import os
import cv2
import librosa
import numpy as np
import torch
import whisper
from moviepy.editor import VideoFileClip, concatenate_videoclips
import requests

# Constants
TARGET_RESOLUTION = (1280, 720) # 720p for fast processing
OLLAMA_API_URL = "http://localhost:11434/api/generate"
BATCH_SIZE = 16 # Adjust based on 8GB VRAM (e.g. 8-16)
HIGHLIGHT_DURATION = 60 # Target 60 seconds

def process_video(input_path: str, output_path: str, status_callback=None):
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Using device: {device}")
    
    if status_callback:
        status_callback("Extracting frames and analyzing motion...")
        
    # 1. Basic motion/scene change detection (OpenCV)
    cap = cv2.VideoCapture(input_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    video_duration = total_frames / fps
    
    # Very simplified motion score calculation
    frame_scores = []
    prev_frame = None
    frame_count = 0
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
            
        # Resize to 720p for faster processing
        frame = cv2.resize(frame, TARGET_RESOLUTION)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        if prev_frame is not None:
             # Sample 1 fps for motion tracking to save time
             if frame_count % int(fps) == 0:
                 diff = cv2.absdiff(prev_frame, gray)
                 score = np.sum(diff)
                 frame_scores.append((frame_count / fps, score))
        else:
             if frame_count % int(fps) == 0:
                  frame_scores.append((frame_count / fps, 0))
                  
        if frame_count % int(fps) == 0:
             prev_frame = gray
             
        frame_count += 1
        
    cap.release()
    
    if status_callback:
        status_callback(f"Transcribing audio with Whisper on {device}...")
        
    # 2. Extract and transcribe audio with Whisper
    # Requires whisper model to be downloaded
    try:
        model = whisper.load_model("base", device=device) 
        result = model.transcribe(input_path)
        transcript = result["text"]
    except Exception as e:
        print(f"Whisper Transcription failed or model not available: {e}")
        transcript = "Audio unvailable or failed to transcribe."
        
    if status_callback:
        status_callback("Scoring clips with Qwen 2.5 3B VL API...")

    # 3. Use Qwen via Ollama API to score and summarize best periods
    # Note: In a true multimodal approach, you'd pass frames to the VL model.
    # For this script, we'll prompt Qwen to identify highlight segments based on transcript
    prompt = f"""
    You are an expert video editor. I am providing you with the transcript of a video.
    Identify the most engaging and exciting segments that would make a good {HIGHLIGHT_DURATION}-second highlight reel.
    Transcript: {transcript}
    
    Return your answer closely matching the following format of start and end times in seconds:
    [ [10.5, 20.0], [45.0, 60.0] ]
    Only return the JSON array of times.
    """
    
    try:
        response = requests.post(OLLAMA_API_URL, json={
            "model": "qwen2.5vl:3b-q4_K_M",
            "prompt": prompt,
            "stream": False
        })
        # Simplified parsing
        # Highlight times returned by model
        import json
        text_resp = response.json().get('response', '[]')
        
        # very naive parsing for demo - in reality need robust regex/json parse
        start_idx = text_resp.find('[')
        end_idx = text_resp.rfind(']') + 1
        times_array = json.loads(text_resp[start_idx:end_idx])
    except Exception as e:
        print(f"Ollama API call failed: {e}")
        # Fallback to taking the first 60 seconds or just based on motion
        times_array = [[0, min(60, video_duration)]]

    if not times_array or len(times_array) == 0:
        # Fallback
        times_array = [[0, min(60, video_duration)]]

    if status_callback:
        status_callback("Stitching final highlight video...")

    # 4. Stitching clips using MoviePy
    clip = VideoFileClip(input_path)
    subclips = []
    
    for start_t, end_t in times_array:
        # Ensure times are within bounds
        start_t = max(0, start_t)
        end_t = min(video_duration, end_t)
        if start_t < end_t:
             subclips.append(clip.subclip(start_t, end_t))
             
    if subclips:
        final_clip = concatenate_videoclips(subclips)
        # Using GPU (if available, mostly CPU encoding in standard moviepy setup unless custom ffmpeg params)
        final_clip.write_videofile(output_path, codec="libx264", audio_codec="aac", temp_audiofile="temp-audio.m4a", remove_temp=True, logger=None)
    else:
        raise Exception("Failed to generate subclips out of the video.")
        
    clip.close()
    if subclips:
         final_clip.close()
    
    if status_callback:
        status_callback("Done!")
