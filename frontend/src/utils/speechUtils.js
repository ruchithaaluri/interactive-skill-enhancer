/**
 * Utility to find and select a friendly English voice (Female or Male)
 * for AI Companions (Dr. Mentor, Ms. Mentor, Alex, Sam, Taylor, Shop Mentor, Study Mentor, Morgan).
 */

export function getAvatarVoice(gender = "female") {
  if (!("speechSynthesis" in window)) return null;
  
  // Check user override setting if saved in window/localStorage
  const userGenderOverride = window.voiceGenderSetting || localStorage.getItem("voice_gender_override") || "auto";
  const effectiveGender = userGenderOverride !== "auto" ? userGenderOverride : gender;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const femaleKeywords = [
    "zira",
    "hazel",
    "eva",
    "samantha",
    "victoria",
    "karen",
    "susan",
    "fiona",
    "female",
    "google uk english female",
    "google us english"
  ];

  const maleKeywords = [
    "david",
    "mark",
    "george",
    "alex",
    "james",
    "richard",
    "male",
    "google us english male",
    "google uk english male"
  ];

  const targetKeywords = effectiveGender === "male" ? maleKeywords : femaleKeywords;

  // 1. Search for English voice matching target gender
  let selectedVoice = voices.find((v) => {
    const name = v.name.toLowerCase();
    const lang = v.lang.toLowerCase();
    return (
      lang.startsWith("en") &&
      targetKeywords.some((kw) => name.includes(kw))
    );
  });

  // 2. Search for any voice matching target keywords regardless of lang tag
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
 * Speak text aloud using selected AI Companion's friendly English Voice
 */
export function speakWithAvatarVoice(text, gender = "female", onStartCallback, onEndCallback) {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  // Strip markdown formatting symbols for clean speech
  const cleanText = text.replace(/[\*\_\[\]\`\#]/g, "").trim();
  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);

  // Apply user speech rate or default
  const userRate = window.ttsRate || parseFloat(localStorage.getItem("tts_speed_override")) || 0.95;
  utterance.rate = userRate;

  const userGenderOverride = window.voiceGenderSetting || localStorage.getItem("voice_gender_override") || "auto";
  const effectiveGender = userGenderOverride !== "auto" ? userGenderOverride : gender;

  utterance.pitch = effectiveGender === "male" ? 0.95 : 1.15; // Natural pitch for mentor gender

  const voice = getAvatarVoice(effectiveGender);
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

  // Ensure voices are loaded
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      const refreshedVoice = getAvatarVoice(effectiveGender);
      if (refreshedVoice) utterance.voice = refreshedVoice;
      window.speechSynthesis.speak(utterance);
    };
  } else {
    window.speechSynthesis.speak(utterance);
  }
}

// Backward compatibility helper
export function speakWithFemaleVoice(text, onStartCallback, onEndCallback) {
  return speakWithAvatarVoice(text, "female", onStartCallback, onEndCallback);
}

