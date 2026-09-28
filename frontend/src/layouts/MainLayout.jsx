import { useState, useContext } from "react";
import Sidebar from "../components/Sidebar";
import { ShieldCheck, Sparkles, HeartHandshake, Award } from "lucide-react";
import { PerformanceContext } from "../context/PerformanceContext";

function MainLayout({ children }) {
  const [caregiverMode, setCaregiverMode] = useState(false);
  const { backgroundMode, reducedMotion } = useContext(PerformanceContext);

  const showBackground = backgroundMode !== "OFF" && !reducedMotion;

  return (
    <div className="relative flex min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden selection:bg-sky-500 selection:text-white">
      {/* Background Effect: OFF by default for ultra-low CPU */}
      {showBackground && (
        <div className="ambient-bg">
          <div className="orb orb-1"></div>
          {backgroundMode === "FULL" && <div className="orb orb-2"></div>}
        </div>
      )}

      {/* Main Glass Sidebar */}
      <Sidebar caregiverMode={caregiverMode} />

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header Bar with Caregiver Mode & Real-World Features */}
        <header className="sticky top-0 z-30 px-6 py-4 border-b border-white/10 bg-slate-950/40 backdrop-blur-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div className="text-xs font-semibold text-slate-300">
              {caregiverMode ? (
                <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <ShieldCheck size={16} /> Caregiver / Educator Observation Mode
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-sky-400 font-bold">
                  <Sparkles size={16} /> Child Interactive Learning Environment
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Gamified Streak / Badge indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-amber-300">
              <Award size={15} className="text-amber-400" />
              <span>3 Day Learning Streak!</span>
            </div>

            {/* Caregiver Mode Toggle Button */}
            <button
              onClick={() => setCaregiverMode(!caregiverMode)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition shadow-lg backdrop-blur-md border ${
                caregiverMode
                  ? "bg-amber-500/20 border-amber-400/40 text-amber-300 hover:bg-amber-500/30"
                  : "bg-sky-500/20 border-sky-400/40 text-sky-300 hover:bg-sky-500/30"
              }`}
            >
              <HeartHandshake size={15} />
              {caregiverMode ? "Switch to Child Mode" : "Caregiver Dashboard Mode"}
            </button>
          </div>
        </header>

        {/* Page Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
