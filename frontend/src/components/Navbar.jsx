import { Link } from "react-router-dom";
import { BrainCircuit } from "lucide-react";

function Navbar() {
  return (
    <nav className="bg-slate-950/70 border-b border-white/10 backdrop-blur-2xl sticky top-0 z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 sm:px-8 py-3.5">

        <Link
          to="/"
          className="flex items-center gap-2.5 group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500/20 to-indigo-500/20 border border-sky-400/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <BrainCircuit size={22} className="text-cyan-400" />
          </div>
          <div>
            <span className="text-lg sm:text-xl font-bold text-white font-starlight tracking-wide block leading-tight">
              Skill Enhancer
            </span>
            <span className="text-[10px] text-cyan-300 font-semibold tracking-wider block uppercase">
              AI Starlight Platform
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium">

          <Link
            to="/"
            className="text-slate-300 hover:text-cyan-300 transition"
          >
            Home
          </Link>

          <Link
            to="/ai-chat"
            className="text-slate-300 hover:text-cyan-300 transition"
          >
            AI Chat
          </Link>

          <Link
            to="/emotion-detection"
            className="text-slate-300 hover:text-cyan-300 transition"
          >
            Emotion AI
          </Link>

          <Link
            to="/dashboard"
            className="text-slate-300 hover:text-cyan-300 transition"
          >
            Dashboard
          </Link>

          <Link
            to="/progress"
            className="text-slate-300 hover:text-cyan-300 transition"
          >
            Progress
          </Link>

          <Link
            to="/login"
            className="text-sky-300 hover:text-white transition"
          >
            Sign In
          </Link>

          <Link
            to="/register"
            className="glass-btn-primary text-white px-4 py-2 rounded-xl transition font-semibold text-xs sm:text-sm"
          >
            Get Started
          </Link>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;