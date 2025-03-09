import React, { useRef } from "react";

interface VideoPlayerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isLocal?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoRef, isLocal }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullScreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div ref={containerRef} className="relative w-80 h-60 bg-black rounded-lg overflow-hidden shadow-lg">
      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
      <button
        onClick={toggleFullScreen}
        className="absolute top-2 right-2 bg-gray-800 p-2 rounded-full text-white hover:bg-gray-600"
      >
        🔍
      </button>
    </div>
  );
};

export default VideoPlayer;
