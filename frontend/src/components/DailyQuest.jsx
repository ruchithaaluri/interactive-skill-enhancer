import { useState, useEffect, useContext, useMemo } from "react";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Award,
  ArrowRight,
  HelpCircle,
  BookOpen,
  Volume2,
  Lightbulb,
  RefreshCw,
  Flame,
  Calendar,
  Clock,
  Shuffle
} from "lucide-react";
import { getTopics, generateQuiz, evaluateQuizAnswer, logProgressEvent } from "../services/api";
import { FormattedText } from "../utils/formatText";
import { speakWithAvatarVoice } from "../utils/speechUtils";
import { AvatarContext } from "../context/AvatarContext";

// Sound synthesis for correct/incorrect feedback
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
  } catch (e) { }
}

// ========================================================
// DAILY ROTATING THEMES SCHEDULE (Changes automatically each day)
// ========================================================
export const DAILY_THEMES = [
  { day: 0, dayName: "Sunday", subject: "Life Skills", topic: "Emotional Resilience", icon: "🌱", bonusXP: 25, title: "Sunday Mindset & Emotional Growth" },
  { day: 1, dayName: "Monday", subject: "Communication", topic: "Active Listening", icon: "💬", bonusXP: 25, title: "Monday Social & Teamwork Challenge" },
  { day: 2, dayName: "Tuesday", subject: "Science", topic: "Solar System", icon: "🚀", bonusXP: 25, title: "Tuesday Cosmic & Space Wonders" },
  { day: 3, dayName: "Wednesday", subject: "Mathematics", topic: "Geometry", icon: "📐", bonusXP: 25, title: "Wednesday Math & Logic Mastery" },
  { day: 4, dayName: "Thursday", subject: "Biology", topic: "Human Anatomy", icon: "🧬", bonusXP: 25, title: "Thursday Living World & Biology" },
  { day: 5, dayName: "Friday", subject: "Computer Science", topic: "Coding Concepts", icon: "⚡", bonusXP: 25, title: "Friday Tech & Coding Exploration" },
  { day: 6, dayName: "Saturday", subject: "Geography", topic: "Countries & Capitals", icon: "🌍", bonusXP: 25, title: "Saturday Global Cultures & Wonders" },
];

// Rich date-seeded dynamic question bank for guaranteed fresh questions every day
const DAILY_QUESTION_POOLS = {
  "Science": {
    "Solar System": [
      {
        question: "Which planet is famous for its bright, spectacular rings made of ice and rock?",
        options: ["Saturn", "Mars", "Mercury", "Venus"],
        correct_answer: "Saturn",
        explanation: "Saturn has the most extensive planetary ring system in our solar system, made mostly of ice chunks and dust particles.",
        hint: "It is the second-largest planet in our solar system."
      },
      {
        question: "Why is Mars often called the 'Red Planet'?",
        options: ["Its surface is rich in iron oxide (rust)", "It is covered in red lava", "It reflects red laser light", "Its atmosphere is pure helium"],
        correct_answer: "Its surface is rich in iron oxide (rust)",
        explanation: "The reddish color comes from iron oxide (rust) covering the rocks and soil across Mars.",
        hint: "Think about what happens to iron when exposed to oxygen."
      },
      {
        question: "Which is the hottest planet in our solar system, despite not being closest to the Sun?",
        options: ["Venus", "Mercury", "Jupiter", "Neptune"],
        correct_answer: "Venus",
        explanation: "Venus has a thick atmosphere of greenhouse gases that trap immense heat, making it hotter than Mercury.",
        hint: "It has a runaway greenhouse effect."
      },
      {
        question: "How long does it take for light from the Sun to travel to Earth?",
        options: ["About 8 minutes and 20 seconds", "Exactly 1 second", "1 hour", "12 hours"],
        correct_answer: "About 8 minutes and 20 seconds",
        explanation: "Light travels at 300,000 km/s, taking about 500 seconds (8 min 20 sec) to cross the 150 million km distance to Earth.",
        hint: "It is between 5 and 10 minutes."
      },
      {
        question: "What is at the very center of our solar system that keeps all planets in orbit?",
        options: ["The Sun (a yellow dwarf star)", "The Moon", "A black hole", "Polaris"],
        correct_answer: "The Sun (a yellow dwarf star)",
        explanation: "The Sun's immense gravity holds all eight planets, asteroids, and comets in orbit.",
        hint: "It provides light and warmth to Earth every day."
      },
      {
        question: "Which dwarf planet was formerly categorized as the 9th planet until 2006?",
        options: ["Pluto", "Ceres", "Eris", "Makemake"],
        correct_answer: "Pluto",
        explanation: "Pluto was reclassified as a dwarf planet by the International Astronomical Union in 2006.",
        hint: "Its name starts with the letter P."
      },
      {
        question: "What is the largest moon of Saturn that has a thick atmosphere and liquid methane lakes?",
        options: ["Titan", "Europa", "Ganymede", "Phobos"],
        correct_answer: "Titan",
        explanation: "Titan is the only moon in our solar system known to have a dense atmosphere and bodies of surface liquid.",
        hint: "Its name sounds like a giant."
      }
    ],
  },
  "Communication": {
    "Active Listening": [
      {
        question: "When someone is speaking to you, what is the best way to show you are actively listening?",
        options: ["Maintain gentle eye contact and nod along", "Look at your smartphone screen", "Interrupt with your own story immediately", "Look at the floor and say nothing"],
        correct_answer: "Maintain gentle eye contact and nod along",
        explanation: "Attentive posture, gentle eye contact, and nodding signal that you respect and value the speaker's thoughts.",
        hint: "Think about what makes you feel heard."
      },
      {
        question: "What is an effective response if you didn't quite understand what someone said?",
        options: ["'Could you please clarify that for me?'", "Walk away in silence", "Pretend you understood anyway", "Tell them it doesn't matter"],
        correct_answer: "'Could you please clarify that for me?'",
        explanation: "Asking polite clarifying questions prevents misunderstandings and demonstrates genuine care.",
        hint: "Polite curiosity builds trust."
      },
      {
        question: "What does 'paraphrasing' mean in active communication?",
        options: ["Reflecting back what you heard in your own words", "Repeating the exact word 10 times", "Ignoring the topic completely", "Speaking in a loud voice"],
        correct_answer: "Reflecting back what you heard in your own words",
        explanation: "Paraphrasing confirms mutual understanding by summarizing the key point before responding.",
        hint: "It starts with: 'So what you're saying is...'."
      },
      {
        question: "Which of the following is an example of an open-ended question that encourages sharing?",
        options: ["'How did you feel about that experience?'", "'Are you done?'", "'Yes or no?'", "'Is it cold outside?'"],
        correct_answer: "'How did you feel about that experience?'",
        explanation: "Open-ended questions allow the other person to share feelings and thoughts beyond a simple yes or no.",
        hint: "Look for questions starting with 'How' or 'What'."
      },
      {
        question: "Why are pauses and silence valuable during a thoughtful conversation?",
        options: ["They give both people time to process and reflect", "They mean the conversation is ruined", "They show that you are bored", "They prove you know everything"],
        correct_answer: "They give both people time to process and reflect",
        explanation: "Comfortable pauses provide healthy thinking space so responses are thoughtful and calm.",
        hint: "Rushing isn't always best for understanding."
      }
    ]
  },
  "Mathematics": {
    "Geometry": [
      {
        question: "What is the sum of the interior angles of any triangle?",
        options: ["180 degrees", "360 degrees", "90 degrees", "270 degrees"],
        correct_answer: "180 degrees",
        explanation: "Every triangle on a flat plane has interior angles that add up to 180 degrees.",
        hint: "It is half of a full 360-degree circle."
      },
      {
        question: "What do you call a polygon with exactly six equal sides and six angles?",
        options: ["Regular Hexagon", "Pentagon", "Octagon", "Decagon"],
        correct_answer: "Regular Hexagon",
        explanation: "A hexagon has 6 sides (hex = six), like the cells in a honeybee comb.",
        hint: "Honeycombs are built in this shape."
      },
      {
        question: "What is the mathematical term for a straight line that connects the center of a circle to any point on its boundary?",
        options: ["Radius", "Diameter", "Chord", "Tangent"],
        correct_answer: "Radius",
        explanation: "The radius connects the center to the edge; the diameter is twice the radius.",
        hint: "It is half the length of the diameter."
      },
      {
        question: "What is the formula used to find the area of a rectangle?",
        options: ["Length × Width", "Length + Width", "2 × (Length + Width)", "Length ÷ Width"],
        correct_answer: "Length × Width",
        explanation: "Area is measured in square units by multiplying the length of the base by its height/width.",
        hint: "You multiply the two adjacent side lengths."
      },
      {
        question: "What is a right angle equal to in degrees?",
        options: ["90 degrees", "45 degrees", "180 degrees", "60 degrees"],
        correct_answer: "90 degrees",
        explanation: "A right angle is an angle of exactly 90 degrees, forming a square corner like the edge of a book.",
        hint: "Like the corner of a sheet of paper."
      }
    ]
  },
  "Computer Science": {
    "Coding Concepts": [
      {
        question: "What is an 'algorithm' in computer science and everyday problem solving?",
        options: ["A step-by-step set of instructions to complete a task", "A type of computer screen", "A broken electrical wire", "A fast keyboard"],
        correct_answer: "A step-by-step set of instructions to complete a task",
        explanation: "An algorithm is like a recipe: a clear sequence of steps designed to solve a specific problem.",
        hint: "Think of following a baking recipe step by step."
      },
      {
        question: "What is a 'variable' used for in programming?",
        options: ["To store and label information in memory for later use", "To turn the computer off", "To delete the internet", "To clean the hardware"],
        correct_answer: "To store and label information in memory for later use",
        explanation: "A variable is like a labeled box where a program keeps numbers, text, or states that can change.",
        hint: "Like a labeled container holding a value."
      },
      {
        question: "What does a 'loop' allow a computer program to do efficiently?",
        options: ["Repeat a block of code multiple times without retyping it", "Crash the operating system", "Draw circles only", "Slow down the CPU"],
        correct_answer: "Repeat a block of code multiple times without retyping it",
        explanation: "Loops (like 'for' and 'while') repeat tasks automatically until a condition is met.",
        hint: "Repeat action until finished."
      },
      {
        question: "What does 'debugging' mean in software development?",
        options: ["Finding and fixing errors or bugs in code", "Removing physical insects from the room", "Writing code without reading it", "Installing a printer"],
        correct_answer: "Finding and fixing errors or bugs in code",
        explanation: "Debugging is the systematic process of identifying, analyzing, and fixing flaws in a program.",
        hint: "Grace Hopper coined the term after finding a real moth in an early computer relay."
      },
      {
        question: "Which of the following is a conditional statement that makes decisions in code?",
        options: ["if / else", "print()", "import", "def"],
        correct_answer: "if / else",
        explanation: "'if / else' checks whether a condition is true or false and branches execution accordingly.",
        hint: "'IF it rains, take an umbrella, ELSE wear sunglasses'."
      }
    ]
  },
  "Life Skills": {
    "Emotional Resilience": [
      {
        question: "When facing a difficult setback or frustrating challenge, what is a growth-mindset response?",
        options: ["'I haven't mastered this yet, but I can learn with practice.'", "'I can never do this, so I quit.'", "'I will blame someone else.'", "'I am not smart enough.'"],
        correct_answer: "'I haven't mastered this yet, but I can learn with practice.'",
        explanation: "Adding the word 'YET' shifts focus from a fixed limitation to a growth journey of learning.",
        hint: "Remember the power of the word 'YET'."
      },
      {
        question: "Which simple physiological technique can help calm the nervous system when feeling overwhelmed?",
        options: ["Taking slow, deep diaphragmatic breaths (e.g. 4 seconds in, 4 out)", "Holding your breath as long as possible", "Skipping sleep completely", "Drinking 4 sodas"],
        correct_answer: "Taking slow, deep diaphragmatic breaths (e.g. 4 seconds in, 4 out)",
        explanation: "Slow deep breathing activates the parasympathetic nervous system, lowering heart rate and promoting calm.",
        hint: "Inhale gently through your nose, exhale slowly."
      },
      {
        question: "What is 'empathy' and why is it so valuable in our friendships?",
        options: ["Understanding and sharing the feelings of another person", "Agreeing with everything always", "Telling people what they must do", "Ignoring emotions"],
        correct_answer: "Understanding and sharing the feelings of another person",
        explanation: "Empathy allows us to step into another person's shoes, building deep mutual care and connection.",
        hint: "Walking in another's shoes."
      },
      {
        question: "How can breaking a large, overwhelming goal into smaller daily steps help?",
        options: ["It reduces anxiety and builds momentum through small wins", "It makes the goal impossible", "It takes twice as much energy", "It stops progress completely"],
        correct_answer: "It reduces anxiety and builds momentum through small wins",
        explanation: "Small micro-steps feel manageable and celebrating small milestones releases dopamine to stay motivated.",
        hint: "One step at a time makes the mountain climbable."
      },
      {
        question: "What is an important part of self-compassion when you make an accidental mistake?",
        options: ["Recognizing that mistakes are normal learning opportunities", "Punishing yourself harshly for days", "Hiding the mistake and lying", "Deciding never to try again"],
        correct_answer: "Recognizing that mistakes are normal learning opportunities",
        explanation: "Self-compassion means treating yourself with the same kindness and understanding you would offer a best friend.",
        hint: "Treat yourself like a good friend."
      }
    ]
  }
};

function DailyQuest() {
  const { selectedAvatar } = useContext(AvatarContext);

  // Determine today's date info
  const today = useMemo(() => new Date(), []);
  const todayDayIdx = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const todayDateString = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  // Calculate day-of-year integer seed (changes daily)
  const dayOfYear = useMemo(() => {
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = today - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }, [today]);

  const todayTheme = DAILY_THEMES[todayDayIdx] || DAILY_THEMES[0];

  const [subjectsMap, setSubjectsMap] = useState({
    "Science": ["Solar System", "Plants", "Animals", "Human Body", "Matter"],
    "Communication": ["Active Listening", "Public Speaking", "Body Language", "Teamwork & Collaboration", "Empathy in Conversation"],
    "Mathematics": ["Geometry", "Addition", "Multiplication", "Fractions"],
    "Computer Science": ["Coding Concepts", "Python Basics", "Algorithms", "Web Development"],
    "Life Skills": ["Emotional Resilience", "Time Management", "Problem Solving", "Financial Literacy"],
    "Biology": ["Human Anatomy", "Cell Biology", "Photosynthesis", "Ecosystems"],
    "Geography": ["Countries & Capitals", "Continents & Oceans", "Climate & Weather"],
    "History": ["Ancient Civilizations", "World Wars", "Inventions"],
  });

  // Initialize selected subject/topic with Today's Featured Theme!
  const [selectedSubject, setSelectedSubject] = useState(todayTheme.subject);
  const [selectedTopic, setSelectedTopic] = useState(todayTheme.topic);
  const [shuffleSeed, setShuffleSeed] = useState(0);

  // Daily Streak management
  const [streakCount, setStreakCount] = useState(() => {
    const saved = localStorage.getItem("daily_quest_streak");
    return saved ? parseInt(saved, 10) : 3;
  });
  const [completedToday, setCompletedToday] = useState(() => {
    const lastDate = localStorage.getItem("daily_quest_last_date");
    return lastDate === today.toDateString();
  });

  // Countdown to next daily refresh
  const [timeUntilReset, setTimeUntilReset] = useState("");
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const diffMs = midnight - now;

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diffMs % (1000 * 60)) / 1000);

      setTimeUntilReset(
        `${hours.toString().padStart(2, "0")}h ${mins.toString().padStart(2, "0")}m ${secs.toString().padStart(2, "0")}s`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

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

  // Fetch subject catalog from backend
  useEffect(() => {
    const fetchSubjectList = async () => {
      try {
        const data = await getTopics();
        if (data && Object.keys(data).length > 0) {
          setSubjectsMap((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.warn("Using default subject map:", err);
      }
    };
    fetchSubjectList();
  }, []);

  // Voice speech helper with companion's configured voice
  const speakText = (text) => {
    speakWithAvatarVoice(text, selectedAvatar?.id || selectedAvatar?.gender || "doctor");
  };

  // Generate / Load Daily Changing Questions
  const loadDailyQuestions = async () => {
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
      // 1. Try fetching from backend API
      const res = await generateQuiz(selectedSubject, selectedTopic, 5);
      if (res && res.questions && res.questions.length > 0) {
        // If user shuffled, permute the questions
        let qList = [...res.questions];
        if (shuffleSeed > 0) {
          qList = qList.sort(() => (Math.sin(shuffleSeed) > 0 ? 1 : -1));
        }
        setQuestions(qList);
        setLoadingQuiz(false);
        return;
      }
    } catch (err) {
      console.warn("Backend quiz generator unavailable, utilizing date-seeded daily bank:", err);
    }

    // 2. Fallback to comprehensive local date-seeded daily bank
    const pool =
      (DAILY_QUESTION_POOLS[selectedSubject] && DAILY_QUESTION_POOLS[selectedSubject][selectedTopic]) ||
      (DAILY_QUESTION_POOLS["Science"] && DAILY_QUESTION_POOLS["Science"]["Solar System"]);

    // Deterministic daily permutation seeded by calendar day-of-year + shuffleSeed
    const dailyOffset = (dayOfYear * 7 + shuffleSeed * 13) % pool.length;
    const dailySelected = [];
    for (let i = 0; i < Math.min(5, pool.length); i++) {
      const idx = (dailyOffset + i) % pool.length;
      dailySelected.push({ ...pool[idx], id: i + 1 });
    }

    setQuestions(dailySelected);
    setLoadingQuiz(false);
  };

  useEffect(() => {
    loadDailyQuestions();
  }, [selectedSubject, selectedTopic, shuffleSeed]);

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
        setScore((prev) => prev + 25);
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
        setScore((prev) => prev + 25);
        setCorrectCount((prev) => prev + 1);
      }
      setEvaluation({
        is_correct: isRight,
        avatar_response: isRight
          ? `Spot on! ${q.explanation || "That is completely correct!"}`
          : `Good effort! The correct answer is ${q.correct_answer}. ${q.explanation || ""}`,
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

      // Increment daily streak if not already completed today
      if (!completedToday) {
        const newStreak = streakCount + 1;
        setStreakCount(newStreak);
        setCompletedToday(true);
        localStorage.setItem("daily_quest_streak", newStreak.toString());
        localStorage.setItem("daily_quest_last_date", today.toDateString());
      }

      try {
        await logProgressEvent("daily_quest_completed", {
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

  // Quick switch to Today's Daily Spotlight
  const handleSelectDailySpotlight = () => {
    setSelectedSubject(todayTheme.subject);
    setSelectedTopic(todayTheme.topic);
  };

  // Instant Shuffle fresh questions
  const handleShuffle = () => {
    setShuffleSeed((prev) => prev + 1);
  };

  return (
    <div className="glass-panel p-5 sm:p-7 space-y-6 border border-white/10 shadow-2xl relative overflow-hidden">
      {/* Top Ambient Glow Ribbon */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500" />

      {/* Daily Header: Date, Rotating Theme Spotlight & Streak */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar size={15} className="text-cyan-400" />
            <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-widest">
              {todayDateString} • DAILY LEARNING QUEST
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-white font-starlight flex items-center gap-2.5">
            <span>{todayTheme.icon}</span>
            <span>{todayTheme.title}</span>
          </h3>
          <p className="text-xs text-sky-200/75 mt-0.5">
            Questions and featured focus rotate every 24 hours. Practice with {selectedAvatar?.name || "your 3D companion"}!
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Daily Streak Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-bold shadow-sm">
            <Flame size={16} className="text-amber-400 animate-bounce" />
            <span>{streakCount} Day Streak</span>
            {completedToday && <span className="text-[10px] text-emerald-400 font-extrabold">✓ COMPLETED</span>}
          </div>

          {/* XP Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-sky-500/15 border border-sky-400/40 text-cyan-300 text-xs font-bold shadow-sm">
            <Award size={16} className="text-cyan-400" />
            <span>{score} XP Earned</span>
          </div>

          {/* Reset Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/5 border border-white/10 text-slate-300 text-xs font-medium backdrop-blur-md">
            <Clock size={14} className="text-indigo-400" />
            <span>Refreshes in {timeUntilReset || "midnight"}</span>
          </div>
        </div>
      </div>

      {/* Daily Subject Spotlight Action Ribbon */}
      <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/60 border border-cyan-400/20 backdrop-blur-md flex-wrap">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
            Today's Feature
          </span>
          <span className="text-xs font-semibold text-slate-200">
            {todayTheme.dayName} Spotlight: <strong className="text-cyan-300">{todayTheme.subject}</strong> ({todayTheme.topic})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {selectedSubject !== todayTheme.subject && (
            <button
              onClick={handleSelectDailySpotlight}
              className="px-3 py-1 rounded-xl text-xs font-bold bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 transition flex items-center gap-1"
            >
              🌟 Snap to Today's Feature
            </button>
          )}

          {/* Instant Question Shuffle Button */}
          <button
            onClick={handleShuffle}
            disabled={loadingQuiz}
            className="px-3 py-1 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 transition flex items-center gap-1.5 shadow"
            title="Generate a brand-new alternate set of questions immediately"
          >
            <Shuffle size={13} className="text-cyan-300" />
            <span>New Questions</span>
          </button>
        </div>
      </div>

      {/* Subject & Topic Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10">
        <div>
          <label className="block text-[11px] font-bold text-sky-300 uppercase tracking-wider mb-1 flex items-center gap-1">
            <BookOpen size={13} className="text-cyan-400" /> Subject
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => {
              const newSubj = e.target.value;
              setSelectedSubject(newSubj);
              const topics = subjectsMap[newSubj] || [];
              if (topics.length > 0) setSelectedTopic(topics[0]);
            }}
            className="w-full bg-slate-900/80 border border-white/10 text-white rounded-xl p-2.5 text-xs sm:text-sm font-medium outline-none focus:border-cyan-400"
          >
            {Object.keys(subjectsMap).map((sub) => (
              <option key={sub} value={sub}>
                {sub} {sub === todayTheme.subject ? "🌟 (Today's Daily)" : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-sky-300 uppercase tracking-wider mb-1">
            Topic Focus
          </label>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full bg-slate-900/80 border border-white/10 text-white rounded-xl p-2.5 text-xs sm:text-sm font-medium outline-none focus:border-cyan-400"
          >
            {(subjectsMap[selectedSubject] || []).map((top) => (
              <option key={top} value={top}>{top}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Quiz Question Body */}
      {loadingQuiz ? (
        <div className="py-12 text-center text-sky-200 font-medium text-sm flex items-center justify-center gap-3">
          <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span>Generating daily questions for {selectedTopic}...</span>
        </div>
      ) : !completed && q ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span className="uppercase tracking-wider text-cyan-400 font-extrabold flex items-center gap-1.5">
              <span>{selectedSubject}</span>
              <span>•</span>
              <span className="text-slate-300">{selectedTopic}</span>
            </span>
            <span>Question {currentIdx + 1} of {questions.length}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 backdrop-blur-md">
            <h4 className="text-base sm:text-lg font-bold text-white leading-relaxed flex items-start gap-2">
              <span className="text-cyan-400 font-black">Q{currentIdx + 1}.</span>
              <span>{q.question}</span>
            </h4>
          </div>

          {/* Hint Button */}
          {q.hint && !isAnswered && (
            <div className="flex justify-end">
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-400/25 transition"
              >
                <Lightbulb size={13} /> {showHint ? "Hide Hint" : "Need a Hint?"}
              </button>
            </div>
          )}

          {showHint && !isAnswered && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-200 text-xs font-medium animate-in fade-in">
              💡 <strong>Hint from {selectedAvatar?.name || "Mentor"}:</strong> {q.hint}
            </div>
          )}

          {/* Answer Options */}
          <div className="space-y-2.5">
            {q.options.map((optText, idx) => {
              let btnStyle = "bg-slate-900/60 border-white/10 text-slate-200 hover:bg-white/10 hover:border-cyan-400/30";
              if (isAnswered) {
                if (optText === q.correct_answer) {
                  btnStyle = "bg-emerald-500/20 border-emerald-400/60 text-emerald-200 font-bold shadow-lg shadow-emerald-500/10";
                } else if (selectedOpt === optText) {
                  btnStyle = "bg-red-500/20 border-red-400/60 text-red-200 font-bold";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(optText)}
                  disabled={isAnswered}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border backdrop-blur-md transition-all flex items-center justify-between text-xs sm:text-sm font-medium ${btnStyle}`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-sky-300">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{optText}</span>
                  </span>
                  {isAnswered && optText === q.correct_answer && <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />}
                  {isAnswered && selectedOpt === optText && optText !== q.correct_answer && <XCircle size={18} className="text-red-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Real-time Feedback from 3D Companion */}
          {isAnswered && evaluation && (
            <div
              className={`p-4 sm:p-5 rounded-2xl border space-y-2.5 text-xs sm:text-sm animate-in fade-in ${
                evaluation.is_correct
                  ? "bg-emerald-500/10 border-emerald-400/35 text-emerald-200"
                  : "bg-sky-500/10 border-sky-400/35 text-sky-200"
              }`}
            >
              <div className="font-extrabold flex items-center justify-between gap-2 text-white">
                <span className="flex items-center gap-2">
                  <span>{selectedAvatar?.name || "Mentor"}:</span>
                  <button
                    onClick={() => speakText(evaluation.avatar_response)}
                    className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-sky-300 transition"
                    title="Listen to feedback"
                  >
                    <Volume2 size={14} />
                  </button>
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    evaluation.is_correct ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"
                  }`}
                >
                  {evaluation.is_correct ? "✓ Correct! (+25 XP)" : "Supportive Feedback"}
                </span>
              </div>
              <div className="leading-relaxed">
                <FormattedText text={evaluation.avatar_response} />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNext}
                  className="glass-btn-primary px-5 py-2 rounded-xl text-white font-extrabold text-xs flex items-center gap-2 shadow-lg"
                >
                  {currentIdx < questions.length - 1 ? "Next Question" : "Complete Daily Quest"} <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center space-y-4 bg-emerald-500/10 border border-emerald-400/30 rounded-3xl animate-in zoom-in-95">
          <Award size={48} className="text-amber-400 mx-auto animate-bounce" />
          <h4 className="text-2xl font-extrabold text-white font-starlight">Daily Quest Mastered! 🎉</h4>
          <p className="text-slate-300 text-sm max-w-md mx-auto">
            Terrific job on today's <strong className="text-sky-300">{selectedTopic}</strong> challenge! You scored{" "}
            <strong className="text-emerald-300 font-extrabold">{correctCount} of {questions.length}</strong> and earned{" "}
            <strong className="text-amber-300 font-extrabold">{score} XP</strong> for your learning streak!
          </p>

          <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
            <button
              onClick={handleShuffle}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center gap-2 shadow"
            >
              <Shuffle size={14} className="text-cyan-300" /> Practice Another Set
            </button>

            <button
              onClick={handleSelectDailySpotlight}
              className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs border border-sky-400 shadow-lg flex items-center gap-1.5"
            >
              <Flame size={14} /> Back to Daily Spotlight
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DailyQuest;
