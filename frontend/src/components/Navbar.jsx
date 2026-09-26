import { Link } from "react-router-dom";
import { BrainCircuit } from "lucide-react";

function Navbar() {
  return (
    <nav className="bg-slate-900 border-b border-slate-700">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">

        <Link
          to="/"
          className="flex items-center gap-3 text-white text-2xl font-bold"
        >
          <BrainCircuit className="text-sky-400" size={34} />
          Interactive Skill Enhancer
        </Link>

        <div className="flex items-center gap-6">

          <Link
            to="/"
            className="text-slate-300 hover:text-sky-400 transition"
          >
            Home
          </Link>

          <Link
            to="/chat"
            className="text-slate-300 hover:text-sky-400 transition"
          >
            AI Chat
          </Link>

          <Link
            to="/emotion"
            className="text-slate-300 hover:text-sky-400 transition"
          >
            Emotion
          </Link>

          <Link
            to="/dashboard"
            className="text-slate-300 hover:text-sky-400 transition"
          >
            Dashboard
          </Link>

          <Link
            to="/progress"
            className="text-slate-300 hover:text-sky-400 transition"
          >
            Progress
          </Link>

          <Link
            to="/profile"
            className="text-slate-300 hover:text-sky-400 transition"
          >
            Profile
          </Link>

          <Link
            to="/login"
            className="text-slate-300 hover:text-sky-400 transition"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded-lg transition"
          >
            Register
          </Link>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;