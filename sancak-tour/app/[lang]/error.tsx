"use client";
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 pb-20 pt-40 text-center">
      <h1 className="font-display text-4xl font-semibold text-forest">Something went wrong</h1>
      <button onClick={reset} className="btn-primary mt-8">Try again</button>
    </section>
  );
}
