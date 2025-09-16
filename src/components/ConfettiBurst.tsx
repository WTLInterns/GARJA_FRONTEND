"use client";

import React, { useEffect, useRef } from "react";

/**
 * Lightweight canvas confetti/glitter burst.
 * Usage:
 *   <ConfettiBurst play={playConfetti} onDone={() => setPlayConfetti(false)} />
 */
export default function ConfettiBurst({ play, onDone, duration = 1000, enableSound = true, soundVariant = 'sparkle' }: {
  play: boolean;
  onDone?: () => void;
  duration?: number; // ms
  enableSound?: boolean;
  soundVariant?: 'sparkle' | 'celebrate';
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const playedRef = useRef<boolean>(false);

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
      // Responsive particle count (reduced for performance)
      const area = window.innerWidth * window.innerHeight;
      const base = area < 400_000 ? 50 : area < 900_000 ? 80 : 110;
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
          life: 0.9,
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

      // gravity and fade (faster fade for fewer frames)
      particles.forEach(p => {
        p.vy += 0.15;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.012;
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
      // Sound: trigger once per burst
      if (enableSound && !playedRef.current) {
        // Try to create or resume AudioContext (may require user gesture in some browsers)
        try {
          if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
          }
          const ac = audioCtxRef.current;
          // If context is suspended, try resume
          if (ac.state === 'suspended') {
            ac.resume().catch(() => {});
          }

          // Create a short "pop + sparkle" using an oscillator and noise burst
          const now = ac.currentTime;

          // Variant-based sound design
          if (soundVariant === 'celebrate') {
            // Brighter chime: two detuned sine blips + gentle noise
            const o1 = ac.createOscillator();
            const o2 = ac.createOscillator();
            const g = ac.createGain();
            o1.type = 'sine';
            o2.type = 'sine';
            o1.frequency.setValueAtTime(660, now);
            o2.frequency.setValueAtTime(880, now);
            o2.detune.setValueAtTime(+10, now);
            g.gain.setValueAtTime(0.0001, now);
            g.gain.exponentialRampToValueAtTime(0.5, now + 0.01);
            g.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
            o1.connect(g);
            o2.connect(g);
            g.connect(ac.destination);
            o1.start(now);
            o2.start(now);
            o1.stop(now + 0.36);
            o2.stop(now + 0.36);

            // Soft sparkle tail
            const bufferSize = ac.sampleRate * 0.25;
            const noiseBuffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
            const data = noiseBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.35;
            const noise = ac.createBufferSource();
            noise.buffer = noiseBuffer;
            const hp = ac.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1200;
            const ng = ac.createGain();
            ng.gain.setValueAtTime(0.001, now);
            ng.gain.exponentialRampToValueAtTime(0.18, now + 0.02);
            ng.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            noise.connect(hp).connect(ng).connect(ac.destination);
            noise.start(now + 0.02);
            noise.stop(now + 0.32);
          } else {
            // Default 'sparkle' (triangle pop + filtered noise)
            const osc = ac.createOscillator();
            const gain = ac.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(120, now + 0.15);
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(0.4, now + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
            osc.connect(gain).connect(ac.destination);
            osc.start(now);
            osc.stop(now + 0.2);

            const bufferSize = ac.sampleRate * 0.2; // 200ms
            const noiseBuffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
            const data = noiseBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
            const noise = ac.createBufferSource();
            noise.buffer = noiseBuffer;
            const noiseFilter = ac.createBiquadFilter();
            noiseFilter.type = 'highpass';
            noiseFilter.frequency.value = 1000;
            const noiseGain = ac.createGain();
            noiseGain.gain.setValueAtTime(0.001, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.25, now + 0.01);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
            noise.connect(noiseFilter).connect(noiseGain).connect(ac.destination);
            noise.start(now);
            noise.stop(now + 0.2);
          }

          playedRef.current = true;
          // Reset after a tick so subsequent plays can trigger again
          setTimeout(() => { playedRef.current = false; }, duration + 100);
        } catch (e) {
          // Fail silently if audio cannot play (autoplay policies)
        }
      }
      spawn();
      rafRef.current = requestAnimationFrame(step);
    }

    return () => {
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [play, duration, onDone, enableSound]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 z-[9999] transition-opacity duration-100 ${play ? "opacity-100" : "opacity-0"}`}
    />
  );
}
