const offerings = [
  {
    title: "Web Platforms",
    description:
      "Conversion-focused sites and SaaS frontends engineered for speed, scale, and maintainability.",
  },
  {
    title: "Product Engineering",
    description:
      "From MVP to mature product: architecture, delivery systems, and iterative feature development.",
  },
  {
    title: "Design Systems",
    description:
      "Reusable UI foundations that keep product teams shipping quickly without breaking consistency.",
  },
];

const metrics = [
  { value: "95+", label: "Lighthouse score baseline" },
  { value: "3x", label: "Faster release velocity targets" },
  { value: "24/7", label: "Performance monitoring mindset" },
  { value: "0 to 1", label: "End-to-end product ownership" },
];

const projects = [
  {
    name: "Pulseboard",
    type: "Analytics Dashboard",
    summary:
      "Unified product, marketing, and revenue intelligence into a real-time executive control center.",
  },
  {
    name: "ForgeOps",
    type: "Operations Platform",
    summary:
      "Replaced spreadsheet-heavy workflows with a resilient internal platform and automated reporting.",
  },
  {
    name: "Cipher Commerce",
    type: "E-commerce Stack",
    summary:
      "Built a modular storefront architecture with rapid campaign deployment and measurable conversion lift.",
  },
];

export default function Home() {
  return (
    <div className="site-shell">
      <div className="bg-orb bg-orb-a" aria-hidden />
      <div className="bg-orb bg-orb-b" aria-hidden />

      <header className="site-header">
        <a className="brand" href="#top">
          <span className="brand-mark">S</span>
          <span>shadowlab.dev</span>
        </a>
        <nav className="top-nav" aria-label="Primary">
          <a href="#services">Services</a>
          <a href="#work">Work</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero section">
          <p className="eyebrow">Independent Digital Product Studio</p>
          <h1>
            We build bold web experiences for teams that move fast.
          </h1>
          <p className="hero-copy">
            Shadowlab partners with startups and established companies to
            design, engineer, and scale digital products that are fast,
            memorable, and production-ready.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#contact">
              Start a Project
            </a>
            <a className="btn btn-ghost" href="#work">
              View Case Studies
            </a>
          </div>
        </section>

        <section id="services" className="section">
          <div className="section-head">
            <p className="eyebrow">Capabilities</p>
            <h2>Built for product teams with high standards.</h2>
          </div>
          <div className="card-grid">
            {offerings.map((item) => (
              <article key={item.title} className="card reveal-up">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section stats-section">
          <div className="stats-grid">
            {metrics.map((metric) => (
              <article key={metric.label} className="stat-card reveal-up">
                <p className="stat-value">{metric.value}</p>
                <p className="stat-label">{metric.label}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="work" className="section">
          <div className="section-head">
            <p className="eyebrow">Selected Work</p>
            <h2>Practical outcomes, not just polished mockups.</h2>
          </div>
          <div className="project-grid">
            {projects.map((project) => (
              <article key={project.name} className="project-card reveal-up">
                <p className="project-type">{project.type}</p>
                <h3>{project.name}</h3>
                <p>{project.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="section contact-section">
          <p className="eyebrow">Let&apos;s Build</p>
          <h2>Need a partner who can ship and scale with you?</h2>
          <p>
            Tell us what you are building and where the current bottlenecks are.
            We will map a delivery plan and start quickly.
          </p>
          <a className="btn btn-primary" href="mailto:hello@shadowlab.dev">
            hello@shadowlab.dev
          </a>
        </section>
      </main>

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} Shadowlab. All rights reserved.</p>
      </footer>
    </div>
  );
}
