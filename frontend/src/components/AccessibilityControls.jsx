import { useState, useEffect, useContext } from "react";
import { Eye, Sliders, Volume2, Type, Sparkles, Zap, ShieldAlert } from "lucide-react";
import { PerformanceContext } from "../context/PerformanceContext";

function AccessibilityControls() {
  const [isOpen, setIsOpen] = useState(false);
  const [sensoryMode, setSensoryMode] = useState(false);
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [ttsSpeed, setTtsSpeed] = useState(1.0);

  const {
    backgroundMode,
    setBackgroundMode,
    reducedMotion,
    setReducedMotion,
    animationsEnabled,
    setAnimationsEnabled,
  } = useContext(PerformanceContext);

  useEffect(() => {
    if (sensoryMode) {
      document.body.classList.add("sensory-friendly");
    } else {
      document.body.classList.remove("sensory-friendly");
    }
  }, [sensoryMode]);

  useEffect(() => {
    if (dyslexicFont) {
      document.body.style.fontFamily = "'Comic Sans MS', 'Chalkboard SE', 'Inter', sans-serif";
    } else {
      document.body.style.fontFamily = "";
    }
  }, [dyslexicFont]);

  return (
    <div className="relative z-40">
      {/* Trigger Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-sky-400/40 text-xs font-bold text-sky-300 hover:bg-sky-500/20 backdrop-blur-md shadow-lg transition"
        title="Neurodiverse & Performance Controls"
      >
        <Sliders size={15} />
        <span>Accessibility & Performance</span>
      </button>

      {/* Floating Control Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 glass-panel p-5 space-y-4 border border-white/20 shadow-2xl z-50 text-slate-100 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h4 className="font-extrabold text-sm flex items-center gap-2 text-white">
              <Eye size={16} className="text-sky-400" /> UX & Performance Controls
            </h4>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Background Mode Selector (Default: OFF) */}
          <div className="space-y-1.5 pb-2 border-b border-white/10">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Zap size={14} className="text-amber-400" /> Background Mode:
              </span>
              <span className="font-mono text-[11px] text-sky-400 font-extrabold uppercase">
                {backgroundMode}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {["OFF", "LIGHT", "FULL"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setBackgroundMode(mode)}
                  className={`py-1 rounded-lg text-xs font-bold border transition ${
                    backgroundMode === mode
                      ? "bg-sky-500 text-white border-sky-400 shadow-md"
                      : "bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
            <div className="text-[10px] text-slate-400 italic">
              *OFF consumes lowest CPU power (0% background rendering).
            </div>
          </div>

          {/* Reduced Motion Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1">
                <ShieldAlert size={14} className="text-emerald-400" /> Reduced Motion Mode
              </div>
              <div className="text-[10px] text-slate-400">Disables non-essential motion</div>
            </div>
            <button
              onClick={() => setReducedMotion(!reducedMotion)}
              className={`w-11 h-6 rounded-full p-1 transition ${
                reducedMotion ? "bg-emerald-500" : "bg-slate-800 border border-white/10"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition transform ${
                  reducedMotion ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Sensory Mode Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">Sensory-Friendly Mode</div>
              <div className="text-[10px] text-slate-400">Reduces intense contrast</div>
            </div>
            <button
              onClick={() => setSensoryMode(!sensoryMode)}
              className={`w-11 h-6 rounded-full p-1 transition ${
                sensoryMode ? "bg-emerald-500" : "bg-slate-800 border border-white/10"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition transform ${
                  sensoryMode ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Dyslexia Friendly Typography Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1">
                <Type size={14} /> High-Legibility Font
              </div>
              <div className="text-[10px] text-slate-400">Dyslexia-friendly spacing</div>
            </div>
            <button
              onClick={() => setDyslexicFont(!dyslexicFont)}
              className={`w-11 h-6 rounded-full p-1 transition ${
                dyslexicFont ? "bg-sky-500" : "bg-slate-800 border border-white/10"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition transform ${
                  dyslexicFont ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Speech Rate Slider */}
          <div className="space-y-1.5 pt-1 border-t border-white/10">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1">
                <Volume2 size={14} /> Voice Speech Speed
              </span>
              <span className="font-bold text-sky-400">{ttsSpeed}x</span>
            </div>
            <input
              type="range"
              min="0.7"
              max="1.3"
              step="0.1"
              value={ttsSpeed}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setTtsSpeed(val);
                if (window.speechSynthesis) {
                  window.ttsRate = val;
                }
              }}
              className="w-full accent-sky-400 cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AccessibilityControls;
