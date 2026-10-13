import { useEffect, useRef } from "react";

/**
 * Interactive Starlight Falling Stars Background Component
 * Features realistic twinkling celestial starfield, graceful falling stardust,
 * and authentic shooting stars (meteors) with smooth glowing trails.
 * Pure lightweight HTML5 Canvas 2D (<1% CPU, 60fps).
 */
export function Particle3DBackground({ mode = "starlight", theme = "sky" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // 1. Static & Twinkling Celestial Stars
    const starCount = 140;
    const stars = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.6 + Math.random() * 1.8,
        baseAlpha: 0.2 + Math.random() * 0.6,
        twinkleSpeed: 0.02 + Math.random() * 0.04,
        twinklePhase: Math.random() * Math.PI * 2,
        isCrossStar: Math.random() > 0.88, // 12% have subtle 4-point starlight diffraction spikes
      });
    }

    // 2. Smooth Falling Stardust Particles (Continuous downward drift)
    const dustCount = 45;
    const stardust = [];
    for (let i = 0; i < dustCount; i++) {
      stardust.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speedY: 0.4 + Math.random() * 0.9, // Gentle falling speed
        speedX: -0.15 + (Math.random() - 0.5) * 0.3,
        size: 1.2 + Math.random() * 2.2,
        alpha: 0.2 + Math.random() * 0.6,
        seed: Math.random() * 100,
      });
    }

    // 3. Realistic Shooting Stars (Meteors with glowing fading tails)
    const shootingStars = [];
    let lastSpawnTime = 0;

    const createShootingStar = () => {
      // Spawn from top or top-right area
      const angle = (35 + Math.random() * 20) * (Math.PI / 180); // 35 to 55 degrees downwards
      const speed = 12 + Math.random() * 8;
      const length = 90 + Math.random() * 110;

      shootingStars.push({
        x: Math.random() * (width * 1.2) - width * 0.1,
        y: -30,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        length,
        life: 0,
        maxLife: 60 + Math.random() * 30, // Frames
        alpha: 0,
        maxAlpha: 0.85 + Math.random() * 0.15,
        thickness: 1.2 + Math.random() * 1.5,
      });
    };

    let time = 0;

    const render = () => {
      if (document.visibilityState !== "visible") {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // --- LAYER 1: Twinkling Celestial Starfield ---
      const starLen = stars.length;
      for (let i = 0; i < starLen; i++) {
        const star = stars[i];
        const twinkle = Math.sin(time * star.twinkleSpeed * 60 + star.twinklePhase);
        const currentAlpha = Math.max(0.1, Math.min(1, star.baseAlpha + twinkle * 0.35));

        // Center Star Dot
        ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();

        // Starlight Halo for brighter stars
        if (star.radius > 1.4) {
          ctx.fillStyle = `rgba(186, 230, 253, ${currentAlpha * 0.35})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // 4-Point Starlight Cross Flare for prominent stars
        if (star.isCrossStar && currentAlpha > 0.55) {
          const flareLen = star.radius * 4;
          ctx.strokeStyle = `rgba(224, 242, 254, ${currentAlpha * 0.45})`;
          ctx.lineWidth = 0.75;
          ctx.beginPath();
          ctx.moveTo(star.x - flareLen, star.y);
          ctx.lineTo(star.x + flareLen, star.y);
          ctx.moveTo(star.x, star.y - flareLen);
          ctx.lineTo(star.x, star.y + flareLen);
          ctx.stroke();
        }
      }

      // --- LAYER 2: Gracefully Falling Stardust ---
      const dustLen = stardust.length;
      for (let i = 0; i < dustLen; i++) {
        const d = stardust[i];
        d.y += d.speedY;
        d.x += d.speedX + Math.sin(time + d.seed) * 0.3;

        // Wrap around bottom to top smoothly
        if (d.y > height + 20) {
          d.y = -10;
          d.x = Math.random() * width;
        }
        if (d.x < -20) d.x = width + 10;
        if (d.x > width + 20) d.x = -10;

        // Glowing Stardust Droplet
        const rad = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.size * 2);
        rad.addColorStop(0, `rgba(255, 255, 255, ${d.alpha})`);
        rad.addColorStop(0.4, `rgba(147, 197, 253, ${d.alpha * 0.6})`);
        rad.addColorStop(1, "rgba(99, 102, 241, 0)");

        ctx.fillStyle = rad;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- LAYER 3: Realistic Shooting Stars (Meteors) ---
      // Spawn a shooting star every 2.5 - 4.5 seconds
      if (time - lastSpawnTime > 2.5 + Math.random() * 2) {
        createShootingStar();
        lastSpawnTime = time;
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.life += 1;
        s.x += s.dx;
        s.y += s.dy;

        // Fade in and fade out curve
        const progress = s.life / s.maxLife;
        if (progress < 0.2) {
          s.alpha = (progress / 0.2) * s.maxAlpha;
        } else {
          s.alpha = (1 - (progress - 0.2) / 0.8) * s.maxAlpha;
        }

        // Draw meteor trail with linear gradient
        const tailX = s.x - (s.dx / Math.hypot(s.dx, s.dy)) * s.length;
        const tailY = s.y - (s.dy / Math.hypot(s.dx, s.dy)) * s.length;

        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, "rgba(147, 197, 253, 0)");
        grad.addColorStop(0.7, `rgba(186, 230, 253, ${s.alpha * 0.5})`);
        grad.addColorStop(1, `rgba(255, 255, 255, ${s.alpha})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = s.thickness;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();

        // Glowing Star Head Flare
        const headGlow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 4.5);
        headGlow.addColorStop(0, `rgba(255, 255, 255, ${s.alpha})`);
        headGlow.addColorStop(0.5, `rgba(147, 197, 253, ${s.alpha * 0.8})`);
        headGlow.addColorStop(1, "rgba(99, 102, 241, 0)");

        ctx.fillStyle = headGlow;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 4.5, 0, Math.PI * 2);
        ctx.fill();

        // Remove dead shooting stars
        if (s.life >= s.maxLife || s.y > height + 100 || s.x > width + 100) {
          shootingStars.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [mode, theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-90 transition-opacity duration-700"
    />
  );
}

export default Particle3DBackground;
