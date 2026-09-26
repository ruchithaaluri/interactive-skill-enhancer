import { useState, useEffect } from "react";
import { Eye, Sliders, Volume2, Type, Sparkles } from "lucide-react";

function AccessibilityControls() {
  const [isOpen, setIsOpen] = useState(false);
  const [sensoryMode, setSensoryMode] = useState(false);
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [ttsSpeed, setTtsSpeed] = useState(1.0);

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
        title="Neurodiverse & Accessibility Controls"
      >
        <Sliders size={15} />
        <span>Accessibility & Sensory Controls</span>
      </button>

      {/* Floating Control Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 glass-panel p-5 space-y-4 border border-white/20 shadow-2xl z-50 text-slate-100 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h4 className="font-extrabold text-sm flex items-center gap-2 text-white">
              <Eye size={16} className="text-sky-400" /> Neurodiverse UX Settings
            </h4>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Sensory Mode Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">Sensory-Friendly Mode</div>
              <div className="text-[10px] text-slate-400">Reduces intense contrast & motion</div>
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
              <div className="text-[10px] text-slate-400">Dyslexia-friendly character spacing</div>
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
