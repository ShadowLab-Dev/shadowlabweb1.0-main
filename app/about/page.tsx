import Link from "next/link";

const archiveNodes = [
  {
    name: "FMHY",
    url: "https://fmhy.net/",
    category: "Resource Atlas",
    note: "Massive discovery index with practical tools and deep link trails.",
  },
  {
    name: "Codrops",
    url: "https://tympanus.net/codrops/",
    category: "Creative Dev",
    note: "Excellent references for interactive layouts and experimental UI motion.",
  },
  {
    name: "Awwwards",
    url: "https://www.awwwards.com/",
    category: "Showcase",
    note: "Great for tracking current patterns in high-end visual web design.",
  },
  {
    name: "Godly",
    url: "https://godly.website/",
    category: "Curated Gallery",
    note: "Strong curation of modern styles, interfaces, and direction shifts.",
  },
  {
    name: "Hoverstat.es",
    url: "https://www.hoverstat.es/",
    category: "Interaction Index",
    note: "Quick scan of animation-forward sites sorted by visual language.",
  },
  {
    name: "Httpster",
    url: "https://httpster.net/",
    category: "Archive",
    note: "Long-running index for finding unusual and memorable web aesthetics.",
  },
  {
    name: "Lapa Ninja",
    url: "https://www.lapa.ninja/",
    category: "Landing References",
    note: "Useful for component ideas, hierarchy, and conversion-friendly layouts.",
  },
  {
    name: "CSS Design Awards",
    url: "https://www.cssdesignawards.com/",
    category: "Award Feed",
    note: "Helpful benchmark for polished production visuals and transitions.",
  },
];

export default function Page() {
  return (
    <main className="subpage-shell">
      <section className="subpage-card sector-card">
        <p className="micro-label">Sector // Archive</p>
        <h1>Archive</h1>
        <p>
          Curated references for visual direction, interaction systems, and modern web atmosphere. Each node below is chosen
          for practical inspiration inside ShadowLab.
        </p>

        <div className="archive-grid">
          {archiveNodes.map((node) => (
            <article key={node.url} className="archive-card">
              <p className="archive-meta">
                <span>{node.category}</span>
              </p>
              <h2>{node.name}</h2>
              <p>{node.note}</p>
              <a href={node.url} target="_blank" rel="noreferrer">
                Open Node
              </a>
            </article>
          ))}
        </div>

        <Link className="subpage-back" href="/">
          Back to Gateway
        </Link>
      </section>
    </main>
  );
}
