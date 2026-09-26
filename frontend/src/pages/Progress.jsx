import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProgress, downloadPdfReport } from "../services/api";
import { BarChart3, Award, Clock, Flame, BookOpen, Smile, Sparkles, Download, FileText, ArrowRight, ShieldAlert, Star, Trophy } from "lucide-react";

function Progress() {
  const [data, setData] = useState({
    completedActivities: 0,
    aiSessionsCount: 0,
    learningTimeMinutes: 0,
    streakDays: 0,
    subjectProgress: [],
    recentEmotions: [],
    totalEventsCount: 0
  });

  const [loading, setLoading] = useState(true);
  const [reportDays, setReportDays] = useState(7);
  const [generatingReport, setGeneratingReport] = useState(false);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const res = await getProgress();
        if (res) {
          setData(res);
        }
      } catch (err) {
        console.error("Progress fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const handleDownloadPdf = async () => {
    setGeneratingReport(true);
    try {
      await downloadPdfReport(reportDays);
    } catch (err) {
      console.error("Report download error:", err);
      alert("Unable to generate PDF report. Please ensure your backend is running.");
    } finally {
      setGeneratingReport(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-sky-400 font-bold text-lg animate-pulse">
        Loading real-time skill & progress metrics...
      </div>
    );
  }

  const hasData = data.totalEventsCount > 0 || data.aiSessionsCount > 0 || data.completedActivities > 0;

  const badges = [
    { title: "First Step", desc: "Completed 1st learning session", icon: <Star size={20} />, unlocked: data.aiSessionsCount > 0 },
    { title: "Consistent Learner", desc: "Active 3+ days in a row", icon: <Flame size={20} />, unlocked: data.streakDays >= 3 },
    { title: "Affect Cue Explorer", desc: "Recognized 5+ facial expressions", icon: <Smile size={20} />, unlocked: data.recentEmotions.length >= 5 },
    { title: "Master Mind", desc: "Completed 10+ activities", icon: <Trophy size={20} />, unlocked: data.completedActivities >= 10 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <BarChart3 className="text-sky-400" size={32} />
            Learning & Skill Progress
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            Real interaction metrics, subject mastery, and observational report downloads.
          </p>
        </div>

        {/* PDF Download Action Header */}
        <div className="flex items-center gap-3 bg-slate-900/80 border border-white/15 p-2 rounded-2xl backdrop-blur-xl shadow-xl">
          <select
            value={reportDays}
            onChange={(e) => setReportDays(Number(e.target.value))}
            className="bg-slate-800 text-slate-200 text-xs font-bold px-3 py-2 rounded-xl border border-white/10 outline-none cursor-pointer"
          >
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 90 Days</option>
          </select>

          <button
            onClick={handleDownloadPdf}
            disabled={generatingReport}
            className="glass-btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold text-white transition shadow-lg"
          >
            <Download size={15} />
            {generatingReport ? "Generating PDF..." : "Download Caregiver Report (PDF)"}
          </button>
        </div>
      </div>

      {/* Observational Disclaimer Notice */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-start gap-3 text-xs text-amber-200/90 backdrop-blur-md">
        <ShieldAlert size={18} className="text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300 font-bold">Observational Support Tool Notice:</strong> All progress data and affective cue statistics are computed from real interactive activity logs and machine learning estimates. This software does not medically diagnose autism or mental health conditions.
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card-interactive p-6 flex items-center gap-4 border border-white/15">
          <div className="p-4 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-400/30">
            <Award size={28} />
          </div>
          <div>
            <div className="text-xs text-slate-300 font-extrabold uppercase tracking-wider">Completed Activities</div>
            <div className="text-3xl font-extrabold text-white mt-1">{data.completedActivities}</div>
          </div>
        </div>

        <div className="glass-card-interactive p-6 flex items-center gap-4 border border-white/15">
          <div className="p-4 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-400/30">
            <BookOpen size={28} />
          </div>
          <div>
            <div className="text-xs text-slate-300 font-extrabold uppercase tracking-wider">AI Tutor Sessions</div>
            <div className="text-3xl font-extrabold text-white mt-1">{data.aiSessionsCount}</div>
          </div>
        </div>

        <div className="glass-card-interactive p-6 flex items-center gap-4 border border-white/15">
          <div className="p-4 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
            <Clock size={28} />
          </div>
          <div>
            <div className="text-xs text-slate-300 font-extrabold uppercase tracking-wider">Learning Time</div>
            <div className="text-3xl font-extrabold text-white mt-1">{data.learningTimeMinutes} <span className="text-sm font-normal text-slate-400">mins</span></div>
          </div>
        </div>

        <div className="glass-card-interactive p-6 flex items-center gap-4 border border-white/15">
          <div className="p-4 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-400/30">
            <Flame size={28} />
          </div>
          <div>
            <div className="text-xs text-slate-300 font-extrabold uppercase tracking-wider">Active Streak</div>
            <div className="text-3xl font-extrabold text-white mt-1">{data.streakDays} <span className="text-sm font-normal text-slate-400">days</span></div>
          </div>
        </div>
      </div>

      {/* Real-World Industry Feature: Unlockable Achievement Badges */}
      <div className="glass-panel p-6 sm:p-8 space-y-4 border border-white/15">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Trophy className="text-amber-400" size={24} />
          Learner Achievement Badges
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((badge, index) => (
            <div
              key={index}
              className={`p-4 rounded-2xl border backdrop-blur-md flex items-center gap-3 transition-all ${
                badge.unlocked
                  ? "bg-amber-500/10 border-amber-400/40 text-amber-200 shadow-lg shadow-amber-500/10"
                  : "bg-slate-900/40 border-white/10 text-slate-500 opacity-60"
              }`}
            >
              <div className={`p-3 rounded-xl ${badge.unlocked ? "bg-amber-500/20 text-amber-400" : "bg-slate-800 text-slate-600"}`}>
                {badge.icon}
              </div>
              <div>
                <div className="text-sm font-extrabold">{badge.title}</div>
                <div className="text-xs text-slate-400 mt-0.5">{badge.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {!hasData ? (
        /* Zero Fake Data Empty State */
        <div className="glass-panel p-10 text-center max-w-2xl mx-auto space-y-5 border border-white/15">
          <div className="w-16 h-16 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center mx-auto border border-sky-400/30 shadow-xl">
            <FileText size={32} />
          </div>
          <h3 className="text-xl font-extrabold text-white">No Learning Activity Recorded Yet</h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            We enforce strict zero fake data standards! Complete your first interactive session with the AI Tutor or start camera affect recognition to log real data.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            <Link
              to="/ai-chat"
              className="glass-btn-primary px-6 py-3 rounded-2xl text-white font-extrabold text-sm transition flex items-center gap-2 shadow-xl"
            >
              Start AI Tutor Session <ArrowRight size={16} />
            </Link>
            <Link
              to="/emotion-detection"
              className="px-6 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-extrabold text-sm transition border border-white/15 backdrop-blur-md"
            >
              Open Affect Cue Recognition
            </Link>
          </div>
        </div>
      ) : (
        /* Real Recorded Data Grid */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Subject Progress Bars */}
          <div className="lg:col-span-2 glass-panel p-6 sm:p-8 space-y-6 border border-white/15">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="text-sky-400" size={22} />
              Subject Progress Breakdown (Real Measured Data)
            </h2>

            {data.subjectProgress.length === 0 ? (
              <p className="text-slate-400 text-sm">No subject breakdown available yet.</p>
            ) : (
              <div className="space-y-6">
                {data.subjectProgress.map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-extrabold text-slate-200">{item.subject}</span>
                      <span className="font-extrabold text-sky-400">{item.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-950/80 h-3.5 rounded-full overflow-hidden p-0.5 border border-white/10 shadow-inner">
                      <div
                        className="bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500 shadow-md"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Emotion / Activity History */}
          <div className="glass-panel p-6 sm:p-8 space-y-6 border border-white/15">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Smile className="text-amber-400" size={22} />
              Recorded Affective Cue Logs
            </h2>

            {data.recentEmotions.length === 0 ? (
              <p className="text-slate-400 text-sm">No camera emotion logs recorded yet.</p>
            ) : (
              <div className="space-y-4">
                {data.recentEmotions.map((log, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 flex items-center justify-between backdrop-blur-md shadow-sm"
                  >
                    <div>
                      <div className="text-sm font-extrabold text-white capitalize">{log.emotion}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{log.time}</div>
                    </div>
                    <div className="text-xs font-extrabold px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/40">
                      {log.confidence}%
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Progress;