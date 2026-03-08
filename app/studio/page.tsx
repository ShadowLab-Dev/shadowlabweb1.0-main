import Link from "next/link";

export default function Page() {
  return (
    <main className="subpage-shell">
      <section className="subpage-card">
        <p className="micro-label">shadowlab.dev</p>
        <h1>Studio</h1>
        <p>
          This is a placeholder destination for the Studio page. Replace this copy with your final service positioning, proof points, and offer structure.
        </p>
        <Link className="subpage-back" href="/">
          Back to Gateway
        </Link>
      </section>
    </main>
  );
}
