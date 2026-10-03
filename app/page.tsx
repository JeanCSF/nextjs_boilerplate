import Link from 'next/link';

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
      <p className="text-primary mb-4 text-sm font-semibold tracking-[0.18em] uppercase">
        Application foundation
      </p>
      <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
        A dependable starting point for your next application.
      </h1>
      <p className="text-foreground/70 mt-6 max-w-2xl text-lg leading-8">
        Secure defaults, a small client surface, and clear conventions—without a preselected product
        domain or infrastructure provider.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          className="bg-primary text-primary-foreground rounded-full px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90 focus-visible:outline-offset-4"
          href="/streaming"
        >
          View the streaming example
        </Link>
        <a
          className="border-foreground/20 hover:bg-foreground/5 rounded-full border px-5 py-3 text-sm font-semibold transition-colors"
          href="https://nextjs.org/docs"
          rel="noreferrer"
          target="_blank"
        >
          Next.js documentation
        </a>
      </div>
      <section
        aria-labelledby="included-heading"
        className="border-foreground/10 mt-20 border-t pt-8"
      >
        <h2 className="text-lg font-semibold" id="included-heading">
          A focused foundation
        </h2>
        <ul className="text-foreground/70 mt-5 grid gap-3 sm:grid-cols-2">
          <li>App Router with Server Components by default</li>
          <li>Type-safe configuration and request validation</li>
          <li>Light and dark themes with no initial flash</li>
          <li>Automated quality, security, and performance checks</li>
        </ul>
      </section>
    </main>
  );
}
