import { useState } from "react";
import { Sparkles, Send, Volume2, UserCheck, Stethoscope } from "lucide-react";
import { askAI } from "../services/api";
import { FormattedText } from "../utils/formatText";
import DoctorAvatar from "./DoctorAvatar";

function GodotPanel() {
  const [avatarState, setAvatarState] = useState("IDLE");
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
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-400/20">
            <Stethoscope size={26} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2 tracking-tight">
              Dr. Mentor Virtual AI Doctor Avatar
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-extrabold text-[11px] uppercase flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Active Avatar
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Realistic Medical Assistant • Interactive Conversational Mentor
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold">Avatar State:</span>
          <span className="px-3.5 py-1 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-300 font-extrabold text-xs uppercase tracking-wider">
            {avatarState}
          </span>
        </div>
      </div>

      {/* REALISTIC DOCTOR AVATAR PRESENTATION */}
      <div className="space-y-5">
        <DoctorAvatar avatarState={avatarState} isSpeaking={avatarState === "SPEAKING"} />

        {/* Clean Formatted AI Response Output */}
        {aiResponse ? (
          <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl text-xs text-slate-200 leading-relaxed shadow-xl space-y-3">
            <div className="flex items-center justify-between font-extrabold text-sky-400 text-xs pb-2 border-b border-slate-800">
              <span className="flex items-center gap-2">
                <Sparkles size={16} /> Dr. Mentor Speech Output:
              </span>
              <button
                onClick={() => speakText(aiResponse)}
                className="px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-400/40 flex items-center gap-1.5 text-xs font-bold transition shadow-sm"
              >
                <Volume2 size={14} /> Speak Aloud
              </button>
            </div>
            <div className="text-sm font-normal">
              <FormattedText text={aiResponse} />
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center justify-between shadow-inner">
            <span className="italic">
              "Hello! I am Dr. Mentor. Ask me a question or start a quiz to see your realistic AI Doctor respond!"
            </span>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
              Interactive Avatar Ready
            </span>
          </div>
        )}
      </div>

      {/* State Controls & Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
        {/* State Triggers */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles size={14} className="text-sky-400" /> Test Doctor Avatar States
          </h4>
          <div className="flex flex-wrap gap-2">
            {AVATAR_STATES.map((st) => (
              <button
                key={st}
                onClick={() => handleStateChange(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition shadow-sm ${
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
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Send size={14} className="text-sky-400" /> Ask Dr. Mentor a Question
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
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-sky-500 transition shadow-inner placeholder-slate-400"
            />
            <button
              onClick={handleAskAvatar}
              disabled={loading || !prompt.trim()}
              className="bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white p-2.5 rounded-xl transition shadow-md shadow-sky-500/20"
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