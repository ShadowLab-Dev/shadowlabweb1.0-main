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
  blobScale: number;
  gridTilt: number;
  atmosphere: number;
  vignette: number;
  axisShift: number;
};

const DEFAULT_REACTOR_STATE: ReactorBackgroundState = {
  glowStrength: 64,
  gridDensity: 34,
  driftAmount: 8,
  motionTempo: 64,
  gridPresence: 74,
  orbitOffset: 0,
  gradientTilt: 170,
  blobScale: 100,
  gridTilt: 0,
  atmosphere: 18,
  vignette: 14,
  axisShift: 0,
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
  blobScale,
  gridTilt,
  atmosphere,
  vignette,
  axisShift,
}: ReactorBackgroundState) {
  const root = document.documentElement;

  const gridSize = Math.round(gridDensity * 1.65);
  const blobBlur = Math.round(32 + glowStrength * 0.76);
  const blobOpacity = clamp(0.16 + glowStrength / 230, 0.12, 1).toFixed(2);
  const driftDuration = Math.max(6.2, 25 - motionTempo * 0.16 - driftAmount * 0.42).toFixed(2);
  const bodyShift = Math.round(driftAmount * 2 + orbitOffset * 0.3);
  const gridOpacity = (gridPresence / 100).toFixed(2);
  const blobScaleValue = (blobScale / 100).toFixed(2);
  const atmosphereOpacity = (atmosphere / 100).toFixed(2);
  const vignetteOpacity = (vignette / 100).toFixed(2);

  root.style.setProperty("--reactor-grid-size", `${gridSize}px`);
  root.style.setProperty("--reactor-blob-blur", `${blobBlur}px`);
  root.style.setProperty("--reactor-blob-opacity", blobOpacity);
  root.style.setProperty("--reactor-drift-duration", `${driftDuration}s`);
  root.style.setProperty("--reactor-body-shift", `${bodyShift}px`);
  root.style.setProperty("--reactor-grid-opacity", gridOpacity);
  root.style.setProperty("--reactor-blob-shift", `${orbitOffset}px`);
  root.style.setProperty("--reactor-gradient-angle", `${gradientTilt}deg`);
  root.style.setProperty("--reactor-blob-scale", blobScaleValue);
  root.style.setProperty("--reactor-grid-tilt", `${gridTilt}deg`);
  root.style.setProperty("--reactor-atmos-opacity", atmosphereOpacity);
  root.style.setProperty("--reactor-vignette-strength", vignetteOpacity);
  root.style.setProperty("--reactor-axis-shift", `${axisShift}px`);
}

function parseStoredBackground(raw: string | null): ReactorBackgroundState | null {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<ReactorBackgroundState>;

    const numberOrFallback = (value: unknown, fallback: number) => {
      const parsedValue = Number(value);
      return Number.isNaN(parsedValue) ? fallback : parsedValue;
    };

    return {
      glowStrength: clamp(numberOrFallback(parsed.glowStrength, DEFAULT_REACTOR_STATE.glowStrength), 0, 220),
      gridDensity: clamp(numberOrFallback(parsed.gridDensity, DEFAULT_REACTOR_STATE.gridDensity), 6, 140),
      driftAmount: clamp(numberOrFallback(parsed.driftAmount, DEFAULT_REACTOR_STATE.driftAmount), 0, 60),
      motionTempo: clamp(numberOrFallback(parsed.motionTempo, DEFAULT_REACTOR_STATE.motionTempo), 0, 220),
      gridPresence: clamp(numberOrFallback(parsed.gridPresence, DEFAULT_REACTOR_STATE.gridPresence), 0, 100),
      orbitOffset: clamp(numberOrFallback(parsed.orbitOffset, DEFAULT_REACTOR_STATE.orbitOffset), -160, 160),
      gradientTilt: clamp(numberOrFallback(parsed.gradientTilt, DEFAULT_REACTOR_STATE.gradientTilt), 0, 360),
      blobScale: clamp(numberOrFallback(parsed.blobScale, DEFAULT_REACTOR_STATE.blobScale), 20, 320),
      gridTilt: clamp(numberOrFallback(parsed.gridTilt, DEFAULT_REACTOR_STATE.gridTilt), -60, 60),
      atmosphere: clamp(numberOrFallback(parsed.atmosphere, DEFAULT_REACTOR_STATE.atmosphere), 0, 100),
      vignette: clamp(numberOrFallback(parsed.vignette, DEFAULT_REACTOR_STATE.vignette), 0, 100),
      axisShift: clamp(numberOrFallback(parsed.axisShift, DEFAULT_REACTOR_STATE.axisShift), -140, 140),
    };
  } catch {
    return null;
  }
}

export default function Page() {
  const [glowStrength, setGlowStrength] = useState(DEFAULT_REACTOR_STATE.glowStrength);
  const [gridDensity, setGridDensity] = useState(DEFAULT_REACTOR_STATE.gridDensity);
  const [driftAmount, setDriftAmount] = useState(DEFAULT_REACTOR_STATE.driftAmount);
  const [motionTempo, setMotionTempo] = useState(DEFAULT_REACTOR_STATE.motionTempo);
  const [gridPresence, setGridPresence] = useState(DEFAULT_REACTOR_STATE.gridPresence);
  const [orbitOffset, setOrbitOffset] = useState(DEFAULT_REACTOR_STATE.orbitOffset);
  const [gradientTilt, setGradientTilt] = useState(DEFAULT_REACTOR_STATE.gradientTilt);
  const [blobScale, setBlobScale] = useState(DEFAULT_REACTOR_STATE.blobScale);
  const [gridTilt, setGridTilt] = useState(DEFAULT_REACTOR_STATE.gridTilt);
  const [atmosphere, setAtmosphere] = useState(DEFAULT_REACTOR_STATE.atmosphere);
  const [vignette, setVignette] = useState(DEFAULT_REACTOR_STATE.vignette);
  const [axisShift, setAxisShift] = useState(DEFAULT_REACTOR_STATE.axisShift);

  const hazeOpacity = 0.18 + glowStrength / 290;
  const coreOffset = driftAmount * 0.55 + orbitOffset * 0.18 + axisShift * 0.12;

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
        blobScale,
        gridTilt,
        atmosphere,
        vignette,
        axisShift,
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
    setBlobScale(stored.blobScale);
    setGridTilt(stored.gridTilt);
    setAtmosphere(stored.atmosphere);
    setVignette(stored.vignette);
    setAxisShift(stored.axisShift);
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
      blobScale,
      gridTilt,
      atmosphere,
      vignette,
      axisShift,
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
    blobScale,
    gridTilt,
    atmosphere,
    vignette,
    axisShift,
  ]);

  const resetReactor = () => {
    setGlowStrength(DEFAULT_REACTOR_STATE.glowStrength);
    setGridDensity(DEFAULT_REACTOR_STATE.gridDensity);
    setDriftAmount(DEFAULT_REACTOR_STATE.driftAmount);
    setMotionTempo(DEFAULT_REACTOR_STATE.motionTempo);
    setGridPresence(DEFAULT_REACTOR_STATE.gridPresence);
    setOrbitOffset(DEFAULT_REACTOR_STATE.orbitOffset);
    setGradientTilt(DEFAULT_REACTOR_STATE.gradientTilt);
    setBlobScale(DEFAULT_REACTOR_STATE.blobScale);
    setGridTilt(DEFAULT_REACTOR_STATE.gridTilt);
    setAtmosphere(DEFAULT_REACTOR_STATE.atmosphere);
    setVignette(DEFAULT_REACTOR_STATE.vignette);
    setAxisShift(DEFAULT_REACTOR_STATE.axisShift);
  };

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
                  min={0}
                  max={220}
                  value={glowStrength}
                  onChange={(event) => setGlowStrength(Number(event.target.value))}
                />
              </label>

              <label>
                Grid Density <span>{gridDensity}px</span>
                <input
                  type="range"
                  min={6}
                  max={140}
                  value={gridDensity}
                  onChange={(event) => setGridDensity(Number(event.target.value))}
                />
              </label>

              <label>
                Drift Offset <span>{driftAmount}</span>
                <input
                  type="range"
                  min={0}
                  max={60}
                  value={driftAmount}
                  onChange={(event) => setDriftAmount(Number(event.target.value))}
                />
              </label>

              <label>
                Motion Tempo <span>{motionTempo}</span>
                <input
                  type="range"
                  min={0}
                  max={220}
                  value={motionTempo}
                  onChange={(event) => setMotionTempo(Number(event.target.value))}
                />
              </label>

              <label>
                Grid Presence <span>{gridPresence}%</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={gridPresence}
                  onChange={(event) => setGridPresence(Number(event.target.value))}
                />
              </label>

              <label>
                Orbit Offset <span>{orbitOffset}px</span>
                <input
                  type="range"
                  min={-160}
                  max={160}
                  value={orbitOffset}
                  onChange={(event) => setOrbitOffset(Number(event.target.value))}
                />
              </label>

              <label>
                Gradient Tilt <span>{gradientTilt}deg</span>
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={gradientTilt}
                  onChange={(event) => setGradientTilt(Number(event.target.value))}
                />
              </label>

              <label>
                Blob Scale <span>{blobScale}%</span>
                <input
                  type="range"
                  min={20}
                  max={320}
                  value={blobScale}
                  onChange={(event) => setBlobScale(Number(event.target.value))}
                />
              </label>

              <label>
                Grid Tilt <span>{gridTilt}deg</span>
                <input
                  type="range"
                  min={-60}
                  max={60}
                  value={gridTilt}
                  onChange={(event) => setGridTilt(Number(event.target.value))}
                />
              </label>

              <label>
                Atmosphere <span>{atmosphere}%</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={atmosphere}
                  onChange={(event) => setAtmosphere(Number(event.target.value))}
                />
              </label>

              <label>
                Vignette <span>{vignette}%</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={vignette}
                  onChange={(event) => setVignette(Number(event.target.value))}
                />
              </label>

              <label>
                Axis Shift <span>{axisShift}px</span>
                <input
                  type="range"
                  min={-140}
                  max={140}
                  value={axisShift}
                  onChange={(event) => setAxisShift(Number(event.target.value))}
                />
              </label>

              <button type="button" className="reactor-reset game-ghost" onClick={resetReactor}>
                Reset To Defaults
              </button>
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
