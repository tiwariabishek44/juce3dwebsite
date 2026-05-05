"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

export type BeatAlign = "center" | "left" | "right";

export type Beat = {
  id: string;
  /** [fadeIn-start, fadeIn-end, fadeOut-start, fadeOut-end] in 0-1 of section scroll */
  range: [number, number, number, number];
  align: BeatAlign;
  eyebrow?: string;
  /** Use \n for line breaks */
  title: string;
  subtitle: string;
  cta?: { label: string; href: string };
};

type Props = {
  frameCount: number;
  /** URL prefix before the zero-padded frame index, e.g. "/sequence/ezgif-frame-" */
  framePrefix: string;
  /** Suffix after the index, e.g. ".jpg". Defaults to ".jpg". */
  frameSuffix?: string;
  /** Zero-padding for the frame index. Defaults to 3 (so "001"). */
  framePadding?: number;
  /** First frame index (most sequences start at 1). Defaults to 1. */
  frameStart?: number;
  beats: Beat[];
  /** Total scroll height of the wrapper (in vh). Defaults to 400. */
  scrollHeightVh?: number;
  /** If true, defer preloading until the section is approaching the viewport. */
  lazyLoad?: boolean;
  /** Show "Scroll to Explore" cue at section start (only meaningful for the first story). */
  showScrollCue?: boolean;
  /** Optional id for accessibility / analytics. */
  id?: string;
};

/** Stride for priority preload — first wave loads every Nth frame so the
 *  user can begin scrolling before the full set arrives. Remaining frames
 *  fill in over the background. */
const PRIORITY_STRIDE = 4;

export default function MatchaCanvasAnimation({
  frameCount,
  framePrefix,
  frameSuffix = ".jpg",
  framePadding = 3,
  frameStart = 1,
  beats,
  scrollHeightVh = 400,
  lazyLoad = false,
  showScrollCue = true,
  id,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const lastDrawnFrame = useRef<number>(-1);

  const [shouldPreload, setShouldPreload] = useState(!lazyLoad);
  const [loadedCount, setLoadedCount] = useState(0);
  const [ready, setReady] = useState(false);

  // Raw scroll drives the canvas — no spring. The previous useSpring
  // smoothing introduced 120-200 ms of input lag that read as "scroll
  // and visuals out of sync." With img.decode() pre-decoding all frames
  // and rAF-coalesced draws, raw scroll is the buttery path. The CSS
  // global prefers-reduced-motion rule still kills the scroll-cue
  // animation for users who opted out.
  const { scrollYProgress: progress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Trigger preload when the section nears the viewport (lazyLoad mode).
  // Tightened rootMargin so Story 2 doesn't fetch while the user is still
  // ingesting Story 1.
  useEffect(() => {
    if (!lazyLoad) return;
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldPreload(true);
          obs.disconnect();
        }
      },
      { rootMargin: "50% 0px 50% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [lazyLoad]);

  // Staged preload: priority frames (every Nth) first → mark ready as soon
  // as those complete so the user can start scrolling. Remaining frames
  // fill in the background; un-loaded frames are skipped by the draw guard.
  useEffect(() => {
    if (!shouldPreload) return;
    let cancelled = false;
    const images: HTMLImageElement[] = new Array(frameCount);
    let totalLoaded = 0;

    const buildSrc = (i: number) =>
      `${framePrefix}${String(frameStart + i).padStart(framePadding, "0")}${frameSuffix}`;

    const loadIndices = (
      indices: number[],
      priority: "high" | "low",
      onWaveDone?: () => void
    ) => {
      let waveLoaded = 0;
      const waveSize = indices.length;
      if (waveSize === 0) {
        onWaveDone?.();
        return;
      }
      indices.forEach((i) => {
        const img = new Image();
        img.decoding = "async";
        // fetchPriority is standard on HTMLImageElement; lib types lag.
        (img as unknown as { fetchPriority?: string }).fetchPriority = priority;
        const tick = () => {
          if (cancelled) return;
          totalLoaded += 1;
          setLoadedCount(totalLoaded);
          waveLoaded += 1;
          if (waveLoaded === waveSize) onWaveDone?.();
        };
        img.src = buildSrc(i);
        images[i] = img;
        // img.decode() resolves only when the bitmap is fully decoded
        // and ready for drawImage — no stutter on first paint of a
        // new frame. Falls back to onload semantics on rejection.
        img
          .decode()
          .then(tick)
          .catch(tick);
      });
    };

    const priorityIdx: number[] = [];
    const restIdx: number[] = [];
    for (let i = 0; i < frameCount; i++) {
      if (i % PRIORITY_STRIDE === 0) priorityIdx.push(i);
      else restIdx.push(i);
    }

    imagesRef.current = images;

    loadIndices(priorityIdx, "high", () => {
      if (cancelled) return;
      setReady(true);
      loadIndices(restIdx, "low");
    });

    return () => {
      cancelled = true;
      images.forEach((img) => {
        if (!img) return;
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [shouldPreload, frameCount, framePrefix, frameSuffix, framePadding, frameStart]);

  // Setup canvas + draw on scroll
  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    // Source frames are 4K (3840×2160); always rendered at viewport size.
    // High-quality smoothing prevents shimmer on the downscale path.
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const currentFrameIndex = (p: number) => {
      const clamped = Math.max(0, Math.min(1, p));
      return Math.min(frameCount - 1, Math.floor(clamped * frameCount));
    };

    const drawFrame = (idx: number) => {
      if (idx === lastDrawnFrame.current) return;
      const img = imagesRef.current[idx];
      // If the requested frame hasn't loaded yet, fall back to the nearest
      // already-loaded frame to avoid a black flash.
      const resolved =
        img && img.complete && img.naturalWidth ? img : findNearest(idx);
      if (!resolved) return;

      const w = window.innerWidth;
      const h = window.innerHeight;

      // Fill void background — any sub-pixel gaps stay seamless
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, w, h);

      // "cover" fit: fill viewport edge-to-edge, center-crop overflow
      const ir = resolved.naturalWidth / resolved.naturalHeight;
      const cr = w / h;
      let dw: number;
      let dh: number;
      if (ir > cr) {
        dh = h;
        dw = h * ir;
      } else {
        dw = w;
        dh = w / ir;
      }
      const dx = (w - dw) / 2;
      const dy = (h - dh) / 2;

      ctx.drawImage(resolved, dx, dy, dw, dh);
      lastDrawnFrame.current = idx;
    };

    const findNearest = (idx: number): HTMLImageElement | null => {
      const list = imagesRef.current;
      for (let r = 1; r < frameCount; r++) {
        const lo = list[idx - r];
        if (lo && lo.complete && lo.naturalWidth) return lo;
        const hi = list[idx + r];
        if (hi && hi.complete && hi.naturalWidth) return hi;
      }
      return null;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lastDrawnFrame.current = -1;
      drawFrame(currentFrameIndex(progress.get()));
    };

    resize();

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    };

    let rafId = 0;
    const unsub = progress.on("change", (p) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        drawFrame(currentFrameIndex(p));
        rafId = 0;
      });
    });

    window.addEventListener("resize", onResize);

    return () => {
      unsub();
      window.removeEventListener("resize", onResize);
      if (resizeTimer) clearTimeout(resizeTimer);
      if (rafId) cancelAnimationFrame(rafId);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [ready, progress, frameCount]);

  // Scroll cue — driven by smoothed progress for consistent easing
  const cueOpacity = useTransform(progress, [0, 0.05, 0.1], [1, 0.8, 0]);
  const cueY = useTransform(progress, [0, 0.1], [0, 12]);

  const loadingPct = Math.floor((loadedCount / frameCount) * 100);
  const showLoader = shouldPreload && !ready;

  return (
    <section
      id={id}
      ref={containerRef}
      className="relative w-full bg-void"
      style={{ height: `${scrollHeightVh}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        />

        {showLoader && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-void">
            <div className="relative mb-8 h-12 w-12">
              <span className="absolute inset-0 rounded-full border border-white/10" />
              <span className="absolute inset-0 animate-spin rounded-full border-t border-white/80" />
            </div>
            <div className="h-px w-56 overflow-hidden bg-white/10">
              <div
                className="h-full bg-white/80 transition-[width] duration-150 ease-linear"
                style={{ width: `${loadingPct}%` }}
              />
            </div>
            <p className="mt-5 text-[10px] uppercase tracking-[0.4em] text-white/40">
              Preparing the void · {loadingPct}%
            </p>
          </div>
        )}

        {beats.map((beat) => (
          <BeatOverlay key={beat.id} beat={beat} progress={progress} />
        ))}

        {showScrollCue && (
          <motion.div
            style={{ opacity: cueOpacity, y: cueY }}
            className="pointer-events-none absolute bottom-10 left-1/2 z-30 -translate-x-1/2"
          >
            <div className="flex flex-col items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.4em] text-white/50">
                Scroll to Explore
              </span>
              <span className="relative block h-8 w-px overflow-hidden bg-white/10">
                <span className="absolute inset-x-0 top-0 block h-3 animate-[scrollCue_1.6s_ease-in-out_infinite] bg-white/70" />
              </span>
            </div>
          </motion.div>
        )}
      </div>

      <style jsx>{`
        @keyframes scrollCue {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          40% {
            opacity: 1;
          }
          100% {
            transform: translateY(200%);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}

function BeatOverlay({
  beat,
  progress,
}: {
  beat: Beat;
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, beat.range, [0, 1, 1, 0]);

  const align =
    beat.align === "left"
      ? "items-start text-left"
      : beat.align === "right"
        ? "items-end text-right"
        : "items-center text-center";

  // Slightly smaller titles for CTA beats so two-line copy doesn't blow out
  const titleClass = beat.cta
    ? "text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
    : "text-6xl sm:text-7xl md:text-8xl lg:text-9xl";

  return (
    <motion.div
      style={{ opacity }}
      className={`pointer-events-none absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-16 lg:px-24 ${align}`}
    >
      {beat.eyebrow && (
        <span className="mb-4 text-[10px] uppercase tracking-[0.4em] text-white/40">
          {beat.eyebrow}
        </span>
      )}
      <h2
        className={`max-w-3xl whitespace-pre-line font-semibold leading-[0.92] tracking-tight text-white/90 ${titleClass}`}
      >
        {beat.title}
      </h2>
      <p className="mt-8 max-w-md text-sm tracking-tight text-white/60 md:text-base">
        {beat.subtitle}
      </p>
      {beat.cta && (
        <a
          href={beat.cta.href}
          className="pointer-events-auto mt-10 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/[0.03] px-8 py-3 text-[11px] uppercase tracking-[0.3em] text-white/90 backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/10"
        >
          <span>{beat.cta.label}</span>
          <span aria-hidden="true">→</span>
        </a>
      )}
    </motion.div>
  );
}
