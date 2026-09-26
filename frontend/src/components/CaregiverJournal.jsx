import { useState, useEffect } from "react";
import { BookOpen, Plus, Save, FileText, Calendar, Trash2 } from "lucide-react";

function CaregiverJournal() {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("caregiver_observational_notes");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 1,
        date: new Date().toLocaleDateString(),
        text: "Learner maintained steady engagement for 15 minutes during AI Tutor math session today.",
        tag: "Focus Observation"
      }
    ];
  });

  const [newNote, setNewNote] = useState("");
  const [tag, setTag] = useState("Focus Observation");

  useEffect(() => {
    localStorage.setItem("caregiver_observational_notes", JSON.stringify(notes));
  }, [notes]);

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const entry = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      text: newNote.trim(),
      tag
    };
    setNotes([entry, ...notes]);
    setNewNote("");
  };

  const handleDelete = (id) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  return (
    <div className="glass-panel p-6 sm:p-8 space-y-6 border border-white/15 shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-400/30">
            <BookOpen size={22} />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white">Caregiver Observational Journal</h3>
            <p className="text-xs text-slate-300">Record clinical observations, focus notes, and daily progress remarks.</p>
          </div>
        </div>
      </div>

      {/* Input Box */}
      <div className="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-white/10">
        <textarea
          rows={3}
          placeholder="Write an observational note (e.g. Learner communicated clearly during AI interaction)..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="w-full bg-slate-950/80 border border-white/10 rounded-xl p-3 text-white placeholder-slate-400 text-sm outline-none focus:border-indigo-400"
        />

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="bg-slate-800 text-slate-200 text-xs font-bold px-3 py-2 rounded-xl border border-white/10 outline-none"
          >
            <option value="Focus Observation">Focus Observation</option>
            <option value="Communication Milestone">Communication Milestone</option>
            <option value="Emotional Regulation">Emotional Regulation</option>
            <option value="General Remark">General Remark</option>
          </select>

          <button
            onClick={handleAddNote}
            disabled={!newNote.trim()}
            className="glass-btn-primary px-4 py-2 rounded-xl text-white font-extrabold text-xs flex items-center gap-2 shadow-lg disabled:opacity-50"
          >
            <Plus size={15} /> Save Observation
          </button>
        </div>
      </div>

      {/* Recorded Journal Feed */}
      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {notes.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-slate-900/40 border border-white/10 backdrop-blur-md flex items-start justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-extrabold text-indigo-300 px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30">
                  {item.tag}
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Calendar size={12} /> {item.date}
                </span>
              </div>
              <p className="text-slate-200 text-sm leading-relaxed font-normal pt-1">
                {item.text}
              </p>
            </div>

            <button
              onClick={() => handleDelete(item.id)}
              className="text-slate-500 hover:text-red-400 transition p-1"
              title="Delete Note"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CaregiverJournal;
