import { useState, useEffect, useRef, useContext } from "react";
import { Sparkles, Volume2, Mic, Brain, CheckCircle2, Heart, Trophy, Info, Zap } from "lucide-react";
import doctorAvatarImg from "../assets/doctor-avatar.png";
import { PerformanceContext } from "../context/PerformanceContext";

function DoctorAvatar({ avatarState = "IDLE", isSpeaking = false }) {
  const { reducedMotion, animationsEnabled } = useContext(PerformanceContext);

  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [isBlinking, setIsBlinking] = useState(false);
  const [gestureActive, setGestureActive] = useState(false);

  // 1. IntersectionObserver: pause animations when outside viewport
  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]) {
          setIsVisible(entries[0].isIntersecting);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // 2. document.visibilityState: pause animations when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(document.visibilityState === "visible");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // 3. Event-driven Blink: Trigger short 180ms blink every 8 seconds, then sleep
  useEffect(() => {
    if (reducedMotion || !animationsEnabled || !isVisible || !isTabVisible) return;

    const interval = setInterval(() => {
      setIsBlinking(true);
      const timer = setTimeout(() => setIsBlinking(false), 180);
      return () => clearTimeout(timer);
    }, 8000);

    return () => clearInterval(interval);
  }, [reducedMotion, animationsEnabled, isVisible, isTabVisible]);

  // 4. Event-driven Gesture: Play predefined short animation only on state change, then return to static state
  useEffect(() => {
    if (avatarState === "ENCOURAGING" || avatarState === "CORRECT" || avatarState === "QUIZ_COMPLETE") {
      setGestureActive(true);
      const timer = setTimeout(() => {
        setGestureActive(false);
      }, 1500); // Stop after 1.5s
      return () => clearTimeout(timer);
    } else {
      setGestureActive(false);
    }
  }, [avatarState]);

  // Master active motion flag: False when reduced motion, tab hidden, or outside viewport
  const activeMotionAllowed = isVisible && isTabVisible && !reducedMotion && animationsEnabled;
  const activeSpeaking = activeMotionAllowed && (avatarState === "SPEAKING" || isSpeaking);
  const activeGesture = activeMotionAllowed && (gestureActive || activeSpeaking);

  // Map avatarState to visual glow and indicator styles
  const getStateConfig = (state) => {
    switch (state) {
      case "SPEAKING":
        return {
          glowClass: activeMotionAllowed ? "avatar-speaking-glow border-sky-400" : "border-sky-400",
          badgeBg: "bg-sky-500/20 border-sky-400/40 text-sky-300",
          label: "Dr. Mentor is Speaking",
          icon: <Volume2 size={15} className={activeMotionAllowed ? "animate-pulse" : ""} />,
        };
      case "LISTENING":
        return {
          glowClass: activeMotionAllowed ? "avatar-listening-glow border-emerald-400" : "border-emerald-400",
          badgeBg: "bg-emerald-500/20 border-emerald-400/40 text-emerald-300",
          label: "Dr. Mentor is Listening...",
          icon: <Mic size={15} className={activeMotionAllowed ? "animate-pulse" : ""} />,
        };
      case "THINKING":
        return {
          glowClass: activeMotionAllowed ? "avatar-thinking-glow border-purple-400" : "border-purple-400",
          badgeBg: "bg-purple-500/20 border-purple-400/40 text-purple-300",
          label: "Thinking & Synthesizing...",
          icon: <Brain size={15} className={activeMotionAllowed ? "animate-spin" : ""} />,
        };
      case "CORRECT":
        return {
          glowClass: activeMotionAllowed ? "avatar-correct-glow border-green-400" : "border-green-400",
          badgeBg: "bg-green-500/20 border-green-400/40 text-green-300",
          label: "Great Job! That's Correct!",
          icon: <CheckCircle2 size={15} />,
        };
      case "ENCOURAGING":
        return {
          glowClass: activeMotionAllowed ? "avatar-correct-glow border-amber-400" : "border-amber-400",
          badgeBg: "bg-amber-500/20 border-amber-400/40 text-amber-300",
          label: "You're Doing Great! Keep Going!",
          icon: <Sparkles size={15} />,
        };
      case "INCORRECT_SUPPORT":
        return {
          glowClass: activeMotionAllowed ? "avatar-listening-glow border-teal-400" : "border-teal-400",
          badgeBg: "bg-teal-500/20 border-teal-400/40 text-teal-300",
          label: "That's Okay! Let's Try Together",
          icon: <Heart size={15} />,
        };
      case "QUIZ_COMPLETE":
        return {
          glowClass: activeMotionAllowed ? "avatar-correct-glow border-purple-400" : "border-purple-400",
          badgeBg: "bg-purple-500/20 border-purple-400/40 text-purple-300",
          label: "Quiz Completed! Outstanding Effort!",
          icon: <Trophy size={15} />,
        };
      case "IDLE":
      default:
        return {
          glowClass: "border-slate-700/80 shadow-2xl",
          badgeBg: "bg-slate-800/80 border-slate-700 text-slate-300",
          label: "Dr. Mentor — Ready to Help",
          icon: <Sparkles size={15} className="text-sky-400" />,
        };
    }
  };

  const currentConfig = getStateConfig(avatarState);

  return (
    <div ref={containerRef} className="relative w-full flex flex-col items-center justify-center p-4">
      {/* Outer Glow & Framing Container */}
      <div className={`relative w-full max-w-md rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900/90 to-slate-950/95 border transition-all duration-500 shadow-2xl flex flex-col items-center ${currentConfig.glowClass}`}>
        
        {/* Upper Body Realistic Doctor Image Presentation */}
        <div className="relative w-full h-[360px] sm:h-[400px] flex items-center justify-center overflow-hidden bg-slate-950/60 group">
          {/* Subtle Background Radial Glow */}
          <div className="absolute inset-0 bg-radial from-sky-500/10 via-transparent to-transparent opacity-60 pointer-events-none" />

          {/* Doctor Image Container with Event-Driven Low-CPU Motion */}
          <div
            className={`w-full h-full relative transition-transform duration-500 ${
              activeSpeaking
                ? "animate-doctor-talking animate-doctor-gesture scale-[1.02]"
                : activeGesture
                ? "animate-doctor-gesture"
                : activeMotionAllowed
                ? "animate-avatar-breath"
                : ""
            }`}
          >
            <img
              src={doctorAvatarImg}
              alt="Dr. Mentor - Realistic Female AI Doctor"
              className={`w-full h-full object-cover object-top transition-opacity duration-150 ${
                isBlinking ? "opacity-90 scale-[0.995]" : "opacity-100"
              }`}
            />

            {/* Event-driven Mouth Viseme Motion Overlay during Active Speech */}
            {activeSpeaking && (
              <div className="absolute top-[52%] left-[48%] -translate-x-1/2 -translate-y-1/2 w-12 h-6 rounded-full bg-sky-400/20 border border-sky-300/40 backdrop-blur-[1px] animate-mouth-viseme pointer-events-none" />
            )}
          </div>

          {/* Hand Gesture Active Badge Overlay */}
          {activeGesture && (
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-extrabold text-[11px] backdrop-blur-md shadow-lg flex items-center gap-1.5 z-10">
              <span>👋 Gesture Event</span>
            </div>
          )}

          {/* Low CPU Performance Badge */}
          <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-emerald-400 font-mono text-[10px] font-bold backdrop-blur-md shadow flex items-center gap-1">
            <Zap size={12} />
            <span>Event-Driven 2D</span>
          </div>

          {/* Subtle Top & Bottom Gradient Vignettes */}
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-slate-950/80 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none" />

          {/* Audio Wave Equalizer Bar Overlay when Speaking */}
          {activeSpeaking && (
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-sky-400/50 backdrop-blur-md flex items-center gap-2 shadow-lg z-10">
              <span className="text-[11px] font-extrabold text-sky-300 uppercase tracking-wider">Speech Sync</span>
              <div className="flex items-center gap-1">
                <span className="equalizer-bar" style={{ animationDelay: '0s' }}></span>
                <span className="equalizer-bar" style={{ animationDelay: '0.2s' }}></span>
                <span className="equalizer-bar" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          )}

          {/* State Badge Banner Overlay at Bottom */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 w-[90%] flex items-center justify-center">
            <div
              className={`px-4 py-2 rounded-2xl border backdrop-blur-md font-extrabold text-xs flex items-center gap-2 shadow-xl transition-all duration-300 ${currentConfig.badgeBg}`}
            >
              {currentConfig.icon}
              <span>{currentConfig.label}</span>
            </div>
          </div>
        </div>

        {/* Doctor Title Card Info */}
        <div className="w-full p-4 bg-slate-900/90 border-t border-slate-800 text-center space-y-1">
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center justify-center gap-2">
            Dr. Mentor
            <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 font-semibold">
              AI Medical Mentor
            </span>
          </h3>
          <p className="text-xs text-slate-400 font-normal">
            Friendly Virtual Doctor • Very-Low CPU 2D Architecture
          </p>
        </div>
      </div>

      {/* Technical Pipeline Notice */}
      <div className="mt-3 max-w-md w-full px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 text-[11px] leading-relaxed flex items-start gap-2">
        <Info size={14} className="text-sky-400 shrink-0 mt-0.5" />
        <span>
          <strong>Performance Architecture:</strong> Event-driven 2D avatar. Zero 3D WebGL overhead. Pauses automatically when tab is hidden or element is out of viewport.
        </span>
      </div>
    </div>
  );
}

export default DoctorAvatar;
