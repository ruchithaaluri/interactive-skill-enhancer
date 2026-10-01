import { useState, useEffect, useRef, useContext } from "react";
import { Sparkles, Volume2, Mic, Brain, CheckCircle2, Heart, Trophy, RefreshCw, UserCheck } from "lucide-react";
import { PerformanceContext } from "../context/PerformanceContext";
import { AvatarContext } from "../context/AvatarContext";

function PersonaEnvironmentBackdrop({ avatarId }) {
  switch (avatarId) {
    case "doctor":
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden bg-gradient-to-b from-cyan-950/50 via-slate-950 to-slate-950">
          <div className="absolute top-3 left-4 opacity-30 text-cyan-300 font-mono text-[10px] space-y-0.5 border-l-2 border-cyan-400 pl-2">
            <div className="font-bold">+ CLINIC MEDICAL BAY</div>
            <div>HR: 72 bpm | SpO2: 99%</div>
            <div>TEMP: 98.6°F | BP: 120/80</div>
          </div>
          <div className="absolute top-4 right-4 opacity-20 text-cyan-400 font-mono text-xs">🩺 EXAMINATION ROOM</div>
          {/* Animated ECG Heartbeat Graph SVG */}
          <svg className="absolute bottom-10 inset-x-0 w-full h-16 opacity-35 text-cyan-400" viewBox="0 0 500 50">
            <path d="M 0 25 L 120 25 L 135 10 L 150 40 L 165 5 L 180 45 L 195 25 L 500 25" fill="none" stroke="currentColor" strokeWidth="2" className="animate-pulse" />
          </svg>
        </div>
      );
    case "teacher":
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden bg-gradient-to-b from-amber-950/45 via-slate-950 to-slate-950">
          <div className="absolute top-4 left-6 opacity-30 text-amber-200 font-serif text-xs space-y-1">
            <div className="font-bold tracking-widest text-[10px] uppercase text-amber-400">Classroom Blackboard</div>
            <div>E = mc² &nbsp;|&nbsp; π ≈ 3.14159</div>
            <div>f(x) = ∫ x² dx = x³/3 + C</div>
            <div>H₂O &nbsp;|&nbsp; F = m · a</div>
          </div>
          <div className="absolute top-4 right-6 w-24 h-14 border border-amber-500/30 rounded-lg bg-amber-950/40 opacity-50 flex flex-col items-center justify-center text-[10px] text-amber-300 font-sans tracking-wide">
            <span className="font-bold">LESSON #4</span>
            <span className="text-[9px] opacity-80">Interactive Board</span>
          </div>
        </div>
      );
    case "friend":
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden bg-gradient-to-b from-emerald-950/45 via-slate-950 to-slate-950">
          <div className="absolute top-8 left-8 w-36 h-36 rounded-full bg-emerald-500/15 blur-2xl animate-pulse" />
          <div className="absolute top-4 right-6 opacity-30 text-emerald-300 text-xs font-semibold flex items-center gap-1">
            <span>☕ CASUAL LOUNGE</span>
          </div>
          <div className="absolute bottom-12 left-6 opacity-20 text-emerald-200 text-xs font-mono">
            <div>🎵 Ambient Music</div>
            <div>Relaxed Chat Zone</div>
          </div>
        </div>
      );
    case "counsellor":
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden bg-gradient-to-b from-purple-950/50 via-slate-950 to-slate-950">
          <div className="absolute top-4 right-6 opacity-30 text-purple-300 text-xs font-light tracking-widest">✨ CALM SANCTUARY</div>
          <div className="absolute top-10 left-6 opacity-20 text-purple-200 text-[10px] font-sans">
            <div>Mindful Listening Space</div>
            <div>Peaceful Support</div>
          </div>
          <div className="absolute inset-0 bg-radial from-purple-500/15 via-transparent to-transparent opacity-60 animate-pulse" />
        </div>
      );
    case "shopkeeper":
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden bg-gradient-to-b from-teal-950/50 via-slate-950 to-slate-950">
          <div className="absolute top-4 left-6 opacity-30 text-teal-300 text-xs font-mono font-bold">🏪 STORE COUNTER</div>
          <div className="absolute top-10 right-6 opacity-25 text-teal-200 text-[10px] space-y-0.5 text-right font-mono">
            <div>🏷️ TODAY'S SPECIAL: 20% OFF</div>
            <div>Cash Register #1 Active</div>
          </div>
        </div>
      );
    case "tutor":
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden bg-gradient-to-b from-blue-950/50 via-slate-950 to-slate-950">
          <div className="absolute top-4 left-6 opacity-30 text-blue-300 text-xs font-mono font-bold">📚 STUDY NOOK</div>
          <div className="absolute top-10 right-6 opacity-25 text-blue-200 text-[10px] font-mono space-y-0.5 text-right">
            <div>📖 Practice Modules</div>
            <div>Step-by-Step Goals</div>
          </div>
        </div>
      );
    case "mentor":
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden bg-gradient-to-b from-rose-950/50 via-slate-950 to-slate-950">
          <div className="absolute top-4 left-6 opacity-30 text-rose-300 text-xs font-mono font-bold">🏢 EXECUTIVE SUITE</div>
          <div className="absolute top-10 right-6 opacity-25 text-rose-200 text-[10px] font-mono space-y-0.5 text-right">
            <div>📊 Strategy & Vision</div>
            <div>Leadership Hub</div>
          </div>
        </div>
      );
    case "colleague":
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden bg-gradient-to-b from-indigo-950/50 via-slate-950 to-slate-950">
          <div className="absolute top-4 left-6 opacity-30 text-indigo-300 text-xs font-mono font-bold">💼 OFFICE WORKSPACE</div>
          <div className="absolute top-10 right-6 opacity-25 text-indigo-200 text-[10px] font-mono space-y-0.5 text-right">
            <div>💻 Project Sprint</div>
            <div>Team Collaboration</div>
          </div>
        </div>
      );
    default:
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden bg-gradient-to-b from-sky-950/30 via-slate-950 to-slate-950">
          <div className="absolute inset-0 bg-radial from-sky-500/10 via-transparent to-transparent opacity-60" />
        </div>
      );
  }
}

export function Animated2DAvatar({ avatarState = "IDLE", isSpeaking = false }) {
  const { reducedMotion, animationsEnabled } = useContext(PerformanceContext);
  const { selectedAvatar } = useContext(AvatarContext);

  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [isBlinking, setIsBlinking] = useState(false);
  const [visemeFrame, setVisemeFrame] = useState(0);
  const [gestureState, setGestureState] = useState("IDLE"); // IDLE, WAVE, THINK, EXPLAIN, CELEBRATE, LISTEN, POINT
  const [renderMode, setRenderMode] = useState("vector"); // 'vector' (Animated Cartoon) or 'photo' (Realistic Artwork)

  // 1. IntersectionObserver to pause animation loops when off-screen
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

  // 2. Page Visibility API to pause animations when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(document.visibilityState === "visible");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // 3. Eye Blinking Loop: periodic 160ms eyelid closure
  useEffect(() => {
    if (reducedMotion || !animationsEnabled || !isVisible || !isTabVisible) return;

    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      const timer = setTimeout(() => setIsBlinking(false), 160);
      return () => clearTimeout(timer);
    }, 4200);

    return () => clearInterval(blinkInterval);
  }, [reducedMotion, animationsEnabled, isVisible, isTabVisible]);

  // 4. Mouth Viseme Animation Loop during SPEAKING state
  const activeSpeaking = (avatarState === "SPEAKING" || isSpeaking) && isVisible && isTabVisible;
  useEffect(() => {
    if (!activeSpeaking || reducedMotion) {
      setVisemeFrame(0);
      return;
    }

    const visemeInterval = setInterval(() => {
      setVisemeFrame((prev) => (prev + 1) % 4);
    }, 130);

    return () => clearInterval(visemeInterval);
  }, [activeSpeaking, reducedMotion]);

  // 5. Map avatarState to Gesture state
  useEffect(() => {
    switch (avatarState) {
      case "GREETING":
        setGestureState("WAVE");
        break;
      case "THINKING":
        setGestureState("THINK");
        break;
      case "SPEAKING":
        setGestureState("EXPLAIN");
        break;
      case "CORRECT":
      case "QUIZ_COMPLETE":
      case "HAPPY":
        setGestureState("CELEBRATE");
        break;
      case "LISTENING":
        setGestureState("LISTEN");
        break;
      case "ENCOURAGING":
      case "INCORRECT_SUPPORT":
        setGestureState("POINT");
        break;
      default:
        setGestureState("IDLE");
        break;
    }
  }, [avatarState]);

  // Persona visual styling definitions for the Vector SVG Avatar (Distinct Male vs Female features)
  const getPersonaVectorTheme = (id, gender) => {
    const isMale = gender === "male";
    switch (id) {
      case "doctor":
        return {
          isMale: false,
          hairColor: "#4A3B32",
          skinColor: "#F3C5A5",
          outfitBg: "#38BDF8",
          outfitDetail: "#0284C7",
          accessory: "stethoscope",
          glasses: false,
          hairStyle: "doctor_bun"
        };
      case "teacher":
        return {
          isMale: false,
          hairColor: "#6B3A19",
          skinColor: "#F5D0A9",
          outfitBg: "#F59E0B",
          outfitDetail: "#D97706",
          accessory: "glasses",
          glasses: true,
          hairStyle: "teacher_bob"
        };
      case "friend":
        return {
          isMale: true,
          hairColor: "#1E293B",
          skinColor: "#E2A782",
          outfitBg: "#10B981",
          outfitDetail: "#059669",
          accessory: "headphone",
          glasses: false,
          hairStyle: "short_parted"
        };
      case "colleague":
        return {
          isMale: true,
          hairColor: "#27272A",
          skinColor: "#DDA176",
          outfitBg: "#6366F1",
          outfitDetail: "#4F46E5",
          accessory: "tie",
          glasses: false,
          hairStyle: "short_cropped"
        };
      case "counsellor":
        return {
          isMale: false,
          hairColor: "#581C87",
          skinColor: "#F5C8A0",
          outfitBg: "#A855F7",
          outfitDetail: "#9333EA",
          accessory: "pendant",
          glasses: false,
          hairStyle: "soft_waves"
        };
      case "shopkeeper":
        return {
          isMale: true,
          hairColor: "#451A03",
          skinColor: "#E5B083",
          outfitBg: "#14B8A6",
          outfitDetail: "#0D9488",
          accessory: "apron",
          glasses: false,
          hairStyle: "short_parted"
        };
      case "tutor":
        return {
          isMale: true,
          hairColor: "#1B2A4A",
          skinColor: "#F0C49E",
          outfitBg: "#3B82F6",
          outfitDetail: "#2563EB",
          accessory: "pen",
          glasses: true,
          hairStyle: "neat_spiky"
        };
      case "mentor":
        return {
          isMale: false,
          hairColor: "#881337",
          skinColor: "#E8B48D",
          outfitBg: "#F43F5E",
          outfitDetail: "#E11D48",
          accessory: "badge",
          glasses: false,
          hairStyle: "shoulder_length"
        };
      case "guide":
        return {
          isMale: false,
          hairColor: "#065F46",
          skinColor: "#F3C8A0",
          outfitBg: "#06B6D4",
          outfitDetail: "#0891B2",
          accessory: "lanyard",
          glasses: false,
          hairStyle: "ponytail"
        };
      case "support":
        return {
          isMale: true,
          hairColor: "#312E81",
          skinColor: "#DC9B76",
          outfitBg: "#8B5CF6",
          outfitDetail: "#7C3AED",
          accessory: "headset",
          glasses: false,
          hairStyle: "clean_cut"
        };
      default:
        return {
          isMale,
          hairColor: "#334155",
          skinColor: "#F3C5A5",
          outfitBg: "#38BDF8",
          outfitDetail: "#0284C7",
          accessory: "none",
          glasses: false,
          hairStyle: isMale ? "short_cropped" : "teacher_bob"
        };
    }
  };

  const vectorTheme = getPersonaVectorTheme(selectedAvatar.id, selectedAvatar.gender);

  // SVG Viseme mouth paths for active speaking animation
  const getMouthPath = () => {
    if (activeSpeaking) {
      switch (visemeFrame) {
        case 0:
          return "M 90,132 Q 100,148 110,132 Z"; // Open A
        case 1:
          return "M 92,134 Q 100,140 108,134 Z"; // E shape
        case 2:
          return "M 94,131 Q 100,152 106,131 Z"; // O shape
        case 3:
        default:
          return "M 88,133 Q 100,144 112,133 Z"; // Wide talk
      }
    }

    switch (avatarState) {
      case "CORRECT":
      case "HAPPY":
      case "QUIZ_COMPLETE":
        return "M 85,130 Q 100,152 115,130 Z"; // Big happy smile
      case "LISTENING":
        return "M 92,134 Q 100,142 108,134 Z"; // Slightly open listening mouth
      case "THINKING":
        return "M 92,136 Q 100,133 108,137"; // Pensive line
      case "ENCOURAGING":
      case "INCORRECT_SUPPORT":
        return "M 88,133 Q 100,145 112,133"; // Warm gentle smile
      case "IDLE":
      default:
        return "M 88,132 Q 100,143 112,132"; // Gentle natural smile
    }
  };

  // SVG Eye paths & pupil positions
  const eyeLidTransform = isBlinking ? "scaleY(0.1)" : "scaleY(1)";
  const eyeGazeOffsetX = avatarState === "THINKING" ? -3 : avatarState === "LISTENING" ? 2 : 0;
  const eyeGazeOffsetY = avatarState === "THINKING" ? -4 : 0;

  // Head tilt rotation transform
  const getHeadTransform = () => {
    if (reducedMotion || !animationsEnabled) return "";
    if (activeSpeaking) return "rotate(1.5deg) translateY(-1.5px)";
    if (avatarState === "LISTENING") return "rotate(-3deg) translateY(1px)";
    if (avatarState === "THINKING") return "rotate(4deg) translateY(-2px)";
    if (avatarState === "CORRECT" || avatarState === "HAPPY") return "rotate(-2.5deg) translateY(-3px)";
    return "";
  };

  // Arm/Hand Gesture SVG transform coordinates for rich human-like movement
  const getArmRightTransform = () => {
    if (gestureState === "WAVE") return "rotate(-55deg) translate(-12px, -24px)";
    if (gestureState === "CELEBRATE") return "rotate(-70deg) translate(-18px, -35px)";
    if (gestureState === "EXPLAIN") return "rotate(-25deg) translate(-8px, -12px)";
    if (gestureState === "POINT") return "rotate(-40deg) translate(-15px, -15px)";
    return "rotate(0deg)";
  };

  const getArmLeftTransform = () => {
    if (gestureState === "THINK") return "rotate(40deg) translate(12px, -18px)";
    if (gestureState === "CELEBRATE") return "rotate(70deg) translate(18px, -35px)";
    if (gestureState === "EXPLAIN") return "rotate(25deg) translate(8px, -12px)";
    if (gestureState === "LISTEN") return "rotate(15deg) translate(5px, -8px)";
    return "rotate(0deg)";
  };

  return (
    <div ref={containerRef} className="relative w-full flex flex-col items-center justify-center p-2">
      {/* Outer Card Panel Container */}
      <div className="relative w-full max-w-md rounded-3xl overflow-hidden bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col items-center">
        
        {/* Top Render Style Switcher Toggle Pill */}
        <div className="absolute top-3 right-3 z-30">
          <button
            onClick={() => setRenderMode(renderMode === "vector" ? "photo" : "vector")}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 border border-sky-400/40 text-[11px] font-bold text-sky-300 hover:bg-sky-500/20 backdrop-blur-md shadow-md transition"
            title="Toggle Visual Style (Animated Vector Cartoon vs Realistic Artwork)"
          >
            <RefreshCw size={12} />
            <span>{renderMode === "vector" ? "Mode: Vector Cartoon" : "Mode: Realistic Artwork"}</span>
          </button>
        </div>

        {/* Avatar Presentation Canvas Area */}
        <div className="relative w-full h-[360px] sm:h-[390px] flex items-center justify-center overflow-hidden bg-slate-950/70">
          {/* Dynamic Profession Environment Backdrop */}
          <PersonaEnvironmentBackdrop avatarId={selectedAvatar.id} />

          {/* Subtle Background Radial Glow */}
          <div className="absolute inset-0 bg-radial from-sky-500/10 via-transparent to-transparent opacity-60 pointer-events-none" />

          {/* RENDER MODE A: ANIMATED VECTOR CARTOON CHARACTER */}
          {renderMode === "vector" ? (
            <div className="relative w-72 h-80 flex items-center justify-center">
              <svg
                viewBox="0 0 200 240"
                className={`w-full h-full transition-transform duration-500 ${
                  activeSpeaking ? "animate-avatar-breath" : "animate-avatar-breath"
                }`}
              >
                <defs>
                  <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3" />
                  </filter>
                  <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={vectorTheme.skinColor} />
                    <stop offset="100%" stopColor={vectorTheme.skinColor} stopOpacity="0.9" />
                  </linearGradient>
                  <linearGradient id="outfitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={vectorTheme.outfitBg} />
                    <stop offset="100%" stopColor={vectorTheme.outfitDetail} />
                  </linearGradient>
                </defs>

                {/* 1. Body & Torso / Outfit */}
                <g filter="url(#shadow)">
                  {/* Shoulders & Torso */}
                  <path
                    d="M 40,190 Q 100,165 160,190 L 175,240 L 25,240 Z"
                    fill="url(#outfitGrad)"
                  />
                  {/* Collar / V-Neck Shirt */}
                  <path d="M 82,175 L 100,205 L 118,175 Z" fill="#FFFFFF" opacity="0.9" />
                  <path d="M 88,175 L 100,198 L 112,175 Z" fill={vectorTheme.outfitDetail} />

                  {/* Accessory Items */}
                  {vectorTheme.accessory === "stethoscope" && (
                    <g stroke="#E2E8F0" strokeWidth="3" fill="none">
                      <path d="M 75,178 Q 100,215 125,178" />
                      <circle cx="100" cy="210" r="5" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1.5" />
                    </g>
                  )}
                  {vectorTheme.accessory === "apron" && (
                    <path d="M 65,190 L 135,190 L 140,240 L 60,240 Z" fill="#0D9488" opacity="0.85" />
                  )}
                  {vectorTheme.accessory === "lanyard" && (
                    <g>
                      <path d="M 85,175 L 100,220 L 115,175" stroke="#06B6D4" strokeWidth="2" fill="none" />
                      <rect x="94" y="215" width="12" height="16" rx="2" fill="#FFFFFF" stroke="#0891B2" strokeWidth="1" />
                    </g>
                  )}
                </g>

                {/* 2. Left Arm & Hand Gesture Layer */}
                <g
                  style={{
                    transformOrigin: "45px 190px",
                    transform: getArmLeftTransform(),
                    transition: "transform 0.4s ease-out"
                  }}
                >
                  <path d="M 40,190 Q 25,210 35,235" stroke={vectorTheme.outfitBg} strokeWidth="14" strokeLinecap="round" fill="none" />
                  <circle cx="35" cy="235" r="8" fill={vectorTheme.skinColor} />
                </g>

                {/* 3. Right Arm & Hand Gesture Layer */}
                <g
                  style={{
                    transformOrigin: "155px 190px",
                    transform: getArmRightTransform(),
                    transition: "transform 0.4s ease-out"
                  }}
                >
                  <path d="M 160,190 Q 175,210 165,235" stroke={vectorTheme.outfitBg} strokeWidth="14" strokeLinecap="round" fill="none" />
                  <circle cx="165" cy="235" r="8" fill={vectorTheme.skinColor} />
                </g>

                {/* 4. Neck */}
                <rect x="88" y="145" width="24" height="35" rx="6" fill={vectorTheme.skinColor} />

                {/* 5. Head Group (Rotates and Tilts dynamically) */}
                <g
                  style={{
                    transformOrigin: "100px 110px",
                    transform: getHeadTransform(),
                    transition: "transform 0.3s ease-out"
                  }}
                  filter="url(#shadow)"
                >
                  {/* Head Oval Base - Chiseled male vs soft female contour */}
                  <ellipse cx="100" cy="105" rx={vectorTheme.isMale ? "41" : "43"} ry={vectorTheme.isMale ? "47" : "49"} fill="url(#skinGrad)" />

                  {/* Ears */}
                  <circle cx="56" cy="108" r="8" fill={vectorTheme.skinColor} />
                  <circle cx="144" cy="108" r="8" fill={vectorTheme.skinColor} />

                  {/* Hair Style Base (Dynamic Male vs Female Hair Paths) */}
                  {vectorTheme.hairStyle === "doctor_bun" && (
                    <g fill={vectorTheme.hairColor}>
                      <circle cx="100" cy="42" r="16" />
                      <path d="M 54,102 C 48,58 70,48 100,48 C 130,48 152,58 146,102 C 140,72 125,58 100,58 C 75,58 60,72 54,102 Z" />
                    </g>
                  )}
                  {vectorTheme.hairStyle === "teacher_bob" && (
                    <path
                      d="M 52,118 C 45,70 65,46 100,46 C 135,46 155,70 148,118 C 142,75 125,58 100,58 C 75,58 58,75 52,118 Z"
                      fill={vectorTheme.hairColor}
                    />
                  )}
                  {vectorTheme.hairStyle === "short_parted" && (
                    <path
                      d="M 56,100 C 52,70 68,52 100,52 C 128,52 144,70 144,100 C 138,78 120,62 95,62 C 70,62 60,78 56,100 Z"
                      fill={vectorTheme.hairColor}
                    />
                  )}
                  {vectorTheme.hairStyle === "short_cropped" && (
                    <path
                      d="M 57,96 C 53,68 70,54 100,54 C 130,54 147,68 143,96 C 138,76 122,64 100,64 C 78,64 62,76 57,96 Z"
                      fill={vectorTheme.hairColor}
                    />
                  )}
                  {vectorTheme.hairStyle === "soft_waves" && (
                    <path
                      d="M 50,135 C 44,75 66,45 100,45 C 134,45 156,75 150,135 C 142,80 126,58 100,58 C 74,58 58,80 50,135 Z"
                      fill={vectorTheme.hairColor}
                    />
                  )}
                  {vectorTheme.hairStyle === "neat_spiky" && (
                    <g fill={vectorTheme.hairColor}>
                      <path d="M 57,98 C 53,65 68,48 100,48 C 132,48 147,65 143,98 C 138,75 120,60 100,60 C 80,60 62,75 57,98 Z" />
                      <path d="M 85,50 L 92,36 L 98,50 L 105,34 L 112,50 Z" />
                    </g>
                  )}
                  {(!vectorTheme.hairStyle || vectorTheme.hairStyle === "shoulder_length" || vectorTheme.hairStyle === "ponytail" || vectorTheme.hairStyle === "clean_cut") && (
                    <path
                      d="M 55,104 C 48,62 68,46 100,46 C 132,46 152,62 145,104 C 140,72 125,58 100,58 C 75,58 60,72 55,104 Z"
                      fill={vectorTheme.hairColor}
                    />
                  )}

                  {/* Eyebrows */}
                  <path
                    d="M 72,82 Q 82,78 90,83"
                    stroke={vectorTheme.hairColor}
                    strokeWidth={vectorTheme.isMale ? "4" : "3.2"}
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M 110,83 Q 118,78 128,82"
                    stroke={vectorTheme.hairColor}
                    strokeWidth={vectorTheme.isMale ? "4" : "3.2"}
                    strokeLinecap="round"
                    fill="none"
                  />

                  {/* Eyes & Blinking Eyelids */}
                  <g style={{ transformOrigin: "100px 96px", transform: eyeLidTransform, transition: "transform 0.08s ease" }}>
                    {/* Female Eyelash Extension Overlays */}
                    {!vectorTheme.isMale && (
                      <g stroke="#1E293B" strokeWidth="1.8" fill="none">
                        <path d="M 72,89 Q 81,84 90,89" />
                        <path d="M 110,89 Q 119,84 128,89" />
                        <path d="M 73,88 L 70,85" />
                        <path d="M 127,88 L 130,85" />
                      </g>
                    )}

                    {/* Left Eye */}
                    <circle cx="81" cy="95" r="8" fill="#FFFFFF" />
                    <circle cx={81 + eyeGazeOffsetX} cy={95 + eyeGazeOffsetY} r="4.5" fill="#1E293B" />
                    <circle cx={82.5 + eyeGazeOffsetX} cy={93.5 + eyeGazeOffsetY} r="1.8" fill="#FFFFFF" />

                    {/* Right Eye */}
                    <circle cx="119" cy="95" r="8" fill="#FFFFFF" />
                    <circle cx={119 + eyeGazeOffsetX} cy={95 + eyeGazeOffsetY} r="4.5" fill="#1E293B" />
                    <circle cx={120.5 + eyeGazeOffsetX} cy={93.5 + eyeGazeOffsetY} r="1.8" fill="#FFFFFF" />
                  </g>

                  {/* Glasses if persona has glasses */}
                  {vectorTheme.glasses && (
                    <g stroke="#1E293B" strokeWidth="2.5" fill="none">
                      <rect x="71" y="87" width="20" height="16" rx="4" fill="rgba(255,255,255,0.15)" />
                      <rect x="109" y="87" width="20" height="16" rx="4" fill="rgba(255,255,255,0.15)" />
                      <line x1="91" y1="94" x2="109" y2="94" />
                    </g>
                  )}

                  {/* Nose */}
                  <path d="M 100,98 L 97,112 L 103,112" stroke="#DDA176" strokeWidth="2" fill="none" strokeLinecap="round" />

                  {/* Cheeks blush */}
                  <ellipse cx="73" cy="114" rx="7" ry="4" fill="#F43F5E" opacity={vectorTheme.isMale ? "0.15" : "0.3"} />
                  <ellipse cx="127" cy="114" rx="7" ry="4" fill="#F43F5E" opacity={vectorTheme.isMale ? "0.15" : "0.3"} />

                  {/* Dynamic Viseme Mouth Path */}
                  <path
                    d={getMouthPath()}
                    fill={activeSpeaking ? "#E11D48" : "#991B1B"}
                    stroke="#881337"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
            </div>
          ) : (
            /* RENDER MODE B: REALISTIC ARTWORK MODE WITH VISEME OVERLAY */
            <div
              className={`w-full h-full relative transition-transform duration-500 ${
                activeSpeaking
                  ? "animate-doctor-talking animate-doctor-gesture scale-[1.02]"
                  : "animate-avatar-breath"
              }`}
            >
              <img
                src={selectedAvatar.image}
                alt={selectedAvatar.name}
                className={`w-full h-full object-cover object-top transition-opacity duration-150 ${
                  isBlinking ? "opacity-90 scale-[0.995]" : "opacity-100"
                }`}
              />

              {/* Event-driven Mouth Viseme Motion Overlay during Active Speech */}
              {activeSpeaking && (
                <div className="absolute top-[52%] left-[48%] -translate-x-1/2 -translate-y-1/2 w-12 h-6 rounded-full bg-sky-400/25 border border-sky-300/40 backdrop-blur-[1px] animate-mouth-viseme pointer-events-none" />
              )}
            </div>
          )}

          {/* Top & Bottom Vignette Shadows */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-slate-950/80 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none" />

          {/* Audio Wave Equalizer Bar Overlay when Speaking */}
          {activeSpeaking && (
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-sky-400/50 backdrop-blur-md flex items-center gap-2 shadow-lg z-10">
              <span className="text-[11px] font-extrabold text-sky-300 uppercase tracking-wider">
                {selectedAvatar.name} is Speaking
              </span>
              <div className="flex items-center gap-1">
                <span className="equalizer-bar" style={{ animationDelay: "0s" }}></span>
                <span className="equalizer-bar" style={{ animationDelay: "0.2s" }}></span>
                <span className="equalizer-bar" style={{ animationDelay: "0.4s" }}></span>
              </div>
            </div>
          )}

          {/* State Badge Banner Overlay */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-10 w-[90%] flex items-center justify-center">
            <div className={`px-4 py-2 rounded-2xl border backdrop-blur-md font-extrabold text-xs flex items-center gap-2 shadow-xl transition-all duration-300 ${selectedAvatar.badgeBg}`}>
              {avatarState === "SPEAKING" ? (
                <Volume2 size={15} className="animate-pulse" />
              ) : avatarState === "LISTENING" ? (
                <Mic size={15} className="animate-pulse" />
              ) : avatarState === "THINKING" ? (
                <Brain size={15} className="animate-spin" />
              ) : avatarState === "CORRECT" ? (
                <CheckCircle2 size={15} />
              ) : avatarState === "QUIZ_COMPLETE" ? (
                <Trophy size={15} />
              ) : (
                <Sparkles size={15} className="text-sky-400" />
              )}
              <span>
                {avatarState === "SPEAKING"
                  ? `${selectedAvatar.name} is Speaking`
                  : avatarState === "LISTENING"
                  ? `${selectedAvatar.name} is Listening...`
                  : avatarState === "THINKING"
                  ? `${selectedAvatar.name} is Thinking...`
                  : avatarState === "CORRECT"
                  ? "Great Job! That's Correct!"
                  : avatarState === "QUIZ_COMPLETE"
                  ? "Quiz Complete! Fantastic!"
                  : `${selectedAvatar.name} — Ready to Help`}
              </span>
            </div>
          </div>
        </div>

        {/* Title Card Info */}
        <div className="w-full p-4 bg-slate-900/90 border-t border-slate-800 text-center space-y-1">
          <h3 className="text-lg font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
            {selectedAvatar.name}
            <span className={`text-xs px-2.5 py-0.5 rounded-full border font-bold ${selectedAvatar.badgeBg}`}>
              {selectedAvatar.role}
            </span>
          </h3>
          <p className="text-xs text-slate-400 font-normal">
            {selectedAvatar.subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Animated2DAvatar;
