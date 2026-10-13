import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import Particle3DBackground from "./Particle3DBackground";

function Hero() {
  return (
    <section className="relative min-h-[85vh] text-white flex items-center justify-center overflow-hidden px-6 py-16">
      {/* 3D Realistic Starlight Particles Background */}
      <Particle3DBackground mode="starlight" theme="starlight" />

      <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center">

        {/* Starlight Platform Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-sky-400/30 text-xs font-semibold text-sky-200 mb-6 backdrop-blur-xl shadow-lg shadow-sky-500/10">
          <Sparkles size={14} className="text-cyan-400 animate-pulse" />
          <span>Interactive Starlight Autism-Support Learning Platform</span>
        </div>

        {/* Main Title Lockup */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white font-starlight leading-tight">
          Master Skills with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-400">
            Lifelike AI Companions
          </span>
        </h1>

        <p className="text-sky-100/80 text-base sm:text-lg leading-relaxed max-w-2xl mt-4">
          An empowering, sensory-calming learning ecosystem featuring interactive 3D companions, free Whisper speech recognition, facial affect feedback, and adaptive micro-quests.
        </p>

        <div className="flex items-center gap-4 mt-8 flex-wrap justify-center">
          <Link
            to="/dashboard"
            className="glass-btn-primary px-8 py-4 rounded-2xl text-base font-bold flex items-center gap-2 shadow-2xl"
          >
            <span>Launch Dashboard</span>
            <ArrowRight size={18} />
          </Link>

          <Link
            to="/ai-chat"
            className="px-8 py-4 rounded-2xl text-base font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-sky-200 backdrop-blur-xl transition shadow-lg"
          >
            Meet AI Companions
          </Link>
        </div>

      </div>

    </section>
  );
}

export default Hero;