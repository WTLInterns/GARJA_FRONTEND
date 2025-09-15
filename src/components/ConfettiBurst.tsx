"use client";

import React, { useEffect, useRef } from "react";

/**
 * Lightweight canvas confetti/glitter burst.
 * Usage:
 *   <ConfettiBurst play={playConfetti} onDone={() => setPlayConfetti(false)} />
 */
export default function ConfettiBurst({ play, onDone, duration = 1000 }: {
  play: boolean;
  onDone?: () => void;
  duration?: number; // ms
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Array<{
      x: number; y: number; vx: number; vy: number; size: number; color: string; life: number; rot: number; vr: number;
    }> = [];

    const colors = ["#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#eab308", "#a855f7"]; // tailwind palette

    const resize = () => {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const spawn = (n?: number) => {
      // Responsive particle count
      const area = window.innerWidth * window.innerHeight;
      const base = area < 400_000 ? 80 : area < 900_000 ? 120 : 160;
      const count = n ?? base;
      particles = [];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 5 + Math.random() * 7;
        const px = window.innerWidth / 2;
        const py = window.innerHeight / 2;
        particles.push({
          x: px,
          y: py,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 4,
          size: 4 + Math.random() * 6,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 1,
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.3,
        });
      }
    };

    let startTime = 0;

    const step = (t: number) => {
      if (!startTime) startTime = t;
      const elapsed = t - startTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // gravity and fade
      particles.forEach(p => {
        p.vy += 0.15;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.008;
        p.rot += p.vr;
      });
      particles = particles.filter(p => p.life > 0);

      // draw
      particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        // draw rectangle shard
        ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66);
        ctx.restore();
      });

      if (elapsed < duration || particles.length) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        if (onDone) onDone();
      }
    };

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    if (play) {
      // spawn and render immediately for snappier UX
      spawn();
      rafRef.current = requestAnimationFrame(step);
    }

    return () => {
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [play, duration, onDone]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 z-[9999] transition-opacity duration-100 ${play ? "opacity-100" : "opacity-0"}`}
    />
  );
}
