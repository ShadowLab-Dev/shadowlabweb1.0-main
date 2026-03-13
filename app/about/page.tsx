import Link from "next/link";

const archiveNodes = [
  {
    name: "fmhy",
    url: "https://fmhy.net/",
    category: "Resource Atlas",
    note: "Massive discovery index with practical tools and deep link trails.",
  },
  {
    name: "ToS;DR",
    url: "https://tosdr.org/en",
    category: "Privacy Intel",
    note: "Service terms transparency ratings and summaries for safer browsing choices.",
  },
  {
    name: "No Hello",
    url: "https://nohello.net/",
    category: "Comms Protocol",
    note: "A concise etiquette reference for clearer, faster chat collaboration.",
  },
  {
    name: "Don't Ask To Ask",
    url: "https://dontasktoask.com/",
    category: "Help Signal",
    note: "Simple guidance on asking technical questions that get better responses.",
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
