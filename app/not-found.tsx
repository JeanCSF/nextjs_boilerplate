import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-foreground/70 mt-4">The page you requested does not exist.</p>
      <Link className="text-primary mt-8 inline-block underline underline-offset-4" href="/">
        Return home
      </Link>
    </main>
  );
}
