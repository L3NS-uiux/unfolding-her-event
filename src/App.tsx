import { FormEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Arrow = ({ down = false }: { down?: boolean }) => (
  <svg
    aria-hidden="true"
    className={down ? "h-4 w-4 rotate-90" : "h-4 w-4"}
    fill="none"
    viewBox="0 0 24 24"
  >
    <path d="M5 12h14M14 6l6 6-6 6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
  </svg>
);

const Spark = () => (
  <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
    <path
      d="M12 1.5c.7 6.3 4.2 9.8 10.5 10.5-6.3.7-9.8 4.2-10.5 10.5C11.3 16.2 7.8 12.7 1.5 12 7.8 11.3 11.3 7.8 12 1.5Z"
      fill="currentColor"
    />
  </svg>
);

const EventIcon = ({ kind }: { kind: "date" | "time" | "venue" }) => {
  const paths = {
    date: (
      <>
        <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
        <path d="M7.5 3.5v3M16.5 3.5v3M4 9.5h16M8 13h2M8 16h2M14 13h2" />
      </>
    ),
    time: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7v5l3.5 2" />
      </>
    ),
    venue: (
      <>
        <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
        <circle cx="12" cy="10" r="2.2" />
      </>
    ),
  };

  return (
    <svg aria-hidden="true" className="event-detail-icon" fill="none" viewBox="0 0 24 24">
      {paths[kind]}
    </svg>
  );
};

const SocialIcon = ({ name }: { name: "whatsapp" | "instagram" | "x" | "tiktok" }) => {
  if (name === "whatsapp") {
    return (
      <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="11.5" r="7.5" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="m7 19-1 3 3.4-1.5M9.3 8.2c.5 3.3 2.2 5 5.6 5.8.6.1 1.3-.8 1.5-1.4l-2.1-1-1 1c-1.1-.5-1.9-1.3-2.4-2.4l.9-.9-1.1-2c-.6.1-1.5.4-1.4.9Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.3"
        />
      </svg>
    );
  }

  if (name === "instagram") {
    return (
      <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
        <rect
          x="3.5"
          y="3.5"
          width="17"
          height="17"
          rx="5"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="17.5" cy="6.8" r="1" fill="currentColor" />
      </svg>
    );
  }

  if (name === "x") {
    return (
      <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
        <path d="M5 4.5 18.8 20M19 4.5 5.2 20" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M14 4v10.2a4.2 4.2 0 1 1-3.6-4.1M14 4c.5 2.8 2.2 4.4 5 4.7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
};

function getNextEvent() {
  const now = new Date();
  let event = new Date(now.getFullYear(), 10, 14, 11, 0, 0);
  if (event.getTime() <= now.getTime()) event = new Date(now.getFullYear() + 1, 10, 14, 11, 0, 0);
  return event;
}

function Countdown() {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, getNextEvent().getTime() - Date.now()),
  );

  useEffect(() => {
    const timer = window.setInterval(
      () => setRemaining(Math.max(0, getNextEvent().getTime() - Date.now())),
      1000,
    );
    return () => window.clearInterval(timer);
  }, []);

  const values = [
    { label: "Days", value: Math.floor(remaining / 86_400_000) },
    { label: "Hours", value: Math.floor((remaining / 3_600_000) % 24) },
    { label: "Minutes", value: Math.floor((remaining / 60_000) % 60) },
    { label: "Seconds", value: Math.floor((remaining / 1000) % 60) },
  ];

  return (
    <div className="countdown" aria-label="Countdown to Unfolding Her">
      {values.map(({ label, value }, index) => (
        <div className="contents" key={label}>
          <div className="countdown-unit">
            <strong>{String(value).padStart(2, "0")}</strong>
            <span>{label}</span>
          </div>
          {index < values.length - 1 && <span className="countdown-colon">:</span>}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const pageRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [joined, setJoined] = useState(false);

  useLayoutEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".nav-shell", { autoAlpha: 0, y: -18, duration: 0.6 })
          .from(".hero-masthead", { autoAlpha: 0, y: 28, duration: 0.75 }, "-=0.3")
          .from(
            ".hero-gallery > *",
            {
              autoAlpha: 0,
              y: 36,
              duration: 0.7,
              stagger: 0.12,
            },
            "-=0.25",
          );

        gsap.from(".story .section-number, .story-heading, .story-body", {
          autoAlpha: 0,
          y: 34,
          duration: 0.8,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".story",
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        });

        gsap.from(".story-gallery > *", {
          autoAlpha: 0,
          y: 28,
          scale: 0.97,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".story-gallery",
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        });

        gsap.from(".founder-kicker, .founder > h2", {
          autoAlpha: 0,
          y: 30,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".founder",
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        });

        gsap.from(".founder-layout > *", {
          autoAlpha: 0,
          x: (index) => (index === 0 ? -42 : index === 2 ? 42 : 0),
          y: (index) => (index === 1 ? 28 : 0),
          duration: 0.8,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".founder-layout",
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        });

        gsap.from(".founder-statement", {
          autoAlpha: 0,
          y: 32,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".founder-statement",
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });

        gsap.from(".event-image-wrap, .event-copy", {
          autoAlpha: 0,
          x: (index) => (index === 0 ? -46 : 46),
          duration: 0.85,
          stagger: 0.16,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".event-card",
            start: "top 76%",
            toggleActions: "play none none reverse",
          },
        });

        gsap.from(".countdown-panel > *", {
          autoAlpha: 0,
          y: 26,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".countdown-panel",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });

        gsap.from(".community-copy, .community-form-wrap", {
          autoAlpha: 0,
          x: (index) => (index === 0 ? -38 : 38),
          duration: 0.8,
          stagger: 0.16,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".community",
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        });

        page
          .querySelectorAll<SVGPathElement>(".transition-brush-path, .transition-brush-detail")
          .forEach((path) => {
            const length = path.getTotalLength();
            gsap.set(path, {
              strokeDasharray: length,
              strokeDashoffset: length,
            });
            gsap.to(path, {
              strokeDashoffset: 0,
              ease: "none",
              scrollTrigger: {
                trigger: ".story",
                start: "top 95%",
                end: "top 15%",
                scrub: 0.7,
              },
            });
          });
      }, page);

      return () => context.revert();
    });

    return () => media.revert();
  }, []);

  const submitCommunityForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setJoined(true);
    event.currentTarget.reset();
  };

  return (
    <main ref={pageRef}>
      <nav className="nav-shell" aria-label="Main navigation">
        <a className="brand" href="#home" aria-label="Hadassah 31 home">
          <span className="brand-flame">♢</span>
          <span>Hadassah 31</span>
        </a>

        <button
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          className={`menu-toggle ${menuOpen ? "menu-open" : ""}`}
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          <span />
          <span />
        </button>

        <div className={`nav-links ${menuOpen ? "nav-open" : ""}`} id="site-navigation">
          <a href="#story" onClick={() => setMenuOpen(false)}>
            About
          </a>
          <a href="#event" onClick={() => setMenuOpen(false)}>
            Programs
          </a>
          <a href="#experience" onClick={() => setMenuOpen(false)}>
            Founder
          </a>
          <a href="#community" onClick={() => setMenuOpen(false)}>
            Contact
          </a>
        </div>

        <a className="button button-small nav-cta" href="#community">
          <span className="nav-cta-label">Join us</span>
          <span className="nav-cta-label-mobile">Join us</span>
          <Arrow />
        </a>
      </nav>

      <section className="hero" id="home">
        <div className="hero-layout">
          <header className="hero-masthead">
            <p className="eyebrow">
              <span /> A community for women becoming
            </p>
            <h1>
              Unfolding <em>Her</em>
            </h1>
            <div className="hero-intro">
              <p>Unlearning. Relearning. Becoming.</p>
              <span>
                A welcoming space to find your voice, grow at your own pace, and become who you
                already have the potential to be.
              </span>
            </div>
            <div className="hero-actions">
              <a className="button hero-cta" href="#community">
                Find your circle <Arrow />
              </a>
              <a className="hero-secondary" href="#story">
                Get to know us <Arrow />
              </a>
            </div>
          </header>

          <div className="hero-gallery">
            <article className="hero-card hero-card-photo hero-card-women">
              <img
                src="https://images.unsplash.com/photo-1655720357872-ce227e4164ba?auto=format&fit=crop&w=1200&q=85"
                alt="A joyful group of women learning together around a laptop"
              />
              <div className="hero-card-overlay">
                <span>Growing together</span>
                <h2>Community changes what feels possible.</h2>
                <a href="#event">
                  See the next gathering <Arrow />
                </a>
              </div>
              <small>Photo by Iwaria Inc. / Unsplash</small>
            </article>
          </div>
        </div>
      </section>

      <section className="story section-shell" id="story">
        <svg
          aria-hidden="true"
          className="transition-brush"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 1440 420"
        >
          <path
            className="transition-brush-path"
            d="M-70 40 C170 85 315 230 505 250 C665 267 650 75 785 98 C930 123 875 278 1030 316 C1180 354 1325 338 1510 405"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="58"
          />
          <path
            className="transition-brush-detail"
            d="M-70 40 C170 85 315 230 505 250 C665 267 650 75 785 98 C930 123 875 278 1030 316 C1180 354 1325 338 1510 405"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="12"
          />
        </svg>
        <div className="section-number">/ 01</div>
        <div className="story-heading">
          <p className="eyebrow eyebrow-dark">
            <span /> Why we gather
          </p>
          <h2>
            There is more
            <br />
            inside <em>her.</em>
          </h2>
        </div>
        <div className="story-body">
          <p className="lead">
            Hadassah 31 is a women-led community built on a simple belief: when a woman is seen,
            supported, and stretched, everything around her changes.
          </p>
          <p>
            Unfolding Her is an invitation to pause the performance and reconnect with the woman
            underneath it all. Through honest conversation, practical mentorship, and collective
            courage, we make room for the next version of ourselves.
          </p>
          <a className="text-link dark-link" href="#community">
            Meet the community <Arrow />
          </a>
        </div>
        <div className="story-gallery" role="group" aria-label="Moments from our community">
          <figure className="story-photo story-photo-circle">
            <figcaption>
              <span className="story-photo-kicker">Our community</span>
              <strong>Room to belong, just as you are.</strong>
              <p>A warm circle where every woman is seen, supported, and welcome.</p>
            </figcaption>
            <img
              src="/images/community-circle.jpg"
              alt="Women gathered in a circle, smiling down into the camera"
            />
          </figure>
          <figure className="story-photo story-photo-workshop story-photo-image-only">
            <img
              src="/images/community-workshop.jpg"
              alt="A woman listening and taking notes during a workshop"
            />
          </figure>
          <figure className="story-photo story-photo-friends story-photo-image-only">
            <img src="/images/community-friends.jpg" alt="Two friends sharing a joyful moment" />
          </figure>
          <figure className="story-photo story-photo-sisterhood story-photo-image-only">
            <img
              src="/images/community-sisterhood.jpg"
              alt="Women standing together outdoors in colorful prints"
            />
          </figure>
          <figure className="story-photo story-photo-gathering">
            <figcaption>
              <span className="story-photo-kicker">Make memories</span>
              <strong>Come as you are. Leave more connected.</strong>
              <p>Shared moments become the beginning of something beautiful.</p>
            </figcaption>
            <img
              src="/images/community-gathering.jpg"
              alt="A group of women celebrating together"
            />
          </figure>
        </div>
      </section>

      <section className="experience" id="experience">
        <div className="founder section-shell">
          <p className="founder-kicker">The woman behind the vision</p>
          <h2>About the founder</h2>
          <div className="founder-layout">
            <div className="founder-copy founder-copy-left">
              <p>
                Maureen Okey is the convener behind Hadassah 31—a community created to help women
                grow in confidence, connection, and purpose.
              </p>
              <p>
                Her vision for Unfolding Her is rooted in making room for honest stories and the
                brave work of becoming.
              </p>
            </div>

            <div className="founder-portrait">
              <img src="/images/maureen-okey.png" alt="Maureen Okey, founder of Hadassah 31" />
            </div>

            <div className="founder-copy founder-copy-right">
              <span>Founder & Convener</span>
              <h3>Maureen Okey</h3>
              <p>
                Through mentorship, shared learning, and meaningful gatherings, she is building a
                circle where every woman can feel seen, supported, and equipped for her next
                chapter.
              </p>
              <a className="text-link" href="#community">
                Join her community <Arrow />
              </a>
            </div>
          </div>
          <div className="founder-statement-wrap">
            <p className="founder-statement">
              WITH HER, WOMEN ARE SEEN,
              <br />
              SUPPORTED & SET IN MOTION.
            </p>
          </div>
        </div>
      </section>

      <section className="event-section" id="event">
        <div className="event-card section-shell">
          <div className="event-image-wrap">
            <img
              src="/images/women-tech-event.png"
              alt="Women sharing ideas during a panel conversation at a community event"
            />
            <span className="image-caption">Women in conversation / Community in motion</span>
          </div>
          <div className="event-copy">
            <p className="eyebrow eyebrow-dark">
              <span /> Coming up
            </p>
            <div className="event-title">
              <h2>
                Your next chapter
                <br />
                has a date.
              </h2>
            </div>
            <p className="event-dek">
              Join convener <strong>Maureen Okey</strong> for the Hadassah 31 community launch—a
              morning of unlearning, relearning, and becoming.
            </p>
            <div className="event-details">
              <div>
                <EventIcon kind="date" />
                <span>Date</span>
                <strong>November 14</strong>
              </div>
              <div>
                <EventIcon kind="time" />
                <span>Time</span>
                <strong>11:00 AM</strong>
              </div>
              <div>
                <EventIcon kind="venue" />
                <span>Venue</span>
                <strong>Lorin Innovation Hub</strong>
              </div>
            </div>
            <a className="button button-dark" href="#community">
              Reserve your place <Arrow />
            </a>
          </div>
        </div>

        <div className="countdown-panel section-shell">
          <div>
            <p className="eyebrow">
              <span /> Until we gather
            </p>
            <p className="countdown-note">The next November 14 gathering begins at 11:00 AM.</p>
          </div>
          <Countdown />
        </div>
      </section>

      <section className="community section-shell" id="community">
        <div className="community-copy">
          <p className="eyebrow">
            <span /> Stay in the circle
          </p>
          <h2>
            Keep
            <br />
            <em>unfolding.</em>
          </h2>
          <p>
            Join a growing circle of women choosing courage, community, and conscious growth. Get
            first access to gatherings, mentorship conversations, and community news.
          </p>
        </div>
        <div className="community-form-wrap">
          {joined ? (
            <div className="success-message" role="status">
              <Spark />
              <h3>You’re in the circle.</h3>
              <p>Thank you for joining. We’re glad you’re here.</p>
              <button className="text-link" onClick={() => setJoined(false)} type="button">
                Add another person <Arrow />
              </button>
            </div>
          ) : (
            <form onSubmit={submitCommunityForm}>
              <label>
                Your name
                <input name="name" placeholder="How should we call you?" required />
              </label>
              <label>
                Email address
                <input name="email" placeholder="you@example.com" required type="email" />
              </label>
              <button className="button button-light" type="submit">
                Join the community <Arrow />
              </button>
              <small>By joining, you agree to receive community updates from Hadassah 31.</small>
            </form>
          )}
          <div className="social-community">
            <div className="social-community-heading">
              <span>Or find your circle online</span>
              <small>Community links coming soon</small>
            </div>
            <div className="social-list" aria-label="Upcoming community social channels">
              {[
                ["whatsapp", "WhatsApp"],
                ["instagram", "Instagram"],
                ["x", "X / Twitter"],
                ["tiktok", "TikTok"],
              ].map(([icon, label]) => (
                <div className="social-item" key={icon}>
                  <SocialIcon name={icon as "whatsapp" | "instagram" | "x" | "tiktok"} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer>
        <a className="brand" href="#home">
          <span className="brand-flame">♢</span>
          <span>Hadassah 31</span>
        </a>
        <p>Empowerment · Growth · Women’s Mentorship</p>
        <a className="back-top" href="#home">
          Back to top <span>↑</span>
        </a>
      </footer>
    </main>
  );
}
