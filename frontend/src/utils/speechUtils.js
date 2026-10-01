/**
 * Persona-specific Voice Configuration Architecture
 * Map each persona profile to distinct pitch, rate, gender, and preferred browser TTS voice names.
 */

export const PERSONA_VOICE_PROFILES = {
  doctor: {
    gender: "female",
    pitch: 1.05,
    rate: 0.95,
    preferredNames: ["zira", "samantha", "victoria", "google us english", "female"]
  },
  teacher: {
    gender: "female",
    pitch: 1.1,
    rate: 0.92,
    preferredNames: ["hazel", "eva", "karen", "susan", "zira", "female"]
  },
  friend: {
    gender: "male",
    pitch: 1.15,
    rate: 1.0,
    preferredNames: ["alex", "david", "mark", "google us english male", "male"]
  },
  colleague: {
    gender: "male",
    pitch: 0.95,
    rate: 0.98,
    preferredNames: ["george", "james", "richard", "david", "male"]
  },
  counsellor: {
    gender: "female",
    pitch: 0.95,
    rate: 0.88,
    preferredNames: ["fiona", "samantha", "zira", "hazel", "female"]
  },
  shopkeeper: {
    gender: "male",
    pitch: 1.0,
    rate: 1.02,
    preferredNames: ["mark", "david", "google uk english male", "male"]
  },
  tutor: {
    gender: "male",
    pitch: 1.05,
    rate: 0.95,
    preferredNames: ["alex", "james", "david", "male"]
  },
  mentor: {
    gender: "female",
    pitch: 0.9,
    rate: 0.9,
    preferredNames: ["victoria", "zira", "samantha", "female"]
  }
};

export function getAvatarVoice(avatarId = "doctor", gender = "female") {
  if (!("speechSynthesis" in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const profile = PERSONA_VOICE_PROFILES[avatarId] || {
    gender,
    preferredNames: gender === "male" ? ["david", "mark", "alex", "male"] : ["zira", "samantha", "hazel", "female"]
  };

  const targetKeywords = profile.preferredNames;

  // 1. Search for English voice matching persona preferred names
  let selectedVoice = voices.find((v) => {
    const name = v.name.toLowerCase();
    const lang = v.lang.toLowerCase();
    return (
      lang.startsWith("en") &&
      targetKeywords.some((kw) => name.includes(kw))
    );
  });

  // 2. Search for any voice matching target keywords regardless of language tag
  if (!selectedVoice) {
    selectedVoice = voices.find((v) =>
      targetKeywords.some((kw) => v.name.toLowerCase().includes(kw))
    );
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
  const avatarId = typeof avatarOrGender === "string" && PERSONA_VOICE_PROFILES[avatarOrGender.toLowerCase()]
    ? avatarOrGender.toLowerCase()
    : "doctor";

  const profile = PERSONA_VOICE_PROFILES[avatarId] || {
    gender: avatarOrGender === "male" ? "male" : "female",
    pitch: 1.0,
    rate: 0.95
  };

  const userRate = window.ttsRate || parseFloat(localStorage.getItem("tts_speed_override")) || profile.rate;
  utterance.rate = userRate;
  utterance.pitch = profile.pitch;

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

