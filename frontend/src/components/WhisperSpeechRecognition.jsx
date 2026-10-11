import { useState, useRef, useEffect } from "react";
import {
  Mic,
  MicOff,
  Sparkles,
  Download,
  AlertCircle,
  X,
  CheckCircle,
  Cpu,
  Layers,
  Volume2
} from "lucide-react";

// Singleton pipeline cache for client-side Whisper
let whisperPipelineInstance = null;
let isPipelineLoading = false;

function WhisperSpeechRecognition({ onResult, onError }) {
  const [engine, setEngine] = useState("whisper"); // "whisper" or "webspeech"
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(null);
  const [transcriptPreview, setTranscriptPreview] = useState("");
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const recognitionRef = useRef(null);
  const audioStreamRef = useRef(null);

  // Initialize Web Speech API for lightweight fallback
  useEffect(() => {
    const SpeechRecognitionApi = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionApi) {
      const recognition = new SpeechRecognitionApi();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        if (event.results && event.results[0]) {
          const text = event.results[0][0].transcript;
          setTranscriptPreview(text);
          if (event.results[0].isFinal) {
            onResult(text);
            setIsRecording(false);
          }
        }
      };

      recognition.onerror = (e) => {
        setIsRecording(false);
        setErrorMsg(`Web Speech error: ${e.error}`);
        if (onError) onError(e.error);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, [onResult, onError]);

  // Load Free Client-Side Whisper Model (@xenova/transformers)
  const getWhisperPipeline = async () => {
    if (whisperPipelineInstance) return whisperPipelineInstance;
    if (isPipelineLoading) {
      while (isPipelineLoading) {
        await new Promise((r) => setTimeout(r, 200));
      }
      return whisperPipelineInstance;
    }

    try {
      isPipelineLoading = true;
      const { pipeline, env } = await import("@xenova/transformers");

      // Configure cache in browser IndexedDB
      env.allowLocalModels = false;
      env.useBrowserCache = true;

      const transcriber = await pipeline(
        "automatic-speech-recognition",
        "Xenova/whisper-tiny.en",
        {
          quantized: true,
          progress_callback: (p) => {
            if (p.status === "progress") {
              setDownloadProgress(Math.round(p.progress || 0));
            } else if (p.status === "ready") {
              setDownloadProgress(null);
            }
          },
        }
      );

      whisperPipelineInstance = transcriber;
      isPipelineLoading = false;
      setDownloadProgress(null);
      return transcriber;
    } catch (err) {
      isPipelineLoading = false;
      setDownloadProgress(null);
      console.error("Local Whisper initialization error:", err);
      throw new Error("Failed to load local Whisper ONNX model: " + err.message);
    }
  };

  // Convert Recorded Audio Blob to 16kHz Float32Array for Whisper
  const audioBlobToFloat32Array = async (blob) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)({
      sampleRate: 16000,
    });
    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const float32Data = audioBuffer.getChannelData(0);
    audioContext.close();
    return float32Data;
  };

  // Start Audio Recording
  const startRecording = async () => {
    setErrorMsg("");
    setTranscriptPreview("");
    setRecordingSeconds(0);

    if (engine === "webspeech") {
      if (!recognitionRef.current) {
        setErrorMsg("Web Speech API is not supported in this browser. Please switch to Local Whisper.");
        return;
      }
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        setErrorMsg("Failed to start speech recognition.");
      }
      return;
    }

    // Local Whisper Path
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      audioStreamRef.current = stream;
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop audio tracks immediately for privacy
        if (audioStreamRef.current) {
          audioStreamRef.current.getTracks().forEach((track) => track.stop());
          audioStreamRef.current = null;
        }

        if (audioChunksRef.current.length === 0) return;

        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        audioChunksRef.current = [];

        await transcribeWithWhisper(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone capture error:", err);
      setErrorMsg("Microphone permission denied or microphone not found.");
      if (onError) onError(err.message);
    }
  };

  // Stop Recording and trigger Transcription
  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (engine === "webspeech") {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsRecording(false);
      return;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  // Cancel Recording without transcribing
  const cancelRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
    }
    audioChunksRef.current = [];
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
    }
    setIsRecording(false);
    setIsTranscribing(false);
    setTranscriptPreview("");
  };

  // Run Local Whisper Inference
  const transcribeWithWhisper = async (audioBlob) => {
    try {
      setIsTranscribing(true);
      const transcriber = await getWhisperPipeline();

      const float32Audio = await audioBlobToFloat32Array(audioBlob);
      if (float32Audio.length < 1600) {
        setErrorMsg("Audio too short or silent. Please speak into the microphone.");
        setIsTranscribing(false);
        return;
      }

      // Run inference
      const output = await transcriber(float32Audio, {
        chunk_length_s: 30,
        stride_length_s: 5,
        language: "english",
        task: "transcribe",
      });

      const text = output?.text?.trim() || "";
      if (text) {
        setTranscriptPreview(text);
        onResult(text);
      } else {
        setErrorMsg("No clear speech detected. Please try speaking again.");
      }
    } catch (err) {
      console.error("Whisper transcription error:", err);
      setErrorMsg("Whisper error: " + err.message + ". Switching to Browser STT option available.");
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <div className="relative inline-flex items-center gap-2">
      {/* Primary Record / Stop Button */}
      <button
        type="button"
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isTranscribing}
        title={isRecording ? "Click to Stop & Transcribe" : "Click to Speak"}
        className={`px-4 py-3.5 rounded-2xl transition flex items-center justify-center shadow-xl ${
          isRecording
            ? "bg-red-500 hover:bg-red-600 text-white animate-pulse ring-4 ring-red-400/30"
            : isTranscribing
            ? "bg-purple-600 text-white cursor-wait animate-bounce"
            : "bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/25"
        }`}
      >
        {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
      </button>

      {/* Engine Config Pill */}
      <button
        type="button"
        onClick={() => setShowSettings(!showSettings)}
        className="px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-[10px] font-bold text-slate-300 flex items-center gap-1.5 shadow"
        title="Speech Recognition Engine Settings"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        {engine === "whisper" ? "Free Whisper Tiny (ONNX)" : "Browser Web Speech"}
      </button>

      {/* Recording Duration Indicator */}
      {isRecording && (
        <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 px-3 py-1.5 rounded-xl text-red-300 text-xs font-bold animate-pulse">
          <span className="w-2 h-2 rounded-full bg-red-400" />
          <span>Recording: {recordingSeconds}s</span>
          <button
            onClick={cancelRecording}
            className="p-1 hover:bg-white/10 rounded text-red-300"
            title="Cancel"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* Transcribing Indicator */}
      {isTranscribing && (
        <div className="flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 px-3 py-1.5 rounded-xl text-purple-300 text-xs font-bold">
          <Cpu size={14} className="animate-spin" />
          <span>Local Whisper Transcribing...</span>
        </div>
      )}

      {/* First-time Download Progress Bar */}
      {downloadProgress !== null && (
        <div className="absolute bottom-full mb-3 left-0 z-50 w-72 p-3 bg-slate-900 border border-sky-400/40 rounded-2xl shadow-2xl space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-sky-300 font-bold">
            <span className="flex items-center gap-1.5">
              <Download size={14} className="animate-bounce" /> Downloading Local Whisper Model
            </span>
            <span>{downloadProgress}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-sky-400 h-full transition-all duration-300"
              style={{ width: `${downloadProgress}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400">
            One-time ~39MB download. Stored locally in your browser cache. 100% Free & Private.
          </p>
        </div>
      )}

      {/* Settings Modal Popover */}
      {showSettings && (
        <div className="absolute bottom-full mb-3 left-0 z-50 w-80 p-4 bg-slate-950 border border-white/15 rounded-3xl shadow-2xl space-y-3 backdrop-blur-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={14} className="text-sky-400" /> Speech Recognition Engine
            </h4>
            <button
              onClick={() => setShowSettings(false)}
              className="text-slate-400 hover:text-white"
            >
              <X size={15} />
            </button>
          </div>

          <div className="space-y-2">
            {/* Option 1: Free Local Whisper */}
            <div
              onClick={() => setEngine("whisper")}
              className={`p-3 rounded-2xl border cursor-pointer transition ${
                engine === "whisper"
                  ? "bg-sky-500/15 border-sky-400/50 text-white"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-900"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                  <Sparkles size={14} /> Local Whisper ONNX (Recommended)
                </span>
                {engine === "whisper" && <CheckCircle size={14} className="text-sky-400" />}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                Runs 100% in-browser via WebAssembly. High accuracy, 0 paid API calls, no billing, no API key required.
              </p>
            </div>

            {/* Option 2: Browser Web Speech API */}
            <div
              onClick={() => setEngine("webspeech")}
              className={`p-3 rounded-2xl border cursor-pointer transition ${
                engine === "webspeech"
                  ? "bg-sky-500/15 border-sky-400/50 text-white"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-900"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Cpu size={14} /> Browser Web Speech (Ultra-Low CPU)
                </span>
                {engine === "webspeech" && <CheckCircle size={14} className="text-amber-400" />}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                Browser-native streaming recognition. Instant zero download, ultra-low resource usage on mobile/older laptops.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {errorMsg && (
        <div className="absolute bottom-full mb-2 left-0 z-50 w-72 p-2.5 bg-slate-950 border border-red-500/40 text-red-300 text-xs rounded-xl shadow-2xl flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0 text-red-400" />
          <span className="flex-1">{errorMsg}</span>
          <button onClick={() => setErrorMsg("")} className="text-red-400 hover:text-white">
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

export default WhisperSpeechRecognition;
