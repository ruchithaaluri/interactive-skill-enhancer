import { useState, useEffect, useRef, useContext } from "react";
import {
  Sparkles,
  Volume2,
  Mic,
  Brain,
  CheckCircle2,
  Trophy,
  Eye,
  Smile,
  Hand,
  UserCheck,
  Flame,
  Radio
} from "lucide-react";
import { AvatarContext } from "../context/AvatarContext";
import { PerformanceContext } from "../context/PerformanceContext";
import { speakWithAvatarVoice } from "../utils/speechUtils";

function RealisticAvatar({
  avatar: propAvatar,
  avatarState = "IDLE",
  isSpeaking = false,
  trackingData = null,
  onGestureTrigger,
}) {
  const context = useContext(AvatarContext);
  const perfContext = useContext(PerformanceContext);

  const activeAvatar = propAvatar || context?.selectedAvatar;
  const reducedMotion = perfContext?.reducedMotion || false;
  const animationsEnabled = perfContext?.animationsEnabled !== false;

  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [activeGesture, setActiveGesture] = useState("IDLE"); // IDLE, WAVE, EXPLAIN, THINK, CELEBRATE, LISTEN
  const [speechVisemePulse, setSpeechVisemePulse] = useState(false);

  const avatarId = activeAvatar?.id || "doctor";
  const isMale = activeAvatar?.gender === "male";
  const themeColor = activeAvatar?.themeColor || "sky";

  // 1. Natural Eyelid Blinking Simulation
  useEffect(() => {
    if (reducedMotion || !animationsEnabled) return;

    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      const timer = setTimeout(() => setIsBlinking(false), 170);
      return () => clearTimeout(timer);
    }, 3800 + Math.random() * 2200);

    return () => clearInterval(blinkInterval);
  }, [reducedMotion, animationsEnabled]);

  // 2. Integrated Lip Sync & Speech Syllable Modulation directly on Avatar
  const activeSpeaking = avatarState === "SPEAKING" || isSpeaking;

  useEffect(() => {
    if (!activeSpeaking || reducedMotion) {
      setSpeechVisemePulse(false);
      return;
    }

    // Continuous rhythmic speech articulation clock matching syllables (~120ms)
    const interval = setInterval(() => {
      setSpeechVisemePulse((prev) => !prev);
    }, 120);

    // Also sync to boundary viseme events from speech synthesizer
    const handleViseme = () => {
      setSpeechVisemePulse((prev) => !prev);
    };

    window.addEventListener("avatar-speech-viseme", handleViseme);

    return () => {
      clearInterval(interval);
      window.removeEventListener("avatar-speech-viseme", handleViseme);
    };
  }, [activeSpeaking, reducedMotion]);

  // 3. React to Avatar State or MediaPipe Tracking Gestures
  useEffect(() => {
    if (trackingData?.gesture && trackingData.gesture.includes("Wave")) {
      setActiveGesture("WAVE");
    } else if (trackingData?.gesture && trackingData.gesture.includes("Thumbs Up")) {
      setActiveGesture("CELEBRATE");
    } else if (avatarState === "THINKING") {
      setActiveGesture("THINK");
    } else if (avatarState === "SPEAKING" || isSpeaking) {
      setActiveGesture("EXPLAIN");
    } else if (avatarState === "CORRECT" || avatarState === "VICTORY" || avatarState === "HAPPY") {
      setActiveGesture("CELEBRATE");
    } else if (avatarState === "LISTENING") {
      setActiveGesture("LISTEN");
    } else if (avatarState === "GREETING") {
      setActiveGesture("WAVE");
    } else {
      setActiveGesture("IDLE");
    }
  }, [avatarState, isSpeaking, trackingData]);

  // 4. Interactive 3D Perspective Tilt on Mouse Movement
  const handleMouseMove = (e) => {
    if (reducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseTilt({ x: x * 10, y: -y * 10 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMouseTilt({ x: 0, y: 0 });
  };

  // Compute final tilt
  let tiltX = mouseTilt.y;
  let tiltY = mouseTilt.x;
  if (trackingData?.headPose) {
    tiltY = trackingData.headPose.yaw * 7;
    tiltX = -trackingData.headPose.pitch * 7;
  }

  // Trigger manual speech intro in persona's gender voice
  const handleSpeakIntro = () => {
    if (activeAvatar?.greeting) {
      speakWithAvatarVoice(
        activeAvatar.greeting,
        activeAvatar.id,
        () => { },
        () => { }
      );
      setActiveGesture("WAVE");
      setTimeout(() => setActiveGesture("IDLE"), 2600);
    }
  };

  const triggerGesture = (gesture) => {
    setActiveGesture(gesture);
    if (onGestureTrigger) onGestureTrigger(gesture);
    setTimeout(() => setActiveGesture("IDLE"), 2600);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[360px] mx-auto rounded-3xl overflow-hidden glass-panel border border-sky-400/25 shadow-2xl transition-all duration-300 group flex flex-col justify-between"
      style={{
        boxShadow: activeSpeaking
          ? "0 0 45px rgba(56, 189, 248, 0.45), 0 0 85px rgba(99, 102, 241, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.25)"
          : isHovered
            ? "0 0 35px rgba(56, 189, 248, 0.25), 0 20px 45px rgba(2, 6, 23, 0.8), inset 0 1px 2px rgba(255, 255, 255, 0.2)"
            : "0 20px 45px rgba(2, 6, 23, 0.7), inset 0 1px 1px rgba(255, 255, 255, 0.15)",
        transform: `perspective(1000px) rotateX(${tiltX * 0.35}deg) rotateY(${tiltY * 0.35}deg)`,
      }}
    >
      {/* Top Header Badge: Persona Profile & Starlight Status */}
      <div className="relative z-20 px-4 py-3 flex items-center justify-between backdrop-blur-xl bg-slate-950/70 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-[10px] text-cyan-400 font-bold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
            <span className="uppercase">3D PIXAR</span>
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-1.5 tracking-wide font-starlight">
              <span>{activeAvatar?.name}</span>
              <span
                className={`text-[9px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                  isMale
                    ? "bg-sky-500/20 text-sky-300 border border-sky-400/30"
                    : "bg-purple-500/20 text-purple-300 border border-purple-400/30"
                }`}
              >
                {isMale ? "Male" : "Female"}
              </span>
            </div>
            <div className="text-[10px] font-medium text-slate-300 flex items-center gap-1">
              <span className="text-sky-300 font-semibold">{activeAvatar?.role}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400 truncate max-w-[130px]">{activeAvatar?.profession || activeAvatar?.subtitle}</span>
            </div>
          </div>
        </div>

        {/* Setting Tag */}
        {activeAvatar?.environment?.title && (
          <div className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-[10px] font-semibold text-sky-200 shadow-sm flex items-center gap-1 backdrop-blur-md">
            <Sparkles size={11} className="text-cyan-400" />
            <span className="truncate max-w-[90px]">{activeAvatar.environment.title.split(" ")[1] || "Studio"}</span>
          </div>
        )}
      </div>

      {/* Main Medium-Size 3D Pixar Avatar Portrait Frame */}
      <div className="relative w-full h-[275px] sm:h-[295px] overflow-hidden bg-slate-950 flex items-center justify-center">
        {/* 3D Pixar Character Render with Smooth Perspective Tilt & Integrated Speech Articulation */}
        <div
          className={`w-full h-full relative transition-transform duration-150 ease-out ${
            activeSpeaking
              ? speechVisemePulse
                ? "animate-doctor-talking scale-[1.025] -translate-y-0.5"
                : "scale-[1.01] translate-y-0"
              : activeGesture === "CELEBRATE"
                ? "animate-hand-celebrate"
                : activeGesture === "WAVE"
                  ? "animate-doctor-gesture"
                  : "animate-avatar-breath"
          }`}
          style={{
            transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${isHovered ? 1.02 : 1})`,
            transformOrigin: "center 70%",
          }}
        >
          <img
            src={activeAvatar?.image}
            alt={activeAvatar?.name}
            className={`w-full h-full object-cover object-[center_16%] select-none transition-all duration-150 ${
              isBlinking
                ? "brightness-95 contrast-95 scale-[0.998]"
                : activeSpeaking
                  ? speechVisemePulse
                    ? "brightness-105 contrast-105"
                    : "brightness-100 contrast-100"
                  : "brightness-100 contrast-100"
            }`}
            draggable={false}
          />

          {/* Natural Eye Blinking Simulation Overlay */}
          {isBlinking && (
            <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[0.5px] pointer-events-none transition-opacity duration-100" />
          )}

          {/* Integrated Speech Aura Glow on Character Mouth & Face Region */}
          {activeSpeaking && (
            <div
              className={`absolute top-[60%] left-[50%] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-all duration-150 ${
                speechVisemePulse
                  ? "w-24 h-14 bg-cyan-400/20 border border-cyan-300/35 backdrop-blur-[0.8px] scale-110 shadow-[0_0_35px_rgba(56,189,248,0.55)]"
                  : "w-20 h-10 bg-cyan-400/10 border border-cyan-300/20 scale-95 shadow-[0_0_15px_rgba(56,189,248,0.25)]"
              }`}
            />
          )}

          {/* Soft Celestial Starlight Vignette Gradient */}
          <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-slate-950/60 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent pointer-events-none" />
        </div>

        {/* Real-time State Banner Overlay */}
        <div className="absolute bottom-2.5 inset-x-3 z-20 flex flex-col items-center gap-1.5 pointer-events-none">
          {/* Audio Equalizer Waves when Speaking */}
          {activeSpeaking && (
            <div className="px-3.5 py-1 rounded-full bg-slate-950/90 border border-cyan-400/50 backdrop-blur-xl flex items-center gap-2 shadow-2xl">
              <Volume2 size={13} className="text-cyan-400 animate-bounce" />
              <span className="text-[10px] font-bold text-sky-200 uppercase tracking-wider">
                {activeAvatar?.name} Speaking ({isMale ? "Male" : "Female"})
              </span>
              <div className="flex items-center gap-1">
                <span className="equalizer-bar" style={{ animationDelay: "0s", height: "12px" }} />
                <span className="equalizer-bar" style={{ animationDelay: "0.2s", height: "16px" }} />
                <span className="equalizer-bar" style={{ animationDelay: "0.4s", height: "10px" }} />
                <span className="equalizer-bar" style={{ animationDelay: "0.1s", height: "14px" }} />
              </div>
            </div>
          )}

          {/* Gesture & Tracking Feedback Indicator */}
          {!activeSpeaking && activeGesture !== "IDLE" && (
            <div className="px-3 py-1 rounded-full bg-slate-950/90 border border-sky-400/40 backdrop-blur-xl flex items-center gap-1.5 text-[10px] font-semibold text-sky-200 shadow-xl animate-bounce">
              {activeGesture === "WAVE" && <span>👋 Friendly Wave</span>}
              {activeGesture === "EXPLAIN" && <span>👐 Explaining Concept</span>}
              {activeGesture === "CELEBRATE" && <span>✨ Great Job! Celebrating</span>}
              {activeGesture === "THINK" && <span>🤔 Reflecting on Thought</span>}
              {activeGesture === "LISTEN" && <span>🎧 Listening Closely</span>}
            </div>
          )}

          {/* MediaPipe Active Landmark Mirroring Tag */}
          {!activeSpeaking && activeGesture === "IDLE" && trackingData?.detectedFace && (
            <div className="px-3 py-0.5 rounded-full bg-slate-950/80 border border-cyan-400/30 backdrop-blur-xl flex items-center gap-1.5 text-[10px] font-medium text-slate-300 shadow-md">
              <Smile size={11} className="text-cyan-400" />
              <span>Face & Gaze Telemetry Synced</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Interactive Toolbar: Audio Intro & Expressive Gestures */}
      <div className="relative z-20 p-2.5 bg-slate-950/90 backdrop-blur-xl border-t border-white/10 flex items-center justify-between gap-1.5 flex-wrap">
        <div className="flex items-center gap-1 flex-wrap">
          <button
            onClick={handleSpeakIntro}
            className="px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-gradient-to-r from-sky-500/30 to-indigo-500/30 hover:from-sky-500/45 hover:to-indigo-500/45 border border-sky-400/40 text-sky-200 transition-all flex items-center gap-1 shadow"
            title="Listen to persona speak introduction in matched gender voice"
          >
            <Volume2 size={13} className="text-cyan-400" /> Talk
          </button>

          <button
            onClick={() => triggerGesture("WAVE")}
            className="px-2 py-1 rounded-xl text-[11px] font-medium bg-white/5 hover:bg-white/15 border border-white/10 text-slate-200 transition flex items-center gap-1"
            title="Trigger wave greeting gesture"
          >
            👋 Wave
          </button>

          <button
            onClick={() => triggerGesture("EXPLAIN")}
            className="px-2 py-1 rounded-xl text-[11px] font-medium bg-white/5 hover:bg-white/15 border border-white/10 text-slate-200 transition flex items-center gap-1"
            title="Trigger concept explanation gesture"
          >
            👐 Explain
          </button>

          <button
            onClick={() => triggerGesture("CELEBRATE")}
            className="px-2 py-1 rounded-xl text-[11px] font-medium bg-white/5 hover:bg-white/15 border border-white/10 text-slate-200 transition flex items-center gap-1"
            title="Trigger celebration gesture"
          >
            🙌 Celebrate
          </button>

          <button
            onClick={() => triggerGesture("THINK")}
            className="px-2 py-1 rounded-xl text-[11px] font-medium bg-white/5 hover:bg-white/15 border border-white/10 text-slate-200 transition flex items-center gap-1"
            title="Trigger thinking gesture"
          >
            🤔 Think
          </button>
        </div>

        <div className="text-[10px] text-cyan-300 font-semibold px-2 py-0.5 rounded-lg bg-cyan-500/10 border border-cyan-400/25 flex items-center gap-1">
          <Eye size={11} className="text-cyan-400" />
          <span>Live 3D</span>
        </div>
      </div>
    </div>
  );
}

export default RealisticAvatar;
export { RealisticAvatar };
