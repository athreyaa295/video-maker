# Deployment - Full Stack GPU HMX1008

### Backend
1. Clone repo
```bash
git clone <repo_url>
cd HMX1008/backend
```

2. Install Python dependencies
```bash
pip install -r requirements.txt
```

3. Pull GPU-optimized Qwen model
```bash
ollama pull qwen2.5vl:3b-q4_K_M
```

4. Install FFmpeg
```bash
choco install ffmpeg
```

5. Run FastAPI backend
```bash
uvicorn app:app --reload
```

### Frontend

1. Navigate to frontend
```bash
cd ../frontend
npm install
npm start
```

2. Frontend communicates with backend at `http://localhost:8000`

### Notes
- Ensure GPU is available for LLM + Whisper
- Use batch frames (8–16) for smoother inference
- Resize frames to 720p for memory efficiency
