import { useState } from 'react';
import axios from 'axios';
import UploadForm from './components/UploadForm';
import ProgressIndicator from './components/ProgressIndicator';
import VideoPlayer from './components/VideoPlayer';
import AnalysisPanel from './components/AnalysisPanel';
import './styles/App.scss';

function App() {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const handleUpload = async (file) => {
    setStatus('uploading');
    setMessage('Uploading video...');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStatus('processing');
      setMessage(response.data.message);
      pollStatus(response.data.task_id);
    } catch (error) {
      setStatus('error');
      setMessage('Upload failed. Please check the backend server.');
    }
  };

  const pollStatus = async (id) => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`http://localhost:8000/status/${id}`);
        setMessage(res.data.message || 'Processing...');
        if (res.data.status === 'completed') {
          clearInterval(interval);
          setStatus('completed');
          setDownloadUrl(`http://localhost:8000/download/${id}`);
          try {
            const aRes = await axios.get(`http://localhost:8000/analysis/${id}`);
            setAnalysis(aRes.data);
          } catch (_) {}
        } else if (res.data.status === 'error' || res.data.status === 'failed') {
          clearInterval(interval);
          setStatus('error');
          setMessage(res.data.message || 'Processing failed');
        }
      } catch (err) {}
    }, 3000);
  };

  const resetApp = () => {
    setStatus('idle');
    setMessage('');
    setDownloadUrl(null);
    setAnalysis(null);
  };

  return (
    <div style={{ background: '#121212', minHeight: '100vh' }} className="p-8 text-white flex flex-col items-center">
      {/* Header */}
      <header className="mb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span style={{ fontSize: '2rem' }}>🎬</span>
          <h1 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '-0.02em', lineHeight: 1 }}>
            HMX<span className="gradient-text">1008</span>
          </h1>
        </div>
        <p style={{ color: '#B0B0B0', fontSize: '1rem', maxWidth: '500px', margin: '0 auto' }}>
          GPU-Powered Video Highlight Extraction · Whisper · Qwen 2.5 3B VL
        </p>
        {/* Stat chips */}
        <div className="flex justify-center gap-3 mt-5 flex-wrap">
          <span className="neon-badge blue">🖥 GPU Accelerated</span>
          <span className="neon-badge purple">🧠 AI Scoring</span>
          <span className="neon-badge green">⚡ Real-time</span>
          <span className="neon-badge orange">🎞 60s Reels</span>
        </div>
      </header>

      <main className="w-full flex flex-col items-center gap-8" style={{ maxWidth: '900px' }}>
        {status === 'idle' && <UploadForm onUpload={handleUpload} />}

        {(status === 'uploading' || status === 'processing') && (
          <ProgressIndicator status={status} message={message} />
        )}

        {status === 'completed' && downloadUrl && (
          <div className="w-full flex flex-col items-center gap-8 animate-fade-in">
            {/* Status banner */}
            <div style={{ background: 'rgba(76,175,80,0.1)', border: '1px solid rgba(76,175,80,0.3)', borderRadius: '0.75rem', padding: '0.75rem 1.5rem' }}
                 className="flex items-center gap-2 text-sm">
              <span style={{ color: '#4CAF50' }}>✅</span>
              <span style={{ color: '#4CAF50', fontWeight: 600 }}>Highlight extraction complete!</span>
            </div>

            {/* Video player */}
            <VideoPlayer url={downloadUrl} />

            {/* Action buttons */}
            <div className="flex gap-4 flex-wrap justify-center">
              <a
                href={downloadUrl}
                download="highlight.mp4"
                className="glow-btn"
                style={{ background: 'linear-gradient(135deg,#2196F3,#7C3AED)', color: '#fff', padding: '0.75rem 2rem', borderRadius: '999px', textDecoration: 'none', fontWeight: 700 }}
              >
                ⬇ Download Highlight
              </a>
              <button
                onClick={resetApp}
                style={{ background: '#1E1E1E', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.75rem 2rem', borderRadius: '999px', fontWeight: 600, cursor: 'pointer' }}
              >
                ↩ Process Another
              </button>
            </div>

            {/* AI Analysis Panel */}
            <AnalysisPanel analysis={analysis} />
          </div>
        )}

        {status === 'error' && (
          <div style={{ background: 'rgba(255,107,107,0.05)', border: '1px solid rgba(255,107,107,0.25)', borderRadius: '1rem', padding: '2.5rem', textAlign: 'center', width: '100%' }}>
            <p style={{ fontSize: '1.25rem', color: '#FF6B6B', marginBottom: '0.5rem' }}>⚠ Error Occurred</p>
            <p style={{ color: '#B0B0B0', marginBottom: '1.5rem' }}>{message}</p>
            <button
              onClick={resetApp}
              style={{ background: '#1E1E1E', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.6rem 1.75rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600 }}
            >
              Try Again
            </button>
          </div>
        )}
      </main>

      <footer className="mt-20" style={{ color: '#444', fontSize: '0.8rem', textAlign: 'center' }}>
        <p>HMX1008 &copy; {new Date().getFullYear()} · GPU Optimized · Dark Theme</p>
      </footer>
    </div>
  );
}

export default App;
