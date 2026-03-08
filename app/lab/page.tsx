import Link from "next/link";

export default function Page() {
  return (
    <main className="subpage-shell">
      <section className="subpage-card">
        <p className="micro-label">shadowlab.dev</p>
        <h1>Lab</h1>
        <p>
          This is a placeholder destination for the Lab page. Use this area for experiments, prototypes, and internal concepts you want to publish.
        </p>
        <Link className="subpage-back" href="/">
          Back to Gateway
        </Link>
      </section>
    </main>
  );
}
