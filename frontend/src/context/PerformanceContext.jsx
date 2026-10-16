import { createContext, useState, useEffect } from "react";

export const PerformanceContext = createContext();

export function PerformanceProvider({ children }) {
  // Scenarios/Settings:
  // Background: FULL (default), LIGHT, OFF
  const [backgroundMode, setBackgroundMode] = useState(() => {
    const saved = localStorage.getItem("bg_mode");
    return saved && saved !== "OFF" ? saved : "FULL";
  });

  // Reduced Motion mode: default false, check system media query
  const [reducedMotion, setReducedMotion] = useState(() => {
    const saved = localStorage.getItem("reduced_motion");
    if (saved !== null) return saved === "true";
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  // Master Animation toggle
  const [animationsEnabled, setAnimationsEnabled] = useState(() => {
    const saved = localStorage.getItem("anim_enabled");
    return saved !== null ? saved === "true" : true;
  });

  useEffect(() => {
    localStorage.setItem("bg_mode", backgroundMode);
  }, [backgroundMode]);

  useEffect(() => {
    localStorage.setItem("reduced_motion", reducedMotion);
    if (reducedMotion) {
      document.body.classList.add("reduced-motion");
    } else {
      document.body.classList.remove("reduced-motion");
    }
  }, [reducedMotion]);

  useEffect(() => {
    localStorage.setItem("anim_enabled", animationsEnabled);
  }, [animationsEnabled]);

  return (
    <PerformanceContext.Provider
      value={{
        backgroundMode,
        setBackgroundMode,
        reducedMotion,
        setReducedMotion,
        animationsEnabled,
        setAnimationsEnabled,
      }}
    >
      {children}
    </PerformanceContext.Provider>
  );
}
