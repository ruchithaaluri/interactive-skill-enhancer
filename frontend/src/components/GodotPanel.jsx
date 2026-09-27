import { useState } from "react";
import { Gamepad2, Send, Volume2, UserCheck, Sparkles, HeartHandshake } from "lucide-react";
import { askAI } from "../services/api";

function GodotPanel() {
  const [avatarState, setAvatarState] = useState("IDLE");
  const [activeModel, setActiveModel] = useState("Doctor_Female_Young.gltf");
  const [prompt, setPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStateChange = (stateName) => {
    setAvatarState(stateName);
  };

  const speakText = (text) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/[\*\_\[\]\`\#]/g, "");
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 0.95;
    utterance.onstart = () => setAvatarState("SPEAKING");
    utterance.onend = () => setAvatarState("IDLE");
    utterance.onerror = () => setAvatarState("IDLE");
    window.speechSynthesis.speak(utterance);
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
      setAvatarState("SPEAKING");

      if ("speechSynthesis" in window) {
        speakText(reply);
      } else {
        setTimeout(() => setAvatarState("IDLE"), 4000);
      }
    } catch (err) {
      console.error(err);
      setAiResponse("I am here to help you learn! Let's try asking again.");
      setAvatarState("INCORRECT_SUPPORT");
      setTimeout(() => setAvatarState("IDLE"), 3000);
    } finally {
      setLoading(false);
    }
  };

  const AVATAR_STATES = [
    "IDLE",
    "LISTENING",
    "THINKING",
    "SPEAKING",
    "ENCOURAGING",
    "CORRECT",
    "INCORRECT_SUPPORT",
    "QUIZ_COMPLETE"
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
            <Gamepad2 size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Dr. Mentor 3D AI Doctor Avatar
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 font-extrabold text-[10px] uppercase">
                Godot 4.x Engine
              </span>
            </h2>
            <p className="text-xs text-slate-400">Warm, friendly, patient virtual doctor tutor</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Model Switcher */}
          <button
            onClick={() =>
              setActiveModel(
                activeModel === "Doctor_Female_Young.gltf"
                  ? "Doctor_Male_Young.gltf"
                  : "Doctor_Female_Young.gltf"
              )
            }
            className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition flex items-center gap-1.5"
          >
            <UserCheck size={14} className="text-sky-400" />
            {activeModel === "Doctor_Female_Young.gltf" ? "Female Doctor" : "Male Doctor Fallback"}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">State:</span>
            <span className="px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 font-bold text-xs uppercase tracking-wider">
              {avatarState}
            </span>
          </div>
        </div>
      </div>

      {/* 3D Canvas / Avatar Visualizer Screen */}
      <div className="relative h-[380px] rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col items-center justify-center text-center p-6">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-950/20 via-transparent to-slate-950 pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-lg">
          <div
            className={`w-36 h-36 mx-auto rounded-full border-4 flex items-center justify-center shadow-2xl transition-all duration-500 ${
              avatarState === "SPEAKING"
                ? "border-emerald-400 bg-emerald-500/20 shadow-emerald-500/30 scale-105"
                : avatarState === "THINKING"
                ? "border-amber-400 bg-amber-500/20 shadow-amber-500/30 animate-pulse"
                : avatarState === "CORRECT" || avatarState === "QUIZ_COMPLETE"
                ? "border-purple-400 bg-purple-500/20 shadow-purple-500/30 scale-105"
                : avatarState === "INCORRECT_SUPPORT"
                ? "border-sky-400 bg-sky-500/20 shadow-sky-500/30"
                : "border-sky-400/60 bg-sky-500/10 shadow-sky-500/20"
            }`}
          >
            <span className="text-6xl">
              {activeModel === "Doctor_Female_Young.gltf" ? "👩‍⚕️" : "👨‍⚕️"}
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white flex items-center justify-center gap-2">
              Dr. Mentor <Sparkles size={16} className="text-sky-400" />
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">3D Model Rig: {activeModel}</p>
          </div>

          {aiResponse ? (
            <div className="bg-slate-900/90 border border-slate-700 p-4 rounded-2xl text-xs text-slate-200 leading-relaxed max-h-28 overflow-y-auto text-left shadow-lg">
              <div className="flex items-center justify-between font-extrabold text-sky-400 text-[11px] mb-1">
                <span>👩‍⚕️ Doctor Response:</span>
                <button
                  onClick={() => speakText(aiResponse)}
                  className="p-1 rounded bg-white/10 hover:bg-white/20 text-sky-300"
                >
                  <Volume2 size={14} />
                </button>
              </div>
              "{aiResponse}"
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-xs text-slate-400">
              "Hi there! I am Dr. Mentor. What would you like to explore or learn today?"
            </div>
          )}
        </div>
      </div>

      {/* Controller Buttons & Direct Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-800">
        {/* State Triggers */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Test Avatar States & Postures
          </h4>
          <div className="flex flex-wrap gap-2">
            {AVATAR_STATES.map((st) => (
              <button
                key={st}
                onClick={() => handleStateChange(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
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
            Speak to Doctor Avatar
          </h4>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask Dr. Mentor a question..."
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