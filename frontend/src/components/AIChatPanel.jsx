import { useState, useRef, useEffect, useContext } from "react";
import { SendHorizontal, Bot, User, Trash2 } from "lucide-react";
import { askAI } from "../services/api";
import SpeechRecognition from "./SpeechRecognition";
import { AvatarContext } from "../context/AvatarContext";
import { speakWithAvatarVoice } from "../utils/speechUtils";

function AIChatPanel() {
  const { selectedAvatar } = useContext(AvatarContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "AI",
      text: selectedAvatar.greeting,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages([
      {
        sender: "AI",
        text: selectedAvatar.greeting,
      },
    ]);
  }, [selectedAvatar.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSpeech = (text) => {
    setMessage(text);
  };

  const sendMessage = async (textToSend = null) => {
    const text = textToSend || message;
    if (!text.trim() || loading) return;

    const newMessages = [
      ...messages,
      { sender: "You", text: text },
    ];

    setMessages(newMessages);
    if (!textToSend) setMessage("");
    setLoading(true);

    try {
      const history = newMessages.map((msg) => ({
        role: msg.sender === "You" ? "user" : "assistant",
        content: msg.text,
      }));

      const reply = await askAI(text, history, selectedAvatar.id, selectedAvatar.systemPrompt);

      setMessages((prev) => [
        ...prev,
        { sender: "AI", text: reply },
      ]);

      if ("speechSynthesis" in window) {
        speakWithAvatarVoice(reply, selectedAvatar.id);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { sender: "AI", text: "❌ Unable to connect to the AI server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel border border-white/10 rounded-3xl h-[600px] flex flex-col overflow-hidden shadow-2xl">
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/20 text-cyan-400 border border-sky-400/30 shadow-md">
            <Bot size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-starlight leading-tight">AI Learning Tutor</h2>
            <p className="text-xs text-sky-200/70">Ask questions, explore examples, or practice skills</p>
          </div>
        </div>

        <button
          onClick={() => setMessages([{ sender: "AI", text: "Chat cleared. What shall we learn next?" }])}
          className="text-slate-400 hover:text-rose-300 p-2 rounded-lg transition"
          title="Clear chat"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed backdrop-blur-md ${
                msg.sender === "You"
                  ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-br-none shadow-lg shadow-sky-500/20"
                  : "glass-panel bg-slate-900/80 border border-white/10 text-slate-100 rounded-bl-none shadow-md"
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1 text-xs opacity-80 font-semibold text-cyan-300">
                {msg.sender === "You" ? <User size={13} className="text-white" /> : <Bot size={13} />}
                <span>{msg.sender === "You" ? "You" : selectedAvatar.name}</span>
              </div>
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="glass-panel bg-slate-900/80 border border-cyan-400/30 rounded-2xl rounded-bl-none px-4 py-3 text-xs text-sky-200 flex items-center gap-2">
              <Bot className="animate-spin text-cyan-400" size={14} />
              <span>Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-slate-950/40 border-t border-white/10 flex gap-2 overflow-x-auto scrollbar-none">
        {["Explain simpler", "Give example", "Quiz me"].map((btn, i) => (
          <button
            key={i}
            onClick={() => sendMessage(btn)}
            className="text-xs shrink-0 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-sky-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 hover:border-sky-400/30 transition backdrop-blur-md"
          >
            {btn}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-white/10 flex items-center gap-2 bg-slate-950/60 backdrop-blur-xl">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          disabled={loading}
          placeholder="Ask a question..."
          className="flex-1 bg-slate-900/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition"
        />

        <SpeechRecognition onResult={handleSpeech} />

        <button
          onClick={() => sendMessage()}
          disabled={loading || !message.trim()}
          className="glass-btn-primary disabled:opacity-50 text-white p-2.5 rounded-xl transition shadow-lg"
        >
          <SendHorizontal size={18} />
        </button>
      </div>
    </div>
  );
}

export default AIChatPanel;