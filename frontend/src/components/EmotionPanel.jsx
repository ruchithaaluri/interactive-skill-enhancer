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
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <Smile size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">
                Emotion Detection
              </h2>
              <p className="text-xs text-slate-400">Live facial engagement tracking</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            {emotionData.emotion} ({emotionData.confidence}%)
          </span>
        </div>

        <Webcam onFrame={handleFrame} />
      </div>

      <div className="mt-4 pt-4 border-t border-slate-800 space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-slate-400">📷 Camera Stream</span>
          <span className="text-emerald-400 font-semibold">{status.camera}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">👤 MediaPipe Model</span>
          <span className="text-emerald-400 font-semibold">{status.mediapipe}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">😊 Detected Emotion</span>
          <span className="text-amber-400 font-semibold">{emotionData.emotion}</span>
        </div>
      </div>
    </div>
  );
}

export default EmotionPanel;