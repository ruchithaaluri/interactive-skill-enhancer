import { Sparkles, Volume2, Mic, Brain, CheckCircle2, Heart, Trophy, Info } from "lucide-react";
import doctorAvatarImg from "../assets/doctor-avatar.png";

function DoctorAvatar({ avatarState = "IDLE", isSpeaking = false }) {
  // Map avatarState to visual glow and indicator styles
  const getStateConfig = (state) => {
    switch (state) {
      case "SPEAKING":
        return {
          glowClass: "avatar-speaking-glow border-sky-400",
          badgeBg: "bg-sky-500/20 border-sky-400/40 text-sky-300",
          label: "Dr. Mentor is Speaking",
          icon: <Volume2 size={15} className="animate-pulse" />,
        };
      case "LISTENING":
        return {
          glowClass: "avatar-listening-glow border-emerald-400",
          badgeBg: "bg-emerald-500/20 border-emerald-400/40 text-emerald-300",
          label: "Dr. Mentor is Listening...",
          icon: <Mic size={15} className="animate-pulse" />,
        };
      case "THINKING":
        return {
          glowClass: "avatar-thinking-glow border-purple-400",
          badgeBg: "bg-purple-500/20 border-purple-400/40 text-purple-300",
          label: "Thinking & Synthesizing...",
          icon: <Brain size={15} className="animate-spin" />,
        };
      case "CORRECT":
        return {
          glowClass: "avatar-correct-glow border-green-400",
          badgeBg: "bg-green-500/20 border-green-400/40 text-green-300",
          label: "Great Job! That's Correct!",
          icon: <CheckCircle2 size={15} />,
        };
      case "ENCOURAGING":
        return {
          glowClass: "avatar-correct-glow border-amber-400",
          badgeBg: "bg-amber-500/20 border-amber-400/40 text-amber-300",
          label: "You're Doing Great! Keep Going!",
          icon: <Sparkles size={15} />,
        };
      case "INCORRECT_SUPPORT":
        return {
          glowClass: "avatar-listening-glow border-teal-400",
          badgeBg: "bg-teal-500/20 border-teal-400/40 text-teal-300",
          label: "That's Okay! Let's Try Together",
          icon: <Heart size={15} />,
        };
      case "QUIZ_COMPLETE":
        return {
          glowClass: "avatar-correct-glow border-purple-400",
          badgeBg: "bg-purple-500/20 border-purple-400/40 text-purple-300",
          label: "Quiz Completed! Outstanding Effort!",
          icon: <Trophy size={15} />,
        };
      case "IDLE":
      default:
        return {
          glowClass: "border-slate-700/80 shadow-2xl",
          badgeBg: "bg-slate-800/80 border-slate-700 text-slate-300",
          label: "Dr. Mentor — Ready to Help",
          icon: <Sparkles size={15} className="text-sky-400" />,
        };
    }
  };

  const currentConfig = getStateConfig(avatarState);
  const activeSpeaking = avatarState === "SPEAKING" || isSpeaking;

  return (
    <div className="relative w-full flex flex-col items-center justify-center p-4">
      {/* Outer Glow & Framing Container */}
      <div className={`relative w-full max-w-md rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900/90 to-slate-950/95 border transition-all duration-500 shadow-2xl flex flex-col items-center ${currentConfig.glowClass}`}>
        
        {/* Upper Body Realistic Doctor Image Presentation */}
        <div className="relative w-full h-[360px] sm:h-[400px] flex items-center justify-center overflow-hidden bg-slate-950/60 group">
          {/* Subtle Background Radial Glow */}
          <div className="absolute inset-0 bg-radial from-sky-500/10 via-transparent to-transparent opacity-60 pointer-events-none" />

          {/* Doctor Image with Subtle Breathing & State Micro-Animations */}
          <img
            src={doctorAvatarImg}
            alt="Dr. Mentor - Realistic Female AI Doctor"
            className={`w-full h-full object-cover object-top transition-transform duration-700 ${
              activeSpeaking ? "animate-avatar-breath scale-[1.02]" : "animate-avatar-breath"
            }`}
          />

          {/* Subtle Top & Bottom Gradient Vignettes for Conversational Framing */}
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-slate-950/80 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none" />

          {/* Audio Wave Equalizer Bar Overlay when Speaking */}
          {activeSpeaking && (
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-sky-400/50 backdrop-blur-md flex items-center gap-2 shadow-lg z-10">
              <span className="text-[11px] font-extrabold text-sky-300 uppercase tracking-wider">Speech Sync</span>
              <div className="flex items-center gap-1">
                <span className="equalizer-bar" style={{ animationDelay: '0s' }}></span>
                <span className="equalizer-bar" style={{ animationDelay: '0.2s' }}></span>
                <span className="equalizer-bar" style={{ animationDelay: '0.4s' }}></span>
                <span className="equalizer-bar" style={{ animationDelay: '0.1s' }}></span>
                <span className="equalizer-bar" style={{ animationDelay: '0.3s' }}></span>
              </div>
            </div>
          )}

          {/* State Badge Banner Overlay at Bottom */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 w-[90%] flex items-center justify-center">
            <div
              className={`px-4 py-2 rounded-2xl border backdrop-blur-md font-extrabold text-xs flex items-center gap-2 shadow-xl transition-all duration-300 ${currentConfig.badgeBg}`}
            >
              {currentConfig.icon}
              <span>{currentConfig.label}</span>
            </div>
          </div>
        </div>

        {/* Doctor Title Card Info */}
        <div className="w-full p-4 bg-slate-900/90 border-t border-slate-800 text-center space-y-1">
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center justify-center gap-2">
            Dr. Mentor
            <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 font-semibold">
              AI Medical Mentor
            </span>
          </h3>
          <p className="text-xs text-slate-400 font-normal">
            Friendly Virtual Doctor • Autism-Supportive Assistant
          </p>
        </div>
      </div>

      {/* Technical Pipeline Notice (Explicit Requirement #5) */}
      <div className="mt-3 max-w-md w-full px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 text-[11px] leading-relaxed flex items-start gap-2">
        <Info size={14} className="text-sky-400 shrink-0 mt-0.5" />
        <span>
          <strong>Technical Note:</strong> Static image avatar is implemented, but true facial lip-sync is not yet implemented because the current project does not contain a compatible facial-animation pipeline.
        </span>
      </div>
    </div>
  );
}

export default DoctorAvatar;
