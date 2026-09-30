import { useState, useEffect, useContext } from "react";
import { Sparkles, CheckCircle2, XCircle, Award, ArrowRight, HelpCircle, BookOpen, Volume2, Lightbulb } from "lucide-react";
import { getTopics, generateQuiz, evaluateQuizAnswer, logProgressEvent } from "../services/api";
import { FormattedText } from "../utils/formatText";
import { speakWithAvatarVoice } from "../utils/speechUtils";
import { AvatarContext } from "../context/AvatarContext";

function playChime(success = true) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (success) {
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15);
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.3);
    } else {
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.2);
    }
    
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.36);
  } catch (e) {}
}

function DailyQuest() {
  const { selectedAvatar } = useContext(AvatarContext);
  const [subjectsMap, setSubjectsMap] = useState({
    "Mathematics": ["Addition", "Subtraction", "Multiplication", "Fractions", "Geometry"],
    "Science": ["Solar System", "Plants", "Animals", "Human Body", "Matter"],
    "English": ["Vocabulary", "Grammar", "Phonics", "Spelling", "Reading Comprehension"],
    "Computer Science": ["Coding Concepts", "Python Basics", "Algorithms", "Web Development", "Computers"],
    "General Knowledge": ["World Landmarks", "Animals & Habitats", "Space Exploration", "Famous Inventors", "Everyday Science"]
  });

  const speakText = (text) => {
    speakWithAvatarVoice(text, selectedAvatar.gender || "female");
  };

  const [selectedSubject, setSelectedSubject] = useState("Science");
  const [selectedTopic, setSelectedTopic] = useState("Solar System");
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const fetchSubjectList = async () => {
      try {
        const data = await getTopics();
        if (data && Object.keys(data).length > 0) {
          setSubjectsMap(data);
        }
      } catch (err) {
        console.warn("Using fallback subject map:", err);
      }
    };
    fetchSubjectList();
  }, []);

  const handleStartQuiz = async () => {
    setLoadingQuiz(true);
    setCompleted(false);
    setCurrentIdx(0);
    setScore(0);
    setCorrectCount(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setEvaluation(null);
    setShowHint(false);

    try {
      const res = await generateQuiz(selectedSubject, selectedTopic, 5);
      if (res && res.questions && res.questions.length > 0) {
        setQuestions(res.questions);
      }
    } catch (err) {
      console.error("Failed to generate quiz:", err);
    } finally {
      setLoadingQuiz(false);
    }
  };

  useEffect(() => {
    handleStartQuiz();
  }, [selectedSubject, selectedTopic]);

  const q = questions[currentIdx];

  const handleSelectOption = async (optionText) => {
    if (isAnswered || !q) return;
    setSelectedOpt(optionText);
    setIsAnswered(true);

    try {
      const evalRes = await evaluateQuizAnswer(
        q.question,
        optionText,
        q.correct_answer,
        q.explanation,
        q.hint
      );
      setEvaluation(evalRes);
      playChime(evalRes.is_correct);

      if (evalRes.is_correct) {
        setScore((prev) => prev + 20);
        setCorrectCount((prev) => prev + 1);
      }

      if (evalRes.avatar_response) {
        speakText(evalRes.avatar_response);
      }
    } catch (err) {
      console.error(err);
      const isRight = optionText === q.correct_answer;
      playChime(isRight);
      if (isRight) {
        setScore((prev) => prev + 20);
        setCorrectCount((prev) => prev + 1);
      }
      setEvaluation({
        is_correct: isRight,
        avatar_response: isRight ? "Great job! That's correct!" : `The correct answer is ${q.correct_answer}.`,
        hint: q.hint
      });
    }
  };

  const handleNext = async () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
      setEvaluation(null);
      setShowHint(false);
    } else {
      setCompleted(true);
      try {
        await logProgressEvent("quiz_complete", {
          subject: selectedSubject,
          topic: selectedTopic,
          score,
          correct_answers: correctCount,
          total_questions: questions.length,
          timestamp: new Date().toISOString()
        });
      } catch (e) {
        console.error("Failed to log progress event:", e);
      }
    }
  };

  return (
    <div className="glass-panel p-6 sm:p-8 space-y-6 border border-white/15 shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-400/30">
            <Sparkles size={22} />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white">Daily Quiz Assistant</h3>
            <p className="text-xs text-slate-300">Pick a subject & topic for interactive Doctor Avatar questions!</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 font-extrabold text-xs">
          <Award size={16} /> {score} XP
        </div>
      </div>

      {/* Subject & Topic Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/70 border border-white/10">
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <BookOpen size={14} className="text-sky-400" /> Select Subject
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => {
              const newSubj = e.target.value;
              setSelectedSubject(newSubj);
              const topics = subjectsMap[newSubj] || [];
              if (topics.length > 0) setSelectedTopic(topics[0]);
            }}
            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3 text-xs sm:text-sm font-semibold outline-none focus:border-sky-400"
          >
            {Object.keys(subjectsMap).map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Select Topic
          </label>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3 text-xs sm:text-sm font-semibold outline-none focus:border-sky-400"
          >
            {(subjectsMap[selectedSubject] || []).map((top) => (
              <option key={top} value={top}>{top}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Quiz Body */}
      {loadingQuiz ? (
        <div className="py-12 text-center text-sky-300 font-semibold text-sm flex items-center justify-center gap-3">
          <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
          <span>Generating today's quiz for {selectedTopic}...</span>
        </div>
      ) : !completed && q ? (
        <div className="space-y-5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span className="uppercase tracking-wider text-sky-400 font-extrabold">{selectedSubject} • {selectedTopic}</span>
            <span>Question {currentIdx + 1} of {questions.length}</span>
          </div>

          <h4 className="text-base sm:text-lg font-bold text-white leading-relaxed">
            {selectedAvatar.name} asks: "{q.question}"
          </h4>

          {/* Hint Button */}
          {q.hint && !isAnswered && (
            <div className="flex justify-end">
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-400/20"
              >
                <Lightbulb size={14} /> {showHint ? "Hide Hint" : "Need a Hint?"}
              </button>
            </div>
          )}

          {showHint && !isAnswered && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-200 text-xs font-medium">
              💡 <strong>Hint:</strong> {q.hint}
            </div>
          )}

          {/* Options */}
          <div className="space-y-3">
            {q.options.map((optText, idx) => {
              let btnStyle = "bg-slate-900/60 border-white/10 text-slate-200 hover:bg-white/10";
              if (isAnswered) {
                if (optText === q.correct_answer) {
                  btnStyle = "bg-emerald-500/20 border-emerald-400/50 text-emerald-200 font-bold shadow-lg shadow-emerald-500/10";
                } else if (selectedOpt === optText) {
                  btnStyle = "bg-red-500/20 border-red-400/50 text-red-200 font-bold";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(optText)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 rounded-2xl border backdrop-blur-md transition-all flex items-center justify-between text-sm sm:text-base font-medium ${btnStyle}`}
                >
                  <span>{optText}</span>
                  {isAnswered && optText === q.correct_answer && <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />}
                  {isAnswered && selectedOpt === optText && optText !== q.correct_answer && <XCircle size={18} className="text-red-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Evaluation Feedback */}
          {isAnswered && evaluation && (
            <div className={`p-5 rounded-2xl border space-y-3 text-xs sm:text-sm animate-in fade-in ${
              evaluation.is_correct
                ? "bg-emerald-500/10 border-emerald-400/30 text-emerald-200"
                : "bg-sky-500/10 border-sky-400/30 text-sky-200"
            }`}>
              <div className="font-extrabold flex items-center justify-between gap-2 text-white">
                <span className="flex items-center gap-2">
                  <span>{selectedAvatar.name}:</span>
                  <button
                    onClick={() => speakText(evaluation.avatar_response)}
                    className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-sky-300"
                  >
                    <Volume2 size={14} />
                  </button>
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase ${
                  evaluation.is_correct ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"
                }`}>
                  {evaluation.is_correct ? "Correct!" : "Supportive Feedback"}
                </span>
              </div>
              <div className="leading-relaxed">
                <FormattedText text={evaluation.avatar_response} />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNext}
                  className="glass-btn-primary px-5 py-2.5 rounded-xl text-white font-extrabold text-xs flex items-center gap-2 shadow-lg"
                >
                  {currentIdx < questions.length - 1 ? "Next Question" : "View Quiz Summary"} <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center space-y-4 bg-emerald-500/10 border border-emerald-400/30 rounded-3xl">
          <Award size={48} className="text-amber-400 mx-auto animate-bounce" />
          <h4 className="text-2xl font-extrabold text-white">Quiz Completed! 🎉</h4>
          <p className="text-slate-300 text-sm">
            Awesome effort on <strong className="text-sky-300">{selectedTopic}</strong>! You answered <strong className="text-emerald-300 font-extrabold">{correctCount} of {questions.length}</strong> correctly and earned <strong className="text-amber-300 font-extrabold">{score} XP</strong>.
          </p>
          <button
            onClick={handleStartQuiz}
            className="px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-xs border border-sky-400 shadow-lg"
          >
            Try Another Quiz in {selectedSubject}
          </button>
        </div>
      )}
    </div>
  );
}

export default DailyQuest;
