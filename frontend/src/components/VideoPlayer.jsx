import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

const VideoPlayer = forwardRef(({ url }, ref) => {
  const videoRef = useRef(null);

  useImperativeHandle(ref, () => ({
    get currentTime() {
      return videoRef.current?.currentTime || 0;
    },
    pause() {
      videoRef.current?.pause();
    }
  }));

  useEffect(() => {
    if (videoRef.current) videoRef.current.load();
  }, [url]);

  return (
    <div className="video-wrapper" style={{ width: '100%' }}>
      <div style={{ position: 'relative', background: '#000', aspectRatio: '16/9' }}>
        <video
          ref={videoRef}
          controls
          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
        >
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';
export default VideoPlayer;
