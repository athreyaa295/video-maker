const ProgressIndicator = ({ status, message }) => {
  return (
    <div className="glass-panel p-8 w-full max-w-xl text-center">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">
          {status === 'uploading' ? 'Uploading...' : 'Processing Highlights...'}
        </h2>
        <p className="text-slate-400 h-6">
          {message}
        </p>
      </div>
      
      <div className="w-full bg-slate-800 rounded-full h-3 mb-4 overflow-hidden shadow-inner">
        <div 
           className="progress-bar-animated h-3 rounded-full w-full" 
           style={{ 
             width: status === 'uploading' ? '50%' : '100%',
             transition: 'width 0.5s ease-in-out'
           }}
        ></div>
      </div>
      
      <div className="grid grid-cols-4 gap-4 mt-8 opacity-70">
        <div className={`flex flex-col items-center ${status === 'uploading' || status === 'processing' ? 'text-blue-400' : 'text-slate-500'}`}>
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center mb-2">1</div>
          <span className="text-xs font-semibold">Upload</span>
        </div>
        <div className={`flex flex-col items-center ${status === 'processing' && message.includes('audio') ? 'text-purple-400' : 'text-slate-500'}`}>
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center mb-2">2</div>
          <span className="text-xs font-semibold">Whisper</span>
        </div>
        <div className={`flex flex-col items-center ${status === 'processing' && message.includes('Qwen') ? 'text-pink-400' : 'text-slate-500'}`}>
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center mb-2">3</div>
          <span className="text-xs font-semibold">Qwen VL</span>
        </div>
        <div className={`flex flex-col items-center ${status === 'processing' && message.includes('Stitching') ? 'text-green-400' : 'text-slate-500'}`}>
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center mb-2">4</div>
          <span className="text-xs font-semibold">Stitch</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
