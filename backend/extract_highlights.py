import os
import cv2
import librosa
import numpy as np
import torch
import whisper
from moviepy.editor import VideoFileClip, concatenate_videoclips
import requests
import json

# Constants
TARGET_RESOLUTION = (1280, 720)  # 720p for GPU memory efficiency
OLLAMA_API_URL = "http://localhost:11434/api/generate"
BATCH_SIZE = 16   # Adjust for 8GB VRAM (8–16 is safe)
HIGHLIGHT_DURATION = 60  # Target highlight reel duration in seconds
MODEL_NAME = "qwen2.5:1.5b"

# Load the LLM system prompt from file
PROMPT_PATH = os.path.join(os.path.dirname(__file__), "llm_system_prompt.txt")
with open(PROMPT_PATH, "r", encoding="utf-8") as f:
    SYSTEM_PROMPT = f.read()

def call_ollama(system_prompt: str, user_prompt: str) -> dict:
    """Calls Ollama with a system + user prompt and returns the parsed JSON response."""
    payload = {
        "model": MODEL_NAME,
        "system": system_prompt,
        "prompt": user_prompt,
        "stream": False,
        "format": "json"  # Request JSON output mode
    }
    response = requests.post(OLLAMA_API_URL, json=payload, timeout=120)
    response.raise_for_status()
    text_resp = response.json().get("response", "{}")
    return json.loads(text_resp)


def get_highlight_times(video_duration: float, transcript: str) -> list:
    """Ask the LLM to return highlight segment times as a list of [start, end] pairs."""
    user_prompt = f"""
Full video transcript:
---
{transcript}
---

Based on this transcript, identify the most engaging segments for a {HIGHLIGHT_DURATION}-second highlight reel.
Return ONLY a strict JSON object with this exact key:
{{
  "highlight_times": [[start_seconds, end_seconds], ...]
}}
Do not add any extra keys or explanation.
"""
    try:
        result = call_ollama(SYSTEM_PROMPT, user_prompt)
        times_array = result.get("highlight_times", [])
        if isinstance(times_array, list) and len(times_array) > 0:
            return times_array
    except Exception as e:
        print(f"[LLM] highlight_times extraction failed: {e}")
    # Fallback: first N seconds
    return [[0, min(HIGHLIGHT_DURATION, video_duration)]]


def get_rich_analysis(transcript: str, highlight_text: str, timestamp_segment: str = "") -> dict:
    """
    Call the LLM with the full system prompt to get:
    subtitles, impact_analysis, titles, notes, full_analysis, pause_analysis
    """
    user_prompt = f"""
Full transcript:
---
{transcript}
---

Highlight segment text:
---
{highlight_text}
---

Current timestamp segment for pause analysis:
---
{timestamp_segment}
---

Please provide all six analyses as defined in the system instructions.
Output MUST be valid JSON matching the exact output format defined.
"""
    try:
        result = call_ollama(SYSTEM_PROMPT, user_prompt)
        return result
    except Exception as e:
        print(f"[LLM] Rich analysis failed: {e}")
        return {}
def explain_moment(transcript_segments: list, timestamp: float) -> str:
    """Find the relevant segment for a timestamp and ask the LLM to explain it."""
    # Find segments within +/- 5 seconds of the timestamp for context
    context_segments = [
        s.get("text", "") 
        for s in transcript_segments 
        if s.get("start", 0) <= timestamp + 2 and s.get("end", 0) >= timestamp - 5
    ]
    
    snippet = " ".join(context_segments).strip()
    if not snippet:
        return "No clear dialogue detected at this moment."

    user_prompt = f"""
Explain exactly what is happening or being discussed at this specific moment in the video.
Context snippet (around {timestamp:.1f}s):
"{snippet}"

Return a concise, engaging 1-2 sentence explanation.
Return ONLY a strict JSON object with this exact key:
{{
  "explanation": "your explanation here"
}}
"""
    try:
        result = call_ollama(SYSTEM_PROMPT, user_prompt)
        return result.get("explanation", "Could not generate explanation.")
    except Exception as e:
        print(f"[LLM] Moment explanation failed: {e}")
        return "AI analysis failed for this moment."


def process_video(input_path: str, output_path: str, status_callback=None):
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"[GPU] Using device: {device}")

    if status_callback:
        status_callback("Extracting frames and analyzing motion...")

    # 1. Motion / Scene change analysis via OpenCV
    cap = cv2.VideoCapture(input_path)
    fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    video_duration = total_frames / fps

    frame_scores = []
    prev_frame = None
    frame_count = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.resize(frame, TARGET_RESOLUTION)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        if frame_count % int(fps) == 0:
            if prev_frame is not None:
                diff = cv2.absdiff(prev_frame, gray)
                score = float(np.sum(diff))
            else:
                score = 0.0
            frame_scores.append((frame_count / fps, score))
            prev_frame = gray

        frame_count += 1

    cap.release()

    if status_callback:
        status_callback(f"Transcribing audio with Whisper on {device}...")

    # 2. Whisper transcription (GPU accelerated)
    transcript = ""
    transcript_segments = []
    try:
        whisper_model = whisper.load_model("base", device=device)
        result = whisper_model.transcribe(input_path)
        transcript = result.get("text", "")
        transcript_segments = result.get("segments", [])
        print(f"[Whisper] Transcribed {len(transcript)} chars and {len(transcript_segments)} segments")
    except Exception as e:
        print(f"[Whisper] Transcription failed: {e}")
        transcript = "Audio unavailable or failed to transcribe."

    if status_callback:
        status_callback("Scoring clips with Qwen 2.5 3B VL API...")

    # 3. LLM: Select highlight times using system prompt
    times_array = get_highlight_times(video_duration, transcript)

    # 4. LLM: Rich analysis with subtitles, titles, notes, etc.
    if status_callback:
        status_callback("Generating subtitles, titles, notes and impact analysis...")

    highlight_text = transcript[:500]  # first 500 chars as sample highlight
    timestamp_segment = ""
    if times_array:
        t_start, t_end = times_array[0]
        timestamp_segment = f"{t_start:.1f}s to {t_end:.1f}s"

    rich_analysis = get_rich_analysis(transcript, highlight_text, timestamp_segment)

    # Save analysis as sidecar JSON file next to output video
    analysis_path = output_path.replace(".mp4", "_analysis.json")
    with open(analysis_path, "w", encoding="utf-8") as f:
        json.dump(rich_analysis, f, indent=2, ensure_ascii=False)
    
    # Save transcript segments as sidecar JSON file
    transcript_path = output_path.replace(".mp4", "_transcript.json")
    with open(transcript_path, "w", encoding="utf-8") as f:
        json.dump(transcript_segments, f, indent=2, ensure_ascii=False)
        
    print(f"[Analysis] Saved rich analysis to {analysis_path} and transcript to {transcript_path}")

    if status_callback:
        status_callback("Stitching final highlight video...")

    # 5. Stitch clips via MoviePy
    clip = VideoFileClip(input_path)
    subclips = []

    for item in times_array:
        if not (isinstance(item, (list, tuple)) and len(item) == 2):
            continue
        start_t, end_t = float(item[0]), float(item[1])
        start_t = max(0.0, start_t)
        end_t = min(video_duration, end_t)
        if start_t < end_t:
            subclips.append(clip.subclip(start_t, end_t))

    if not subclips:
        raise Exception("LLM returned no valid clip times. Check transcript quality.")

    final_clip = concatenate_videoclips(subclips)
    final_clip.write_videofile(
        output_path,
        codec="libx264",
        audio_codec="aac",
        temp_audiofile="temp-audio.m4a",
        remove_temp=True,
        logger=None
    )

    clip.close()
    final_clip.close()

    if status_callback:
        status_callback("Done!")

    return rich_analysis
