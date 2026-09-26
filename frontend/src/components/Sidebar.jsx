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
    <aside className="w-64 bg-slate-900/70 backdrop-blur-2xl border-r border-white/10 min-h-screen p-6 flex flex-col justify-between shrink-0 shadow-2xl relative z-20">
      <div>
        <div className="flex items-center gap-3.5 mb-8">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 border border-white/30 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-sky-500/30">
            <Sparkles size={22} />
          </div>
          <div>
            <h1 className="text-white text-base font-extrabold tracking-tight leading-tight font-heading">
              Skill Enhancer
            </h1>
            <p className="text-[11px] font-medium text-sky-400/90 flex items-center gap-1 mt-0.5">
              <Zap size={12} /> AI Autism Support
            </p>
          </div>
        </div>

        <nav className="space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `group relative flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-xl shadow-sky-500/25 border border-white/20"
                    : "text-slate-300 hover:bg-white/5 hover:text-white border border-transparent"
                }`
              }
            >
              <div className="flex items-center gap-3">
                {link.icon}
                <span>{link.name}</span>
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

      <div className="pt-6 border-t border-white/10 space-y-3">
        {user ? (
          <div className="bg-slate-800/40 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 shadow-inner">
            <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1">
              Active User
            </div>
            <div className="text-sm font-bold text-white truncate">
              {user.full_name || user.email}
            </div>
            <button
              onClick={handleLogout}
              className="mt-3 flex items-center justify-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 py-1.5 px-3 rounded-xl border border-red-500/20 transition w-full"
            >
              <LogOut size={15} /> Logout Session
            </button>
          </div>
        ) : (
          <NavLink
            to="/login"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold text-sky-300 bg-sky-500/10 border border-sky-500/30 hover:bg-sky-500/20 transition shadow-lg shadow-sky-500/10"
          >
            <LogIn size={18} /> Sign In
          </NavLink>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;