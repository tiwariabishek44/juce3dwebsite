import MatchaCanvasAnimation, {
  type Beat,
} from "@/components/MatchaCanvasAnimation";
import TransitionZone from "@/components/TransitionZone";

const FRAME_COUNT = 160;
const FRAME_SUFFIX = ".jpg";
const FRAME_PADDING = 3;
const FRAME_PREFIX = "/sequence/ezgif-frame-";

const story1Beats: Beat[] = [
  {
    id: "a",
    range: [0, 0.02, 0.18, 0.2],
    align: "center",
    eyebrow: "Phase 01",
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
    eyebrow: "Phase 04 · Taste it now",
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
    eyebrow: "Phase 08 · Find a cafe",
    title: "LIVE\nTHE RITUAL",
    subtitle: "Find your nearest Matcha Cafe.",
    cta: { label: "Locate", href: "#locate" },
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen bg-void text-white">
      <a href="#order" className="skip-link">
        Skip cinematic
      </a>

      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-6 md:px-12">
        <span className="text-xs uppercase tracking-[0.35em] text-white/70">
          Matcha Cafe
        </span>
        <span className="text-xs uppercase tracking-[0.35em] text-white/40">
          Iced Latte
        </span>
      </header>

      {/* Story 1 — The Eruption */}
      <MatchaCanvasAnimation
        id="story-eruption"
        frameCount={FRAME_COUNT}
        framePrefix={FRAME_PREFIX}
        frameSuffix={FRAME_SUFFIX}
        framePadding={FRAME_PADDING}
        beats={story1Beats}
        scrollHeightVh={600}
        showScrollCue
      />

      {/* Atmospheric breath — matcha aura between scenes */}
      <TransitionZone />

      {/* Story 2 — The Stillness (Slogan A) */}
      <MatchaCanvasAnimation
        id="story-stillness"
        frameCount={FRAME_COUNT}
        framePrefix={FRAME_PREFIX}
        frameSuffix={FRAME_SUFFIX}
        framePadding={FRAME_PADDING}
        beats={story2Beats}
        scrollHeightVh={600}
        lazyLoad
        showScrollCue={false}
      />

      <section
        id="order"
        className="relative z-10 border-t border-white/5 bg-void px-6 py-24 md:px-12 md:py-32"
        aria-labelledby="order-heading"
      >
        <div className="mx-auto flex max-w-4xl flex-col items-start gap-6">
          <span className="text-[10px] uppercase tracking-[0.4em] text-matcha-light">
            Order
          </span>
          <h2
            id="order-heading"
            className="text-4xl font-semibold leading-[0.95] tracking-tight text-white/90 md:text-6xl"
          >
            Bring the ritual home.
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-white/55 md:text-base">
            Whisked-to-order. Delivered cold. Reach out and we&apos;ll route
            your first iced latte to a cafe near you.
          </p>
          <a
            href="mailto:hello@matchacafe.example?subject=Order%20Inquiry"
            className="mt-4 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/[0.03] px-8 py-3 text-[11px] uppercase tracking-[0.3em] text-white/90 transition-all duration-300 hover:border-white/50 hover:bg-white/10"
          >
            <span>Place an order</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <section
        id="locate"
        className="relative z-10 border-t border-white/5 bg-void px-6 py-24 md:px-12 md:py-32"
        aria-labelledby="locate-heading"
      >
        <div className="mx-auto flex max-w-4xl flex-col items-start gap-6">
          <span className="text-[10px] uppercase tracking-[0.4em] text-matcha-light">
            Locate
          </span>
          <h2
            id="locate-heading"
            className="text-4xl font-semibold leading-[0.95] tracking-tight text-white/90 md:text-6xl"
          >
            Find your nearest cafe.
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-white/55 md:text-base">
            We&apos;re opening cafes in select cities. Ask us where to find the
            ritual closest to you.
          </p>
          <a
            href="mailto:hello@matchacafe.example?subject=Locate%20Inquiry"
            className="mt-4 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/[0.03] px-8 py-3 text-[11px] uppercase tracking-[0.3em] text-white/90 transition-all duration-300 hover:border-white/50 hover:bg-white/10"
          >
            <span>Get directions</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/5 bg-void px-6 py-12 md:px-12">
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
