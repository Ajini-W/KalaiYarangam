"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 text-center">
        <span className="text-7xl font-bold text-gray-200">500</span>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Something went wrong</h1>
          <p className="mt-1 text-sm text-gray-500">An unexpected error occurred. Please try again.</p>
        </div>
        <button
          onClick={reset}
          className="mt-2 inline-flex h-9 items-center rounded-lg bg-indigo-500 px-4 text-sm font-medium text-white hover:bg-indigo-600 transition-colors"
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
