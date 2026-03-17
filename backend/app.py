import os
from fastapi import FastAPI, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
import uuid
import shutil
from extract_highlights import process_video, explain_moment

app = FastAPI(title="HMX1008 - Video Highlight Extraction")

# Allow CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

INPUT_DIR = "../input_videos"
OUTPUT_DIR = "../output"
os.makedirs(INPUT_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

# In-memory status tracking dictionary. In production, use a Database or Redis.
tasks_status = {}

@app.post("/upload")
async def upload_video(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    try:
        if not file.filename.endswith((".mp4", ".mov", ".avi", ".mkv")):
            return JSONResponse(status_code=400, content={"message": "Unsupported file format"})
        
        task_id = str(uuid.uuid4())
        input_path = os.path.join(INPUT_DIR, f"{task_id}_{file.filename}")
        output_path = os.path.join(OUTPUT_DIR, f"{task_id}_highlight.mp4")
        
        # Read in chunks to handle large files without blowing up memory
        with open(input_path, "wb") as buffer:
            while content := await file.read(1024 * 1024): # 1MB chunks
                buffer.write(content)
            
        tasks_status[task_id] = {"status": "processing", "message": "Video uploaded, starting processing."}
        
        # Start background processing
        background_tasks.add_task(run_pipeline, task_id, input_path, output_path)
        
        return {"task_id": task_id, "message": "Video uploaded successfully and processing started."}
    except Exception as e:
         print(f"Error during upload: {e}")
         return JSONResponse(status_code=500, content={"message": f"Upload failed: {str(e)}"})

def run_pipeline(task_id: str, input_path: str, output_path: str):
    try:
        tasks_status[task_id]["message"] = "Extracting audio and transcribing..."
        rich_analysis, transcript_segments = process_video(input_path, output_path, status_callback=lambda msg: update_status(task_id, msg))
        tasks_status[task_id] = {
            "status": "completed",
            "output_file": output_path,
            "message": "Highlight extraction complete.",
            "analysis": rich_analysis or {},
            "transcript_segments": transcript_segments or []
        }
    except Exception as e:
        tasks_status[task_id] = {"status": "failed", "message": str(e)}

def update_status(task_id: str, msg: str):
    if task_id in tasks_status:
         tasks_status[task_id]["message"] = msg

@app.get("/status/{task_id}")
async def get_status(task_id: str):
    if task_id not in tasks_status:
        return JSONResponse(status_code=404, content={"message": "Task not found"})
    return tasks_status[task_id]

@app.get("/download/{task_id}")
async def download_highlight(task_id: str):
    if task_id not in tasks_status:
        return JSONResponse(status_code=404, content={"message": "Task not found"})
        
    task_data = tasks_status[task_id]
    if task_data["status"] != "completed":
        return JSONResponse(status_code=400, content={"message": "Processing not completed yet"})
        
    output_path = task_data.get("output_file")
    if not output_path or not os.path.exists(output_path):
        return JSONResponse(status_code=404, content={"message": "Output file not found"})
        
    return FileResponse(output_path, media_type="video/mp4", filename="highlight.mp4")

@app.get("/analysis/{task_id}")
async def get_analysis(task_id: str):
    if task_id not in tasks_status:
        return JSONResponse(status_code=404, content={"message": "Task not found"})
    task_data = tasks_status[task_id]
    if task_data.get("status") != "completed":
        return JSONResponse(status_code=400, content={"message": "Processing not completed yet"})
    return task_data.get("analysis", {})

@app.get("/")
def health_check():
    import torch
    return {"status": "ok", "gpu_enabled": torch.cuda.is_available()}
@app.get("/analyze_moment/{task_id}/{timestamp}")
async def analyze_moment(task_id: str, timestamp: float):
    if task_id not in tasks_status:
        return JSONResponse(status_code=404, content={"message": "Task not found"})
    
    task_data = tasks_status[task_id]
    segments = task_data.get("transcript_segments", [])
    
    if not segments:
        # Try to load from sidecar if not in memory (e.g. server restart)
        output_path = task_data.get("output_file")
        if output_path:
            transcript_path = output_path.replace(".mp4", "_transcript.json")
            if os.path.exists(transcript_path):
                import json
                with open(transcript_path, "r", encoding="utf-8") as f:
                    segments = json.load(f)
                    task_data["transcript_segments"] = segments

    if not segments:
        return JSONResponse(status_code=400, content={"message": "No transcript data available for this video"})

    explanation = explain_moment(segments, timestamp)
    return {"explanation": explanation, "timestamp": timestamp}

