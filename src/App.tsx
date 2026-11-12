import { FormEvent, useLayoutEffect, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUp,
  Calendar,
  CalendarHeart,
  CalendarPlus,
  MessagesSquare,
  Navigation,
  HandHeart,
  Heart,
  NotebookPen,
  Smile,
  Users,
  ChevronsDown,
  Clock,
  HeartHandshake,
  Hourglass,
  Mail,
  MapPin,
  MessageCircleHeart,
  PartyPopper,
  Quote,
  SendHorizontal,
  Share2,
  Sparkles,
  Sprout,
  UserRound,
} from "lucide-react";
import { BrushStroke } from "./components/BrushStroke";
import { BrandMark } from "./components/BrandMark";
import { celebrate, initAnimations } from "./animations";

const Arrow = () => <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} />;

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

const EVENT = {
  title: "UNFOLDING HER: Unlearning, Relearning & Becoming",
  venue: "Ilorin Innovation Hub",
  address: "9a Ahmadu Bello Way, Ilorin 240212, Kwara, Nigeria",
  registerUrl: "https://luma.com/0d3iaqyz",
  // 14 November, 12:00 PM – 3:00 PM West Africa Time (UTC+1), per the Luma page.
  startUtcHour: 11,
  durationHours: 3,
};

/** Next 14 November at 12:00 PM WAT, as an absolute instant (correct in any timezone). */
function getNextEvent() {
  const now = new Date();
  const at = (year: number) => new Date(Date.UTC(year, 10, 14, EVENT.startUtcHour, 0, 0));
  const event = at(now.getUTCFullYear());
  return event.getTime() > now.getTime() ? event : at(now.getUTCFullYear() + 1);
}

/** Builds an .ics invite (UTC times, so calendars convert to local) and downloads it. */
function downloadCalendarInvite() {
  const start = getNextEvent();
  const end = new Date(start.getTime() + EVENT.durationHours * 3_600_000);
  const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const escape = (text: string) => text.replace(/[,;\\]/g, (c) => `\\${c}`);
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Hadassah 31//Unfolding Her//EN",
    "BEGIN:VEVENT",
    `UID:unfolding-her-${start.getUTCFullYear()}@hadassah31`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${escape(EVENT.title)}`,
    `LOCATION:${escape(`${EVENT.venue}, ${EVENT.address}`)}`,
    `URL:${EVENT.registerUrl}`,
    `DESCRIPTION:${escape(
      `An afternoon of unlearning, relearning, and becoming with Hadassah31 Foundation. Register: ${EVENT.registerUrl}`,
    )}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  const link = Object.assign(document.createElement("a"), { href: url, download: "unfolding-her.ics" });
  link.click();
  URL.revokeObjectURL(url);
}

/** Native share sheet where supported (phones); otherwise copies the Luma link. */
async function shareInvite(): Promise<"shared" | "copied" | "failed"> {
  const data = {
    title: EVENT.title,
    text: "Join me at Unfolding Her by Hadassah31 Foundation, 14 November in Ilorin. Register here:",
    url: EVENT.registerUrl,
  };
  try {
    if (navigator.share) {
      await navigator.share(data);
      return "shared";
    }
    await navigator.clipboard.writeText(`${data.text} ${data.url}`);
    return "copied";
  } catch (error) {
    // Dismissing the share sheet is not a failure.
    if (error instanceof DOMException && error.name === "AbortError") return "shared";
    return "failed";
  }
}

/** Each digit rolls up when it changes (the inner key remounts the span). */
function RollingNumber({ value }: { value: number }) {
  return (
    <strong className="rolling-number">
      {String(value)
        .padStart(2, "0")
        .split("")
        .map((digit, index) => (
          <span className="digit" key={index}>
            <span className="digit-in" key={digit}>
              {digit}
            </span>
          </span>
        ))}
    </strong>
  );
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
            <RollingNumber value={value} />
            <span>{label}</span>
          </div>
          {index < values.length - 1 && <span className="countdown-colon">:</span>}
        </div>
      ))}
    </div>
  );
}

const PERKS = [
  { Icon: CalendarHeart, label: "First access to gatherings" },
  { Icon: MessagesSquare, label: "Mentorship conversations" },
  { Icon: Mail, label: "Community news, never spam" },
];

const NAV_LINKS = [
  ["#story", "About"],
  ["#experience", "Founder"],
  ["#event", "Programs"],
  ["#community", "Contact"],
] as const;

const PILLARS = [
  { Icon: MessageCircleHeart, label: "Honest conversation" },
  { Icon: Sprout, label: "Practical mentorship" },
  { Icon: HeartHandshake, label: "Collective courage" },
];

const MOMENTS = [
  {
    key: "circle",
    src: "/images/community-circle.jpg",
    alt: "Women gathered in a circle, smiling down into the camera",
    caption: "Our circle",
    Icon: Users,
  },
  {
    key: "workshop",
    src: "/images/community-workshop.jpg",
    alt: "A woman listening and taking notes during a workshop",
    caption: "Learning out loud",
    Icon: NotebookPen,
  },
  {
    key: "friends",
    src: "/images/community-friends.jpg",
    alt: "Two friends sharing a joyful moment",
    caption: "Friendships that stay",
    Icon: Smile,
  },
  {
    key: "sisterhood",
    src: "/images/community-sisterhood.jpg",
    alt: "Women standing together outdoors in colorful prints",
    caption: "Sisterhood",
    Icon: HandHeart,
  },
  {
    key: "gathering",
    src: "/images/community-gathering.jpg",
    alt: "A group of women celebrating together",
    caption: "Celebrating each other",
    Icon: PartyPopper,
  },
];

export default function App() {
  const pageRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [joined, setJoined] = useState(false);
  const [shareLabel, setShareLabel] = useState("Share the invite");

  const onShare = async () => {
    const result = await shareInvite();
    if (result === "shared") return;
    setShareLabel(result === "copied" ? "Link copied!" : "Copy failed, try again");
    window.setTimeout(() => setShareLabel("Share the invite"), 2400);
  };
  const menuOpenRef = useRef(menuOpen);
  menuOpenRef.current = menuOpen;

  useLayoutEffect(() => {
    if (!pageRef.current) return;
    return initAnimations(pageRef.current, () => menuOpenRef.current);
  }, []);

  const submitCommunityForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const button = event.currentTarget.querySelector("button");
    if (button) celebrate(button);
    setJoined(true);
    event.currentTarget.reset();
  };

  return (
    <main ref={pageRef}>
      <div className="intro-curtain" aria-hidden="true">
        <span>
          Unfolding <em>Her</em>
        </span>
      </div>
      <div className="scroll-progress" aria-hidden="true" />

      <nav className="nav-shell" aria-label="Main navigation">
        <a className="brand" href="#home" aria-label="Hadassah 31 home">
          <BrandMark />
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
          {NAV_LINKS.map(([href, label]) => (
            <a href={href} key={href} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
        </div>

        <a
          className="button button-small nav-cta"
          href={EVENT.registerUrl}
          rel="noreferrer"
          target="_blank"
        >
          Join us <Arrow />
        </a>
      </nav>

      <section className="hero" id="home">
        <div className="hero-layout">
          <header className="hero-masthead">
            <h1>
              Unfolding <em>Her</em>
            </h1>
            <div className="hero-intro">
              <p>Unlearning. Relearning. Becoming.</p>
              <span>
                A welcoming space to find your voice, grow at your own pace, and become who you
                already have the potential to be. Unfolding Her brings women together for honest
                conversations, practical mentorship, and the kind of sisterhood that reminds you
                that you were never meant to grow alone.
              </span>
              <span>
                Whether you are starting over, starting out, or simply learning to listen to
                yourself again, there is a seat saved for you in this circle.
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

        <a className="scroll-cue" href="#story">
          <ChevronsDown aria-hidden="true" strokeWidth={1.6} />
          Scroll to unfold
        </a>
      </section>

      <section className="story section-shell" id="story">
        <BrushStroke variant="story" />
        <div className="section-number" data-fly="fade">
          / 01
        </div>
        <div className="story-heading">
          <p className="eyebrow eyebrow-dark" data-fly="left">
            <span /> Why we gather
          </p>
          <h2 data-split>
            There is more
            <br />
            inside <em>her.</em>
          </h2>
        </div>
        <div className="story-body">
          <p className="lead" data-fly>
            Hadassah 31 is a women-led community built on a simple belief: when a woman is seen,
            supported, and stretched, everything around her changes.
          </p>
          <p data-fly>
            Unfolding Her is an invitation to pause the performance and reconnect with the woman
            underneath it all.
          </p>
          <ul className="pillars">
            {PILLARS.map(({ Icon, label }) => (
              <li data-fly key={label}>
                <span className="pillar-icon">
                  <Icon aria-hidden="true" className="icon-draw" strokeWidth={1.5} />
                </span>
                {label}
              </li>
            ))}
          </ul>
          <a className="text-link dark-link" data-fly href="#community">
            Meet the community <Arrow />
          </a>
        </div>
      </section>

      <section className="moments" id="moments" aria-labelledby="moments-title">
        <div className="moments-stage">
          <div className="moments-copy">
            <p className="moments-note">moments from our circle</p>
            <h2 id="moments-title">
              Come as you are.
              <br />
              <em>Leave held.</em>
            </h2>
            <p>
              Every gathering is a little different: a workshop that stretches you, a conversation
              that stays with you for weeks, a table full of women cheering each other on. These
              are a few of the moments that make Hadassah 31 feel like home.
            </p>
            <ul className="moments-tags">
              <li>
                <Heart aria-hidden="true" strokeWidth={1.7} /> Sisterhood
              </li>
              <li>
                <NotebookPen aria-hidden="true" strokeWidth={1.7} /> Workshops
              </li>
              <li>
                <Sparkles aria-hidden="true" strokeWidth={1.7} /> Celebrations
              </li>
            </ul>
          </div>

          <div className="moments-photos" role="group" aria-label="Moments from our community">
            {MOMENTS.map(({ key, src, alt, caption, Icon }) => (
              <figure className={`moment moment-${key}`} key={key}>
                <img src={src} alt={alt} loading="lazy" />
                <figcaption>
                  <Icon aria-hidden="true" strokeWidth={1.7} />
                  {caption}
                </figcaption>
              </figure>
            ))}
            <p className="moment-sticker" aria-hidden="true">
              you belong here <Heart strokeWidth={2} />
            </p>
          </div>
        </div>
      </section>

      <section className="experience" id="experience">
        <BrushStroke variant="founder" />
        <div className="founder section-shell">
          <p className="founder-kicker" data-fly="fade">
            The woman behind the vision
          </p>
          <h2 data-split>About the founder</h2>
          <div className="founder-layout">
            <div className="founder-copy founder-copy-left" data-fly="left">
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
              <img src="/images/founder-maureen.jpg" alt="Maureen Okey, founder of Hadassah 31, in a magenta blouse and plum blazer" />
            </div>

            <div className="founder-copy founder-copy-right" data-fly="right">
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
            <Quote aria-hidden="true" className="statement-quote icon-draw" strokeWidth={1.2} />
            <p className="founder-statement">
              WITH HER, WOMEN ARE SEEN,
              <br />
              SUPPORTED & SET IN MOTION.
            </p>
          </div>
        </div>
      </section>

      <section className="event-section" id="event">
        <BrushStroke variant="event" />
        <div className="event-card section-shell">
          <div className="event-image-wrap" data-fly="left">
            <div className="event-image-inner">
              <img
                src="/images/women-tech-event.png"
                alt="Women sharing ideas during a panel conversation at a community event"
              />
            </div>
            <span className="image-caption">Women in conversation / Community in motion</span>
          </div>
          <div className="event-copy">
            <p className="eyebrow eyebrow-dark" data-fly="right">
              <span /> Coming up
            </p>
            <div className="event-title">
              <h2 data-split>
                Your next chapter
                <br />
                has a date.
              </h2>
            </div>
            <p className="event-dek" data-fly>
              Join convener <strong>Maureen Okey</strong> for the Hadassah 31 community launch—a
              afternoon of unlearning, relearning, and becoming.
            </p>
            <div className="event-details">
              {[
                { Icon: Calendar, label: "Date", value: "November 14" },
                { Icon: Clock, label: "Time", value: "12:00 – 3:00 PM" },
                { Icon: MapPin, label: "Venue", value: EVENT.venue },
              ].map(({ Icon, label, value }) => (
                <div data-fly key={label}>
                  <Icon aria-hidden="true" className="event-detail-icon icon-draw" strokeWidth={1.6} />
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
            <div className="event-actions" data-fly>
              <a
                className="button button-dark"
                href={EVENT.registerUrl}
                rel="noreferrer"
                target="_blank"
              >
                Register on Luma <Arrow />
              </a>
              <button className="button button-outline" onClick={downloadCalendarInvite} type="button">
                <CalendarPlus aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} />
                Add to calendar
              </button>
              <button className="button button-outline" onClick={onShare} type="button">
                <Share2 aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} />
                {shareLabel}
              </button>
              <a
                className="text-link dark-link event-directions"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${EVENT.venue}, ${EVENT.address}`,
                )}`}
                rel="noreferrer"
                target="_blank"
              >
                <Navigation aria-hidden="true" strokeWidth={1.8} /> Get directions
              </a>
            </div>
          </div>
        </div>

        <div className="countdown-panel section-shell">
          <div data-fly="left">
            <p className="eyebrow">
              <Hourglass aria-hidden="true" className="icon-hourglass" strokeWidth={1.6} /> Until we
              gather
            </p>
            <p className="countdown-note">
              Saturday, 14 November · 12:00 PM WAT · Ilorin Innovation Hub
            </p>
            <span className="live-dot">Counting down live</span>
          </div>
          <div className="countdown-side" data-fly="right">
            <Countdown />
            <a
              className="button button-light countdown-register"
              href={EVENT.registerUrl}
              rel="noreferrer"
              target="_blank"
            >
              Save your seat on Luma <Arrow />
            </a>
          </div>
        </div>
      </section>

      <section className="community section-shell" id="community">
        <BrushStroke variant="community" />
        <div className="community-copy">
          <p className="eyebrow" data-fly="left">
            <span /> Stay in the circle
          </p>
          <h2 data-split>
            Keep
            <br />
            <em>unfolding.</em>
          </h2>
          <p data-fly>
            Join a growing circle of women choosing courage, community, and conscious growth. Get
            first access to gatherings, mentorship conversations, and community news.
          </p>
          <ul className="perks">
            {PERKS.map(({ Icon, label }) => (
              <li data-fly="left" key={label}>
                <span className="perk-icon">
                  <Icon aria-hidden="true" className="icon-draw" strokeWidth={1.5} />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>
        <div className="community-form-wrap">
          <div className="form-card" data-fly="scale">
            {joined ? (
              <div className="success-message" role="status">
                <PartyPopper aria-hidden="true" className="icon-pop" strokeWidth={1.4} />
                <h3>You’re in the circle.</h3>
                <p>Thank you for joining. We’re glad you’re here.</p>
                <button className="text-link" onClick={() => setJoined(false)} type="button">
                  Add another person <Arrow />
                </button>
              </div>
            ) : (
              <form onSubmit={submitCommunityForm}>
                <p className="form-card-title">
                  Join the circle <span>it takes 10 seconds</span>
                </p>
                <label>
                  <span className="label-text">
                    <UserRound aria-hidden="true" strokeWidth={1.6} /> Your name
                  </span>
                  <input name="name" placeholder="How should we call you?" required />
                  <span className="input-line" aria-hidden="true" />
                </label>
                <label>
                  <span className="label-text">
                    <Mail aria-hidden="true" strokeWidth={1.6} /> Email address
                  </span>
                  <input name="email" placeholder="you@example.com" required type="email" />
                  <span className="input-line" aria-hidden="true" />
                </label>
                <button className="button button-light button-send" type="submit">
                  Join the community
                  <SendHorizontal aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} />
                </button>
                <small>By joining, you agree to receive community updates from Hadassah 31.</small>
                <a
                  className="form-register-link"
                  href={EVENT.registerUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Coming on 14 November? Register for the event on Luma <Arrow />
                </a>
              </form>
            )}
          </div>
          <div className="social-community">
            <div className="social-community-heading" data-fly="fade">
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
                <div className="social-item" data-fly="scale" key={icon}>
                  <SocialIcon name={icon as "whatsapp" | "instagram" | "x" | "tiktok"} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-top">
          <a className="brand" href="#home">
            <BrandMark />
            <span>Hadassah 31</span>
          </a>
          <nav className="footer-links" aria-label="Footer">
            {NAV_LINKS.map(([href, label]) => (
              <a href={href} key={href}>
                {label}
              </a>
            ))}
          </nav>
          <a className="back-top" href="#home">
            Back to top
            <span>
              <ArrowUp aria-hidden="true" strokeWidth={1.6} />
            </span>
          </a>
        </div>
        <p className="footer-wordmark" aria-hidden="true">
          {"Unfolding Her".split("").map((char, index) => (
            <span className={index >= 10 ? "wordmark-em" : undefined} key={index}>
              {char === " " ? "\u00a0" : char}
            </span>
          ))}
        </p>
        <div className="footer-bottom">
          <p>Empowerment · Growth · Women’s Mentorship</p>
          <p>© {new Date().getFullYear()} Hadassah 31</p>
        </div>
      </footer>
    </main>
  );
}
