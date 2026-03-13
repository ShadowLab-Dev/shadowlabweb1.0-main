"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";

const gatewayBoxes = [
  {
    href: "/studio",
    title: "Reactor",
    body: "Tune panel glow, motion pressure, and UI atmosphere in the live reactor bay.",
  },
  {
    href: "/work",
    title: "Vault",
    body: "Prototype worlds, interface systems, and concept builds staged for review.",
  },
  {
    href: "/contact",
    title: "Signal",
    body: "Outbound references, relays, and utility links collected for fast access.",
  },
  {
    href: "/lab",
    title: "Experiments",
    body: "Interactive visual tests and motion probes running in the active sector.",
  },
  {
    href: "/about",
    title: "Archive",
    body: "Curated websites and references cataloged for design and interface research.",
  },
  {
    href: "/updates",
    title: "Logs",
    body: "Transmission notes on what was tested, tuned, and discovered in ShadowLab.",
  },
];

const HUNT_CELLS = 12;
const COIN_SIDES = ["heads", "tails"] as const;
const SLOT_SYMBOLS = ["7", "BAR", "STAR", "BELL", "WILD", "LUCK"] as const;
const SWATCHES = [
  { name: "Cyan", value: "#26d9ff" },
  { name: "Sky", value: "#5fa2ff" },
  { name: "Mint", value: "#6bf0c7" },
  { name: "Amber", value: "#ffc772" },
  { name: "Rose", value: "#ff9292" },
  { name: "Violet", value: "#b7a0ff" },
];

type ReactionPhase = "idle" | "waiting" | "ready" | "result" | "tooSoon";
type CoinSide = (typeof COIN_SIDES)[number];
type MathPrompt = {
  left: number;
  right: number;
  operator: "+" | "-";
  answer: number;
};

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createMathPrompt(): MathPrompt {
  const operator = Math.random() < 0.5 ? "+" : "-";
  const left = randomBetween(4, 24);
  const right = randomBetween(2, 15);

  if (operator === "-") {
    const high = Math.max(left, right);
    const low = Math.min(left, right);
    return { left: high, right: low, operator, answer: high - low };
  }

  return { left, right, operator, answer: left + right };
}

function createMemoryCode(length: number) {
  return Array.from({ length }, () => randomBetween(0, 9)).join("");
}

function pickSwatchTarget() {
  return SWATCHES[randomBetween(0, SWATCHES.length - 1)].name;
}

function formatCardValue(value: number) {
  if (value === 1) {
    return "A";
  }
  if (value === 11) {
    return "J";
  }
  if (value === 12) {
    return "Q";
  }
  if (value === 13) {
    return "K";
  }
  return String(value);
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

  const [coinResult, setCoinResult] = useState("Call heads or tails to start.");
  const [coinWins, setCoinWins] = useState(0);
  const [coinLosses, setCoinLosses] = useState(0);
  const [coinStreak, setCoinStreak] = useState(0);
  const [coinBestStreak, setCoinBestStreak] = useState(0);

  const [mathPrompt, setMathPrompt] = useState<MathPrompt>(() => createMathPrompt());
  const [mathInput, setMathInput] = useState("");
  const [mathScore, setMathScore] = useState(0);
  const [mathRounds, setMathRounds] = useState(0);
  const [mathMessage, setMathMessage] = useState("Solve the equation and submit your answer.");

  const memoryTimeoutRef = useRef<number | null>(null);
  const [memorySequence, setMemorySequence] = useState("");
  const [memoryVisible, setMemoryVisible] = useState(false);
  const [memoryInput, setMemoryInput] = useState("");
  const [memoryRound, setMemoryRound] = useState(1);
  const [memoryScore, setMemoryScore] = useState(0);
  const [memoryAttempts, setMemoryAttempts] = useState(0);
  const [memoryMessage, setMemoryMessage] = useState("Reveal a code, memorize it, then type it.");

  const [slotReels, setSlotReels] = useState<string[]>(["7", "BAR", "7"]);
  const [slotSpins, setSlotSpins] = useState(0);
  const [slotJackpots, setSlotJackpots] = useState(0);
  const [slotMessage, setSlotMessage] = useState("Spin the reels and line up a triple.");

  const [targetSwatch, setTargetSwatch] = useState(() => pickSwatchTarget());
  const [swatchTries, setSwatchTries] = useState(0);
  const [swatchHits, setSwatchHits] = useState(0);
  const [swatchMessage, setSwatchMessage] = useState("Pick the color that matches the target.");

  const [highLowCurrent, setHighLowCurrent] = useState(() => randomBetween(1, 13));
  const [highLowScore, setHighLowScore] = useState(0);
  const [highLowBest, setHighLowBest] = useState(0);
  const [highLowLives, setHighLowLives] = useState(3);
  const [highLowMessage, setHighLowMessage] = useState(
    "Guess whether the next card value goes higher or lower.",
  );

  const [gamesRevealed, setGamesRevealed] = useState(false);

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
      if (memoryTimeoutRef.current) {
        window.clearTimeout(memoryTimeoutRef.current);
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

  const playCoinRound = (call: CoinSide) => {
    const flipped = COIN_SIDES[randomBetween(0, COIN_SIDES.length - 1)];

    if (flipped === call) {
      setCoinWins((current) => current + 1);
      setCoinStreak((current) => {
        const next = current + 1;
        setCoinBestStreak((best) => Math.max(best, next));
        return next;
      });
      setCoinResult(`Flip: ${flipped}. Exact call.`);
      return;
    }

    setCoinLosses((current) => current + 1);
    setCoinStreak(0);
    setCoinResult(`Flip: ${flipped}. Missed that one.`);
  };

  const resetCoinGame = () => {
    setCoinResult("Call heads or tails to start.");
    setCoinWins(0);
    setCoinLosses(0);
    setCoinStreak(0);
    setCoinBestStreak(0);
  };

  const submitMathAnswer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const value = Number.parseInt(mathInput, 10);
    if (Number.isNaN(value)) {
      setMathMessage("Enter a valid number first.");
      return;
    }

    setMathRounds((current) => current + 1);

    if (value === mathPrompt.answer) {
      setMathScore((current) => current + 1);
      setMathMessage("Correct. Next equation loaded.");
    } else {
      setMathMessage(`Not quite. Answer was ${mathPrompt.answer}.`);
    }

    setMathInput("");
    setMathPrompt(createMathPrompt());
  };

  const resetMathGame = () => {
    setMathPrompt(createMathPrompt());
    setMathInput("");
    setMathScore(0);
    setMathRounds(0);
    setMathMessage("Solve the equation and submit your answer.");
  };

  const revealMemoryCode = () => {
    if (memoryTimeoutRef.current) {
      window.clearTimeout(memoryTimeoutRef.current);
    }

    const length = Math.min(7, 2 + memoryRound);
    const nextCode = createMemoryCode(length);
    setMemorySequence(nextCode);
    setMemoryVisible(true);
    setMemoryInput("");
    setMemoryMessage("Memorize the code before it fades.");

    memoryTimeoutRef.current = window.setTimeout(() => {
      setMemoryVisible(false);
      memoryTimeoutRef.current = null;
    }, 1500 + length * 150);
  };

  const submitMemoryGuess = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!memorySequence) {
      setMemoryMessage("Reveal a code first.");
      return;
    }

    if (memoryVisible) {
      setMemoryMessage("Wait for the code to hide, then submit.");
      return;
    }

    const cleanedGuess = memoryInput.replace(/\s+/g, "");
    const correct = cleanedGuess === memorySequence;
    setMemoryAttempts((current) => current + 1);
    setMemoryRound((current) => current + 1);

    if (correct) {
      setMemoryScore((current) => current + 1);
      setMemoryMessage("Perfect recall. Reveal the next one.");
    } else {
      setMemoryMessage(`Missed. The code was ${memorySequence}.`);
    }

    setMemoryInput("");
  };

  const resetMemoryGame = () => {
    if (memoryTimeoutRef.current) {
      window.clearTimeout(memoryTimeoutRef.current);
      memoryTimeoutRef.current = null;
    }
    setMemorySequence("");
    setMemoryVisible(false);
    setMemoryInput("");
    setMemoryRound(1);
    setMemoryScore(0);
    setMemoryAttempts(0);
    setMemoryMessage("Reveal a code, memorize it, then type it.");
  };

  const spinSlots = () => {
    const nextReels = Array.from(
      { length: 3 },
      () => SLOT_SYMBOLS[randomBetween(0, SLOT_SYMBOLS.length - 1)],
    );

    setSlotReels(nextReels);
    setSlotSpins((current) => current + 1);

    const uniqueCount = new Set(nextReels).size;
    if (uniqueCount === 1) {
      setSlotJackpots((current) => current + 1);
      setSlotMessage(`Jackpot: ${nextReels.join(" | ")}`);
      return;
    }

    if (uniqueCount === 2) {
      setSlotMessage(`Pair landed: ${nextReels.join(" | ")}`);
      return;
    }

    setSlotMessage(`No match: ${nextReels.join(" | ")}`);
  };

  const resetSlotGame = () => {
    setSlotReels(["7", "BAR", "7"]);
    setSlotSpins(0);
    setSlotJackpots(0);
    setSlotMessage("Spin the reels and line up a triple.");
  };

  const pickSwatch = (name: string) => {
    setSwatchTries((current) => current + 1);

    if (name === targetSwatch) {
      setSwatchHits((current) => current + 1);
      setSwatchMessage(`Hit confirmed on ${name}. New target set.`);
      setTargetSwatch(pickSwatchTarget());
      return;
    }

    setSwatchMessage(`${name} was close. Try again.`);
  };

  const resetSwatchGame = () => {
    setTargetSwatch(pickSwatchTarget());
    setSwatchTries(0);
    setSwatchHits(0);
    setSwatchMessage("Pick the color that matches the target.");
  };

  const guessHighLow = (direction: "higher" | "lower") => {
    const nextValue = randomBetween(1, 13);

    if (nextValue === highLowCurrent) {
      setHighLowCurrent(nextValue);
      setHighLowMessage(`Tie at ${formatCardValue(nextValue)}. No score change.`);
      return;
    }

    const correctGuess =
      direction === "higher" ? nextValue > highLowCurrent : nextValue < highLowCurrent;

    if (correctGuess) {
      setHighLowScore((current) => {
        const next = current + 1;
        setHighLowBest((best) => Math.max(best, next));
        return next;
      });
      setHighLowCurrent(nextValue);
      setHighLowMessage(`Next card ${formatCardValue(nextValue)}. Correct call.`);
      return;
    }

    const remainingLives = highLowLives - 1;
    if (remainingLives <= 0) {
      setHighLowBest((best) => Math.max(best, highLowScore));
      setHighLowScore(0);
      setHighLowLives(3);
      setHighLowCurrent(randomBetween(1, 13));
      setHighLowMessage(
        `Next card ${formatCardValue(nextValue)}. Run ended, new round started.`,
      );
      return;
    }

    setHighLowLives(remainingLives);
    setHighLowCurrent(nextValue);
    setHighLowMessage(
      `Next card ${formatCardValue(nextValue)}. Missed, ${remainingLives} lives left.`,
    );
  };

  const resetHighLowGame = () => {
    setHighLowCurrent(randomBetween(1, 13));
    setHighLowScore(0);
    setHighLowLives(3);
    setHighLowMessage("Guess whether the next card value goes higher or lower.");
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
              A digital experiment facility for testing visuals, interfaces, and unusual web ideas.
              Select a sector, or press Enter to drop into the arcade.
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

        <div className="games-toggle-wrap">
          <button
            type="button"
            className={`reveal-games-button ${gamesRevealed ? "is-open" : ""}`}
            onClick={() => setGamesRevealed(true)}
            aria-expanded={gamesRevealed}
            aria-controls="games-grid-panel"
            disabled={gamesRevealed}
          >
            <span>{gamesRevealed ? "Games Revealed" : "Reveal Web Games"}</span>
            <small>
              {gamesRevealed ? "Arcade unlocked. All games are live." : "Tap to reveal all 9 games."}
            </small>
          </button>
        </div>

        <div
          id="games-grid-panel"
          className={`games-reveal-wrap ${gamesRevealed ? "is-open" : ""}`}
          aria-hidden={!gamesRevealed}
        >
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

          <article className="game-card reveal" data-reveal>
            <h3>Coin Clash</h3>
            <p>Call heads or tails and build your best streak.</p>
            <div className="choice-grid">
              {COIN_SIDES.map((side) => (
                <button
                  key={side}
                  type="button"
                  className="game-ghost"
                  onClick={() => playCoinRound(side)}
                >
                  {side === "heads" ? "Heads" : "Tails"}
                </button>
              ))}
            </div>
            <p className="game-status">{coinResult}</p>
            <p className="game-meta">
              Wins: {coinWins} | Losses: {coinLosses} | Streak: {coinStreak} | Best: {coinBestStreak}
            </p>
            <button type="button" className="game-ghost" onClick={resetCoinGame}>
              Reset Clash
            </button>
          </article>

          <article className="game-card reveal" data-reveal>
            <h3>Math Sprint</h3>
            <p>Solve each equation quickly to raise your score.</p>
            <p className="game-meta">
              Equation: {mathPrompt.left} {mathPrompt.operator} {mathPrompt.right}
            </p>
            <form className="code-form" onSubmit={submitMathAnswer}>
              <input
                type="number"
                value={mathInput}
                onChange={(event) => setMathInput(event.target.value)}
                placeholder="Enter answer"
                aria-label="Math answer"
              />
              <button type="submit" className="game-button">
                Submit Answer
              </button>
            </form>
            <p className="game-status">{mathMessage}</p>
            <p className="game-meta">
              Score: {mathScore} / Rounds: {mathRounds}
            </p>
            <button type="button" className="game-ghost" onClick={resetMathGame}>
              Reset Sprint
            </button>
          </article>

          <article className="game-card reveal" data-reveal>
            <h3>Memory Flash</h3>
            <p>Memorize the code before it disappears.</p>
            <button type="button" className="game-button" onClick={revealMemoryCode}>
              Reveal Code
            </button>
            <div className={`game-display ${memoryVisible ? "is-visible" : ""}`}>
              {memoryVisible
                ? memorySequence
                : memorySequence
                  ? "Code hidden"
                  : "Press Reveal Code"}
            </div>
            <form className="code-form" onSubmit={submitMemoryGuess}>
              <input
                type="text"
                value={memoryInput}
                onChange={(event) => setMemoryInput(event.target.value)}
                placeholder="Type code"
                aria-label="Memory code guess"
              />
              <button type="submit" className="game-button">
                Check Recall
              </button>
            </form>
            <p className="game-status">{memoryMessage}</p>
            <p className="game-meta">
              Score: {memoryScore} / Attempts: {memoryAttempts} / Round: {memoryRound}
            </p>
            <button type="button" className="game-ghost" onClick={resetMemoryGame}>
              Reset Flash
            </button>
          </article>

          <article className="game-card reveal" data-reveal>
            <h3>Lucky Slots</h3>
            <p>Spin three reels and aim for a full match.</p>
            <div className="slot-reels" role="group" aria-label="Slot reels">
              {slotReels.map((symbol, index) => (
                <span key={`${symbol}-${index}`} className="slot-reel">
                  {symbol}
                </span>
              ))}
            </div>
            <button type="button" className="game-button" onClick={spinSlots}>
              Spin Reels
            </button>
            <p className="game-status">{slotMessage}</p>
            <p className="game-meta">
              Spins: {slotSpins} | Jackpots: {slotJackpots}
            </p>
            <button type="button" className="game-ghost" onClick={resetSlotGame}>
              Reset Slots
            </button>
          </article>

          <article className="game-card reveal" data-reveal>
            <h3>Spectrum Match</h3>
            <p>Hit the target color in as few tries as possible.</p>
            <p className="game-meta">Target: {targetSwatch}</p>
            <div className="swatch-grid" role="group" aria-label="Color choices">
              {SWATCHES.map((swatch) => (
                <button
                  key={swatch.name}
                  type="button"
                  className="swatch-button"
                  style={{ backgroundColor: swatch.value }}
                  onClick={() => pickSwatch(swatch.name)}
                  aria-label={`Pick ${swatch.name}`}
                >
                  {swatch.name}
                </button>
              ))}
            </div>
            <p className="game-status">{swatchMessage}</p>
            <p className="game-meta">
              Hits: {swatchHits} | Tries: {swatchTries}
            </p>
            <button type="button" className="game-ghost" onClick={resetSwatchGame}>
              Reset Match
            </button>
          </article>

          <article className="game-card reveal" data-reveal>
            <h3>High-Low Relay</h3>
            <p>Predict if the next card goes higher or lower.</p>
            <div className="game-display is-visible">
              Current card: {formatCardValue(highLowCurrent)}
            </div>
            <div className="choice-grid">
              <button type="button" className="game-button" onClick={() => guessHighLow("higher")}>
                Higher
              </button>
              <button type="button" className="game-button" onClick={() => guessHighLow("lower")}>
                Lower
              </button>
            </div>
            <p className="game-status">{highLowMessage}</p>
            <p className="game-meta">
              Score: {highLowScore} | Lives: {highLowLives} | Best: {highLowBest}
            </p>
            <button type="button" className="game-ghost" onClick={resetHighLowGame}>
              Reset Relay
            </button>
          </article>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} shadowlab.dev</p>
      </footer>
    </div>
  );
}
