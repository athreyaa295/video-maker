const AnalysisPanel = ({ analysis }) => {
  const isEmpty = !analysis || Object.keys(analysis).length === 0;

  const card = (icon, title, color, children) => (
    <div className="analysis-card" key={title}>
      <div className="card-title" style={{ color }}>
        <span>{icon}</span> {title}
      </div>
      {children}
    </div>
  );

  if (isEmpty) {
    return (
      <div style={{ width: '100%', marginTop: '2rem' }}>
        <h2 style={{ textAlign: 'center', fontWeight: 800, fontSize: '1.5rem', marginBottom: '1rem' }}>
          <span className="gradient-text">📊 AI Analysis</span>
        </h2>
        <div style={{ background: '#1E1E1E', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '2.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1.1rem', color: '#B0B0B0', marginBottom: '0.5rem' }}>🤖 AI Analysis Unavailable</p>
          <p style={{ color: '#555', fontSize: '0.85rem', maxWidth: '400px', margin: '0 auto 1rem' }}>
            Make sure <span style={{ color: '#7C3AED', fontWeight: 700 }}>Ollama is running</span> with Qwen 2.5 3B VL, then re-process a video.
          </p>
          <code style={{ display: 'block', background: '#252525', color: '#4CAF50', fontSize: '0.75rem', borderRadius: '0.5rem', padding: '0.6rem 1rem', width: 'fit-content', margin: '0 auto' }}>
            ollama run qwen2.5vl:3b-q4_K_M
          </code>
        </div>
      </div>
    );
  }

  const { subtitles, impact_analysis, titles, notes, full_analysis, pause_analysis } = analysis;

  return (
    <div style={{ width: '100%', marginTop: '2rem' }}>
      <h2 style={{ textAlign: 'center', fontWeight: 800, fontSize: '1.5rem', marginBottom: '1.5rem' }}>
        <span className="gradient-text">📊 AI Analysis</span>
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {subtitles && card('📝', 'Enhanced Subtitles', '#2196F3',
          <p style={{ color: '#B0B0B0', fontSize: '0.875rem', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{subtitles}</p>
        )}

        {impact_analysis && card('⚡', 'Impact Analysis', '#FF5722',
          <div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              <span className="neon-badge purple">Type: {impact_analysis.type}</span>
              <span className="neon-badge orange">Score: {impact_analysis.score} / 10</span>
            </div>
            {impact_analysis.reason && <p style={{ color: '#B0B0B0', fontSize: '0.875rem' }}>{impact_analysis.reason}</p>}
          </div>
        )}

        {titles?.length > 0 && card('🔥', 'Viral Titles', '#FF6B6B',
          <ol style={{ margin: 0, padding: '0 0 0 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {titles.map((t, i) => (
              <li key={i} style={{ color: '#fff', fontSize: '0.875rem' }}>{t}</li>
            ))}
          </ol>
        )}

        {notes && card('📋', 'Key Notes', '#4CAF50',
          <div>
            {notes.summary && <p style={{ color: '#B0B0B0', fontSize: '0.875rem', marginBottom: '0.75rem' }}>{notes.summary}</p>}
            {notes.key_points?.length > 0 && (
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {notes.key_points.map((p, i) => (
                  <li key={i} style={{ color: '#eee', fontSize: '0.875rem', display: 'flex', gap: '0.5rem' }}>
                    <span style={{ color: '#4CAF50' }}>•</span> {p}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {full_analysis && card('🎬', 'Full Video Analysis', '#FFC107',
          <div>
            {full_analysis.summary && <p style={{ color: '#B0B0B0', fontSize: '0.875rem', marginBottom: '0.75rem' }}>{full_analysis.summary}</p>}
            {full_analysis.key_topics?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                {full_analysis.key_topics.map((t, i) => (
                  <span key={i} className="neon-badge blue">{t}</span>
                ))}
              </div>
            )}
            {full_analysis.tone && (
              <p style={{ color: '#555', fontSize: '0.75rem' }}>Tone: <span style={{ color: '#B0B0B0' }}>{full_analysis.tone}</span></p>
            )}
          </div>
        )}

        {pause_analysis && card('⏸️', 'Pause Analysis', '#A78BFA',
          <p style={{ color: '#B0B0B0', fontSize: '0.875rem' }}>{pause_analysis}</p>
        )}
      </div>
    </div>
  );
};

export default AnalysisPanel;
