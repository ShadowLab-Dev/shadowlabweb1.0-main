"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const modules = [
  {
    name: "Lattice Drift",
    type: "Motion",
    status: "Online",
    detail: "Adaptive line motion, offset by viewport depth and user input.",
  },
  {
    name: "Pulse Scanner",
    type: "Interface",
    status: "Online",
    detail: "Signal sweep overlays for cards, nav surfaces, and panel frames.",
  },
  {
    name: "Void Particles",
    type: "Visual",
    status: "Calibrating",
    detail: "Dynamic particle streams with per-theme color pressure.",
  },
  {
    name: "Holo Layers",
    type: "Composition",
    status: "Staged",
    detail: "Multi-plane blur and glass depth experiments for UI shells.",
  },
];

const REACTOR_BG_STORAGE_KEY = "shadowlab-reactor-background";

type ReactorBackgroundState = {
  glowStrength: number;
  gridDensity: number;
  driftAmount: number;
};

function applyReactorBackground({
  glowStrength,
  gridDensity,
  driftAmount,
}: ReactorBackgroundState) {
  const root = document.documentElement;

  const gridSize = Math.round(gridDensity * 1.65);
  const blobBlur = Math.round(36 + glowStrength * 0.72);
  const blobOpacity = (0.2 + glowStrength / 240).toFixed(2);
  const driftDuration = Math.max(8.5, 20 - driftAmount * 0.62).toFixed(2);
  const bodyShift = Math.round(driftAmount * 2.2);

  root.style.setProperty("--reactor-grid-size", `${gridSize}px`);
  root.style.setProperty("--reactor-blob-blur", `${blobBlur}px`);
  root.style.setProperty("--reactor-blob-opacity", blobOpacity);
  root.style.setProperty("--reactor-drift-duration", `${driftDuration}s`);
  root.style.setProperty("--reactor-body-shift", `${bodyShift}px`);
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

    if (
      Number.isNaN(glowStrength) ||
      Number.isNaN(gridDensity) ||
      Number.isNaN(driftAmount)
    ) {
      return null;
    }

    return {
      glowStrength: Math.min(100, Math.max(20, glowStrength)),
      gridDensity: Math.min(58, Math.max(18, gridDensity)),
      driftAmount: Math.min(18, Math.max(0, driftAmount)),
    };
  } catch {
    return null;
  }
}

export default function Page() {
  const [glowStrength, setGlowStrength] = useState(64);
  const [gridDensity, setGridDensity] = useState(34);
  const [driftAmount, setDriftAmount] = useState(8);

  const hazeOpacity = 0.2 + glowStrength / 300;
  const coreOffset = driftAmount * 0.6;

  useEffect(() => {
    const stored = parseStoredBackground(
      window.localStorage.getItem(REACTOR_BG_STORAGE_KEY),
    );

    if (!stored) {
      applyReactorBackground({ glowStrength, gridDensity, driftAmount });
      return;
    }

    setGlowStrength(stored.glowStrength);
    setGridDensity(stored.gridDensity);
    setDriftAmount(stored.driftAmount);
    applyReactorBackground(stored);
  }, []);

  useEffect(() => {
    const backgroundState = { glowStrength, gridDensity, driftAmount };
    applyReactorBackground(backgroundState);
    window.localStorage.setItem(
      REACTOR_BG_STORAGE_KEY,
      JSON.stringify(backgroundState),
    );
  }, [driftAmount, glowStrength, gridDensity]);

  return (
    <main className="subpage-shell">
      <section className="subpage-card sector-card">
        <p className="micro-label">Sector // Experiments</p>
        <h1>Experiments</h1>
        <p>
          ShadowLab test floor for visual systems, interaction loops, and UI behavior probes. Tune the reactor below to test
          a live preview profile.
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
                }}
              />
              <div
                className="reactor-core"
                style={{
                  transform: `translate(${coreOffset}px, ${-coreOffset}px)`,
                }}
              />
              <p>Preview feed synchronized</p>
            </div>

            <div className="reactor-controls">
              <p className="reactor-note">
                Reactor tuning changes global background behavior. Theme presets determine color.
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
            </div>
          </article>

          <article className="experiments-modules">
            <h2>Active Modules</h2>
            <div className="experiments-list">
              {modules.map((module) => (
                <div key={module.name} className="experiments-item">
                  <p className="experiments-meta">
                    <span>{module.type}</span>
                    <span className={`module-status ${module.status === "Online" ? "is-online" : ""}`}>
                      {module.status}
                    </span>
                  </p>
                  <h3>{module.name}</h3>
                  <p>{module.detail}</p>
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
