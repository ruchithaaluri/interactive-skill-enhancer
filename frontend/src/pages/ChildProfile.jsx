import { useState, useEffect } from "react";
import { getProfile, updateProfile } from "../services/api";
import { User, Save, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

function ChildProfile() {
  const [child, setChild] = useState({
    name: "",
    age: "",
    gender: "",
    autismLevel: "",
    language: "English",
    parent: "",
    contact: "",
    notes: "",
    learningGoals: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const data = await getProfile();
        if (data) {
          setChild((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    setChild({
      ...child,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      await updateProfile(child);
      setMessage({ type: "success", text: "Child Profile saved successfully!" });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to save profile. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 font-medium">
        Loading profile data...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <User className="text-sky-400" size={32} />
          Learner & Child Profile
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Customize personalized learning preferences, support levels, and guardian contacts.
        </p>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-medium border ${
            message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 size={20} className="shrink-0" />
          ) : (
            <AlertCircle size={20} className="shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Learner / Child Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Alex Smith"
                value={child.name}
                onChange={handleChange}
                className="w-full p-3.5 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Age
              </label>
              <input
                type="number"
                name="age"
                placeholder="e.g. 10"
                value={child.age}
                onChange={handleChange}
                className="w-full p-3.5 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={child.gender}
                onChange={handleChange}
                className="w-full p-3.5 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-Binary">Non-Binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Support / Autism Level
              </label>
              <select
                name="autismLevel"
                value={child.autismLevel}
                onChange={handleChange}
                className="w-full p-3.5 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
              >
                <option value="">Select Level</option>
                <option value="Level 1">Level 1 - Requiring Support</option>
                <option value="Level 2">Level 2 - Substantial Support</option>
                <option value="Level 3">Level 3 - Very Substantial Support</option>
                <option value="General Learner">General Learner / Neurotypical</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Preferred Language
              </label>
              <input
                type="text"
                name="language"
                placeholder="e.g. English, Spanish"
                value={child.language}
                onChange={handleChange}
                className="w-full p-3.5 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Parent / Guardian Name
              </label>
              <input
                type="text"
                name="parent"
                placeholder="e.g. Sarah Smith"
                value={child.parent}
                onChange={handleChange}
                className="w-full p-3.5 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Emergency Contact Number
              </label>
              <input
                type="text"
                name="contact"
                placeholder="e.g. +1 (555) 000-1234"
                value={child.contact}
                onChange={handleChange}
                className="w-full p-3.5 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Learning Goals & Special Interests
              </label>
              <textarea
                rows="3"
                name="learningGoals"
                placeholder="e.g. Master Python basics, improve emotional regulation, learn 3D animation"
                value={child.learningGoals}
                onChange={handleChange}
                className="w-full p-3.5 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Medical / Behavioral Notes
              </label>
              <textarea
                rows="4"
                name="notes"
                placeholder="Additional details for educators or AI tutor customization..."
                value={child.notes}
                onChange={handleChange}
                className="w-full p-3.5 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-sky-500 hover:bg-sky-600 disabled:opacity-60 text-white font-semibold py-4 rounded-xl transition shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {saving ? "Saving Profile..." : "Save Child Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChildProfile;