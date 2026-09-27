import { useState, useRef, useEffect } from "react";
import { SendHorizontal, Bot, User, Trash2, Volume2, VolumeX, Sparkles, Download, Mic, Activity } from "lucide-react";
import { askAI } from "../services/api";
import SpeechRecognition from "../components/SpeechRecognition";
import { FormattedText } from "../utils/formatText";

function AIChat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "AI",
      text: "Hello! 👋 I am Dr. Mentor, your AI Doctor Learning Assistant. Ask me anything about programming, mathematics, science, history, geography, or social interaction skills!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const speakText = (text) => {
    if (!ttsEnabled || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    
    // Remove markdown symbols before speaking
    const cleanSpeechText = text.replace(/[\*\_\[\]\`\#]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleSpeech = (text) => {
    setMessage(text);
  };

  const sendMessage = async (textToSend = null) => {
    const text = textToSend || message;
    if (!text.trim() || loading) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMessages = [
      ...messages,
      {
        sender: "You",
        text: text,
        timestamp: currentTime,
      },
    ];

    setMessages(newMessages);
    if (!textToSend) setMessage("");
    setLoading(true);

    try {
      const history = newMessages.map((msg) => ({
        role: msg.sender === "You" ? "user" : "assistant",
        content: msg.text,
      }));

      const reply = await askAI(text, history);

      setMessages((prev) => [
        ...prev,
        {
          sender: "AI",
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);

      speakText(reply);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "AI",
          text: "Unable to connect to the AI server. Please check backend connection.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setMessages([
      {
        sender: "AI",
        text: "Conversation cleared. How can I help you learn today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const exportTranscript = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(messages, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Learning_Transcript_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const quickActions = [
    "Explain simpler",
    "Give an example",
    "What is 20% of 150?",
    "Why is the sky blue?",
    "How to make friends?",
    "Quiz me",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Sparkles className="text-sky-400 animate-pulse" size={32} />
            Dr. Mentor AI Learning Assistant
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            Ask any question on programming, math, science, history, geography, or social interaction skills.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* TTS Toggle */}
          <button
            onClick={() => {
              setTtsEnabled(!ttsEnabled);
              if (ttsEnabled) {
                window.speechSynthesis?.cancel();
                setIsSpeaking(false);
              }
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold border backdrop-blur-md transition shadow-lg ${
              ttsEnabled
                ? "bg-sky-500/20 border-sky-400/40 text-sky-300 hover:bg-sky-500/30"
                : "bg-slate-800/60 border-white/10 text-slate-400 hover:bg-slate-800"
            }`}
          >
            {ttsEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            {ttsEnabled ? "Voice Output ON" : "Voice Output OFF"}
          </button>

          {/* Export Transcript Button */}
          <button
            onClick={exportTranscript}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold bg-slate-800/60 hover:bg-slate-800 border border-white/10 text-slate-200 backdrop-blur-md transition shadow-lg"
          >
            <Download size={16} /> Export Chat
          </button>

          {/* Clear Chat Button */}
          <button
            onClick={clearChat}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 backdrop-blur-md transition shadow-lg"
          >
            <Trash2 size={16} /> Clear Chat
          </button>
        </div>
      </div>

      {/* Main Glass Chat Panel */}
      <div className="glass-panel h-[calc(100vh-230px)] flex flex-col overflow-hidden relative border border-white/15 shadow-2xl">
        {/* Equalizer Indicator when AI is speaking */}
        {isSpeaking && (
          <div className="px-6 py-2 bg-sky-500/20 border-b border-sky-400/30 flex items-center justify-between backdrop-blur-md">
            <span className="text-xs font-bold text-sky-300 flex items-center gap-2">
              <Volume2 size={16} className="animate-bounce" /> Dr. Mentor AI is speaking...
            </span>
            <div className="flex items-center gap-1">
              <span className="equalizer-bar" style={{ animationDelay: '0s' }}></span>
              <span className="equalizer-bar" style={{ animationDelay: '0.2s' }}></span>
              <span className="equalizer-bar" style={{ animationDelay: '0.4s' }}></span>
              <span className="equalizer-bar" style={{ animationDelay: '0.1s' }}></span>
              <span className="equalizer-bar" style={{ animationDelay: '0.3s' }}></span>
            </div>
          </div>
        )}

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[88%] lg:max-w-[78%] rounded-3xl p-5 border backdrop-blur-xl transition-all duration-300 ${
                  msg.sender === "You"
                    ? "bg-gradient-to-r from-sky-600/90 to-blue-600/90 border-sky-400/40 text-white rounded-br-none shadow-xl shadow-sky-600/20"
                    : "bg-slate-900/80 border-white/15 text-slate-100 rounded-bl-none shadow-2xl"
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-2.5 pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    {msg.sender === "You" ? (
                      <div className="p-1.5 rounded-full bg-white/20 text-white">
                        <User size={14} />
                      </div>
                    ) : (
                      <div className="p-1.5 rounded-full bg-sky-500/30 text-sky-300 border border-sky-400/40">
                        <Bot size={14} />
                      </div>
                    )}
                    <span className="font-extrabold text-xs tracking-wider uppercase">
                      {msg.sender === "You" ? "Learner" : "Dr. Mentor"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {msg.sender === "AI" && (
                      <button
                        onClick={() => speakText(msg.text)}
                        className="text-xs text-sky-300 hover:text-white transition p-1 rounded-lg hover:bg-white/10"
                        title="Read Aloud"
                      >
                        <Volume2 size={15} />
                      </button>
                    )}
                    <span className="text-[11px] opacity-70 font-mono">{msg.timestamp}</span>
                  </div>
                </div>

                <div className="leading-relaxed text-sm sm:text-base font-normal">
                  <FormattedText text={msg.text} />
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-900/80 border border-sky-400/30 rounded-3xl rounded-bl-none p-4 flex items-center gap-3 text-sky-300 text-sm shadow-xl backdrop-blur-xl">
                <Bot className="animate-bounce text-sky-400" size={20} />
                <span className="font-semibold">Dr. Mentor is generating your response...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Action Chips */}
        <div className="px-6 py-3 bg-slate-950/60 border-t border-white/10 flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Quick Actions:
          </span>
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={() => sendMessage(action)}
              disabled={loading}
              className="shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-800/80 hover:bg-sky-500 hover:text-white border border-white/10 text-slate-200 transition shadow-sm backdrop-blur-md"
            >
              {action}
            </button>
          ))}
        </div>

        {/* Input Bar with Speech Recognition */}
        <div className="p-4 bg-slate-950/80 border-t border-white/10 flex items-center gap-3">
          <input
            type="text"
            placeholder="Ask any question on programming, math, science, history, geography..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            disabled={loading}
            className="flex-1 bg-slate-900/80 border border-white/15 rounded-2xl px-5 py-3.5 text-white placeholder-slate-400 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30 transition text-sm sm:text-base font-medium shadow-inner"
          />

          <SpeechRecognition onResult={handleSpeech} />

          <button
            onClick={() => sendMessage()}
            disabled={loading || !message.trim()}
            className="glass-btn-primary text-white font-extrabold px-6 py-3.5 rounded-2xl transition disabled:opacity-40 flex items-center justify-center shrink-0 shadow-xl"
          >
            <SendHorizontal size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AIChat;