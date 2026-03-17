const ProgressIndicator = ({ status, message }) => {
  const steps = [
    { label: 'Upload', key: 'uploading' },
    { label: 'Whisper', key: 'transcribing' },
    { label: 'Qwen VL', key: 'scoring' },
    { label: 'Stitch',  key: 'stitching' },
  ];

  const activeIdx = status === 'uploading' ? 0
    : message?.toLowerCase().includes('whisper') ? 1
    : message?.toLowerCase().includes('qwen') ? 2
    : message?.toLowerCase().includes('stitch') ? 3
    : 1;

  return (
    <div style={{ background: '#1E1E1E', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem', padding: '2.5rem', width: '100%', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
        {status === 'uploading' ? '📤 Uploading...' : '⚙️ Processing Highlights...'}
      </h2>
      <p style={{ color: '#B0B0B0', fontSize: '0.9rem', marginBottom: '2rem', minHeight: '1.5rem' }}>{message}</p>

      {/* Progress bar */}
      <div style={{ background: '#2A2A2A', borderRadius: '999px', height: '8px', overflow: 'hidden', marginBottom: '2rem' }}>
        <div className="progress-bar-animated" style={{
          height: '8px',
          borderRadius: '999px',
          width: status === 'uploading' ? '30%' : '85%',
          transition: 'width 0.8s ease-in-out'
        }} />
      </div>

      {/* Step indicators */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        {steps.map((step, i) => (
          <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
            <div
              className={`step-dot ${i < activeIdx ? 'done' : i === activeIdx ? 'active' : ''}`}
            >
              {i < activeIdx ? '✓' : i + 1}
            </div>
            <span style={{ fontSize: '0.7rem', color: i === activeIdx ? '#2196F3' : '#555', fontWeight: i === activeIdx ? 700 : 400 }}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;
