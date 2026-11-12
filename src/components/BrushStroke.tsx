/**
 * Full-bleed painted brush stroke. The visible stroke is drawn by
 * animations.ts with a scroll-scrubbed stroke-dashoffset, so it paints
 * forward as the user scrolls down and retracts as they scroll back up.
 * A faint "ghost" copy of the path stays visible as the track.
 */
export type BrushVariant = "story" | "founder" | "event" | "community";

const BRUSH_PATHS: Record<BrushVariant, string> = {
  // Sweeps in from the left, loops once right of centre, exits low right.
  story:
    "M-60 90 C160 60 320 140 470 250 C560 316 640 330 700 290 C770 244 790 160 730 120 C664 76 590 130 600 210 C612 300 720 380 860 410 C1040 450 1220 470 1500 620",
  // Enters from the right, loops behind the portrait, exits low left.
  founder:
    "M1500 80 C1300 70 1120 150 980 230 C860 300 760 300 700 250 C640 200 660 120 730 110 C800 100 830 190 780 260 C700 370 480 400 300 470 C160 524 60 590 -60 660",
  // S-curve with a small loop beside the event copy.
  event:
    "M-60 140 C220 40 420 120 520 260 C610 386 760 450 900 380 C1010 326 1020 200 940 170 C860 140 820 240 880 320 C960 420 1180 470 1500 520",
  // Right-to-left sweep behind the sign-up form.
  community:
    "M1500 120 C1240 200 1080 120 920 200 C780 270 800 400 680 440 C560 480 460 380 520 320 C580 260 660 330 620 420 C570 530 300 600 -60 640",
};

export function BrushStroke({ variant }: { variant: BrushVariant }) {
  const d = BRUSH_PATHS[variant];

  return (
    <div className={`brush brush-${variant}`} aria-hidden="true">
      <svg viewBox="0 0 1440 700" preserveAspectRatio="none" fill="none">
        <path className="brush-ghost" d={d} />
        <path className="brush-paint" d={d} />
        <path className="brush-bristle" d={d} transform="translate(0 -10)" />
        <path className="brush-bristle brush-bristle-alt" d={d} transform="translate(4 11)" />
      </svg>
    </div>
  );
}
