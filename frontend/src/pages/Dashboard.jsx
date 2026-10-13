import { useContext } from "react";
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
import Particle3DBackground from "../components/Particle3DBackground";
import { Brain, Smile, BarChart3, User, Sparkles, ArrowRight } from "lucide-react";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const { selectedAvatar } = useContext(AvatarContext);
  const learnerName = user?.full_name || "Learner";

  const quickNav = [
    {
      title: "AI Companion",
      desc: "Live conversations & interactive learning",
      path: "/ai-chat",
      icon: <Brain className="text-cyan-400" size={24} />,
      bg: "glass-card-interactive border-sky-400/20 hover:border-sky-400/60 hover:shadow-sky-500/20",
    },
    {
      title: "Emotion Detection",
      desc: "Real-time facial & affect cue guidance",
      path: "/emotion-detection",
      icon: <Smile className="text-teal-300" size={24} />,
      bg: "glass-card-interactive border-teal-400/20 hover:border-teal-400/60 hover:shadow-teal-500/20",
    },
    {
      title: "Skill Progress",
      desc: "Learning milestones & mastery charts",
      path: "/progress",
      icon: <BarChart3 className="text-indigo-400" size={24} />,
      bg: "glass-card-interactive border-indigo-400/20 hover:border-indigo-400/60 hover:shadow-indigo-500/20",
    },
    {
      title: "Learner Profile",
      desc: "Sensory preferences & learning pace",
      path: "/child-profile",
      icon: <User className="text-purple-300" size={24} />,
      bg: "glass-card-interactive border-purple-400/20 hover:border-purple-400/60 hover:shadow-purple-500/20",
    },
  ];

  return (
    <div className="space-y-8 relative">
      {/* 3D Animated Starlight Particle Wave Field */}
      <Particle3DBackground mode="starlight" theme="starlight" />

      {/* Top Banner with Celestial Starlight Welcome & Sensory Controls */}
      <div className="glass-panel p-6 sm:p-8 border border-white/10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-cyan-400 animate-pulse" />
            <span className="text-xs font-semibold text-cyan-300 tracking-wider uppercase">
              Interactive Starlight Learning Hub
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-starlight leading-tight">
            Welcome back, {learnerName}! ✨
          </h1>
          <p className="text-sky-200/80 text-xs sm:text-sm mt-2 max-w-xl">
            Choose your companion, complete your daily skill quest, or practice conversational dialogue in a calm, sensory-friendly space.
          </p>
        </div>

        {/* Accessibility & Neurodiverse UX Controls */}
        <AccessibilityControls />
      </div>

      {/* CHOOSE YOUR AI MENTOR SELECTOR */}
      <AvatarSelector />

      {/* INTERACTIVE AI MENTOR PANEL */}
      <GodotPanel />

      {/* Daily Learning Quest (Micro-Learning) & Caregiver Observational Journal */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <DailyQuest />
        <CaregiverJournal />
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {quickNav.map((card, idx) => (
          <Link
            key={idx}
            to={card.path}
            className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between group ${card.bg}`}
          >
            <div>
              <div className="p-3.5 rounded-2xl bg-white/5 w-fit mb-4 border border-white/10 shadow-inner group-hover:border-sky-400/40 transition">
                {card.icon}
              </div>
              <h3 className="font-bold text-white text-lg group-hover:text-cyan-300 transition">
                {card.title}
              </h3>
              <p className="text-slate-300/80 text-xs mt-1.5 leading-relaxed">
                {card.desc}
              </p>
            </div>

            <div className="mt-6 flex items-center text-xs font-semibold text-sky-300 group-hover:text-cyan-200 transition gap-1.5">
              <span>Explore</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition" />
            </div>
          </Link>
        ))}
      </div>

      {/* Embedded Feature Panels */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <AIChatPanel />
        <EmotionPanel />
      </div>
    </div>
  );
}

export default Dashboard;