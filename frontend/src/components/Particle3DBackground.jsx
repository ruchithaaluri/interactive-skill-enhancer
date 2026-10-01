import { useEffect, useRef } from "react";

/**
 * Interactive 3D Animated Particle Background Component
 * Inspired by Particle Saturn, Scroll Wave Field, Light Cables, and Spiral Vortex aesthetics.
 * Uses lightweight HTML5 Canvas 2D/3D mathematics for high-performance glowing visuals.
 */
export function Particle3DBackground({ mode = "waves", theme = "cyan" }) {
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

    // Color palette selector based on theme
    const getThemeColors = () => {
      switch (theme) {
        case "amber":
        case "gold":
        case "saturn":
          return { primary: "rgba(245, 158, 11, ", secondary: "rgba(217, 119, 6, " };
        case "emerald":
        case "green":
          return { primary: "rgba(16, 185, 129, ", secondary: "rgba(5, 150, 105, " };
        case "purple":
        case "violet":
          return { primary: "rgba(168, 85, 247, ", secondary: "rgba(147, 51, 234, " };
        case "rose":
          return { primary: "rgba(244, 63, 94, ", secondary: "rgba(225, 29, 72, " };
        case "indigo":
          return { primary: "rgba(99, 102, 241, ", secondary: "rgba(79, 70, 229, " };
        case "teal":
          return { primary: "rgba(20, 184, 166, ", secondary: "rgba(13, 148, 136, " };
        case "sky":
        case "cyan":
        default:
          return { primary: "rgba(56, 189, 248, ", secondary: "rgba(2, 132, 199, " };
      }
    };

    const colors = getThemeColors();

    // Generate Particles for Wave / Ring / Saturn field
    const particleCount = mode === "saturn" ? 220 : 160;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      if (mode === "saturn") {
        // 3D Saturn Ring Particles
        const angle = Math.random() * Math.PI * 2;
        const radius = 120 + Math.random() * 160;
        particles.push({
          angle,
          radius,
          speed: 0.003 + Math.random() * 0.005,
          yOffset: (Math.random() - 0.5) * 35,
          size: 1 + Math.random() * 2.2,
          alpha: 0.3 + Math.random() * 0.7
        });
      } else {
        // Wave Field Grid Particles
        particles.push({
          x: (i % 25) * (width / 24) - width * 0.1,
          z: Math.floor(i / 25) * 20,
          baseY: height * 0.65 + (i / particleCount) * 120,
          speed: 0.02 + Math.random() * 0.02,
          phase: Math.random() * Math.PI * 2,
          size: 1.2 + Math.random() * 2,
          alpha: 0.2 + Math.random() * 0.6
        });
      }
    }

    let time = 0;

    const render = () => {
      if (document.visibilityState !== "visible") {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Render Mode A: Saturn Particle Ring & Planet Glow
      if (mode === "saturn") {
        const centerX = width * 0.5;
        const centerY = height * 0.45;

        // Central Planet Soft Radial Glow
        const radGrad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, 140);
        radGrad.addColorStop(0, colors.primary + "0.35)");
        radGrad.addColorStop(0.6, colors.secondary + "0.15)");
        radGrad.addColorStop(1, "rgba(2, 6, 23, 0)");

        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 140, 0, Math.PI * 2);
        ctx.fill();

        // Planet Sphere Wireframe Core
        ctx.strokeStyle = colors.primary + "0.25)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 65, 0, Math.PI * 2);
        ctx.stroke();

        // Render Orbiting Ring Particles
        particles.forEach((p) => {
          p.angle += p.speed;

          // 3D Isometric projection math for tilted Saturn Ring
          const tiltFactor = 0.38;
          const rx = Math.cos(p.angle) * p.radius;
          const ry = Math.sin(p.angle) * p.radius * tiltFactor + p.yOffset;

          const px = centerX + rx;
          const py = centerY + ry;

          // Depth sorting scale
          const scale = 0.7 + (ry / (p.radius * tiltFactor + 40)) * 0.5;

          ctx.fillStyle = colors.primary + `${p.alpha * scale})`;
          ctx.beginPath();
          ctx.arc(px, py, Math.max(0.5, p.size * scale), 0, Math.PI * 2);
          ctx.fill();

          // Connect nearby particles with subtle light cables
          particles.forEach((p2) => {
            const rx2 = Math.cos(p2.angle) * p2.radius;
            const ry2 = Math.sin(p2.angle) * p2.radius * tiltFactor + p2.yOffset;
            const distSq = (rx - rx2) ** 2 + (ry - ry2) ** 2;

            if (distSq < 1200) {
              ctx.strokeStyle = colors.primary + `${0.12 * (1 - distSq / 1200)})`;
              ctx.lineWidth = 0.6;
              ctx.beginPath();
              ctx.moveTo(px, py);
              ctx.lineTo(centerX + rx2, centerY + ry2);
              ctx.stroke();
            }
          });
        });
      } else {
        // Render Mode B: Flowing Scroll Wave Field Grid
        const stepX = width / 30;

        for (let xIndex = 0; xIndex < 35; xIndex++) {
          const x = (xIndex - 2) * stepX;

          for (let zIndex = 0; zIndex < 12; zIndex++) {
            const waveY =
              Math.sin(time + xIndex * 0.2 + zIndex * 0.3) * 25 +
              Math.cos(time * 0.8 + xIndex * 0.15) * 15;

            const py = height * 0.7 + zIndex * 18 + waveY;
            const px = x + (zIndex * 12 - 60);

            const alpha = Math.max(0.05, (1 - zIndex / 12) * 0.45);
            ctx.fillStyle = colors.primary + `${alpha})`;
            ctx.beginPath();
            ctx.arc(px, py, 1.8 + (1 - zIndex / 12) * 1.5, 0, Math.PI * 2);
            ctx.fill();

            // Connect horizontal wave field light cables
            if (xIndex > 0) {
              const prevWaveY =
                Math.sin(time + (xIndex - 1) * 0.2 + zIndex * 0.3) * 25 +
                Math.cos(time * 0.8 + (xIndex - 1) * 0.15) * 15;
              const prevPx = (xIndex - 3) * stepX + (zIndex * 12 - 60);
              const prevPy = height * 0.7 + zIndex * 18 + prevWaveY;

              ctx.strokeStyle = colors.primary + `${alpha * 0.4})`;
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(px, py);
              ctx.lineTo(prevPx, prevPy);
              ctx.stroke();
            }
          }
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
      className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-80 transition-opacity duration-700"
    />
  );
}

export default Particle3DBackground;
