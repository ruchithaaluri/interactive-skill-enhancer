import { useContext } from "react";
import { AvatarContext } from "../context/AvatarContext";
import {
  Stethoscope,
  GraduationCap,
  Store,
  CheckCircle,
  HeartHandshake,
  Briefcase,
  Heart,
  BookOpen,
  Compass
} from "lucide-react";

function AvatarSelector() {
  const { selectedAvatarId, selectAvatar, avatarConfigs } = useContext(AvatarContext);

  const avatarIcons = {
    doctor: <Stethoscope size={16} />,
    teacher: <GraduationCap size={16} />,
    friend: <HeartHandshake size={16} />,
    colleague: <Briefcase size={16} />,
    counsellor: <Heart size={16} />,
    shopkeeper: <Store size={16} />,
    tutor: <BookOpen size={16} />,
    mentor: <Compass size={16} />,
  };

  return (
    <div className="w-full glass-panel p-5 border border-white/15 shadow-2xl rounded-3xl space-y-4">
      <div className="text-center space-y-1">
        <h2 className="text-xs font-extrabold text-sky-400 uppercase tracking-widest">
          Personal AI Companion
        </h2>
        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Choose Your AI Companion
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Who would you like to talk to today? Select an AI companion to guide your conversation and learning.
        </p>
      </div>

      {/* Selector Cards Grid (2 cols on mobile, 4 cols on desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
        {Object.values(avatarConfigs).map((av) => {
          const isSelected = selectedAvatarId === av.id;

          return (
            <button
              key={av.id}
              onClick={() => selectAvatar(av.id)}
              className={`relative flex flex-col items-center p-3.5 rounded-2xl border transition-all duration-300 group outline-none text-left ${
                isSelected
                  ? "bg-slate-900/90 border-sky-400 ring-2 ring-sky-400/40 shadow-xl scale-[1.02]"
                  : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/50"
              }`}
            >
              {/* Active Selection Badge */}
              {isSelected && (
                <div className="absolute top-2 right-2 text-sky-400 bg-sky-500/20 rounded-full p-1 border border-sky-400/40">
                  <CheckCircle size={14} />
                </div>
              )}

              {/* Avatar Preview Thumbnail */}
              <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden border-2 border-white/20 mb-2.5 shadow-md group-hover:scale-105 transition-transform">
                <img
                  src={av.image}
                  alt={av.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Name & Title */}
              <div className="text-center space-y-0.5 w-full">
                <div className="text-xs sm:text-sm font-extrabold text-white flex items-center justify-center gap-1.5 truncate">
                  {avatarIcons[av.id]}
                  <span className="truncate">{av.name}</span>
                </div>
                <div className="text-[11px] font-semibold text-slate-400 truncate">
                  {av.role}
                </div>
                <div className="text-[10px] text-slate-500 font-medium truncate pt-0.5">
                  {av.subtitle}
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

