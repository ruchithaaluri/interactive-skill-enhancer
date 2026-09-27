/**
 * Utility to find and select a friendly English female voice
 * for Dr. Mentor (Web Speech Synthesis).
 */

export function getFemaleVoice() {
  if (!("speechSynthesis" in window)) return null;
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
    "google us english",
    "microsoft zira"
  ];

  // 1. Search for English voice matching known female voice names
  let selectedVoice = voices.find((v) => {
    const name = v.name.toLowerCase();
    const lang = v.lang.toLowerCase();
    return (
      lang.startsWith("en") &&
      femaleKeywords.some((kw) => name.includes(kw))
    );
  });

  // 2. Search for any voice matching female keywords regardless of lang tag
  if (!selectedVoice) {
    selectedVoice = voices.find((v) =>
      femaleKeywords.some((kw) => v.name.toLowerCase().includes(kw))
    );
  }

  // 3. Fallback to any English voice
  if (!selectedVoice) {
    selectedVoice = voices.find((v) => v.lang.toLowerCase().startsWith("en"));
  }

  return selectedVoice || voices[0];
}

/**
 * Speak text aloud using Dr. Mentor's friendly English Female Voice
 */
export function speakWithFemaleVoice(text, onStartCallback, onEndCallback) {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  // Strip markdown formatting symbols for clean speech
  const cleanText = text.replace(/[\*\_\[\]\`\#]/g, "").trim();
  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = 0.95; // Warm, steady, patient pace
  utterance.pitch = 1.15; // Slightly higher pitch for female voice tone

  const femaleVoice = getFemaleVoice();
  if (femaleVoice) {
    utterance.voice = femaleVoice;
  }

  if (onStartCallback) {
    utterance.onstart = () => onStartCallback();
  }
  if (onEndCallback) {
    utterance.onend = () => onEndCallback();
    utterance.onerror = () => onEndCallback();
  }

  // Ensure voices are loaded (Chrome edge case workaround)
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      const refreshedVoice = getFemaleVoice();
      if (refreshedVoice) utterance.voice = refreshedVoice;
      window.speechSynthesis.speak(utterance);
    };
  } else {
    window.speechSynthesis.speak(utterance);
  }
}
