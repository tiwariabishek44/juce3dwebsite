import MatchaCanvasAnimation, {
  type Beat,
} from "@/components/MatchaCanvasAnimation";
import TransitionZone from "@/components/TransitionZone";

const FRAME_COUNT = 160;
const FRAME_SUFFIX = ".jpg";
const FRAME_PADDING = 3;
const STORY_1_PREFIX = "/sequence/ezgif-frame-";
const STORY_2_PREFIX = "/image2/ezgif-frame-";

const story1Beats: Beat[] = [
  {
    id: "a",
    range: [0, 0.02, 0.18, 0.2],
    align: "center",
    title: "CRAFTED\nPERFECTION",
    subtitle: "Hand-whisked matcha meets dynamic refreshment.",
  },
  {
    id: "b",
    range: [0.25, 0.27, 0.43, 0.45],
    align: "left",
    eyebrow: "Phase 02",
    title: "DYNAMIC\nERUPTION",
    subtitle: "Vibrant green matcha and creamy milk suspended in time.",
  },
  {
    id: "c",
    range: [0.5, 0.52, 0.68, 0.7],
    align: "right",
    eyebrow: "Phase 03",
    title: "CRYSTAL\nCHILL",
    subtitle: "Caught in a zero-gravity dance.",
  },
  {
    id: "d",
    range: [0.75, 0.77, 0.93, 0.95],
    align: "center",
    eyebrow: "Taste it now",
    title: "EXPERIENCE\nMATCHA CAFE",
    subtitle: "A hyper-realistic taste sensation.",
    cta: { label: "Order Now", href: "#order" },
  },
];

const story2Beats: Beat[] = [
  {
    id: "a",
    range: [0, 0.02, 0.18, 0.2],
    align: "center",
    eyebrow: "Phase 05",
    title: "STILLNESS\nRETURNS",
    subtitle: "The chaos settles into clarity.",
  },
  {
    id: "b",
    range: [0.25, 0.27, 0.43, 0.45],
    align: "left",
    eyebrow: "Phase 06",
    title: "EARTHEN\nDEPTH",
    subtitle: "Centuries of ceremony in every sip.",
  },
  {
    id: "c",
    range: [0.5, 0.52, 0.68, 0.7],
    align: "right",
    eyebrow: "Phase 07",
    title: "LASTING\nFOCUS",
    subtitle: "Calm energy. No crash. No noise.",
  },
  {
    id: "d",
    range: [0.75, 0.77, 0.93, 0.95],
    align: "center",
    eyebrow: "Find a cafe",
    title: "LIVE\nTHE RITUAL",
    subtitle: "Find your nearest Matcha Cafe.",
    cta: { label: "Locate", href: "#locate" },
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#050505] text-white">
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-6 md:px-12">
        <span className="text-xs uppercase tracking-[0.35em] text-white/70">
          Matcha Cafe
        </span>
        <span className="text-xs uppercase tracking-[0.35em] text-white/40">
          Iced Latte · 2026
        </span>
      </header>

      {/* Story 1 — The Eruption */}
      <MatchaCanvasAnimation
        id="story-eruption"
        frameCount={FRAME_COUNT}
        framePrefix={STORY_1_PREFIX}
        frameSuffix={FRAME_SUFFIX}
        framePadding={FRAME_PADDING}
        beats={story1Beats}
        scrollHeightVh={400}
        showScrollCue
      />

      {/* Atmospheric breath — matcha aura between scenes */}
      <TransitionZone />

      {/* Story 2 — The Stillness (Slogan A) */}
      <MatchaCanvasAnimation
        id="story-stillness"
        frameCount={FRAME_COUNT}
        framePrefix={STORY_2_PREFIX}
        frameSuffix={FRAME_SUFFIX}
        framePadding={FRAME_PADDING}
        beats={story2Beats}
        scrollHeightVh={400}
        lazyLoad
        showScrollCue={false}
      />

      <footer className="relative z-10 border-t border-white/5 bg-[#050505] px-6 py-12 md:px-12">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">
            Crafted in the void · #050505
          </p>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">
            © Matcha Cafe
          </p>
        </div>
      </footer>
    </main>
  );
}
