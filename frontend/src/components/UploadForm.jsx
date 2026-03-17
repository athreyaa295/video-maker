import { useState, useCallback } from 'react';

const UploadForm = ({ onUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  }, []);

  const handleChange = (e) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) onUpload(file);
  };

  return (
    <div style={{ background: '#1E1E1E', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem', padding: '2.5rem', width: '100%', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'center', color: '#fff' }}>
        Upload Video
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <label
          className={`upload-dropzone${dragActive ? ' drag-active' : ''}`}
          style={{ width: '100%', minHeight: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
        >
          <svg style={{ width: '3rem', height: '3rem', color: '#2196F3', marginBottom: '0.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
          </svg>
          <p style={{ color: '#fff', fontWeight: 600 }}>Drop your video here</p>
          <p style={{ color: '#B0B0B0', fontSize: '0.8rem' }}>or click to browse · MP4, MOV, AVI supported</p>
          <input id="file-upload" type="file" className="hidden" accept="video/*" onChange={handleChange} />
        </label>

        {file && (
          <div style={{ marginTop: '1rem', background: '#252525', border: '1px solid rgba(33,150,243,0.2)', borderRadius: '0.75rem', padding: '0.75rem 1.25rem', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.25rem' }}>🎬</span>
              <span style={{ fontSize: '0.875rem', color: '#fff', fontWeight: 600 }}>{file.name}</span>
            </div>
            <span style={{ color: '#B0B0B0', fontSize: '0.75rem' }}>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
          </div>
        )}

        <button
          type="submit"
          disabled={!file}
          className="glow-btn"
          style={{
            marginTop: '1.5rem',
            width: '100%',
            padding: '1rem',
            borderRadius: '0.75rem',
            fontWeight: 800,
            fontSize: '1rem',
            color: '#fff',
            border: 'none',
            cursor: file ? 'pointer' : 'not-allowed',
            background: file ? 'linear-gradient(135deg, #2196F3, #7C3AED)' : '#2A2A2A',
            opacity: file ? 1 : 0.5,
          }}
        >
          🚀 Generate HMX Reel
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
