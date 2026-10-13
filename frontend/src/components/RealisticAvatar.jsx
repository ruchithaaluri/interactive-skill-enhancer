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
  UserCheck
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
  const [visemeFrame, setVisemeFrame] = useState(0);

  const avatarId = activeAvatar?.id || "doctor";
  const isMale = activeAvatar?.gender === "male";
  const themeColor = activeAvatar?.themeColor || "sky";

  // 1. Natural Eyelid Blinking Simulation
  useEffect(() => {
    if (reducedMotion || !animationsEnabled) return;

    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      const timer = setTimeout(() => setIsBlinking(false), 160);
      return () => clearTimeout(timer);
    }, 4000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, [reducedMotion, animationsEnabled]);

  // 2. Active Speaking Mouth & Articulation Movement
  const activeSpeaking = (avatarState === "SPEAKING" || isSpeaking);
  useEffect(() => {
    if (!activeSpeaking || reducedMotion) {
      setVisemeFrame(0);
      return;
    }

    const interval = setInterval(() => {
      setVisemeFrame((prev) => (prev + 1) % 4);
    }, 120);

    return () => clearInterval(interval);
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

  // Compute final tilt (combines mouse position with MediaPipe head tracking if active)
  let tiltX = mouseTilt.y;
  let tiltY = mouseTilt.x;
  if (trackingData?.headPose) {
    tiltY = trackingData.headPose.yaw * 8;
    tiltX = -trackingData.headPose.pitch * 8;
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
      setTimeout(() => setActiveGesture("IDLE"), 2500);
    }
  };

  const triggerGesture = (gesture) => {
    setActiveGesture(gesture);
    if (onGestureTrigger) onGestureTrigger(gesture);
    setTimeout(() => setActiveGesture("IDLE"), 2800);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-full rounded-3xl overflow-hidden glass-panel border border-sky-400/20 shadow-2xl transition-all duration-300 group flex flex-col justify-between"
      style={{
        boxShadow: activeSpeaking
          ? "0 0 45px rgba(56, 189, 248, 0.45), 0 0 90px rgba(99, 102, 241, 0.3), inset 0 0 20px rgba(56, 189, 248, 0.2)"
          : isHovered
            ? "0 0 35px rgba(56, 189, 248, 0.25), 0 20px 45px rgba(2, 6, 23, 0.8)"
            : "0 20px 45px rgba(2, 6, 23, 0.7)",
      }}
    >
      {/* Top Header Badge: Persona Profile & Starlight Status */}
      <div className="relative z-20 p-4 flex items-center justify-between backdrop-blur-xl bg-slate-950/60 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-cyan-400 font-bold tracking-wide">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping inline-block" />
            <span className="uppercase">COMPANION ONLINE</span>
          </div>
          <div>
            <div className="text-base font-bold text-white flex items-center gap-2 tracking-wide font-starlight">
              <span>{activeAvatar?.name}</span>
              <span
                className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold shadow-sm uppercase tracking-wider ${isMale
                    ? "bg-sky-500/15 text-sky-300 border border-sky-400/30"
                    : "bg-purple-500/15 text-purple-300 border border-purple-400/30"
                  }`}
              >
                {isMale ? "Male Companion" : "Female Companion"}
              </span>
            </div>
            <div className="text-[11px] font-medium text-slate-300 flex items-center gap-1.5">
              <span className="text-sky-300 font-semibold">{activeAvatar?.role}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">{activeAvatar?.profession || activeAvatar?.subtitle}</span>
            </div>
          </div>
        </div>

        {/* Environment / Setting Tag */}
        {activeAvatar?.environment?.title && (
          <div className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-[11px] font-semibold text-sky-200 shadow-sm flex items-center gap-1.5 backdrop-blur-md">
            <Sparkles size={12} className="text-cyan-400" />
            <span>{activeAvatar.environment.title}</span>
          </div>
        )}
      </div>

      {/* Main Realistic Portrait Frame with Natural Aspect Ratio & Lifelike Micro-Animations */}
      <div className="relative w-full aspect-[4/5] sm:aspect-square overflow-hidden bg-slate-950 flex items-center justify-center">
        {/* Photorealistic Persona Image with Smooth 3D Perspective Tilt & Breathing */}
        <div
          className={`w-full h-full relative transition-transform duration-200 ease-out ${activeSpeaking
              ? "animate-doctor-talking scale-[1.015]"
              : activeGesture === "CELEBRATE"
                ? "animate-hand-celebrate"
                : activeGesture === "WAVE"
                  ? "animate-doctor-gesture"
                  : "animate-avatar-breath"
            }`}
          style={{
            transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${isHovered ? 1.02 : 1})`,
            transformOrigin: "center center",
          }}
        >
          <img
            src={activeAvatar?.image}
            alt={activeAvatar?.name}
            className={`w-full h-full object-cover object-top select-none transition-all duration-200 ${isBlinking ? "brightness-95 contrast-95 scale-[0.998]" : "brightness-100 contrast-100"
              }`}
            draggable={false}
          />

          {/* Natural Eye Blinking Simulation Overlay */}
          {isBlinking && (
            <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[0.5px] pointer-events-none transition-opacity duration-100" />
          )}

          {/* Rhythmic Speech Viseme Pulse Overlay in Celestial Cyan */}
          {activeSpeaking && (
            <div
              className="absolute top-[48%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-16 h-8 rounded-full bg-cyan-400/20 border border-cyan-300/40 backdrop-blur-[1px] animate-mouth-viseme pointer-events-none"
              style={{
                boxShadow: "0 0 30px rgba(56, 189, 248, 0.55)",
              }}
            />
          )}

          {/* Realistic Soft Starlight Vignette Gradient */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-slate-950/70 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent pointer-events-none" />
        </div>

        {/* Real-time State Banner Overlay */}
        <div className="absolute bottom-4 inset-x-4 z-20 flex flex-col items-center gap-2 pointer-events-none">
          {/* Audio Equalizer Waves when Speaking */}
          {activeSpeaking && (
            <div className="px-4 py-1.5 rounded-full bg-slate-950/85 border border-cyan-400/40 backdrop-blur-xl flex items-center gap-2.5 shadow-2xl">
              <Volume2 size={15} className="text-cyan-400 animate-bounce" />
              <span className="text-xs font-bold text-sky-200 uppercase tracking-wider">
                {activeAvatar?.name} Speaking ({isMale ? "Male Voice" : "Female Voice"})
              </span>
              <div className="flex items-center gap-1">
                <span className="equalizer-bar" style={{ animationDelay: "0s" }} />
                <span className="equalizer-bar" style={{ animationDelay: "0.2s" }} />
                <span className="equalizer-bar" style={{ animationDelay: "0.4s" }} />
                <span className="equalizer-bar" style={{ animationDelay: "0.1s" }} />
                <span className="equalizer-bar" style={{ animationDelay: "0.3s" }} />
              </div>
            </div>
          )}

          {/* Gesture & Tracking Feedback Indicator */}
          {!activeSpeaking && activeGesture !== "IDLE" && (
            <div className="px-4 py-1.5 rounded-full bg-slate-950/85 border border-sky-400/40 backdrop-blur-xl flex items-center gap-2 text-xs font-semibold text-sky-200 shadow-xl animate-bounce">
              {activeGesture === "WAVE" && <span>👋 Friendly Wave</span>}
              {activeGesture === "EXPLAIN" && <span>👐 Explaining Concept</span>}
              {activeGesture === "CELEBRATE" && <span>✨ Great Job! Celebrating</span>}
              {activeGesture === "THINK" && <span>🤔 Reflecting on Thought</span>}
              {activeGesture === "LISTEN" && <span>🎧 Listening Closely</span>}
            </div>
          )}

          {/* MediaPipe Active Landmark Mirroring Tag */}
          {!activeSpeaking && activeGesture === "IDLE" && trackingData?.detectedFace && (
            <div className="px-3.5 py-1 rounded-full bg-slate-950/75 border border-cyan-400/30 backdrop-blur-xl flex items-center gap-1.5 text-[11px] font-medium text-slate-300 shadow-md">
              <Smile size={13} className="text-cyan-400" />
              <span>Gaze & Facial Telemetry Synced</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Interactive Toolbar: Audio Intro & Expressive Gestures */}
      <div className="relative z-20 p-3 bg-slate-950/85 backdrop-blur-xl border-t border-white/10 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={handleSpeakIntro}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-sky-500/25 to-indigo-500/25 hover:from-sky-500/40 hover:to-indigo-500/40 border border-sky-400/30 text-sky-200 transition-all flex items-center gap-1.5 shadow"
            title="Listen to persona speak introduction in matched gender voice"
          >
            <Volume2 size={14} className="text-cyan-400" /> Voice Intro
          </button>

          <button
            onClick={() => triggerGesture("WAVE")}
            className="px-2.5 py-1.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 transition flex items-center gap-1"
            title="Trigger wave greeting gesture"
          >
            👋 Wave
          </button>

          <button
            onClick={() => triggerGesture("EXPLAIN")}
            className="px-2.5 py-1.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 transition flex items-center gap-1"
            title="Trigger concept explanation gesture"
          >
            👐 Explain
          </button>

          <button
            onClick={() => triggerGesture("CELEBRATE")}
            className="px-2.5 py-1.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 transition flex items-center gap-1"
            title="Trigger celebration gesture"
          >
            🙌 Celebrate
          </button>

          <button
            onClick={() => triggerGesture("THINK")}
            className="px-2.5 py-1.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 transition flex items-center gap-1"
            title="Trigger thinking gesture"
          >
            🤔 Think
          </button>
        </div>

        <div className="text-[11px] text-sky-300 font-medium px-3 py-1 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5 backdrop-blur-md">
          <Eye size={12} className="text-cyan-400" />
          <span>Interactive Live</span>
        </div>
      </div>
    </div>
  );
}

export default RealisticAvatar;
export { RealisticAvatar };
