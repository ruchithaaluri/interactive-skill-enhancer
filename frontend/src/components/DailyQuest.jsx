import { useState } from "react";
import { Sparkles, CheckCircle2, XCircle, Award, ArrowRight, HelpCircle } from "lucide-react";
import { logProgressEvent } from "../services/api";

function playChime(success = true) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (success) {
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.3); // G5
    } else {
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.2);
    }
    
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.36);
  } catch (e) {
    // Audio context fallback
  }
}

const DAILY_QUESTIONS = [
  {
    category: "Math & Logic",
    question: "If Alex has 12 apples and shares 20% of them with a friend, how many apples did Alex share?",
    options: ["2.4 apples", "3 apples", "4.5 apples", "2 apples"],
    answerIndex: 0,
    explanation: "12 × 0.20 = 2.4 apples."
  },
  {
    category: "Science & Nature",
    question: "Why does the sky appear blue during the daytime?",
    options: [
      "Water reflecting from oceans",
      "Rayleigh scattering of blue light waves by atmospheric gases",
      "Air molecules absorbing red light",
      "Sunlight turning blue in space"
    ],
    answerIndex: 1,
    explanation: "Rayleigh scattering scatters shorter blue light waves across the atmosphere."
  },
  {
    category: "Social Skills",
    question: "When someone is speaking to you, what is the best way to show you are listening?",
    options: [
      "Look away and talk over them",
      "Maintain gentle eye contact and give your full attention",
      "Interrupt immediately with your own story",
      "Walk away to another room"
    ],
    answerIndex: 1,
    explanation: "Gentle eye contact and listening demonstrates kindness and social connection."
  }
];

function DailyQuest() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const q = DAILY_QUESTIONS[currentIdx];

  const handleSelect = (idx) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);

    const isCorrect = idx === q.answerIndex;
    playChime(isCorrect);

    if (isCorrect) {
      setScore((prev) => prev + 10);
    }
  };

  const handleNext = async () => {
    if (currentIdx < DAILY_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    } else {
      setCompleted(true);
      // Log interaction event to MongoDB
      try {
        await logProgressEvent("daily_quest_completed", { score, total: DAILY_QUESTIONS.length * 10 });
      } catch (e) {
        console.error("Failed to log quest:", e);
      }
    }
  };

  return (
    <div className="glass-panel p-6 sm:p-8 space-y-6 border border-white/15 shadow-2xl relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-400/30">
            <Sparkles size={22} />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white">Daily Learning Quest</h3>
            <p className="text-xs text-slate-300">Complete 3 daily adaptive questions for 30 XP!</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 font-extrabold text-xs">
          <Award size={16} /> {score} XP
        </div>
      </div>

      {!completed ? (
        <div className="space-y-5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span className="uppercase tracking-wider text-sky-400 font-extrabold">{q.category}</span>
            <span>Question {currentIdx + 1} of {DAILY_QUESTIONS.length}</span>
          </div>

          <h4 className="text-base sm:text-lg font-bold text-white leading-relaxed">
            {q.question}
          </h4>

          <div className="space-y-3">
            {q.options.map((opt, idx) => {
              let btnStyle = "bg-slate-900/60 border-white/10 text-slate-200 hover:bg-white/10";
              if (isAnswered) {
                if (idx === q.answerIndex) {
                  btnStyle = "bg-emerald-500/20 border-emerald-400/50 text-emerald-200 font-bold shadow-lg shadow-emerald-500/10";
                } else if (selectedOpt === idx) {
                  btnStyle = "bg-red-500/20 border-red-400/50 text-red-200 font-bold";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 rounded-2xl border backdrop-blur-md transition-all flex items-center justify-between text-sm sm:text-base font-medium ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswered && idx === q.answerIndex && <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />}
                  {isAnswered && selectedOpt === idx && idx !== q.answerIndex && <XCircle size={18} className="text-red-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-400/30 space-y-3 text-xs text-sky-200 animate-in fade-in">
              <div className="font-extrabold flex items-center gap-1.5 text-sky-300">
                <HelpCircle size={15} /> Explanation & Solution:
              </div>
              <div>{q.explanation}</div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={handleNext}
                  className="glass-btn-primary px-5 py-2.5 rounded-xl text-white font-extrabold text-xs flex items-center gap-2 shadow-lg"
                >
                  {currentIdx < DAILY_QUESTIONS.length - 1 ? "Next Question" : "Complete Quest"} <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center space-y-4 bg-emerald-500/10 border border-emerald-400/30 rounded-3xl">
          <Award size={48} className="text-amber-400 mx-auto animate-bounce" />
          <h4 className="text-2xl font-extrabold text-white">Daily Quest Completed! 🎉</h4>
          <p className="text-slate-300 text-sm">
            Awesome effort! You earned <strong className="text-amber-300 font-extrabold">{score} XP</strong> for completing today's adaptive learning challenge.
          </p>
          <button
            onClick={() => {
              setCompleted(false);
              setCurrentIdx(0);
              setSelectedOpt(null);
              setIsAnswered(false);
              setScore(0);
            }}
            className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs border border-white/15"
          >
            Replay Today's Quest
          </button>
        </div>
      )}
    </div>
  );
}

export default DailyQuest;
