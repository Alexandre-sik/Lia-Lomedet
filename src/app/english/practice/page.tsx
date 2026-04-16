import Link from "next/link";

export default function EnglishPracticePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
        תרגול אנגלית — בקרוב!
      </h1>
      <Link
        href="/english"
        className="rounded-full border border-line bg-white/80 px-6 py-3 text-base font-bold text-ink shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md"
      >
        ← חזרה לאנגלית
      </Link>
    </main>
  );
}
