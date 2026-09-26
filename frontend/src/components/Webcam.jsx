import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, AlertTriangle } from "lucide-react";

function Webcam({ onFrame = null, active = true }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [streamActive, setStreamActive] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let stream = null;

    const startCamera = async () => {
      if (!active) return;
      try {
        setError(null);
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreamActive(true);
        }
      } catch (err) {
        console.error("Camera access error:", err);
        setError("Camera permission denied or camera not found.");
        setStreamActive(false);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      setStreamActive(false);
    };
  }, [active]);

  // Periodic frame capture if onFrame callback provided
  useEffect(() => {
    if (!streamActive || !onFrame) return;

    const interval = setInterval(() => {
      if (videoRef.current && canvasRef.current && videoRef.current.readyState === 4) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth || 320;
        canvas.height = video.videoHeight || 240;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
        onFrame(dataUrl);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [streamActive, onFrame]);

  return (
    <div className="relative bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
      <canvas ref={canvasRef} className="hidden" />

      {error ? (
        <div className="h-64 sm:h-80 flex flex-col items-center justify-center p-6 text-center bg-slate-900">
          <AlertTriangle className="text-amber-400 mb-3" size={40} />
          <h4 className="text-white font-semibold mb-1">Camera Unavailable</h4>
          <p className="text-slate-400 text-xs max-w-sm">{error}</p>
        </div>
      ) : (
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-64 sm:h-80 object-cover ${!streamActive ? "hidden" : "block"}`}
          />

          {!streamActive && (
            <div className="h-64 sm:h-80 flex flex-col items-center justify-center p-6 text-center bg-slate-900">
              <CameraOff className="text-slate-500 mb-3" size={40} />
              <p className="text-slate-400 text-sm">Starting camera stream...</p>
            </div>
          )}

          {streamActive && (
            <div className="absolute top-3 left-3 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 px-3 py-1.5 rounded-full text-xs text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-semibold text-emerald-400">LIVE</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Webcam;