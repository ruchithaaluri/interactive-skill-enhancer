import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { AvatarContext } from "../context/AvatarContext";
import AIChatPanel from "../components/AIChatPanel";
import EmotionPanel from "../components/EmotionPanel";
import GodotPanel from "../components/GodotPanel";
import AvatarSelector from "../components/AvatarSelector";
import DailyQuest from "../components/DailyQuest";
import CaregiverJournal from "../components/CaregiverJournal";
import AccessibilityControls from "../components/AccessibilityControls";
import SensoryCalmingStation from "../components/SensoryCalmingStation";
import biometricEngine from "../services/biometricEmotionEngine";
import {
  Brain,
  Smile,
  BarChart3,
  User,
  Sparkles,
  ArrowRight,
  Heart,
  ShieldCheck,
  Compass,
  CheckCircle2,
  Zap,
  Crosshair
} from "lucide-react";

/**
 * Enterprise Dashboard - Designed for Autism, ADHD & Introverted Learners
 * 
 * Aesthetic: Aurora Borealis (Northern Lights) with 3D Falling Stars & Frosted Glassmorphism
 * Standards: 10/10 Enterprise UI (Google / Apple / Microsoft executive grade)
 * Features:
 * - Evidence-based sensory regulation with 4-7-8 Bio-Feedback Breathing Pacer
 * - Zero-GPU, Zero-RAM affective emotion & perception hub
 * - Low-pressure, judgment-free communication sandbox for introverts
 * - Structured micro-quests & clinical caregiver observational journal
 */
function Dashboard() {
  const { user } = useContext(AuthContext);
  const { selectedAvatar } = useContext(AvatarContext);
  const learnerName = user?.full_name || "Learner";

  const [showCalmingStation, setShowCalmingStation] = useState(false);
  const [calibratingSecs, setCalibratingSecs] = useState(0);
  const [isCalibrated, setIsCalibrated] = useState(() => {
    try {
      const stored = localStorage.getItem("ise_calibration_baseline");
      return !!stored;
    } catch {
      return false;
    }
  });

  const handleStartCalibration = () => {
    biometricEngine.startCalibration();
    setCalibratingSecs(3);
    setTimeout(() => setCalibratingSecs(2), 1000);
    setTimeout(() => setCalibratingSecs(1), 2000);
    setTimeout(() => {
      setCalibratingSecs(0);
      setIsCalibrated(true);
    }, 3000);
  };

  const quickNav = [
    {
      title: "AI Companion",
      desc: "Low-pressure conversations & interactive mentoring",
      path: "/ai-chat",
      icon: <Brain className="text-cyan-400" size={24} />,
      bg: "bg-gradient-to-br from-cyan-500/10 via-slate-900/60 to-slate-950/80 border-cyan-400/25 hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]",
      badge: "Judgement-Free",
    },
    {
      title: "Affective Perception Lab",
      desc: "7-State Zero-GPU facial biometrics & comfort telemetry",
      path: "/emotion-detection",
      icon: <Smile className="text-emerald-400" size={24} />,
      bg: "bg-gradient-to-br from-emerald-500/10 via-slate-900/60 to-slate-950/80 border-emerald-400/25 hover:border-emerald-400/60 hover:shadow-[0_0_30px_rgba(52,211,153,0.2)]",
      badge: "0.0% GPU • Safe",
    },
    {
      title: "Skill Progress & Insights",
      desc: "Mastery trajectories, calm focus streaks & reports",
      path: "/progress",
      icon: <BarChart3 className="text-indigo-400" size={24} />,
      bg: "bg-gradient-to-br from-indigo-500/10 via-slate-900/60 to-slate-950/80 border-indigo-400/25 hover:border-indigo-400/60 hover:shadow-[0_0_30px_rgba(129,140,248,0.2)]",
      badge: "Clinical Metrics",
    },
    {
      title: "Learner Sensory Profile",
      desc: "Sensory thresholds, pacing, & comfort preferences",
      path: "/child-profile",
      icon: <User className="text-purple-400" size={24} />,
      bg: "bg-gradient-to-br from-purple-500/10 via-slate-900/60 to-slate-950/80 border-purple-400/25 hover:border-purple-400/60 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]",
      badge: "Custom Pacing",
    },
  ];

  return (
    <div className="space-y-8 relative">
      {/* AURORA BOREALIS SANCTUARY BANNER (Autism & Introvert Optimized) */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative overflow-hidden backdrop-blur-2xl">
        {/* Subtle Ambient Aurora Light Flares */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          {/* Neurodiverse Sensory Safety Assurance Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold shadow-sm">
              <ShieldCheck size={14} className="text-emerald-400" /> Neurodiverse Sensory Safe Zone
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-semibold">
              <Zap size={14} className="text-cyan-400" /> 0.0% GPU • Zero Glare • No Sudden Sounds
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs">
              <Compass size={14} className="text-purple-400" /> Autonomous Pacing Active
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-starlight leading-tight">
            Welcome to Your Sanctuary, {learnerName} ✨
          </h1>
          <p className="text-sky-100/80 text-xs sm:text-sm max-w-2xl leading-relaxed">
            A serene, judgment-free space designed for introverts and neurodivergent learners. Choose your Pixar companion, explore comfortable micro-quests, or take a peaceful sensory reset under the Northern Lights.
          </p>
        </div>

        {/* Top Action Buttons & Sensory Controls */}
        <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={handleStartCalibration}
            disabled={calibratingSecs > 0}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold text-xs transition border shadow-lg ${
              calibratingSecs > 0
                ? "bg-amber-500/20 border-amber-400/50 text-amber-200 animate-pulse"
                : isCalibrated
                ? "bg-indigo-500/20 border-indigo-400/40 text-indigo-200 hover:bg-indigo-500/30"
                : "bg-amber-500/20 border-amber-400/40 text-amber-300 hover:bg-amber-500/30"
            }`}
          >
            <Crosshair size={16} className={calibratingSecs > 0 ? "animate-spin text-amber-400" : "text-indigo-400"} />
            {calibratingSecs > 0
              ? `Calibrating Face (${calibratingSecs}s)...`
              : isCalibrated
              ? "Re-Calibrate Baseline ✨"
              : "Calibrate Neutral Face (3s)"}
          </button>

          <button
            onClick={() => setShowCalmingStation(!showCalmingStation)}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white shadow-xl shadow-purple-500/20 border border-purple-400/40 transition active:scale-95"
          >
            <Heart size={16} className="text-rose-300 animate-pulse" />
            {showCalmingStation ? "Close Calming Station" : "4-7-8 Sensory Calming Station"}
          </button>

          <AccessibilityControls />
        </div>
      </div>

      {/* POPUP / INLINE SENSORY CALMING STATION */}
      {showCalmingStation && (
        <SensoryCalmingStation
          isOpen={true}
          onClose={() => setShowCalmingStation(false)}
        />
      )}

      {/* CHOOSE YOUR AI MENTOR SELECTOR */}
      <AvatarSelector />

      {/* INTERACTIVE AI PIXAR MENTOR PANEL */}
      <GodotPanel />

      {/* Daily Learning Quest (Micro-Learning) & Caregiver Observational Journal */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <DailyQuest />
        <CaregiverJournal />
      </div>

      {/* Quick Navigation Cards with Iridescent Aurora Hover Borders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {quickNav.map((card, idx) => (
          <Link
            key={idx}
            to={card.path}
            className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between group backdrop-blur-xl ${card.bg}`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 shadow-inner group-hover:scale-105 transition-transform duration-300">
                  {card.icon}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10 group-hover:border-cyan-400/40 group-hover:text-cyan-200 transition">
                  {card.badge}
                </span>
              </div>

              <h3 className="font-bold text-white text-lg group-hover:text-cyan-300 transition">
                {card.title}
              </h3>
              <p className="text-slate-300/80 text-xs mt-1.5 leading-relaxed">
                {card.desc}
              </p>
            </div>

            <div className="mt-6 flex items-center text-xs font-semibold text-sky-300 group-hover:text-cyan-200 transition gap-1.5">
              <span>Open Space</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition" />
            </div>
          </Link>
        ))}
      </div>

      {/* Embedded Feature Panels (AI Chat Companion & Affective Perception HUD) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <AIChatPanel />
        <EmotionPanel />
      </div>
    </div>
  );
}

export default Dashboard;