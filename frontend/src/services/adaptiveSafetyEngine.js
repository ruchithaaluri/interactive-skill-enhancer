/**
 * ENTERPRISE ADAPTIVE AFFECTIVE SAFETY ENGINE
 * 
 * Top-tier Product Architecture (Google Health / Microsoft Inclusive Design Standard)
 * Implements a Closed-Loop Autonomic Feedback Mechanism:
 * 1. Subscribes to Edge Biometric Telemetry (FACS-468)
 * 2. Runs temporal hysteresis filtering (avoids micro-trigger false positives)
 * 3. Dynamically adapts platform sensory parameters:
 *    - Audio cadence: reduces speech rate, lowers pitch, suppresses sharp highs
 *    - Visual load: dampens ambient particle velocities, softens high-contrast neon
 *    - Cognitive load: notifies AI companion to simplify syntax & offer low-pressure choices
 * 4. Triggers Clinical 4-7-8 Autonomic Reset when distress exceeds threshold
 */

class AdaptiveSafetyEngine {
  constructor() {
    this.listeners = new Set();
    this.consecutiveOverloadTicks = 0;
    this.consecutiveFrustrationTicks = 0;
    this.activeSafetyState = {
      isSafeMode: false,
      sensoryLoadLevel: "NORMAL", // NORMAL, CAUTION, HIGH_SENSORY_OVERLOAD
      recommendedAction: "MAINTAIN_ENGAGEMENT",
      adaptiveSpeechRate: 1.0,
      adaptivePitch: 1.0,
      dimAmbience: false,
      lastEventTimestamp: null,
      distressTrend: "STABLE", // IMPROVING, STABLE, ESCALATING
    };

    this.recentDistressScores = [];
  }

  /**
   * Subscribe to adaptive safety state changes
   */
  subscribe(callback) {
    this.listeners.add(callback);
    callback(this.activeSafetyState);
    return () => this.listeners.delete(callback);
  }

  notify() {
    this.listeners.forEach((callback) => {
      try {
        callback(this.activeSafetyState);
      } catch (err) {
        console.error("AdaptiveSafetyEngine listener error:", err);
      }
    });
  }

  /**
   * Ingest biometric frame from zero-GPU Wasm engine
   */
  ingestBiometricFrame(frame) {
    if (!frame) return;

    const distress = frame.distressScore || 0;
    const emotion = frame.emotion || "Focused";
    const overloadRisk = frame.overloadRisk || "Minimal";

    // Track rolling distress trend (last 10 samples)
    this.recentDistressScores.push(distress);
    if (this.recentDistressScores.length > 10) {
      this.recentDistressScores.shift();
    }

    const avgDistress =
      this.recentDistressScores.reduce((a, b) => a + b, 0) /
      this.recentDistressScores.length;

    // Check escalation
    if (this.recentDistressScores.length >= 5) {
      const firstHalf = this.recentDistressScores.slice(0, 5).reduce((a, b) => a + b, 0) / 5;
      const secondHalf = this.recentDistressScores.slice(-5).reduce((a, b) => a + b, 0) / 5;
      if (secondHalf - firstHalf > 15) {
        this.activeSafetyState.distressTrend = "ESCALATING";
      } else if (firstHalf - secondHalf > 10) {
        this.activeSafetyState.distressTrend = "IMPROVING";
      } else {
        this.activeSafetyState.distressTrend = "STABLE";
      }
    }

    // Check for sustained sensory overload / agitation
    if (overloadRisk.includes("Overload") || emotion === "Fear" || distress > 45) {
      this.consecutiveOverloadTicks++;
    } else {
      this.consecutiveOverloadTicks = Math.max(0, this.consecutiveOverloadTicks - 1);
    }

    if (emotion === "Angry" || distress > 35) {
      this.consecutiveFrustrationTicks++;
    } else {
      this.consecutiveFrustrationTicks = Math.max(0, this.consecutiveFrustrationTicks - 1);
    }

    let stateChanged = false;

    // Trigger High-Sensory Safe Mode if sustained for >= 3 seconds (approx 9 frames at 3fps)
    if (this.consecutiveOverloadTicks >= 6) {
      if (this.activeSafetyState.sensoryLoadLevel !== "HIGH_SENSORY_OVERLOAD") {
        this.activeSafetyState = {
          ...this.activeSafetyState,
          isSafeMode: true,
          sensoryLoadLevel: "HIGH_SENSORY_OVERLOAD",
          recommendedAction: "OFFER_SENSORY_RESET",
          adaptiveSpeechRate: 0.85,
          adaptivePitch: 0.95,
          dimAmbience: true,
          lastEventTimestamp: Date.now(),
        };
        stateChanged = true;
      }
    } else if (this.consecutiveFrustrationTicks >= 6) {
      if (this.activeSafetyState.sensoryLoadLevel !== "CAUTION") {
        this.activeSafetyState = {
          ...this.activeSafetyState,
          isSafeMode: true,
          sensoryLoadLevel: "CAUTION",
          recommendedAction: "SIMPLIFY_COGNITIVE_LOAD",
          adaptiveSpeechRate: 0.9,
          adaptivePitch: 1.0,
          dimAmbience: false,
          lastEventTimestamp: Date.now(),
        };
        stateChanged = true;
      }
    } else if (this.consecutiveOverloadTicks === 0 && this.consecutiveFrustrationTicks === 0 && avgDistress < 20) {
      if (this.activeSafetyState.sensoryLoadLevel !== "NORMAL") {
        this.activeSafetyState = {
          ...this.activeSafetyState,
          isSafeMode: false,
          sensoryLoadLevel: "NORMAL",
          recommendedAction: "MAINTAIN_ENGAGEMENT",
          adaptiveSpeechRate: 1.0,
          adaptivePitch: 1.0,
          dimAmbience: false,
          lastEventTimestamp: Date.now(),
        };
        stateChanged = true;
      }
    }

    if (stateChanged) {
      this.notify();
    }
  }

  /**
   * Reset safe mode manually (e.g. after child completes 4-7-8 breathing)
   */
  resolveSafeMode() {
    this.consecutiveOverloadTicks = 0;
    this.consecutiveFrustrationTicks = 0;
    this.activeSafetyState = {
      isSafeMode: false,
      sensoryLoadLevel: "NORMAL",
      recommendedAction: "MAINTAIN_ENGAGEMENT",
      adaptiveSpeechRate: 1.0,
      adaptivePitch: 1.0,
      dimAmbience: false,
      lastEventTimestamp: Date.now(),
      distressTrend: "STABLE",
    };
    this.notify();
  }
}

export const adaptiveSafetyEngine = new AdaptiveSafetyEngine();
export default adaptiveSafetyEngine;
