import { useRef, useEffect } from 'react';

const VideoPlayer = ({ url }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    // Basic setup if we needed HLS, but here it's simple MP4.
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [url]);

  return (
    <div className="glass-panel p-2 w-full max-w-3xl overflow-hidden shadow-2xl shadow-purple-900/20">
      <div className="relative rounded-lg overflow-hidden bg-black aspect-video flex justify-center items-center group">
        <video
          ref={videoRef}
          controls
          className="w-full h-full object-contain"
          poster="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'><rect width='100%' height='100%' fill='black'/></svg>"
        >
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Subtle overlay effect that disappears on play */}
        <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-lg group-hover:border-purple-500/50 transition-colors duration-500"></div>
      </div>
    </div>
  );
};

export default VideoPlayer;
