import { Suspense } from 'react';
import { StreamedContent } from '@/components/streamed-content';

export default function StreamingPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="text-3xl font-semibold tracking-tight">Streaming example</h1>
      <Suspense
        fallback={
          <p aria-live="polite" className="text-foreground/70 mt-6">
            Loading streamed content…
          </p>
        }
      >
        <div className="mt-6">
          <StreamedContent />
        </div>
      </Suspense>
    </main>
  );
}
