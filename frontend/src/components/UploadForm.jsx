import { useState, useCallback } from 'react';

const UploadForm = ({ onUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="glass-panel p-8 w-full">
      <h2 className="text-2xl font-bold mb-6 text-center">Extract Highlights</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <label 
           className={`upload-dropzone w-full h-48 flex flex-col items-center justify-center rounded-xl cursor-pointer
           ${dragActive ? 'drag-active' : ''}`}
           onDragEnter={handleDrag}
           onDragLeave={handleDrag}
           onDragOver={handleDrag}
           onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg aria-hidden="true" className="w-12 h-12 mb-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
            <p className="mb-2 text-sm text-slate-400">
               <span className="font-semibold text-slate-300">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-slate-500">MP4, MOV, AVI (Max 2GB)</p>
          </div>
          <input 
             id="dropzone-file" 
             type="file" 
             className="hidden" 
             accept="video/mp4,video/x-m4v,video/*"
             onChange={handleChange}
          />
        </label>

        {file && (
           <div className="mt-6 w-full glass-panel !bg-slate-800/50 p-4 border border-slate-700/50 flex justify-between items-center">
              <div className="flex items-center truncate">
                 <svg className="w-6 h-6 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                 <span className="text-sm font-medium truncate">{file.name}</span>
              </div>
              <span className="text-xs text-slate-400 ml-4">
                 {(file.size / (1024 * 1024)).toFixed(2)} MB
              </span>
           </div>
        )}

        <button 
           type="submit" 
           disabled={!file}
           className={`mt-8 glow-btn w-full py-4 rounded-xl font-bold text-lg text-white transition-opacity
             ${!file ? 'opacity-50 cursor-not-allowed bg-slate-700' : 'bg-gradient-to-r from-blue-600 to-purple-600'}`
           }
        >
          Generate HMX Reel
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
