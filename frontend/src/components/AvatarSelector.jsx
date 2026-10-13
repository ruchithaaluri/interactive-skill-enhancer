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
  Compass,
  MapPin,
  LifeBuoy
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
    guide: <MapPin size={16} />,
    support: <LifeBuoy size={16} />,
  };

  return (
    <div className="w-full glass-panel p-5 border border-white/10 shadow-2xl rounded-3xl space-y-4">
      <div className="text-center space-y-1">
        <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
          Interactive Companions
        </h2>
        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-starlight">
          Select Your Learning Companion
        </h3>
        <p className="text-xs text-sky-200/70 max-w-md mx-auto">
          Choose a companion to guide your interactive training, speech practice, and daily skills.
        </p>
      </div>

      {/* Selector Cards Grid (2 cols on mobile, 5 cols on desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 pt-2">
        {Object.values(avatarConfigs).map((av) => {
          const isSelected = selectedAvatarId === av.id;

          return (
            <button
              key={av.id}
              onClick={() => selectAvatar(av.id)}
              className={`relative flex flex-col items-center p-3.5 rounded-2xl border transition-all duration-300 group outline-none text-left ${
                isSelected
                  ? "glass-panel bg-sky-500/15 border-cyan-400 ring-2 ring-cyan-400/50 shadow-2xl shadow-cyan-500/25 scale-[1.02]"
                  : "glass-panel bg-white/5 border-white/10 text-slate-300 hover:border-sky-400/40 hover:bg-white/10"
              }`}
            >
              {/* Active Selection Badge */}
              {isSelected && (
                <div className="absolute top-2 right-2 text-cyan-400 bg-slate-950/80 rounded-full p-1 border border-cyan-400/50 shadow-sm">
                  <CheckCircle size={14} />
                </div>
              )}

              {/* Avatar Preview Thumbnail */}
              <div className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden mb-2.5 shadow-md group-hover:scale-105 transition-transform ${
                isSelected ? "border-2 border-cyan-400 shadow-cyan-400/30" : "border-2 border-white/20"
              }`}>
                <img
                  src={av.image}
                  alt={av.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Name & Title */}
              <div className="text-center space-y-0.5 w-full">
                <div className="text-xs sm:text-sm font-bold text-white flex items-center justify-center gap-1.5 truncate">
                  <span className="text-cyan-400">{avatarIcons[av.id] || <Compass size={16} />}</span>
                  <span className="truncate">{av.name}</span>
                </div>
                <div className="text-[11px] font-medium text-slate-300 truncate">
                  {av.role}
                </div>
                <div>
                  <span className={`inline-block text-[9px] px-2 py-0.5 rounded-full font-semibold shadow-sm uppercase tracking-wider ${
                    av.gender === "male"
                      ? "bg-sky-500/15 text-sky-300 border border-sky-400/30"
                      : "bg-purple-500/15 text-purple-300 border border-purple-400/30"
                  }`}>
                    {av.gender === "male" ? "Male Companion" : "Female Companion"}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium truncate pt-0.5">
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


