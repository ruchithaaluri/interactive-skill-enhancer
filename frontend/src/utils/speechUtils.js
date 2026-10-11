/**
 * Persona-specific Voice Configuration Architecture
 * Map each persona profile to distinct pitch, rate, gender, and preferred browser TTS voice names.
 */

export const PERSONA_VOICE_PROFILES = {
  doctor: {
    gender: "female",
    pitch: 1.12,
    rate: 0.95,
    preferredNames: ["zira", "samantha", "victoria", "hazel", "eva", "female"]
  },
  teacher: {
    gender: "female",
    pitch: 1.18,
    rate: 0.92,
    preferredNames: ["hazel", "eva", "karen", "susan", "zira", "female"]
  },
  friend: {
    gender: "male",
    pitch: 0.88,
    rate: 1.0,
    preferredNames: ["david", "mark", "alex", "george", "james", "male", "guy"]
  },
  colleague: {
    gender: "male",
    pitch: 0.84,
    rate: 0.98,
    preferredNames: ["george", "james", "richard", "david", "mark", "male"]
  },
  counsellor: {
    gender: "female",
    pitch: 1.05,
    rate: 0.88,
    preferredNames: ["fiona", "samantha", "zira", "hazel", "female"]
  },
  shopkeeper: {
    gender: "male",
    pitch: 0.86,
    rate: 1.02,
    preferredNames: ["mark", "david", "george", "alex", "male"]
  },
  tutor: {
    gender: "male",
    pitch: 0.88,
    rate: 0.95,
    preferredNames: ["alex", "james", "david", "mark", "male"]
  },
  mentor: {
    gender: "female",
    pitch: 1.10,
    rate: 0.92,
    preferredNames: ["victoria", "zira", "samantha", "female"]
  },
  guide: {
    gender: "female",
    pitch: 1.15,
    rate: 0.94,
    preferredNames: ["zira", "samantha", "hazel", "eva", "female"]
  },
  support: {
    gender: "male",
    pitch: 0.85,
    rate: 0.98,
    preferredNames: ["david", "alex", "mark", "george", "male"]
  }
};

export function getAvatarVoice(avatarId = "doctor", gender = "female") {
  if (!("speechSynthesis" in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const profile = PERSONA_VOICE_PROFILES[avatarId] || {
    gender: gender === "male" ? "male" : "female",
    preferredNames: gender === "male"
      ? ["david", "mark", "alex", "george", "james", "male"]
      : ["zira", "samantha", "hazel", "victoria", "eva", "female"]
  };

  const isMale = profile.gender === "male";
  const targetKeywords = profile.preferredNames;

  // 1. Strict gender-matched voice search
  let selectedVoice = voices.find((v) => {
    const name = v.name.toLowerCase();
    const lang = v.lang.toLowerCase();
    if (!lang.startsWith("en")) return false;

    if (isMale) {
      // Must not match female markers
      if (name.includes("zira") || name.includes("female") || name.includes("samantha") || name.includes("hazel") || name.includes("victoria")) {
        return false;
      }
      return targetKeywords.some((kw) => name.includes(kw));
    } else {
      // Must not match male markers
      if (name.includes("david") || name.includes("male") || name.includes("george") || name.includes("mark")) {
        return false;
      }
      return targetKeywords.some((kw) => name.includes(kw));
    }
  });

  // 2. Broad search with gender exclusion
  if (!selectedVoice) {
    selectedVoice = voices.find((v) => {
      const name = v.name.toLowerCase();
      if (isMale) {
        return (
          (name.includes("david") || name.includes("male") || name.includes("george") || name.includes("alex") || name.includes("mark")) &&
          !name.includes("female") && !name.includes("zira")
        );
      } else {
        return (
          (name.includes("zira") || name.includes("female") || name.includes("samantha") || name.includes("hazel")) &&
          !name.includes("male") && !name.includes("david")
        );
      }
    });
  }

  // 3. Fallback to any English voice
  if (!selectedVoice) {
    selectedVoice = voices.find((v) => v.lang.toLowerCase().startsWith("en"));
  }

  return selectedVoice || voices[0];
}

/**
 * Speak text aloud using selected AI Companion's configured voice profile
 */
export function speakWithAvatarVoice(text, avatarOrGender = "doctor", onStartCallback, onEndCallback) {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  // Strip markdown formatting symbols for clean speech
  const cleanText = text.replace(/[\*\_\[\]\`\#]/g, "").trim();
  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);

  // Retrieve persona voice profile
  let avatarId = "doctor";
  let fallbackGender = "female";

  if (typeof avatarOrGender === "string") {
    const lower = avatarOrGender.toLowerCase();
    if (PERSONA_VOICE_PROFILES[lower]) {
      avatarId = lower;
      fallbackGender = PERSONA_VOICE_PROFILES[lower].gender;
    } else if (lower === "male" || lower === "female") {
      fallbackGender = lower;
      avatarId = lower === "male" ? "friend" : "doctor";
    }
  }

  const profile = PERSONA_VOICE_PROFILES[avatarId] || {
    gender: fallbackGender,
    pitch: fallbackGender === "male" ? 0.85 : 1.15,
    rate: 0.95
  };

  const isMale = profile.gender === "male";
  // Pitch modulation ensures male voices sound unmistakably deep/masculine and female voices sound bright/feminine
  const basePitch = isMale ? 0.82 : 1.18;
  const userRate = window.ttsRate || parseFloat(localStorage.getItem("tts_speed_override")) || profile.rate;
  utterance.rate = userRate;
  utterance.pitch = basePitch;

  const voice = getAvatarVoice(avatarId, profile.gender);
  if (voice) {
    utterance.voice = voice;
  }

  if (onStartCallback) {
    utterance.onstart = () => onStartCallback();
  }
  if (onEndCallback) {
    utterance.onend = () => onEndCallback();
    utterance.onerror = () => onEndCallback();
  }

  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      const refreshedVoice = getAvatarVoice(avatarId, profile.gender);
      if (refreshedVoice) utterance.voice = refreshedVoice;
      window.speechSynthesis.speak(utterance);
    };
  } else {
    window.speechSynthesis.speak(utterance);
  }
}

export function speakWithFemaleVoice(text, onStartCallback, onEndCallback) {
  return speakWithAvatarVoice(text, "doctor", onStartCallback, onEndCallback);
}

