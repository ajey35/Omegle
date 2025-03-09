import React, { useRef } from "react";

interface VideoPlayerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isLocal?: boolean;
}

// Extending HTMLElement to include browser-specific fullscreen methods
interface FullscreenElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoRef }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Request full screen function with cross-browser support
  const requestFullScreen = () => {
    const element = containerRef.current as FullscreenElement | null;
    if (!element) return;

    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen(); // Safari
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen(); // IE11
    }
  };

  // Toggle full screen
  const toggleFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      requestFullScreen();
    }
  };

  return (
    <div ref={containerRef} className="relative w-80 aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
      {videoRef && <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />}
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
