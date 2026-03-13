import Link from "next/link";

const queuedExperiments = [
  {
    name: "Particle Storm",
    detail: "Fullscreen particle field with density and turbulence controls.",
  },
  {
    name: "Signal Distortion",
    detail: "Scanline distortion pass for panel edges and transition overlays.",
  },
  {
    name: "Parallax Vault",
    detail: "Depth-layer page transitions with staggered sector reveals.",
  },
  {
    name: "Holo Console",
    detail: "Command-centric UI shell with modular app cards and hidden modes.",
  },
];

export default function Page() {
  return (
    <main className="subpage-shell">
      <section className="subpage-card sector-card">
        <p className="micro-label">Sector // Experiments</p>
        <h1>Experiments</h1>
        <p>
          This sector is now a staging floor for incoming demos. Live global background tuning has moved to the Reactor
          sector.
        </p>

        <div className="experiments-list">
          {queuedExperiments.map((experiment) => (
            <article key={experiment.name} className="experiments-item">
              <h3>{experiment.name}</h3>
              <p>{experiment.detail}</p>
            </article>
          ))}
        </div>

        <Link className="subpage-back" href="/studio">
          Open Reactor
        </Link>
      </section>
    </main>
  );
}
