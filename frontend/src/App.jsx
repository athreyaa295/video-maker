import { useState } from 'react';
import axios from 'axios';
import UploadForm from './components/UploadForm';
import ProgressIndicator from './components/ProgressIndicator';
import VideoPlayer from './components/VideoPlayer';
import AnalysisPanel from './components/AnalysisPanel';
import './styles/App.scss';

function App() {
  const [taskId, setTaskId] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, uploading, processing, completed, error
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
      
      setTaskId(response.data.task_id);
      setStatus('processing');
      setMessage(response.data.message);
      
      // Start polling for status
      pollStatus(response.data.task_id);
    } catch (error) {
      console.error("Upload failed", error);
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
          // Fetch rich AI analysis
          try {
            const aRes = await axios.get(`http://localhost:8000/analysis/${id}`);
            setAnalysis(aRes.data);
          } catch (_) { /* analysis optional */ }
        } else if (res.data.status === 'error' || res.data.status === 'failed') {
          clearInterval(interval);
          setStatus('error');
          setMessage(res.data.message || 'Processing failed');
        }
      } catch (err) {
        // Just keep polling unless it's a hard error
        console.error("Polling error", err);
      }
    }, 3000); // poll every 3 seconds
  };

  const resetApp = () => {
    setTaskId(null);
    setStatus('idle');
    setMessage('');
    setDownloadUrl(null);
    setAnalysis(null);
  };

  return (
    <div className="min-h-screen p-8 text-slate-100 font-sans flex flex-col items-center">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
          HMX<span className="gradient-text">1008</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Automated Video Highlight Extraction powered by Qwen 2.5 3B VL & Whisper
        </p>
      </header>

      <main className="w-full max-w-4xl flex-1 flex flex-col items-center gap-8">
        {status === 'idle' && <UploadForm onUpload={handleUpload} />}
        
        {(status === 'uploading' || status === 'processing') && (
          <ProgressIndicator status={status} message={message} />
        )}
        
        {status === 'completed' && downloadUrl && (
          <div className="w-full flex flex-col items-center animate-fade-in">
            {analysis && <AnalysisPanel analysis={analysis} />}
            <VideoPlayer url={downloadUrl} />
            <div className="mt-8 flex gap-4">
               <a 
                 href={downloadUrl}
                 download="highlight.mp4"
                 className="glow-btn bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 rounded-full font-semibold text-white transition-transform"
               >
                 Download Video
               </a>
               <button 
                 onClick={resetApp}
                 className="px-8 py-3 rounded-full font-semibold bg-slate-800 text-white hover:bg-slate-700 transition-colors border border-slate-700"
               >
                 Process Another
               </button>
            </div>
            <p className="mt-4 text-green-400 font-medium">✨ Highlight extraction complete!</p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="glass-panel p-8 text-center border-red-500/30">
             <h3 className="text-xl text-red-400 mb-2">Error Occurred</h3>
             <p className="text-slate-300 mb-6">{message}</p>
             <button 
                 onClick={resetApp}
                 className="px-6 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
               >
                 Try Again
             </button>
          </div>
        )}
      </main>
      
      <footer className="mt-16 text-slate-500 text-sm">
        <p>HMX1008 Project &copy; {new Date().getFullYear()} • GPU Optimized</p>
      </footer>
    </div>
  );
}

export default App;
