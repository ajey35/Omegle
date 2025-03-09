import { useEffect, useRef, useState } from "react";
import VideoPlayer from "../components/Video-player"; // Importing the reusable component

const ws = new WebSocket("ws://localhost:8080"); // WebSocket server URL

const VideoCall = () => {
  const [role, setRole] = useState<"sender" | "receiver" | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null!);
  const remoteVideoRef = useRef<HTMLVideoElement>(null!);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!role) return;

    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        ws.send(JSON.stringify({ type: "iceCandidate", candidate: event.candidate }));
      }
    };

    peerConnection.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    ws.onmessage = async (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "createOffer") {
        if (peerConnection.current) {
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.sdp));
          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);
          ws.send(JSON.stringify({ type: "createAnswer", sdp: answer }));
        }
      }

      if (data.type === "createAnswer") {
        if (peerConnection.current) {
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.sdp));
        }
      }

      if (data.type === "iceCandidate") {
        if (peerConnection.current) {
          await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
      }
    };

    return () => {
      ws.onmessage = null; // Cleanup event listener
    };
  }, [role]);

  const startCall = async () => {
    localStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStream.current;
    }

    localStream.current.getTracks().forEach((track) => peerConnection.current?.addTrack(track, localStream.current!));

    if (role === "sender") {
      const offer = await peerConnection.current?.createOffer();
      if (offer && peerConnection.current) {
        await peerConnection.current.setLocalDescription(offer);
        ws.send(JSON.stringify({ type: "createOffer", sdp: offer }));
      }
    }
  };

  const endCall = () => {
    localStream.current?.getTracks().forEach((track) => track.stop());
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    peerConnection.current?.close();
    peerConnection.current = null;
    setRole(null);
  };

  const toggleMute = () => {
    if (localStream.current) {
      localStream.current.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">📹 WebRTC Video Chat</h1>

      {!role ? (
        <div className="space-x-4">
          <button
            onClick={() => {
              setRole("sender");
              ws.send(JSON.stringify({ type: "set-role", role: "sender" }));
            }}
            className="bg-blue-500 px-6 py-3 rounded-lg hover:bg-blue-600 transition text-white text-lg"
          >
            🎥 Start Call
          </button>
          <button
            onClick={() => {
              setRole("receiver");
              ws.send(JSON.stringify({ type: "set-role", role: "receiver" }));
            }}
            className="bg-green-500 px-6 py-3 rounded-lg hover:bg-green-600 transition text-white text-lg"
          >
            ✅ Join Call
          </button>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-6">
            <VideoPlayer videoRef={localVideoRef} isLocal />
            <VideoPlayer videoRef={remoteVideoRef} />
          </div>

          <div className="mt-6 flex space-x-6">
            <button
              onClick={startCall}
              className="bg-red-500 px-6 py-3 rounded-lg hover:bg-red-600 transition text-white text-lg flex items-center space-x-2"
            >
              🎬 <span>Start Video</span>
            </button>

            <button
              onClick={toggleMute}
              className="bg-yellow-500 px-6 py-3 rounded-lg hover:bg-yellow-600 transition text-white text-lg flex items-center space-x-2"
            >
              {isMuted ? "🔊" : "🔇"} <span>{isMuted ? "Unmute" : "Mute"}</span>
            </button>

            <button
              onClick={endCall}
              className="bg-gray-500 px-6 py-3 rounded-lg hover:bg-gray-600 transition text-white text-lg flex items-center space-x-2"
            >
              ❌ <span>End Call</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoCall;
