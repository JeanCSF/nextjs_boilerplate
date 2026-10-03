'use client';

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-5xl px-6 py-20" role="alert">
      <h1 className="text-3xl font-semibold tracking-tight">Something went wrong</h1>
      <p className="text-foreground/70 mt-4">An unexpected error occurred. Please try again.</p>
      <button
        className="bg-primary text-primary-foreground mt-8 rounded-full px-5 py-3 text-sm font-semibold"
        onClick={reset}
        type="button"
      >
        Try again
      </button>
    </main>
  );
}
