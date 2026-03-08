"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

const placeholderCards = [
  {
    title: "Module Alpha",
    copy: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer accumsan sem in magna consequat.",
  },
  {
    title: "Module Beta",
    copy: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vel augue posuere, blandit elit in, pharetra mi.",
  },
  {
    title: "Module Gamma",
    copy: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt nisi et neque maximus fermentum.",
  },
  {
    title: "Module Delta",
    copy: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas interdum tellus ac sem dignissim tincidunt.",
  },
  {
    title: "Module Epsilon",
    copy: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum gravida augue quis nunc fringilla commodo.",
  },
  {
    title: "Module Zeta",
    copy: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur euismod risus ut lacus dapibus ultrices.",
  },
  {
    title: "Module Eta",
    copy: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ullamcorper augue vitae felis lacinia congue.",
  },
  {
    title: "Module Theta",
    copy: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque congue elit eget lectus congue sollicitudin.",
  },
];

const signalItems = [
  "Adaptive user flows",
  "Realtime cloud telemetry",
  "Security-first architecture",
  "Elegant frontend engineering",
];

const HUNT_CELLS = 12;

type ReactionPhase = "idle" | "waiting" | "ready" | "result" | "tooSoon";

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function Home() {
  const [reactionPhase, setReactionPhase] = useState<ReactionPhase>("idle");
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const reactionReadyAtRef = useRef<number | null>(null);
  const reactionTimeoutRef = useRef<number | null>(null);

  const [secretCode, setSecretCode] = useState(() => randomBetween(1, 20));
  const [codeGuess, setCodeGuess] = useState("");
  const [codeAttempts, setCodeAttempts] = useState(0);
  const [codeSolved, setCodeSolved] = useState(false);
  const [codeMessage, setCodeMessage] = useState(
    "Guess the code from 1 to 20 to unlock the panel.",
  );

  const [huntActive, setHuntActive] = useState(false);
  const [huntTime, setHuntTime] = useState(10);
  const [huntScore, setHuntScore] = useState(0);
  const [huntBest, setHuntBest] = useState(0);
  const [activeCell, setActiveCell] = useState(() =>
    randomBetween(0, HUNT_CELLS - 1),
  );
  const huntScoreRef = useRef(0);

  useEffect(() => {
    const revealElements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      revealElements.forEach((element) => {
        element.classList.add("in-view");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -9% 0px" },
    );

    revealElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (reactionTimeoutRef.current) {
        window.clearTimeout(reactionTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    huntScoreRef.current = huntScore;
  }, [huntScore]);

  useEffect(() => {
    if (!huntActive) {
      return;
    }

    const moveTarget = window.setInterval(() => {
      setActiveCell((current) => {
        let next = randomBetween(0, HUNT_CELLS - 1);
        if (next === current) {
          next = (next + 1) % HUNT_CELLS;
        }
        return next;
      });
    }, 620);

    const tickClock = window.setInterval(() => {
      setHuntTime((current) => {
        if (current <= 1) {
          window.clearInterval(moveTarget);
          window.clearInterval(tickClock);
          setHuntActive(false);
          setHuntBest((best) => Math.max(best, huntScoreRef.current));
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(moveTarget);
      window.clearInterval(tickClock);
    };
  }, [huntActive]);

  const startReactionTest = () => {
    if (reactionTimeoutRef.current) {
      window.clearTimeout(reactionTimeoutRef.current);
    }

    setReactionPhase("waiting");
    setReactionTime(null);

    const delay = randomBetween(1200, 3200);

    reactionTimeoutRef.current = window.setTimeout(() => {
      reactionReadyAtRef.current = performance.now();
      setReactionPhase("ready");
    }, delay);
  };

  const handleReactionTap = () => {
    if (reactionPhase === "waiting") {
      if (reactionTimeoutRef.current) {
        window.clearTimeout(reactionTimeoutRef.current);
      }
      setReactionPhase("tooSoon");
      return;
    }

    if (reactionPhase === "ready") {
      const now = performance.now();
      const startedAt = reactionReadyAtRef.current ?? now;
      const measured = Math.round(now - startedAt);
      setReactionTime(measured);
      setReactionPhase("result");
    }
  };

  const submitCodeGuess = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (codeSolved) {
      return;
    }

    const value = Number.parseInt(codeGuess, 10);

    if (Number.isNaN(value) || value < 1 || value > 20) {
      setCodeMessage("Enter a valid number between 1 and 20.");
      return;
    }

    const nextAttempts = codeAttempts + 1;
    setCodeAttempts(nextAttempts);

    if (value === secretCode) {
      setCodeSolved(true);
      setCodeMessage(`Access granted in ${nextAttempts} attempts.`);
      return;
    }

    setCodeMessage(
      value < secretCode ? "Too low. Increase the signal." : "Too high. Lower the signal.",
    );
    setCodeGuess("");
  };

  const resetCodeGame = () => {
    setSecretCode(randomBetween(1, 20));
    setCodeGuess("");
    setCodeAttempts(0);
    setCodeSolved(false);
    setCodeMessage("Guess the code from 1 to 20 to unlock the panel.");
  };

  const startHuntGame = () => {
    huntScoreRef.current = 0;
    setHuntScore(0);
    setHuntTime(10);
    setActiveCell(randomBetween(0, HUNT_CELLS - 1));
    setHuntActive(true);
  };

  const clickHuntCell = (index: number) => {
    if (!huntActive || index !== activeCell) {
      return;
    }

    setHuntScore((current) => {
      const next = current + 1;
      huntScoreRef.current = next;
      return next;
    });

    setActiveCell((current) => {
      let next = randomBetween(0, HUNT_CELLS - 1);
      if (next === current) {
        next = (next + 1) % HUNT_CELLS;
      }
      return next;
    });
  };

  const reactionLabel =
    reactionPhase === "idle"
      ? "Start the test"
      : reactionPhase === "waiting"
        ? "Wait for green"
        : reactionPhase === "ready"
          ? "Tap now"
          : reactionPhase === "tooSoon"
            ? "Too early"
            : "Completed";

  const reactionDetail =
    reactionPhase === "idle"
      ? "Press Start, then tap the panel when it turns green."
      : reactionPhase === "waiting"
        ? "Stay focused. The panel will switch soon."
        : reactionPhase === "ready"
          ? "Click immediately to log your speed."
          : reactionPhase === "tooSoon"
            ? "You tapped too early. Try again."
            : `Your reaction time: ${reactionTime ?? "--"} ms`;

  return (
    <div className="site-shell">
      <div className="grid-overlay" aria-hidden />
      <div className="halo halo-a" aria-hidden />
      <div className="halo halo-b" aria-hidden />

      <header className="site-header" data-reveal>
        <a className="brand" href="#top">
          <span className="brand-mark">SL</span>
          <span>shadowlab.dev</span>
        </a>
        <nav className="top-nav" aria-label="Primary">
          <a href="#top">Front Page</a>
          <a href="#signals">Signals</a>
          <a href="#games">Arcade</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main id="top">
        <section className="front-panel reveal" data-reveal>
          <p className="kicker">Shadowlab Front Page</p>
          <h1>Future-ready web presence for shadowlab.dev</h1>
          <p className="lede">
            This page is now structured as a visual launch surface with animated
            content blocks, progressive scroll reveals, and an embedded game
            zone near the bottom.
          </p>
          <div className="placeholder-grid">
            {placeholderCards.map((card, index) => (
              <article
                key={card.title}
                className="placeholder-card reveal"
                data-reveal
                style={{ transitionDelay: `${index * 90}ms` }}
              >
                <h2>{card.title}</h2>
                <p>{card.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="signals" className="content-panel reveal" data-reveal>
          <div className="panel-head">
            <p className="kicker">Signal Matrix</p>
            <h2>Scroll interactions now stage content with cinematic timing.</h2>
          </div>
          <div className="signal-grid">
            {signalItems.map((item, index) => (
              <article
                key={item}
                className="signal-card reveal"
                data-reveal
                style={{ transitionDelay: `${index * 110}ms` }}
              >
                <h3>{item}</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  sodales, orci a pretium accumsan, libero lorem efficitur
                  mauris, vel convallis nisi magna nec dui.
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="games" className="games-panel reveal" data-reveal>
          <div className="panel-head">
            <p className="kicker">Arcade Lab</p>
            <h2>Online mini games, built directly into shadowlab.dev</h2>
          </div>

          <div className="games-grid">
            <article className="game-card reveal" data-reveal>
              <h3>Reflex Pulse</h3>
              <p>
                Measure reaction speed. Wait for the panel to switch and tap as
                fast as possible.
              </p>
              <button
                type="button"
                className="game-button"
                onClick={startReactionTest}
              >
                Start Test
              </button>
              <button
                type="button"
                className={`reaction-pad phase-${reactionPhase}`}
                onClick={handleReactionTap}
              >
                <span>{reactionLabel}</span>
                <small>{reactionDetail}</small>
              </button>
            </article>

            <article className="game-card reveal" data-reveal>
              <h3>Signal Decoder</h3>
              <p>
                Crack the hidden code from 1-20 using high and low feedback.
              </p>
              <form className="code-form" onSubmit={submitCodeGuess}>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={codeGuess}
                  onChange={(event) => setCodeGuess(event.target.value)}
                  placeholder="Enter code"
                  disabled={codeSolved}
                  aria-label="Code guess"
                />
                <button type="submit" className="game-button" disabled={codeSolved}>
                  Submit Guess
                </button>
              </form>
              <p className="game-status">{codeMessage}</p>
              <p className="game-meta">Attempts: {codeAttempts}</p>
              <button type="button" className="game-ghost" onClick={resetCodeGame}>
                Reset Decoder
              </button>
            </article>

            <article className="game-card reveal" data-reveal>
              <h3>Grid Hunt</h3>
              <p>
                Hit the glowing target before it shifts position. You get 10
                seconds.
              </p>
              <div className="hunt-meta">
                <span>Time: {huntTime}s</span>
                <span>Score: {huntScore}</span>
                <span>Best: {huntBest}</span>
              </div>
              <button type="button" className="game-button" onClick={startHuntGame}>
                {huntActive ? "Restart Hunt" : "Start Hunt"}
              </button>
              <div className="hunt-grid" role="group" aria-label="Grid hunt board">
                {Array.from({ length: HUNT_CELLS }).map((_, index) => (
                  <button
                    type="button"
                    key={`cell-${index}`}
                    className={`hunt-cell ${huntActive && index === activeCell ? "is-target" : ""}`}
                    onClick={() => clickHuntCell(index)}
                    aria-label={`Grid cell ${index + 1}`}
                  />
                ))}
              </div>
            </article>
          </div>
        </section>

        <section id="contact" className="contact-panel reveal" data-reveal>
          <p className="kicker">Contact</p>
          <h2>Ready to turn these placeholders into final product content?</h2>
          <p>
            We can wire your final sections, copy, and services into this design
            system without changing the visual language.
          </p>
          <a className="cta-link" href="mailto:hello@shadowlab.dev">
            hello@shadowlab.dev
          </a>
        </section>
      </main>

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} shadowlab.dev</p>
      </footer>
    </div>
  );
}
