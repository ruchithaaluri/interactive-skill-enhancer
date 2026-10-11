import { useState, useEffect, useRef, useContext } from "react";
import { Sparkles, Volume2, Mic, Brain, CheckCircle2, Heart, Trophy, RefreshCw, UserCheck } from "lucide-react";
import { PerformanceContext } from "../context/PerformanceContext";
import { AvatarContext } from "../context/AvatarContext";

function PersonaEnvironmentBackdrop({ avatarId }) {
  switch (avatarId) {
    case "doctor":
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden bg-gradient-to-tr from-slate-900 via-sky-950 to-cyan-900">
          {/* Realistic Medical Examination Room Lighting & Backdrop Elements */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-400/20 via-sky-950/60 to-slate-950" />
          <div className="absolute top-4 left-6 border-l-4 border-cyan-400 pl-3 space-y-1 bg-slate-900/80 p-2.5 rounded-r-xl border-y border-r border-cyan-500/30 backdrop-blur-md shadow-lg">
            <div className="text-xs font-black text-cyan-300 tracking-wider">🏥 ADVANCED MEDICAL CLINIC</div>
            <div className="text-[11px] font-mono text-cyan-200">Patient HR: 72 bpm | SpO2: 99%</div>
            <div className="text-[10px] font-mono text-cyan-300/80">Room 304 • Sterilized Bay</div>
          </div>
          <div className="absolute top-4 right-6 px-3 py-1.5 rounded-xl bg-cyan-900/60 border border-cyan-400/40 text-cyan-200 font-mono text-xs font-bold shadow-md">
            🩺 Examination Room 1
          </div>
          {/* Real-time Heartbeat Waveform SVG */}
          <svg className="absolute bottom-12 inset-x-0 w-full h-20 opacity-40 text-cyan-300" viewBox="0 0 500 50">
            <path d="M 0 25 L 120 25 L 135 8 L 150 42 L 165 2 L 180 48 L 195 25 L 500 25" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-pulse" />
          </svg>
          {/* Background Ambient Medical Bay Light Beams */}
          <div className="absolute top-0 right-1/4 w-72 h-72 rounded-full bg-cyan-400/10 blur-3xl" />
        </div>
      );
    case "teacher":
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden bg-gradient-to-tr from-slate-950 via-amber-950 to-stone-900">
          {/* Realistic Wooden Classroom Backdrop with Blackboard & Warm Sunlight */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-amber-400/25 via-amber-950/70 to-slate-950" />
          <div className="absolute top-4 left-6 border-2 border-amber-600/40 rounded-xl bg-amber-950/80 p-3 shadow-xl backdrop-blur-md max-w-xs">
            <div className="text-xs font-black text-amber-300 uppercase tracking-widest pb-1 border-b border-amber-700/50">
              🏫 Classroom Blackboard
            </div>
            <div className="text-xs font-serif text-amber-100 pt-1 space-y-0.5">
              <div>• E = mc² &nbsp;|&nbsp; π ≈ 3.14159</div>
              <div>• f(x) = ∫ x² dx = x³/3 + C</div>
              <div>• Photosynthesis: H₂O + CO₂ + Light</div>
            </div>
          </div>
          <div className="absolute top-4 right-6 px-3.5 py-2 rounded-xl bg-amber-900/70 border border-amber-500/40 text-amber-200 text-xs font-bold shadow-md">
            📚 Interactive Learning Board
          </div>
          {/* Warm Golden Sunlight Beams */}
          <div className="absolute -top-10 -right-10 w-96 h-96 rounded-full bg-amber-400/15 blur-3xl animate-pulse" />
        </div>
      );
    case "friend":
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden bg-gradient-to-tr from-slate-950 via-emerald-950 to-teal-900">
          {/* Outdoor Sunny Park / Casual Coffee Lounge Backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-400/25 via-teal-950/70 to-slate-950" />
          <div className="absolute top-4 left-6 px-4 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold text-xs shadow-lg backdrop-blur-md">
            ☕ CASUAL GARDEN LOUNGE
          </div>
          <div className="absolute top-4 right-6 text-xs font-semibold text-emerald-200 bg-emerald-900/60 px-3 py-1.5 rounded-xl border border-emerald-400/30">
            ☀️ Sunny Afternoon Chat
          </div>
          {/* Leaf & Sunlight Glow Effects */}
          <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-emerald-400/15 blur-3xl animate-pulse" />
        </div>
      );
    case "colleague":
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden bg-gradient-to-tr from-slate-950 via-indigo-950 to-slate-900">
          {/* Glass Modern Office Backdrop with City Skyline Lighting */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-400/20 via-slate-900/80 to-slate-950" />
          <div className="absolute top-4 left-6 px-4 py-2 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 font-extrabold text-xs shadow-lg backdrop-blur-md">
            💼 CORPORATE GLASS OFFICE
          </div>
          <div className="absolute top-4 right-6 text-xs font-mono font-bold text-indigo-200 bg-indigo-900/60 px-3 py-1.5 rounded-xl border border-indigo-400/30">
            💻 Project Sprint Hub
          </div>
          <div className="absolute top-1/3 right-1/3 w-80 h-80 rounded-full bg-indigo-500/15 blur-3xl" />
        </div>
      );
    case "counsellor":
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden bg-gradient-to-tr from-slate-950 via-purple-950 to-fuchsia-950">
          {/* Calm Mindful Sanctuary Backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-400/25 via-purple-950/70 to-slate-950" />
          <div className="absolute top-4 left-6 px-4 py-2 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300 font-extrabold text-xs shadow-lg backdrop-blur-md">
            ✨ PEACEFUL SANCTUARY ROOM
          </div>
          <div className="absolute top-4 right-6 text-xs font-sans font-bold text-purple-200 bg-purple-900/60 px-3 py-1.5 rounded-xl border border-purple-400/30">
            🌿 Mindful Listening Space
          </div>
          <div className="absolute inset-0 bg-radial from-purple-500/20 via-transparent to-transparent opacity-75 animate-pulse" />
        </div>
      );
    case "shopkeeper":
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden bg-gradient-to-tr from-slate-950 via-teal-950 to-emerald-900">
          {/* Realistic Retail Store Counter Backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-teal-400/25 via-teal-950/70 to-slate-950" />
          <div className="absolute top-4 left-6 px-4 py-2 rounded-xl bg-teal-950/80 border border-teal-500/40 text-teal-300 font-mono font-bold text-xs shadow-lg backdrop-blur-md">
            🏪 RETAIL STORE COUNTER
          </div>
          <div className="absolute top-4 right-6 text-xs font-mono font-bold text-teal-200 bg-teal-900/60 px-3 py-1.5 rounded-xl border border-teal-400/30">
            🏷️ 20% Store Special Active
          </div>
        </div>
      );
    case "tutor":
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden bg-gradient-to-tr from-slate-950 via-blue-950 to-sky-900">
          {/* Cozy Library Study Corner Backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400/25 via-blue-950/70 to-slate-950" />
          <div className="absolute top-4 left-6 px-4 py-2 rounded-xl bg-blue-950/80 border border-blue-500/40 text-blue-300 font-bold text-xs shadow-lg backdrop-blur-md">
            📚 LIBRARY STUDY NOOK
          </div>
          <div className="absolute top-4 right-6 text-xs font-bold text-blue-200 bg-blue-900/60 px-3 py-1.5 rounded-xl border border-blue-400/30">
            📖 Step-by-Step Practice
          </div>
        </div>
      );
    case "mentor":
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden bg-gradient-to-tr from-slate-950 via-rose-950 to-pink-950">
          {/* Executive Leadership Suite Backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-400/25 via-rose-950/70 to-slate-950" />
          <div className="absolute top-4 left-6 px-4 py-2 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 font-extrabold text-xs shadow-lg backdrop-blur-md">
            🏢 EXECUTIVE LEADERSHIP SUITE
          </div>
          <div className="absolute top-4 right-6 text-xs font-bold text-rose-200 bg-rose-900/60 px-3 py-1.5 rounded-xl border border-rose-400/30">
            📊 Strategic Growth Hub
          </div>
        </div>
      );
    case "guide":
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden bg-gradient-to-tr from-slate-950 via-cyan-950 to-sky-900">
          {/* Outdoor Discovery Center Backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-400/25 via-cyan-950/70 to-slate-950" />
          <div className="absolute top-4 left-6 px-4 py-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold text-xs shadow-lg backdrop-blur-md">
            🗺️ DISCOVERY & TRAVEL HUB
          </div>
          <div className="absolute top-4 right-6 text-xs font-bold text-cyan-200 bg-cyan-900/60 px-3 py-1.5 rounded-xl border border-cyan-400/30">
            🌐 World Explorer Center
          </div>
        </div>
      );
    case "support":
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden bg-gradient-to-tr from-slate-950 via-violet-950 to-purple-900">
          {/* Tech Helpdesk Support Desk Backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-400/25 via-violet-950/70 to-slate-950" />
          <div className="absolute top-4 left-6 px-4 py-2 rounded-xl bg-violet-950/80 border border-violet-500/40 text-violet-300 font-bold text-xs shadow-lg backdrop-blur-md">
            🎧 TECH SUPPORT WORKSTATION
          </div>
          <div className="absolute top-4 right-6 text-xs font-bold text-violet-200 bg-violet-900/60 px-3 py-1.5 rounded-xl border border-violet-400/30">
            💬 24/7 Learning Support
          </div>
        </div>
      );
    default:
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden bg-gradient-to-b from-sky-900/50 via-slate-950 to-slate-950">
          <div className="absolute inset-0 bg-radial from-sky-500/20 via-transparent to-transparent opacity-75" />
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
          isMale,
          hairColor: isMale ? "#1E293B" : "#4A3B32",
          skinColor: "#F3C5A5",
          outfitBg: "#38BDF8",
          outfitDetail: "#0284C7",
          accessory: "stethoscope",
          glasses: false,
          hairStyle: isMale ? "short_cropped" : "doctor_bun"
        };
      case "teacher":
        return {
          isMale,
          hairColor: isMale ? "#27272A" : "#6B3A19",
          skinColor: "#F5D0A9",
          outfitBg: "#F59E0B",
          outfitDetail: "#D97706",
          accessory: "glasses",
          glasses: true,
          hairStyle: isMale ? "short_parted" : "teacher_bob"
        };
      case "friend":
        return {
          isMale,
          hairColor: isMale ? "#1E293B" : "#581C87",
          skinColor: "#E2A782",
          outfitBg: "#10B981",
          outfitDetail: "#059669",
          accessory: "headphone",
          glasses: false,
          hairStyle: isMale ? "short_parted" : "soft_waves"
        };
      case "colleague":
        return {
          isMale,
          hairColor: isMale ? "#27272A" : "#334155",
          skinColor: "#DDA176",
          outfitBg: "#6366F1",
          outfitDetail: "#4F46E5",
          accessory: "tie",
          glasses: false,
          hairStyle: isMale ? "short_cropped" : "teacher_bob"
        };
      case "counsellor":
        return {
          isMale,
          hairColor: isMale ? "#312E81" : "#581C87",
          skinColor: "#F5C8A0",
          outfitBg: "#A855F7",
          outfitDetail: "#9333EA",
          accessory: "pendant",
          glasses: false,
          hairStyle: isMale ? "clean_cut" : "soft_waves"
        };
      case "shopkeeper":
        return {
          isMale,
          hairColor: isMale ? "#451A03" : "#78350F",
          skinColor: "#E5B083",
          outfitBg: "#14B8A6",
          outfitDetail: "#0D9488",
          accessory: "apron",
          glasses: false,
          hairStyle: isMale ? "short_parted" : "doctor_bun"
        };
      case "tutor":
        return {
          isMale,
          hairColor: isMale ? "#1B2A4A" : "#431407",
          skinColor: "#F0C49E",
          outfitBg: "#3B82F6",
          outfitDetail: "#2563EB",
          accessory: "pen",
          glasses: true,
          hairStyle: isMale ? "neat_spiky" : "teacher_bob"
        };
      case "mentor":
        return {
          isMale,
          hairColor: isMale ? "#111827" : "#881337",
          skinColor: "#E8B48D",
          outfitBg: "#F43F5E",
          outfitDetail: "#E11D48",
          accessory: "badge",
          glasses: false,
          hairStyle: isMale ? "clean_cut" : "shoulder_length"
        };
      case "guide":
        return {
          isMale,
          hairColor: isMale ? "#065F46" : "#047857",
          skinColor: "#F3C8A0",
          outfitBg: "#06B6D4",
          outfitDetail: "#0891B2",
          accessory: "lanyard",
          glasses: false,
          hairStyle: isMale ? "short_cropped" : "ponytail"
        };
      case "support":
        return {
          isMale,
          hairColor: isMale ? "#312E81" : "#4C1D95",
          skinColor: "#DC9B76",
          outfitBg: "#8B5CF6",
          outfitDetail: "#7C3AED",
          accessory: "headset",
          glasses: false,
          hairStyle: isMale ? "clean_cut" : "shoulder_length"
        };
      default:
        return {
          isMale,
          hairColor: isMale ? "#334155" : "#4A3B32",
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
    <div ref={containerRef} className="relative w-full flex flex-col items-center justify-center p-2 perspective-[1200px]">
      {/* Outer Card Panel Container with 3D Depth Elevation */}
      <div className="relative w-full max-w-2xl rounded-3xl overflow-hidden bg-slate-900/95 border border-slate-800/80 shadow-[0_25px_60px_rgba(0,0,0,0.6)] flex flex-col items-center transform-gpu transition-all duration-300 hover:scale-[1.005]">
        
        {/* Top Render Style Switcher Toggle Pill */}
        <div className="absolute top-3.5 right-4 z-30">
          <button
            onClick={() => setRenderMode(renderMode === "vector" ? "photo" : "vector")}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/85 border border-sky-400/50 text-xs font-extrabold text-sky-300 hover:bg-sky-500/30 backdrop-blur-md shadow-lg transition"
            title="Toggle Visual Style (Animated Vector Cartoon vs Realistic Artwork)"
          >
            <RefreshCw size={13} />
            <span>{renderMode === "vector" ? "Mode: 3D Vector Cartoon" : "Mode: Realistic Artwork"}</span>
          </button>
        </div>

        {/* Avatar Presentation Canvas Area (ENHANCED ENLARGED FRAME SIZE) */}
        <div className="relative w-full h-[460px] sm:h-[520px] flex items-center justify-center overflow-hidden bg-slate-950/80">
          {/* Dynamic Profession Environment Backdrop */}
          <PersonaEnvironmentBackdrop avatarId={selectedAvatar.id} />

          {/* Subtle Background Radial Glow */}
          <div className="absolute inset-0 bg-radial from-sky-500/10 via-transparent to-transparent opacity-60 pointer-events-none" />

          {/* Prominent Floating Action & Hand Gesture Indicator */}
          <div className="absolute top-3 left-3 z-30 pointer-events-none">
            <div className="px-3 py-1 rounded-full bg-slate-950/85 border border-sky-400/50 backdrop-blur-md flex items-center gap-1.5 shadow-xl animate-gesture-float">
              <span className="text-sm">
                {gestureState === "WAVE"
                  ? "👋"
                  : gestureState === "EXPLAIN"
                  ? "👐"
                  : gestureState === "THINK"
                  ? "🤔"
                  : gestureState === "CELEBRATE"
                  ? "🙌"
                  : gestureState === "LISTEN"
                  ? "🎧"
                  : gestureState === "POINT"
                  ? "👉"
                  : "😊"}
              </span>
              <span className="text-[10px] font-extrabold text-sky-300 uppercase tracking-wider">
                {gestureState === "WAVE"
                  ? "Waving Gesture"
                  : gestureState === "EXPLAIN"
                  ? "Explaining Concept"
                  : gestureState === "THINK"
                  ? "Pondering & Thinking"
                  : gestureState === "CELEBRATE"
                  ? "Celebrating Success!"
                  : gestureState === "LISTEN"
                  ? "Listening Intently"
                  : gestureState === "POINT"
                  ? "Pointing to Lesson"
                  : "Attentive & Ready"}
              </span>
            </div>
          </div>

          {/* RENDER MODE A: ANIMATED VECTOR CARTOON CHARACTER */}
          {renderMode === "vector" ? (
            <div className="relative w-80 h-96 sm:w-96 sm:h-[440px] flex items-center justify-center drop-shadow-[0_25px_35px_rgba(0,0,0,0.6)]">
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
                  className={gestureState === "EXPLAIN" ? "animate-hand-explain" : gestureState === "CELEBRATE" ? "animate-hand-celebrate" : ""}
                  style={{
                    transformOrigin: "45px 190px",
                    transform: getArmLeftTransform(),
                    transition: "transform 0.4s ease-out"
                  }}
                >
                  <path d="M 40,190 Q 20,210 32,230" stroke={vectorTheme.outfitBg} strokeWidth="16" strokeLinecap="round" fill="none" />
                  <g transform="translate(32, 230)">
                    <circle cx="0" cy="0" r="9" fill={vectorTheme.skinColor} />
                    <path d="M -4,-2 C -8,-8 -3,-12 0,-9 C 3,-12 8,-8 4,-2" fill={vectorTheme.skinColor} stroke={vectorTheme.skinColor} strokeWidth="2" />
                  </g>
                </g>

                {/* 3. Right Arm & Hand Gesture Layer */}
                <g
                  className={gestureState === "WAVE" ? "animate-hand-wave" : gestureState === "EXPLAIN" ? "animate-hand-explain" : gestureState === "CELEBRATE" ? "animate-hand-celebrate" : ""}
                  style={{
                    transformOrigin: "155px 190px",
                    transform: getArmRightTransform(),
                    transition: "transform 0.4s ease-out"
                  }}
                >
                  <path d="M 160,190 Q 180,210 168,230" stroke={vectorTheme.outfitBg} strokeWidth="16" strokeLinecap="round" fill="none" />
                  <g transform="translate(168, 230)">
                    <circle cx="0" cy="0" r="9" fill={vectorTheme.skinColor} />
                    <path d="M -4,-2 C -8,-8 -3,-12 0,-9 C 3,-12 8,-8 4,-2" fill={vectorTheme.skinColor} stroke={vectorTheme.skinColor} strokeWidth="2" />
                  </g>
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

                  {/* Dynamic Viseme Mouth Path - Male lip contour vs Female lip contour */}
                  <path
                    d={getMouthPath()}
                    fill={
                      activeSpeaking
                        ? vectorTheme.isMale
                          ? "#B45309"
                          : "#E11D48"
                        : vectorTheme.isMale
                        ? "#78350F"
                        : "#991B1B"
                    }
                    stroke={vectorTheme.isMale ? "#451A03" : "#881337"}
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
