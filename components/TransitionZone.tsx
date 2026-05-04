"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Atmospheric breath between two storytelling sections.
 * Pure #050505 base, with a soft matcha-green radial aura that fades
 * in and out as the user scrolls through. The glow never touches a
 * canvas image — both stories paint #050505 backgrounds, so the void
 * bleeds seamlessly into this zone on either side.
 */
export default function TransitionZone() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Glow lifecycle: fades in, peaks across the middle, fades out
  const glowOpacity = useTransform(
    scrollYProgress,
    [0.1, 0.4, 0.7, 0.95],
    [0, 1, 1, 0]
  );
  const glowScale = useTransform(
    scrollYProgress,
    [0.1, 0.5, 0.95],
    [0.85, 1.1, 0.85]
  );

  // Typography lifecycle: appears only in the heart of the zone
  const typeOpacity = useTransform(
    scrollYProgress,
    [0.3, 0.45, 0.6, 0.78],
    [0, 1, 1, 0]
  );
  const typeY = useTransform(
    scrollYProgress,
    [0.3, 0.45, 0.6, 0.78],
    [24, 0, 0, -24]
  );

  return (
    <section
      ref={ref}
      className="relative h-[80vh] w-full overflow-hidden bg-[#050505]"
      aria-label="Interlude"
    >
      {/* Deep matcha aura — large blurred disc, never touches the edges */}
      <motion.div
        style={{ opacity: glowOpacity, scale: glowScale }}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      >
        <div className="h-[80vmin] w-[80vmin] rounded-full bg-[#3D6E4E] opacity-40 blur-[140px]" />
      </motion.div>

      {/* Inner brighter core for depth */}
      <motion.div
        style={{ opacity: glowOpacity, scale: glowScale }}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      >
        <div className="h-[40vmin] w-[40vmin] rounded-full bg-[#7CA982] opacity-25 blur-[100px]" />
      </motion.div>

      {/* Subtle noise overlay to prevent gradient banding */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
        aria-hidden="true"
      />

      {/* Top + bottom safety fades — keep edges firmly #050505 so the
          handoff with each canvas is invisible */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[20vh] bg-gradient-to-b from-[#050505] to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[20vh] bg-gradient-to-t from-[#050505] to-transparent"
        aria-hidden="true"
      />

      {/* Typography — quiet, centered */}
      <motion.div
        style={{ opacity: typeOpacity, y: typeY }}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
      >
        <h3
          className="text-5xl font-light text-white/75 md:text-6xl"
          style={{
            fontFamily:
              "'Hiragino Mincho ProN', 'Yu Mincho', 'YuMincho', 'Noto Serif JP', serif",
            letterSpacing: "0.15em",
          }}
        >
          茶の湯
        </h3>
        <p className="mt-5 text-[10px] uppercase tracking-[0.45em] text-white/40">
          The Way of Tea
        </p>
        <p className="mt-8 max-w-md text-sm italic tracking-tight text-white/55 md:text-base">
          Between every storm, a stillness.
        </p>
      </motion.div>
    </section>
  );
}
