"use client";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background p-4">
      <div className="flex flex-col items-center gap-4 max-w-md text-center">
        <h1 className="font-display text-3xl font-medium">Something went wrong</h1>
        <p className="text-sm text-muted-foreground">
          {error.message || "An unexpected error occurred."}
        </p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center px-6 h-10 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-charcoal transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
