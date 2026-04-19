import Link from "next/link";

export default function PizzeriaGamePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="text-7xl" aria-hidden>
        🍕
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
        פיצרייה — בקרוב!
      </h1>
      <p className="max-w-md text-base font-medium text-ink-soft">
        משחק שברים עם פיצה — בעבודה. בינתיים את יכולה לנסות משחק אחר.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/math/games/mul-race"
          className="rounded-2xl px-6 py-3 text-base font-extrabold text-white shadow-md transition hover:-translate-y-0.5"
          style={{
            background:
              "linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #ec4899 100%)",
          }}
        >
          🚀 מסע הכפל
        </Link>
        <Link
          href="/math"
          className="rounded-full border border-line bg-white/90 px-5 py-3 text-sm font-bold text-ink shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          ← חזרה לכל המשחקים
        </Link>
      </div>
    </main>
  );
}
