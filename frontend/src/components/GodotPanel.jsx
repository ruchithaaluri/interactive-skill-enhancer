import { useState } from "react";
import { Gamepad2, Play, Sparkles, Send, Volume2 } from "lucide-react";
import { askAI } from "../services/api";

function GodotPanel() {
  const [avatarState, setAvatarState] = useState("IDLE");
  const [prompt, setPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStateChange = (stateName) => {
    setAvatarState(stateName);
  };

  const handleAskAvatar = async () => {
    if (!prompt.trim() || loading) return;

    const userQuestion = prompt;
    setPrompt("");
    setLoading(true);
    setAvatarState("THINKING");

    try {
      const reply = await askAI(userQuestion, []);
      setAiResponse(reply);
      setAvatarState("TALKING");

      // Optional speech synthesis
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(reply);
        utterance.onend = () => setAvatarState("IDLE");
        window.speechSynthesis.speak(utterance);
      } else {
        setTimeout(() => setAvatarState("IDLE"), 4000);
      }
    } catch (err) {
      console.error(err);
      setAiResponse("Unable to reach backend AI server.");
      setAvatarState("IDLE");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
            <Gamepad2 size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">3D AI Tutor Avatar</h2>
            <p className="text-xs text-slate-400">Interactive 3D character controller (Godot Engine)</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Current State:</span>
          <span className="px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 font-bold text-xs uppercase tracking-wider">
            {avatarState}
          </span>
        </div>
      </div>

      {/* 3D Canvas / Avatar Screen */}
      <div className="relative h-[380px] rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col items-center justify-center text-center p-6">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-950/20 via-transparent to-slate-950 pointer-events-none" />

        {/* Avatar Visualizer Representation */}
        <div className="relative z-10 space-y-4">
          <div className={`w-32 h-32 mx-auto rounded-full border-4 flex items-center justify-center shadow-2xl transition-all duration-500 ${
            avatarState === "TALKING"
              ? "border-emerald-400 bg-emerald-500/20 shadow-emerald-500/30 scale-105"
              : avatarState === "THINKING"
              ? "border-amber-400 bg-amber-500/20 shadow-amber-500/30 animate-pulse"
              : avatarState === "WALKING"
              ? "border-purple-400 bg-purple-500/20 shadow-purple-500/30 animate-bounce"
              : "border-sky-400 bg-sky-500/20 shadow-sky-500/30"
          }`}>
            <span className="text-5xl">👨‍⚕️</span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">Dr. Quaternius AI</h3>
            <p className="text-xs text-slate-400 mt-0.5">3D Model: Doctor_Male_Young.gltf</p>
          </div>

          {aiResponse && (
            <div className="max-w-md bg-slate-900/90 border border-slate-700 p-4 rounded-2xl text-xs text-slate-200 leading-relaxed max-h-24 overflow-y-auto">
              "{aiResponse}"
            </div>
          )}
        </div>
      </div>

      {/* Controller Buttons & Direct Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-800">
        {/* State Triggers */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Test Avatar Animations
          </h4>
          <div className="flex flex-wrap gap-2">
            {["IDLE", "WALKING", "TALKING", "VICTORY"].map((st) => (
              <button
                key={st}
                onClick={() => handleStateChange(st)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
                  avatarState === st
                    ? "bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-500/25"
                    : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Interact with Avatar */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Speak to 3D Avatar
          </h4>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask avatar a concept..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAskAvatar();
              }}
              disabled={loading}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-sky-500"
            />
            <button
              onClick={handleAskAvatar}
              disabled={loading || !prompt.trim()}
              className="bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white p-2 rounded-xl transition"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GodotPanel;