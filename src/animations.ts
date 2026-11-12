import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);
// Don't re-measure when the mobile address bar shows/hides — avoids scroll jumps.
ScrollTrigger.config({ ignoreMobileResize: true });

const EASE_OUT = "expo.out";
const ICON_SHAPES = "path, circle, rect, line, polyline, polygon, ellipse";

/* ------------------------------------------------------------------ */
/* Smooth scroll                                                       */
/* ------------------------------------------------------------------ */

/** Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync. */
export function initSmoothScroll() {
  const lenis = new Lenis({
    // Continuous interpolation toward the target: lower = silkier glide.
    lerp: 0.075,
    smoothWheel: true,
    // Slightly shorter wheel steps so each flick glides rather than jumps.
    wheelMultiplier: 0.85,
    // Touch keeps the device's native momentum, which already feels smooth.
    touchMultiplier: 1.4,
    // Menu links glide with a gentle ease-in-out.
    anchors: {
      offset: -12,
      duration: 1.8,
      easing: (t: number) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2),
    },
    autoRaf: false,
  });

  lenis.on("scroll", ScrollTrigger.update);
  const tick = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    gsap.ticker.lagSmoothing(500, 33);
    lenis.destroy();
  };
}

/* ------------------------------------------------------------------ */
/* Fly in / fly out                                                    */
/* ------------------------------------------------------------------ */

type FlyState = { x: number; y: number; scale: number; rotationX: number };

/**
 * Offset an element sits at while hidden. `exitTop` is used when it has
 * scrolled off the top of the screen, so it flies out upward instead.
 */
function flyState(el: Element, exitTop = false): FlyState {
  const type = (el as HTMLElement).dataset.fly || "up";
  const state: FlyState = { x: 0, y: 0, scale: 1, rotationX: 0 };

  if (type === "left") state.x = -80;
  else if (type === "right") state.x = 80;
  else if (type === "scale") Object.assign(state, { scale: 0.88, y: 40 });
  else if (type === "card") Object.assign(state, { y: 90, rotationX: -22 });
  else if (type !== "fade") state.y = 60;

  if (exitTop) {
    state.y = type === "left" || type === "right" ? 0 : -50;
    state.rotationX = 0;
  }
  return state;
}

const hiddenVars = (exitTop = false): gsap.TweenVars => ({
  autoAlpha: 0,
  x: (_: number, el: Element) => flyState(el, exitTop).x,
  y: (_: number, el: Element) => flyState(el, exitTop).y,
  scale: (_: number, el: Element) => flyState(el, exitTop).scale,
  rotationX: (_: number, el: Element) => flyState(el, exitTop).rotationX,
});

function initFly() {
  const items = gsap.utils.toArray<HTMLElement>("[data-fly]");
  if (!items.length) return;

  gsap.set(items, { ...hiddenVars(), transformOrigin: "50% 100%" });

  const flyIn = (batch: Element[]) =>
    gsap.to(batch, {
      autoAlpha: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotationX: 0,
      duration: 1,
      ease: EASE_OUT,
      stagger: 0.1,
      overwrite: true,
    });

  const flyOut = (exitTop: boolean) => (batch: Element[]) =>
    gsap.to(batch, {
      ...hiddenVars(exitTop),
      duration: 0.55,
      ease: "power2.in",
      stagger: 0.04,
      overwrite: true,
    });

  ScrollTrigger.batch(items, {
    start: "top 88%",
    end: "bottom 8%",
    onEnter: flyIn,
    onEnterBack: flyIn,
    onLeave: flyOut(true),
    onLeaveBack: flyOut(false),
  });
}

/* ------------------------------------------------------------------ */
/* Brush strokes                                                       */
/* ------------------------------------------------------------------ */

/** Scroll-scrubbed: paints forward on scroll down, retracts on scroll up. */
function initBrushes() {
  gsap.utils.toArray<HTMLElement>(".brush").forEach((brush) => {
    const strokes = brush.querySelectorAll<SVGPathElement>(".brush-paint, .brush-bristle");
    strokes.forEach((path) => {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: `${length} ${length + 10}`, strokeDashoffset: length });
    });

    const [paint, ...bristles] = strokes;
    gsap
      .timeline({
        defaults: { ease: "none", strokeDashoffset: 0 },
        scrollTrigger: {
          trigger: brush,
          start: "top 85%",
          end: "bottom 35%",
          scrub: 0.9,
        },
      })
      .to(paint, { duration: 1 }, 0)
      // Bristles trail the main stroke slightly, like a dry brush edge.
      .to(bristles, { duration: 1, stagger: 0.04 }, 0.06);
  });
}

/* ------------------------------------------------------------------ */
/* Text reveals                                                        */
/* ------------------------------------------------------------------ */

function initSplitHeadings() {
  gsap.utils.toArray<HTMLElement>("[data-split]").forEach((heading) => {
    SplitText.create(heading, {
      type: "words",
      mask: "words",
      wordsClass: "split-word",
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.words, {
          yPercent: 115,
          rotation: 3,
          duration: 1.1,
          ease: EASE_OUT,
          stagger: 0.07,
          scrollTrigger: {
            trigger: heading,
            start: "top 86%",
            end: "bottom 6%",
            toggleActions: "play reverse play reverse",
          },
        }),
    });
  });

  // Founder statement fills in word by word as you scroll through it.
  SplitText.create(".founder-statement", {
    type: "words",
    wordsClass: "statement-word",
    autoSplit: true,
    onSplit: (self) =>
      gsap.fromTo(
        self.words,
        { opacity: 0.16 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".founder-statement",
            start: "top 88%",
            end: "bottom 55%",
            scrub: true,
          },
        },
      ),
  });
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function initHero() {
  const title = SplitText.create(".hero h1", {
    type: "words,chars",
    mask: "words",
    wordsClass: "split-word",
  });

  // Starts as the intro curtain lifts (see .intro-curtain in index.css).
  gsap
    .timeline({ delay: 0.85, defaults: { ease: EASE_OUT } })
    .from(".nav-shell", { yPercent: -160, autoAlpha: 0, duration: 1 })
    .fromTo(
      ".hero-card",
      { clipPath: "inset(100% 0% 0% 0% round 28px)" },
      { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1.4, ease: "expo.inOut" },
      0,
    )
    .from(".hero-card > img", { scale: 1.35, duration: 1.8, ease: "expo.out" }, 0.25)
    .from(title.chars, { yPercent: 115, duration: 1.2, stagger: 0.035 }, 0.2)
    .from(".hero-intro > *", { y: 30, autoAlpha: 0, duration: 1, stagger: 0.12 }, 0.6)
    .from(".hero-actions > *", { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.1 }, 0.8)
    .from(".hero-card-overlay > *", { y: 26, autoAlpha: 0, duration: 0.9, stagger: 0.1 }, 0.9)
    .from(".scroll-cue", { y: -12, autoAlpha: 0, duration: 0.8 }, 1.1);

  // Fly out as the hero scrolls away; reverses on the way back up.
  const out = { trigger: ".hero", start: "top top", end: "bottom top", scrub: true };
  gsap.to(".hero-masthead", { y: -90, opacity: 0.15, ease: "none", scrollTrigger: out });
  gsap.to(".hero-gallery", { y: 70, scale: 0.94, ease: "none", scrollTrigger: out });
  gsap.to(".hero-card > img", { yPercent: 8, ease: "none", scrollTrigger: out });
  gsap.to(".scroll-cue", { autoAlpha: 0, ease: "none", scrollTrigger: { ...out, end: "15% top" } });
}

/* ------------------------------------------------------------------ */
/* Section-specific motion                                             */
/* ------------------------------------------------------------------ */

function initSections() {
  // Founder portrait opens up and its photo drifts (parallax).
  gsap.fromTo(
    ".founder-portrait",
    { clipPath: "inset(14% 16% 14% 16% round 22px)" },
    {
      clipPath: "inset(0% 0% 0% 0% round 22px)",
      ease: "none",
      scrollTrigger: { trigger: ".founder-portrait", start: "top 92%", end: "top 35%", scrub: 1 },
    },
  );
  gsap.fromTo(
    ".founder-portrait img",
    { yPercent: -6 },
    {
      yPercent: 6,
      ease: "none",
      scrollTrigger: { trigger: ".founder-portrait", start: "top bottom", end: "bottom top", scrub: true },
    },
  );

  // Event photo parallax inside its frame.
  gsap.fromTo(
    ".event-image-wrap img",
    { yPercent: -5 },
    {
      yPercent: 5,
      ease: "none",
      scrollTrigger: { trigger: ".event-image-wrap", start: "top bottom", end: "bottom top", scrub: true },
    },
  );

  // Countdown panel grows into place.
  gsap.fromTo(
    ".countdown-panel",
    { scale: 0.86, borderRadius: 64 },
    {
      scale: 1,
      borderRadius: 24,
      ease: "none",
      scrollTrigger: { trigger: ".countdown-panel", start: "top bottom", end: "top 55%", scrub: 1 },
    },
  );
}

/* ------------------------------------------------------------------ */
/* Moments gallery                                                     */
/* ------------------------------------------------------------------ */

const DECK_TILT = [-14, 9, -5, 12, -8];

/**
 * Desktop: the section pins and the five photos start as a stacked deck in
 * the centre, then deal out into the collage as you scroll (and gather back
 * up when you scroll up). Smaller screens get a swipeable row instead.
 */
function initMoments() {
  const media = gsap.matchMedia();

  media.add("(min-width: 901px)", () => {
    const wrap = document.querySelector<HTMLElement>(".moments-photos");
    if (!wrap) return;
    const photos = gsap.utils.toArray<HTMLElement>(".moment", wrap);

    gsap
      .timeline({
        scrollTrigger: {
          trigger: ".moments",
          start: "top top",
          end: "+=160%",
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })
      .from(photos, {
        x: (_, el: HTMLElement) => wrap.offsetWidth / 2 - (el.offsetLeft + el.offsetWidth / 2),
        y: (_, el: HTMLElement) => wrap.offsetHeight / 2 - (el.offsetTop + el.offsetHeight / 2),
        rotation: (i) => DECK_TILT[i % DECK_TILT.length],
        scale: 0.78,
        duration: 1,
        ease: "power2.inOut",
        stagger: 0.07,
      })
      .from(
        ".moments-copy > *",
        { y: 50, autoAlpha: 0, duration: 0.45, stagger: 0.08, ease: "power2.out" },
        0.6,
      )
      .from(
        ".moment figcaption",
        { y: 16, scale: 0.8, autoAlpha: 0, duration: 0.3, stagger: 0.05, ease: "back.out(2)" },
        0.95,
      )
      .from(
        ".moment-sticker",
        { scale: 0, rotation: -40, autoAlpha: 0, duration: 0.3, ease: "back.out(2.5)" },
        1.1,
      )
      .to({}, { duration: 0.25 }); // short hold before the pin releases
  });

  media.add("(max-width: 900px)", () => {
    gsap.from(".moments-copy > *", {
      y: 40,
      autoAlpha: 0,
      duration: 0.9,
      stagger: 0.1,
      ease: EASE_OUT,
      scrollTrigger: { trigger: ".moments-copy", start: "top 85%", toggleActions: "play none none reverse" },
    });
    gsap.from(".moment", {
      x: 80,
      rotation: 6,
      autoAlpha: 0,
      duration: 1,
      stagger: 0.1,
      ease: EASE_OUT,
      scrollTrigger: { trigger: ".moments-photos", start: "top 88%", toggleActions: "play none none reverse" },
    });
  });

  return media;
}

/* ------------------------------------------------------------------ */
/* Footer & celebration                                                */
/* ------------------------------------------------------------------ */

/** Giant footer wordmark rises letter by letter as you reach the bottom. */
function initFooter() {
  gsap.from(".footer-wordmark span", {
    yPercent: 110,
    rotation: 8,
    ease: "power3.out",
    stagger: 0.04,
    scrollTrigger: { trigger: "footer", start: "top 90%", end: "bottom bottom", scrub: 0.8 },
  });
}

const CELEBRATE_COLORS = ["#f4b1cf", "#f7d8b0", "#ffffff", "#e98fb9", "#ffd6e8"];

/** Burst of bubbles and hearts from an element (used when someone joins). */
export function celebrate(origin: Element) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const box = origin.getBoundingClientRect();
  const cx = box.left + box.width / 2;
  const cy = box.top + box.height / 2;

  for (let i = 0; i < 28; i++) {
    const heart = i % 4 === 0;
    const piece = document.createElement("span");
    piece.className = heart ? "burst-piece burst-heart" : "burst-piece";
    if (heart) piece.textContent = "♥";
    document.body.appendChild(piece);

    const angle = gsap.utils.random(0, Math.PI * 2);
    const distance = gsap.utils.random(70, 190);
    const size = heart ? gsap.utils.random(14, 22) : gsap.utils.random(6, 14);
    gsap.set(piece, {
      left: cx,
      top: cy,
      width: size,
      height: size,
      fontSize: size,
      color: gsap.utils.random(CELEBRATE_COLORS),
      xPercent: -50,
      yPercent: -50,
      scale: 0,
    });
    gsap
      .timeline({ onComplete: () => piece.remove() })
      .to(piece, { scale: 1, duration: 0.2, ease: "back.out(3)" })
      .to(
        piece,
        {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance - 40,
          rotation: gsap.utils.random(-120, 120),
          duration: gsap.utils.random(0.9, 1.4),
          ease: "power3.out",
        },
        0,
      )
      .to(piece, { y: "+=60", opacity: 0, duration: 0.6, ease: "power1.in" }, ">-0.35");
  }
}

/* ------------------------------------------------------------------ */
/* Animated icons                                                      */
/* ------------------------------------------------------------------ */

/** Line icons marked .icon-draw sketch themselves in whenever they enter view. */
function initIconDraw() {
  const draw = (batch: Element[]) =>
    batch.forEach((icon) =>
      gsap.fromTo(
        icon.querySelectorAll(ICON_SHAPES),
        { drawSVG: "0%" },
        { drawSVG: "100%", duration: 1.3, ease: "power2.inOut", stagger: 0.15, overwrite: true },
      ),
    );

  ScrollTrigger.batch(".icon-draw", { start: "top 92%", onEnter: draw, onEnterBack: draw });
}

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

/** Underlines the nav link for the section in view (styled in CSS). */
function initActiveLinks(nav: HTMLElement) {
  nav.querySelectorAll<HTMLAnchorElement>(".nav-links a").forEach((link) => {
    const target = link.getAttribute("href");
    if (!target || !document.querySelector(target)) return;
    ScrollTrigger.create({
      trigger: target,
      // "About" also covers the Moments gallery that follows it.
      endTrigger: target === "#story" ? "#moments" : target,
      start: "top 50%",
      end: "bottom 50%",
      toggleClass: { targets: link, className: "is-active" },
    });
  });
}

function initNav(isMenuOpen: () => boolean) {
  const nav = document.querySelector<HTMLElement>(".nav-shell");
  if (!nav) return;

  // Hide while scrolling down, fly back in when scrolling up.
  let hidden = false;
  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => {
      nav.classList.toggle("nav-scrolled", self.scroll() > 40);
      const shouldHide = self.direction === 1 && self.scroll() > 320 && !isMenuOpen();
      if (shouldHide === hidden) return;
      hidden = shouldHide;
      gsap.to(nav, {
        yPercent: shouldHide ? -170 : 0,
        duration: shouldHide ? 0.45 : 0.6,
        ease: shouldHide ? "power2.in" : EASE_OUT,
        overwrite: "auto",
      });
    },
  });

  initActiveLinks(nav);

  // Reading progress bar.
  gsap.fromTo(
    ".scroll-progress",
    { scaleX: 0 },
    { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } },
  );

}

/* ------------------------------------------------------------------ */

/** Sets up every motion effect on the page. Returns a cleanup function. */
export function initAnimations(scope: HTMLElement, isMenuOpen: () => boolean) {
  const media = gsap.matchMedia();

  media.add("(prefers-reduced-motion: no-preference)", () => {
    const stopSmoothScroll = initSmoothScroll();
    let moments: gsap.MatchMedia | undefined;
    const context = gsap.context(() => {
      initHero();
      // Moments pins first so later triggers measure the added pin spacing.
      moments = initMoments();
      initNav(isMenuOpen);
      initBrushes();
      initSplitHeadings();
      initFly();
      initSections();
      initFooter();
      initIconDraw();
    }, scope);

    // Re-measure once fonts and images have settled.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      moments?.revert();
      context.revert();
      stopSmoothScroll();
    };
  });

  return () => media.revert();
}
