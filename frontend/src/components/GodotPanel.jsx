import { useState } from "react";
import { Gamepad2, Send, Volume2, Sparkles, UserCheck, Activity } from "lucide-react";
import { askAI } from "../services/api";
import { FormattedText } from "../utils/formatText";
import AvatarCanvas3D from "./AvatarCanvas3D";

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
            <Gamepad2 size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Dr. Mentor 3D AI Doctor Avatar
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-extrabold text-[11px] uppercase flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Real-Time 3D WebGL Engine
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Interactive 3D Doctor Avatar ({activeModel})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Model Selector */}
          <button
            onClick={() =>
              setActiveModel(
                activeModel === "Doctor_Female_Young.gltf"
                  ? "Doctor_Male_Young.gltf"
                  : "Doctor_Female_Young.gltf"
              )
            }
            className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition flex items-center gap-1.5 shadow-sm"
          >
            <UserCheck size={14} className="text-sky-400" />
            {activeModel === "Doctor_Female_Young.gltf" ? "Female Doctor" : "Male Doctor Fallback"}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">State:</span>
            <span className="px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-300 font-extrabold text-xs uppercase tracking-wider">
              {avatarState}
            </span>
          </div>
        </div>
      </div>

      {/* REAL 3D WEBGLE CANVAS VIEWPORT */}
      <div className="space-y-4">
        <AvatarCanvas3D modelFile={activeModel} avatarState={avatarState} />

        {/* Clean Formatted AI Response Output */}
        {aiResponse ? (
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl text-xs text-slate-200 leading-relaxed shadow-lg space-y-2">
            <div className="flex items-center justify-between font-extrabold text-sky-400 text-[11px] pb-1 border-b border-slate-800">
              <span className="flex items-center gap-1.5">
                <Sparkles size={14} /> Dr. Mentor Speech Output:
              </span>
              <button
                onClick={() => speakText(aiResponse)}
                className="p-1 rounded bg-white/10 hover:bg-white/20 text-sky-300 flex items-center gap-1 text-[11px]"
              >
                <Volume2 size={13} /> Speak Aloud
              </button>
            </div>
            <FormattedText text={aiResponse} />
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>"Hello! I am Dr. Mentor. Ask me a question or start a quiz to see the 3D Doctor Avatar respond!"</span>
            <span className="text-[11px] font-mono text-slate-500">GLTF 3D Rig Active</span>
          </div>
        )}
      </div>

      {/* State Controls & Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-800">
        {/* State Triggers */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Test 3D Avatar States & Animations
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
            Speak to 3D Doctor Avatar
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