import Link from "next/link";

export default function Page() {
  return (
    <main className="subpage-shell">
      <section className="subpage-card">
        <p className="micro-label">shadowlab.dev</p>
        <h1>Work</h1>
        <p>
          This is a placeholder destination for the Work page. Replace this section with case studies, outcomes, and project highlights for shadowlab.dev.
        </p>
        <Link className="subpage-back" href="/">
          Back to Gateway
        </Link>
      </section>
    </main>
  );
}
