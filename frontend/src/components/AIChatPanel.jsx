import { useState, useRef, useEffect, useContext } from "react";
import { SendHorizontal, Bot, User, Trash2 } from "lucide-react";
import { askAI } from "../services/api";
import SpeechRecognition from "./SpeechRecognition";
import { AvatarContext } from "../context/AvatarContext";

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
    <div className="bg-slate-900 border border-slate-800 rounded-3xl h-[600px] flex flex-col overflow-hidden shadow-xl">
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
            <Bot size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white leading-tight">AI Learning Tutor</h2>
            <p className="text-xs text-slate-400">Ask questions, get examples, or practice skills</p>
          </div>
        </div>

        <button
          onClick={() => setMessages([{ sender: "AI", text: "Chat cleared. What shall we learn next?" }])}
          className="text-slate-400 hover:text-white p-2 rounded-lg transition"
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
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.sender === "You"
                  ? "bg-sky-600 text-white rounded-br-none"
                  : "bg-slate-800 border border-slate-700/70 text-slate-100 rounded-bl-none"
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1 text-xs opacity-75 font-semibold">
                {msg.sender === "You" ? <User size={13} /> : <Bot size={13} />}
                <span>{msg.sender}</span>
              </div>
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 border border-slate-700/70 rounded-2xl rounded-bl-none px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
              <Bot className="animate-spin text-sky-400" size={14} />
              <span>Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-slate-950/40 border-t border-slate-800 flex gap-2 overflow-x-auto scrollbar-none">
        {["Explain simpler", "Give example", "Quiz me"].map((btn, i) => (
          <button
            key={i}
            onClick={() => sendMessage(btn)}
            className="text-xs shrink-0 px-3 py-1 rounded-full bg-slate-800 hover:bg-sky-500 hover:text-white text-slate-300 border border-slate-700 transition"
          >
            {btn}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-slate-800 flex items-center gap-2 bg-slate-900">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          disabled={loading}
          placeholder="Ask a question..."
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-sky-500 transition"
        />

        <SpeechRecognition onResult={handleSpeech} />

        <button
          onClick={() => sendMessage()}
          disabled={loading || !message.trim()}
          className="bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white p-2.5 rounded-xl transition"
        >
          <SendHorizontal size={18} />
        </button>
      </div>
    </div>
  );
}

export default AIChatPanel;