import { useEffect, useState, useCallback } from "react";
import Webcam from "./Webcam";
import { getVisionStatus, detectEmotion } from "../services/api";
import { Smile } from "lucide-react";

function EmotionPanel() {
  const [status, setStatus] = useState({
    camera: "Loading...",
    mediapipe: "Loading...",
    emotion: "Loading...",
  });

  const [emotionData, setEmotionData] = useState({
    emotion: "Focused",
    confidence: 87.0,
    status: "Monitoring",
  });

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const data = await getVisionStatus();
        setStatus(data);
      } catch (error) {
        console.error(error);
        setStatus({
          camera: "Ready",
          mediapipe: "Ready",
          emotion: "Fallback Active",
        });
      }
    };

    loadStatus();
  }, []);

  const handleFrame = useCallback(async (dataUrl) => {
    try {
      const res = await detectEmotion(dataUrl);
      if (res && res.emotion) {
        setEmotionData(res);
      }
    } catch (e) {
      console.warn("Frame emotion error:", e);
    }
  }, []);

  return (
    <div className="glass-panel border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/20 text-cyan-400 border border-sky-400/30 shadow-md">
              <Smile size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-starlight leading-tight">
                Emotion Detection
              </h2>
              <p className="text-xs text-sky-200/70">Live facial engagement and affect cue guidance</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/30">
            {emotionData.emotion} ({emotionData.confidence}%)
          </span>
        </div>

        <Webcam onFrame={handleFrame} />
      </div>

      <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-slate-400">📷 Camera Stream</span>
          <span className="text-cyan-300 font-semibold">{status.camera}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">👤 MediaPipe Model</span>
          <span className="text-cyan-300 font-semibold">{status.mediapipe}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">😊 Detected Emotion</span>
          <span className="text-emerald-300 font-semibold">{emotionData.emotion}</span>
        </div>
      </div>
    </div>
  );
}

export default EmotionPanel;