import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  LayoutDashboard,
  User,
  Brain,
  Smile,
  BarChart3,
  Home,
  LogOut,
  LogIn,
  Sparkles,
  Zap
} from "lucide-react";

function Sidebar({ caregiverMode }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const links = [
    {
      name: "Home",
      path: "/",
      icon: <Home size={20} />,
    },
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "AI Tutor Chat",
      path: "/ai-chat",
      icon: <Brain size={20} />,
      badge: "Voice Enabled"
    },
    {
      name: "Affect Cue Detection",
      path: "/emotion-detection",
      icon: <Smile size={20} />,
      badge: "Real-time AI"
    },
    {
      name: "Skill & Progress",
      path: "/progress",
      icon: <BarChart3 size={20} />,
    },
    {
      name: "Learner Profile",
      path: "/child-profile",
      icon: <User size={20} />,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-slate-950/75 backdrop-blur-2xl border-r border-white/10 min-h-screen p-5 flex flex-col justify-between shrink-0 shadow-2xl relative z-20">
      <div>
        {/* Starlight Celestial Logo Badge */}
        <div className="flex items-center gap-3.5 mb-7 px-1">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-600 border border-white/30 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Sparkles size={22} className="animate-pulse" />
          </div>
          <div>
            <h1 className="text-white text-base font-black tracking-tight leading-tight font-starlight">
              Skill Enhancer
            </h1>
            <p className="text-[11px] font-semibold text-sky-400 flex items-center gap-1 mt-0.5">
              <Zap size={12} className="text-amber-400" /> AI Autism Support
            </p>
          </div>
        </div>

        <nav className="space-y-1.5">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `group relative flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-sky-500/90 via-indigo-600/90 to-purple-600/90 text-white shadow-xl shadow-indigo-500/25 border border-white/20"
                    : "text-slate-300 hover:bg-white/5 hover:text-white border border-transparent"
                }`
              }
            >
              <div className="flex items-center gap-3">
                <span className="group-hover:text-sky-300 transition-colors">
                  {link.icon}
                </span>
                <span className="tracking-wide">{link.name}</span>
              </div>
              {link.badge && (
                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-sky-400/10 border border-sky-400/30 text-sky-300">
                  {link.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="pt-5 border-t border-white/10 space-y-3">
        {user ? (
          <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 shadow-inner">
            <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">
              Active Learner
            </div>
            <div className="text-sm font-bold text-white truncate">
              {user.full_name || user.email}
            </div>
            <button
              onClick={handleLogout}
              className="mt-3 flex items-center justify-center gap-2 text-xs font-bold text-rose-400 hover:text-rose-200 hover:bg-rose-500/15 py-1.5 px-3 rounded-xl border border-rose-500/25 transition w-full"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        ) : (
          <NavLink
            to="/login"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-600 border border-white/20 hover:from-sky-400 hover:to-indigo-500 transition shadow-lg shadow-indigo-500/25"
          >
            <LogIn size={18} /> Sign In
          </NavLink>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;