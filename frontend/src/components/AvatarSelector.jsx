import { useContext } from "react";
import { AvatarContext } from "../context/AvatarContext";
import { Stethoscope, GraduationCap, Store, CheckCircle } from "lucide-react";

function AvatarSelector() {
  const { selectedAvatarId, selectAvatar, avatarConfigs } = useContext(AvatarContext);

  const avatarIcons = {
    doctor: <Stethoscope size={18} />,
    teacher: <GraduationCap size={18} />,
    shopkeeper: <Store size={18} />,
  };

  return (
    <div className="w-full glass-panel p-6 border border-white/15 shadow-2xl rounded-3xl space-y-4">
      <div className="text-center space-y-1">
        <h2 className="text-xs font-extrabold text-sky-400 uppercase tracking-widest">
          Interactive Learning Mentor
        </h2>
        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          CHOOSE YOUR AI MENTOR
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Select your preferred AI mentor below. Each mentor has a unique friendly personality and teaching style!
        </p>
      </div>

      {/* Selector Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        {Object.values(avatarConfigs).map((av) => {
          const isSelected = selectedAvatarId === av.id;

          return (
            <button
              key={av.id}
              onClick={() => selectAvatar(av.id)}
              className={`relative flex flex-col items-center p-4 rounded-2xl border transition-all duration-300 group outline-none ${
                isSelected
                  ? "bg-slate-900/90 border-sky-400 ring-2 ring-sky-400/40 shadow-xl scale-[1.02]"
                  : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/50"
              }`}
            >
              {/* Active Selection Badge */}
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 text-sky-400 bg-sky-500/20 rounded-full p-1 border border-sky-400/40">
                  <CheckCircle size={14} />
                </div>
              )}

              {/* Avatar Preview Thumbnail */}
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white/20 mb-3 shadow-md group-hover:scale-105 transition-transform">
                <img
                  src={av.image}
                  alt={av.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Name & Title */}
              <div className="text-center space-y-0.5">
                <div className="text-sm font-extrabold text-white flex items-center justify-center gap-1.5">
                  {avatarIcons[av.id]}
                  <span>{av.name}</span>
                </div>
                <div className="text-[11px] font-semibold text-slate-400">
                  {av.role}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default AvatarSelector;
