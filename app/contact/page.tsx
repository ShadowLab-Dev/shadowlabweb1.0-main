import Link from "next/link";

export default function Page() {
  return (
    <main className="subpage-shell">
      <section className="subpage-card">
        <p className="micro-label">shadowlab.dev</p>
        <h1>Contact</h1>
        <p>
          This is a placeholder destination for the Contact page. Add your preferred channels, project intake flow, and availability details here.
        </p>
        <Link className="subpage-back" href="/">
          Back to Gateway
        </Link>
      </section>
    </main>
  );
}
