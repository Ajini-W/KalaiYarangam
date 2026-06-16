export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface px-6 text-center">
      <span className="text-5xl">📡</span>
      <div>
        <h1 className="text-xl font-semibold text-text-primary">You&apos;re offline</h1>
        <p className="mt-1 text-sm text-text-secondary">Check your internet connection and try again.</p>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 inline-flex h-9 items-center rounded-[var(--radius-md)] bg-brand-500 px-4 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
      >
        Retry
      </button>
    </div>
  );
}
