"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";

const gatewayBoxes = [
  {
    href: "/studio",
    title: "Studio",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere sapien id tortor cursus, vitae convallis arcu dictum.",
  },
  {
    href: "/work",
    title: "Work",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ultricies nisl at neque tristique, in interdum nunc aliquam.",
  },
  {
    href: "/contact",
    title: "Contact",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec varius urna ac lacus volutpat, in pharetra felis facilisis.",
  },
  {
    href: "/lab",
    title: "Lab",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum volutpat velit sit amet massa vulputate, non feugiat est posuere.",
  },
  {
    href: "/about",
    title: "About",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur dictum tellus in ligula commodo, vel posuere massa hendrerit.",
  },
  {
    href: "/updates",
    title: "Updates",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque accumsan justo at lectus blandit, vitae semper leo commodo.",
  },
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
      revealElements.forEach((element) => element.classList.add("in-view"));
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
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
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
    }, 600);

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
      ? "Press Start, then tap when the panel turns green."
      : reactionPhase === "waiting"
        ? "Hold position. The signal is charging."
        : reactionPhase === "ready"
          ? "Tap immediately to record your speed."
          : reactionPhase === "tooSoon"
            ? "You tapped too early. Retry."
            : `Your reaction time: ${reactionTime ?? "--"} ms`;

  return (
    <div className="landing-shell">
      <div className="ambient-grid" aria-hidden />
      <div className="ambient-blob ambient-blob-a" aria-hidden />
      <div className="ambient-blob ambient-blob-b" aria-hidden />

      <section className="welcome-screen" id="top">
        <div className="welcome-inner">
          <div className="welcome-copy reveal in-view">
            <p className="micro-label">shadowlab.dev / gateway</p>
            <h1>Welcome to Shadowlab</h1>
            <p>
              A modern, futuristic front page designed as a redirect hub.
              Select a destination box, or press Enter to drop into the arcade.
            </p>
            <a className="enter-link" href="#games">
              <span>Enter</span>
            </a>
          </div>

          <div className="gateway-grid">
            {gatewayBoxes.map((box, index) => (
              <Link
                key={box.title}
                href={box.href}
                className="gateway-box reveal"
                data-reveal
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <h2>{box.title}</h2>
                <p>{box.body}</p>
              </Link>
            ))}
          </div>
          <p className="scroll-cue">Scroll down for built-in games</p>
        </div>
      </section>

      <section id="games" className="games-section reveal" data-reveal>
        <div className="games-head">
          <p className="micro-label">Arcade</p>
          <h2>Built-in games</h2>
        </div>

        <div className="games-grid">
          <article className="game-card reveal" data-reveal>
            <h3>Reflex Pulse</h3>
            <p>Measure your reaction speed against the signal flash.</p>
            <button type="button" className="game-button" onClick={startReactionTest}>
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
            <p>Guess the hidden code from 1 to 20.</p>
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
            <p>Tap the glowing target before it relocates.</p>
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

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} shadowlab.dev</p>
      </footer>
    </div>
  );
}
