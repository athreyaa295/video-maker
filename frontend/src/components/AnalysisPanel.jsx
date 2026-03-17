const AnalysisPanel = ({ analysis }) => {
  if (!analysis || Object.keys(analysis).length === 0) return null;

  const { subtitles, impact_analysis, titles, notes, full_analysis, pause_analysis } = analysis;

  return (
    <div className="w-full max-w-4xl mt-10 space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-center gradient-text">📊 AI Analysis</h2>

      {/* Subtitles */}
      {subtitles && (
        <div className="glass-panel p-5">
          <h3 className="text-lg font-semibold text-blue-400 mb-2">📝 Enhanced Subtitles</h3>
          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{subtitles}</p>
        </div>
      )}

      {/* Impact Analysis */}
      {impact_analysis && (
        <div className="glass-panel p-5">
          <h3 className="text-lg font-semibold text-purple-400 mb-2">⚡ Impact Analysis</h3>
          <div className="flex flex-wrap gap-4 items-center">
            <span className="px-3 py-1 rounded-full bg-purple-900/40 border border-purple-500/30 text-purple-300 text-sm font-semibold">
              Type: {impact_analysis.type}
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-900/40 border border-blue-500/30 text-blue-300 text-sm font-semibold">
              Score: {impact_analysis.score} / 10
            </span>
          </div>
          {impact_analysis.reason && (
            <p className="text-slate-300 text-sm mt-3">{impact_analysis.reason}</p>
          )}
        </div>
      )}

      {/* Viral Titles */}
      {titles && titles.length > 0 && (
        <div className="glass-panel p-5">
          <h3 className="text-lg font-semibold text-pink-400 mb-3">🔥 Viral Titles</h3>
          <ol className="space-y-2">
            {titles.map((title, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-pink-400 font-bold text-sm min-w-[20px]">{i + 1}.</span>
                <span className="text-slate-200 text-sm">{title}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Notes */}
      {notes && (
        <div className="glass-panel p-5">
          <h3 className="text-lg font-semibold text-green-400 mb-2">📋 Key Notes</h3>
          {notes.summary && <p className="text-slate-300 text-sm mb-3">{notes.summary}</p>}
          {notes.key_points && notes.key_points.length > 0 && (
            <ul className="space-y-1">
              {notes.key_points.map((pt, i) => (
                <li key={i} className="text-slate-200 text-sm flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Full Analysis */}
      {full_analysis && (
        <div className="glass-panel p-5">
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">🎬 Full Video Analysis</h3>
          {full_analysis.summary && <p className="text-slate-300 text-sm mb-3">{full_analysis.summary}</p>}
          {full_analysis.key_topics && full_analysis.key_topics.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {full_analysis.key_topics.map((topic, i) => (
                <span key={i} className="px-2 py-1 rounded-md bg-yellow-900/30 border border-yellow-500/20 text-yellow-300 text-xs">
                  {topic}
                </span>
              ))}
            </div>
          )}
          {full_analysis.tone && (
            <p className="text-slate-400 text-xs">Tone: <span className="text-slate-200">{full_analysis.tone}</span></p>
          )}
        </div>
      )}

      {/* Pause Analysis */}
      {pause_analysis && (
        <div className="glass-panel p-5">
          <h3 className="text-lg font-semibold text-cyan-400 mb-2">⏸️ Pause Analysis</h3>
          <p className="text-slate-300 text-sm">{pause_analysis}</p>
        </div>
      )}
    </div>
  );
};

export default AnalysisPanel;
