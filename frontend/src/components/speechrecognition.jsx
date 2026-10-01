import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, AlertCircle } from "lucide-react";

function SpeechRecognition({ onResult, onError }) {
  const [listening, setListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognitionApi =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionApi) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognitionApi();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        if (event.results && event.results[0] && event.results[0][0]) {
          const transcript = event.results[0][0].transcript;
          onResult(transcript);
        }
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setListening(false);
        let msg = "Microphone error. Please try again.";
        if (event.error === "not-allowed" || event.error === "permission-denied") {
          msg = "Microphone access denied. Please allow mic permissions in your browser.";
        } else if (event.error === "no-speech") {
          msg = "No speech detected. Please speak clearly.";
        }
        setErrorMessage(msg);
        if (onError) onError(msg);
      };

      recognition.onend = () => {
        setListening(false);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.error("Failed to initialize SpeechRecognition:", e);
      setIsSupported(false);
    }
  }, [onResult, onError]);

  const toggleListening = () => {
    if (!isSupported) {
      setErrorMessage("Speech recognition is not supported in this browser.");
      return;
    }
    if (!recognitionRef.current) return;

    setErrorMessage("");

    if (listening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setListening(true);
      } catch (e) {
        console.error("Failed to start speech recognition:", e);
        setListening(false);
      }
    }
  };

  return (
    <div className="relative inline-flex flex-col items-center">
      <button
        type="button"
        onClick={toggleListening}
        disabled={!isSupported}
        title={isSupported ? (listening ? "Stop Listening" : "Click to Speak") : "Speech recognition unsupported"}
        className={`px-4 py-3 rounded-xl transition flex items-center justify-center shadow-lg ${
          !isSupported
            ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
            : listening
            ? "bg-red-500 hover:bg-red-600 text-white animate-pulse shadow-red-500/30 ring-2 ring-red-400"
            : "bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/25"
        }`}
      >
        {listening ? <MicOff size={20} /> : <Mic size={20} />}
      </button>

      {errorMessage && (
        <div className="absolute bottom-full mb-2 z-50 w-56 p-2 bg-slate-900 border border-slate-700 text-red-300 text-[11px] rounded-lg shadow-xl flex items-center gap-1.5">
          <AlertCircle size={14} className="shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}

export default SpeechRecognition;