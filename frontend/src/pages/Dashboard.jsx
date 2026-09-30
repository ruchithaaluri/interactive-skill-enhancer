import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AIChatPanel from "../components/AIChatPanel";
import EmotionPanel from "../components/EmotionPanel";
import GodotPanel from "../components/GodotPanel";
import AvatarSelector from "../components/AvatarSelector";
import DailyQuest from "../components/DailyQuest";
import CaregiverJournal from "../components/CaregiverJournal";
import AccessibilityControls from "../components/AccessibilityControls";
import { Brain, Smile, BarChart3, User, Sparkles, ArrowRight } from "lucide-react";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const learnerName = user?.full_name || "Learner";

  const quickNav = [
    {
      title: "AI Tutor",
      desc: "Ask questions & get instant explanations",
      path: "/ai-chat",
      icon: <Brain className="text-sky-400" size={24} />,
      bg: "glass-card-interactive border-sky-400/30",
    },
    {
      title: "Emotion Recognition",
      desc: "Live engagement & expression tracking",
      path: "/emotion-detection",
      icon: <Smile className="text-emerald-400" size={24} />,
      bg: "glass-card-interactive border-emerald-400/30",
    },
    {
      title: "Progress Dashboard",
      desc: "Activity metrics & subject mastery",
      path: "/progress",
      icon: <BarChart3 className="text-purple-400" size={24} />,
      bg: "glass-card-interactive border-purple-400/30",
    },
    {
      title: "Child Profile",
      desc: "Learner goals & guardian settings",
      path: "/child-profile",
      icon: <User className="text-amber-400" size={24} />,
      bg: "glass-card-interactive border-amber-400/30",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner with Accessibility & Sensory Control Bar */}
      <div className="glass-panel p-6 sm:p-8 border border-white/15 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-extrabold mb-3 border border-sky-400/40 shadow-sm backdrop-blur-md">
            <Sparkles size={14} /> Interactive Skill Enhancer | AI Autism Support Platform
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Welcome back, {learnerName}! 👋
          </h1>
          <p className="text-slate-300 text-sm mt-2 max-w-xl font-normal">
            Ready for your interactive learning session today? Choose your AI Mentor, explore micro-learning quests, and practice skills below.
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
              <div className="p-3.5 rounded-2xl bg-slate-900/80 w-fit mb-4 border border-white/15 shadow-inner">
                {card.icon}
              </div>
              <h3 className="font-extrabold text-white text-lg group-hover:text-sky-300 transition">
                {card.title}
              </h3>
              <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                {card.desc}
              </p>
            </div>

            <div className="mt-6 flex items-center text-xs font-extrabold text-sky-400 group-hover:text-white transition gap-1">
              <span>Open Module</span>
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