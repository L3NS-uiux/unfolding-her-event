import { FormEvent, useEffect, useState } from "react";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [joined, setJoined] = useState(false);

  const submitCommunityForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setJoined(true);
    event.currentTarget.reset();
  };

  return (
    <main>
      <nav className="nav-shell" aria-label="Main navigation">
        <a className="brand" href="#home" aria-label="Hadassah 31 home">
          <span className="brand-flame">♢</span>
          <span>Hadassah 31</span>
        </a>

        <button
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
          className="menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          <span />
          <span />
        </button>

        <div className={`nav-links ${menuOpen ? "nav-open" : ""}`}>
          <a href="#story" onClick={() => setMenuOpen(false)}>
            Our story
          </a>
          <a href="#experience" onClick={() => setMenuOpen(false)}>
            The founder
          </a>
          <a href="#event" onClick={() => setMenuOpen(false)}>
            The event
          </a>
        </div>

        <a className="button button-small nav-cta" href="#community">
          Join the community <Arrow />
        </a>
      </nav>

      <section className="hero" id="home">
        <header className="hero-masthead">
          <div>
            <p className="eyebrow">
              <span /> Hadassah 31 presents
            </p>
            <h1>
              Unfolding <em>Her</em>
            </h1>
          </div>
          <div className="hero-intro">
            <p>Unlearning. Relearning. Becoming.</p>
            <span>A space for women to claim their voice and grow into who they are becoming.</span>
          </div>
        </header>

        <div className="hero-gallery">
          <article className="hero-card hero-card-purpose">
            <span className="hero-card-number">01 / Our mission</span>
            <div>
              <h2>A room for every version of her.</h2>
              <p>
                We empower women and girls through honest conversation, mentorship, community
                support, and access to meaningful learning opportunities.
              </p>
            </div>
            <a href="#story">
              Why we gather <Arrow />
            </a>
          </article>

          <div className="hero-card-stack">
            <article className="hero-card hero-card-join">
              <Spark />
              <h2>Join women who are becoming, together.</h2>
              <a className="button" href="#community">
                Join our community <Arrow />
              </a>
            </article>

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

          <article className="hero-card hero-card-vision">
            <span className="hero-card-number">02 / Our vision</span>
            <div className="hero-card-vision-copy">
              <h2>Every girl deserves space to dream bigger.</h2>
              <p>
                We see a future where women and girls have the support, confidence, and opportunity
                to learn, lead, and thrive.
              </p>
            </div>
            <div className="hero-card-vision-photo">
              <img
                src="https://images.unsplash.com/photo-1567057420215-0afa9aa9253a?auto=format&fit=crop&w=1200&q=85"
                alt="School children happily learning and writing together"
              />
              <small>Photo by Annie Spratt / Unsplash</small>
            </div>
          </article>
        </div>
      </section>

      <section className="story section-shell" id="story">
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
          <p className="founder-statement">
            WITH HER, WOMEN ARE SEEN,
            <br />
            SUPPORTED & SET IN MOTION.
          </p>
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
            <h2>
              Your next chapter
              <br />
              has a date.
            </h2>
            <p className="event-dek">
              Join convener <strong>Maureen Okey</strong> for the Hadassah 31 community launch—a
              morning of unlearning, relearning, and becoming.
            </p>
            <div className="event-details">
              <div>
                <span>Date</span>
                <strong>November 14</strong>
              </div>
              <div>
                <span>Time</span>
                <strong>11:00 AM</strong>
              </div>
              <div>
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
