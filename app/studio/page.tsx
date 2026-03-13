"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const reactorSystems = [
  {
    name: "Field Lattice",
    type: "Background",
    status: "Online",
    detail: "Grid density and response pressure matrix.",
  },
  {
    name: "Atmos Drift",
    type: "Motion",
    status: "Online",
    detail: "Global drift vectors and ambient movement tempo.",
  },
  {
    name: "Orbital Offset",
    type: "Positioning",
    status: "Online",
    detail: "Blob and gradient orbit bias across the full scene.",
  },
  {
    name: "Reactor Tempo",
    type: "Timing",
    status: "Linked",
    detail: "Synchronizes animation rhythm across active layers.",
  },
];

const REACTOR_BG_STORAGE_KEY = "shadowlab-reactor-background";

type ReactorBackgroundState = {
  glowStrength: number;
  gridDensity: number;
  driftAmount: number;
  motionTempo: number;
  gridPresence: number;
  orbitOffset: number;
  gradientTilt: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function applyReactorBackground({
  glowStrength,
  gridDensity,
  driftAmount,
  motionTempo,
  gridPresence,
  orbitOffset,
  gradientTilt,
}: ReactorBackgroundState) {
  const root = document.documentElement;

  const gridSize = Math.round(gridDensity * 1.65);
  const blobBlur = Math.round(32 + glowStrength * 0.76);
  const blobOpacity = (0.16 + glowStrength / 230).toFixed(2);
  const driftDuration = Math.max(6.2, 25 - motionTempo * 0.16 - driftAmount * 0.42).toFixed(2);
  const bodyShift = Math.round(driftAmount * 2 + orbitOffset * 0.3);
  const gridOpacity = (gridPresence / 100).toFixed(2);

  root.style.setProperty("--reactor-grid-size", `${gridSize}px`);
  root.style.setProperty("--reactor-blob-blur", `${blobBlur}px`);
  root.style.setProperty("--reactor-blob-opacity", blobOpacity);
  root.style.setProperty("--reactor-drift-duration", `${driftDuration}s`);
  root.style.setProperty("--reactor-body-shift", `${bodyShift}px`);
  root.style.setProperty("--reactor-grid-opacity", gridOpacity);
  root.style.setProperty("--reactor-blob-shift", `${orbitOffset}px`);
  root.style.setProperty("--reactor-gradient-angle", `${gradientTilt}deg`);
}

function parseStoredBackground(raw: string | null): ReactorBackgroundState | null {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<ReactorBackgroundState>;
    const glowStrength = Number(parsed.glowStrength);
    const gridDensity = Number(parsed.gridDensity);
    const driftAmount = Number(parsed.driftAmount);
    const motionTempo = Number(parsed.motionTempo);
    const gridPresence = Number(parsed.gridPresence);
    const orbitOffset = Number(parsed.orbitOffset);
    const gradientTilt = Number(parsed.gradientTilt);

    if (
      Number.isNaN(glowStrength) ||
      Number.isNaN(gridDensity) ||
      Number.isNaN(driftAmount) ||
      Number.isNaN(motionTempo) ||
      Number.isNaN(gridPresence) ||
      Number.isNaN(orbitOffset) ||
      Number.isNaN(gradientTilt)
    ) {
      return null;
    }

    return {
      glowStrength: clamp(glowStrength, 20, 100),
      gridDensity: clamp(gridDensity, 18, 58),
      driftAmount: clamp(driftAmount, 0, 18),
      motionTempo: clamp(motionTempo, 20, 100),
      gridPresence: clamp(gridPresence, 20, 100),
      orbitOffset: clamp(orbitOffset, -40, 40),
      gradientTilt: clamp(gradientTilt, 140, 200),
    };
  } catch {
    return null;
  }
}

export default function Page() {
  const [glowStrength, setGlowStrength] = useState(64);
  const [gridDensity, setGridDensity] = useState(34);
  const [driftAmount, setDriftAmount] = useState(8);
  const [motionTempo, setMotionTempo] = useState(64);
  const [gridPresence, setGridPresence] = useState(74);
  const [orbitOffset, setOrbitOffset] = useState(0);
  const [gradientTilt, setGradientTilt] = useState(170);

  const hazeOpacity = 0.18 + glowStrength / 290;
  const coreOffset = driftAmount * 0.55 + orbitOffset * 0.18;

  useEffect(() => {
    const stored = parseStoredBackground(
      window.localStorage.getItem(REACTOR_BG_STORAGE_KEY),
    );

    if (!stored) {
      applyReactorBackground({
        glowStrength,
        gridDensity,
        driftAmount,
        motionTempo,
        gridPresence,
        orbitOffset,
        gradientTilt,
      });
      return;
    }

    setGlowStrength(stored.glowStrength);
    setGridDensity(stored.gridDensity);
    setDriftAmount(stored.driftAmount);
    setMotionTempo(stored.motionTempo);
    setGridPresence(stored.gridPresence);
    setOrbitOffset(stored.orbitOffset);
    setGradientTilt(stored.gradientTilt);
    applyReactorBackground(stored);
  }, []);

  useEffect(() => {
    const state = {
      glowStrength,
      gridDensity,
      driftAmount,
      motionTempo,
      gridPresence,
      orbitOffset,
      gradientTilt,
    };
    applyReactorBackground(state);
    window.localStorage.setItem(REACTOR_BG_STORAGE_KEY, JSON.stringify(state));
  }, [
    driftAmount,
    glowStrength,
    gradientTilt,
    gridDensity,
    gridPresence,
    motionTempo,
    orbitOffset,
  ]);

  return (
    <main className="subpage-shell">
      <section className="subpage-card sector-card">
        <p className="micro-label">Sector // Reactor</p>
        <h1>Reactor</h1>
        <p>
          Global background reactor. Every control below adjusts structure and motion across the site. Theme presets still
          control color.
        </p>

        <div className="experiments-grid">
          <article className="reactor-panel">
            <h2>Live Reactor</h2>
            <div className="reactor-preview">
              <div className="reactor-haze" style={{ opacity: hazeOpacity }} />
              <div
                className="reactor-lines"
                style={{
                  backgroundSize: `${gridDensity}px ${gridDensity}px`,
                  opacity: gridPresence / 100,
                }}
              />
              <div
                className="reactor-core"
                style={{
                  transform: `translate(${coreOffset}px, ${-coreOffset}px)`,
                }}
              />
              <p>Background systems linked</p>
            </div>

            <div className="reactor-controls">
              <p className="reactor-note">
                Split control model: Reactor tunes structure and motion, theme presets tune palette.
              </p>

              <label>
                Glow Strength <span>{glowStrength}</span>
                <input
                  type="range"
                  min={20}
                  max={100}
                  value={glowStrength}
                  onChange={(event) => setGlowStrength(Number(event.target.value))}
                />
              </label>

              <label>
                Grid Density <span>{gridDensity}px</span>
                <input
                  type="range"
                  min={18}
                  max={58}
                  value={gridDensity}
                  onChange={(event) => setGridDensity(Number(event.target.value))}
                />
              </label>

              <label>
                Drift Offset <span>{driftAmount}</span>
                <input
                  type="range"
                  min={0}
                  max={18}
                  value={driftAmount}
                  onChange={(event) => setDriftAmount(Number(event.target.value))}
                />
              </label>

              <label>
                Motion Tempo <span>{motionTempo}</span>
                <input
                  type="range"
                  min={20}
                  max={100}
                  value={motionTempo}
                  onChange={(event) => setMotionTempo(Number(event.target.value))}
                />
              </label>

              <label>
                Grid Presence <span>{gridPresence}%</span>
                <input
                  type="range"
                  min={20}
                  max={100}
                  value={gridPresence}
                  onChange={(event) => setGridPresence(Number(event.target.value))}
                />
              </label>

              <label>
                Orbit Offset <span>{orbitOffset}px</span>
                <input
                  type="range"
                  min={-40}
                  max={40}
                  value={orbitOffset}
                  onChange={(event) => setOrbitOffset(Number(event.target.value))}
                />
              </label>

              <label>
                Gradient Tilt <span>{gradientTilt}deg</span>
                <input
                  type="range"
                  min={140}
                  max={200}
                  value={gradientTilt}
                  onChange={(event) => setGradientTilt(Number(event.target.value))}
                />
              </label>
            </div>
          </article>

          <article className="experiments-modules">
            <h2>Reactor Systems</h2>
            <div className="experiments-list">
              {reactorSystems.map((system) => (
                <div key={system.name} className="experiments-item">
                  <p className="experiments-meta">
                    <span>{system.type}</span>
                    <span className={`module-status ${system.status === "Online" ? "is-online" : ""}`}>
                      {system.status}
                    </span>
                  </p>
                  <h3>{system.name}</h3>
                  <p>{system.detail}</p>
                </div>
              ))}
            </div>
          </article>
        </div>

        <Link className="subpage-back" href="/">
          Back to Gateway
        </Link>
      </section>
    </main>
  );
}
