import { useState, useContext } from "react";
import { Sparkles, Send, Volume2, Mic } from "lucide-react";
import { askAI } from "../services/api";
import { FormattedText } from "../utils/formatText";
import { speakWithAvatarVoice } from "../utils/speechUtils";
import DoctorAvatar from "./DoctorAvatar";
import SpeechRecognition from "./SpeechRecognition";
import { AvatarContext } from "../context/AvatarContext";

function GodotPanel() {
  const { selectedAvatar } = useContext(AvatarContext);
  const [avatarState, setAvatarState] = useState("IDLE");
  const [prompt, setPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const speakText = (text) => {
    speakWithAvatarVoice(
      text,
      selectedAvatar.gender || "female",
      () => setAvatarState("SPEAKING"),
      () => setAvatarState("IDLE")
    );
  };

  const handleAskAvatar = async (textToSend = null) => {
    const question = textToSend || prompt;
    if (!question.trim() || loading) return;

    setPrompt("");
    setLoading(true);
    setAvatarState("THINKING");

    try {
      // Pass avatar system prompt prefix to AI chatbot
      const systemHistory = [
        { role: "system", content: selectedAvatar.systemPrompt },
      ];

      const reply = await askAI(question, systemHistory);
      setAiResponse(reply);
      setAvatarState("SPEAKING");

      if ("speechSynthesis" in window) {
        speakText(reply);
      } else {
        setTimeout(() => setAvatarState("IDLE"), 4000);
      }
    } catch (err) {
      console.error(err);
      setAiResponse(`I am here to help you learn! Let's try asking again.`);
      setAvatarState("INCORRECT_SUPPORT");
      setTimeout(() => setAvatarState("IDLE"), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeechResult = (transcript) => {
    setPrompt(transcript);
    setAvatarState("LISTENING");
    setTimeout(() => {
      handleAskAvatar(transcript);
    }, 500);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2 tracking-tight">
            {selectedAvatar.name} — Interactive AI Learning Assistant
          </h2>
          <p className="text-xs text-slate-400">
            {selectedAvatar.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-extrabold text-xs uppercase tracking-wider">
            State: <span className="text-sky-400">{avatarState}</span>
          </span>
        </div>
      </div>

      {/* AVATAR PRESENTATION */}
      <div className="space-y-5">
        <DoctorAvatar avatarState={avatarState} isSpeaking={avatarState === "SPEAKING"} />

        {/* Clean Formatted AI Response Output */}
        {aiResponse ? (
          <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl text-xs text-slate-200 leading-relaxed shadow-xl space-y-3">
            <div className="flex items-center justify-between font-extrabold text-sky-400 text-xs pb-2 border-b border-slate-800">
              <span className="flex items-center gap-2">
                <Sparkles size={16} /> {selectedAvatar.name} Response:
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
              "{selectedAvatar.greeting}"
            </span>
          </div>
        )}
      </div>

      {/* Input Bar & Voice Speech Capture */}
      <div className="pt-2 border-t border-slate-800 space-y-3">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder={`Ask ${selectedAvatar.name} a question...`}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAskAvatar();
            }}
            disabled={loading}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-2xl px-5 py-3 text-xs sm:text-sm text-white outline-none focus:border-sky-500 transition shadow-inner placeholder-slate-400"
          />

          <SpeechRecognition onResult={handleSpeechResult} />

          <button
            onClick={() => handleAskAvatar()}
            disabled={loading || !prompt.trim()}
            className="bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-extrabold px-5 py-3 rounded-2xl transition shadow-md shadow-sky-500/20 flex items-center gap-2 shrink-0 text-xs sm:text-sm"
          >
            <span>Send</span>
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default GodotPanel;