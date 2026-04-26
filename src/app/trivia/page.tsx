"use client";

import Link from "next/link";
import { useState } from "react";
import { useProgress } from "@/lib/progress";

type CategoryId =
  | "geography"
  | "capitals"
  | "history"
  | "science"
  | "arts"
  | "sports"
  | "trivia";

type LevelId = "easy" | "normal" | "hard";

type Category = { id: CategoryId; emoji: string; label: string };
type Level = {
  id: LevelId;
  emoji: string;
  label: string;
  bg: string;
  shadow: string;
};

const CATEGORIES: Category[] = [
  { id: "geography", emoji: "🌍", label: "גאוגרפיה" },
  { id: "capitals", emoji: "🏳️", label: "בירות ודגלים" },
  { id: "history", emoji: "📜", label: "היסטוריה" },
  { id: "science", emoji: "🔬", label: "מדע וטבע" },
  { id: "arts", emoji: "🎨", label: "אומנות ותרבות" },
  { id: "sports", emoji: "🏅", label: "ספורט" },
  { id: "trivia", emoji: "💡", label: "טריוויה" },
];

const LEVELS: Level[] = [
  {
    id: "easy",
    emoji: "🌱",
    label: "קל",
    bg: "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
    shadow: "0 14px 32px -12px rgba(16, 185, 129, 0.55)",
  },
  {
    id: "normal",
    emoji: "⭐",
    label: "רגיל",
    bg: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
    shadow: "0 14px 32px -12px rgba(245, 158, 11, 0.55)",
  },
  {
    id: "hard",
    emoji: "🔥",
    label: "מאתגר",
    bg: "linear-gradient(135deg, #fb7185 0%, #f43f5e 100%)",
    shadow: "0 14px 32px -12px rgba(244, 63, 94, 0.55)",
  },
];

const CATEGORY_ACTIVE_BG =
  "linear-gradient(135deg, #14b8a6 0%, #10b981 100%)";
const CATEGORY_ACTIVE_SHADOW =
  "0 14px 32px -12px rgba(20, 184, 166, 0.55)";

export default function TriviaDashboard() {
  const [category, setCategory] = useState<CategoryId>("geography");
  const [level, setLevel] = useState<LevelId>("easy");
  const progress = useProgress();

  const categoryLabel =
    CATEGORIES.find((c) => c.id === category)?.label ?? "";
  const levelLabel = LEVELS.find((l) => l.id === level)?.label ?? "";

  return (
    <main className="mx-auto w-full max-w-6xl px-5 pb-20 pt-6 sm:px-8">
      <Header totalStars={progress.totalStars} />
      <Hero />
      <MascotBand />
      <Controls
        category={category}
        setCategory={setCategory}
        level={level}
        setLevel={setLevel}
      />
      <LearnSection
        category={category}
        level={level}
        categoryLabel={categoryLabel}
        levelLabel={levelLabel}
      />
    </main>
  );
}

function Header({ totalStars }: { totalStars: number }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 py-4">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3">
          <div
            className="grid h-11 w-11 place-items-center rounded-2xl text-xl text-white shadow-lg shadow-indigo-500/30"
            style={{
              background:
                "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
            }}
          >
            ✨
          </div>
          <span className="text-lg font-extrabold tracking-tight text-ink sm:text-xl">
            ליה לומדת
          </span>
        </Link>

        <Link
          href="/"
          className="ms-2 flex items-center gap-1.5 rounded-full border border-line bg-white/70 px-3.5 py-1.5 text-sm font-semibold text-ink-soft backdrop-blur transition hover:-translate-y-0.5 hover:text-ink hover:shadow-sm"
        >
          <span>← חזרה למקצועות</span>
          <span className="text-ink/30">·</span>
          <span className="font-bold text-ink">ידע כללי</span>
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/parent"
          aria-label="פאנל הורים"
          className="grid h-11 w-11 place-items-center rounded-2xl border border-line bg-white/80 text-lg shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md"
        >
          ⚙️
        </Link>
        <div className="flex h-11 items-center gap-2 rounded-full border border-line bg-white/80 px-4 text-sm font-bold text-ink shadow-sm backdrop-blur">
          <span>⭐</span>
          <span>{totalStars}</span>
        </div>
        <div
          className="grid h-11 w-11 place-items-center rounded-full text-xl shadow-md"
          style={{
            background: "linear-gradient(135deg, #fde68a 0%, #f59e0b 100%)",
          }}
          aria-label="ליה"
        >
          👧
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="mt-6 sm:mt-10">
      <h2 className="text-[40px] font-extrabold leading-tight tracking-tight text-ink sm:text-5xl">
        שלום,{" "}
        <span
          className="bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #14b8a6 0%, #10b981 50%, #06b6d4 100%)",
          }}
        >
          ליה
        </span>{" "}
        🌟
      </h2>
      <p className="mt-2 text-lg font-medium text-ink-soft sm:text-xl">
        בחרי נושא ורמה ובואי נגלה דברים חדשים על העולם
      </p>
    </section>
  );
}

function MascotBand() {
  return (
    <section
      className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl border border-teal-200 p-5 shadow-[0_12px_32px_-20px_rgba(20,184,166,0.4)] sm:flex-nowrap"
      style={{
        background:
          "linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #d1fae5 100%)",
      }}
    >
      <div className="order-2 flex-1 text-center sm:text-right">
        <h3 className="text-lg font-extrabold text-teal-900 sm:text-xl">
          !שלום ליה! אני חוחו 🦉
        </h3>
        <p className="mt-1 text-sm font-medium leading-relaxed text-teal-700 sm:text-base">
          בואי נגלה יחד דברים מדהימים על העולם שלנו! בחרי נושא שמעניין אותך.
        </p>
      </div>

      <div
        className="order-1 text-[40px] leading-none drop-shadow-sm"
        aria-hidden
      >
        🦉
      </div>
    </section>
  );
}

type ControlsProps = {
  category: CategoryId;
  setCategory: (c: CategoryId) => void;
  level: LevelId;
  setLevel: (l: LevelId) => void;
};

function Controls({ category, setCategory, level, setLevel }: ControlsProps) {
  return (
    <section className="mt-8 rounded-[28px] border border-line bg-white/90 p-6 shadow-[0_16px_40px_-20px_rgba(15,21,53,0.15)] backdrop-blur sm:p-7">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-ink-soft">
          בחרי נושא
        </h3>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {CATEGORIES.map((c) => {
            const active = c.id === category;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-all duration-200 ${
                  active
                    ? "text-white"
                    : "border border-line bg-bg-2 text-ink hover:-translate-y-0.5 hover:bg-white hover:shadow-sm"
                }`}
                style={
                  active
                    ? {
                        background: CATEGORY_ACTIVE_BG,
                        boxShadow: CATEGORY_ACTIVE_SHADOW,
                      }
                    : undefined
                }
                aria-pressed={active}
              >
                <span className="text-base">{c.emoji}</span>
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-ink-soft">
          רמת קושי
        </h3>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {LEVELS.map((l) => {
            const active = l.id === level;
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => setLevel(l.id)}
                className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-base font-extrabold transition-all duration-200 ${
                  active
                    ? "text-white"
                    : "border border-line bg-bg-2 text-ink hover:-translate-y-0.5 hover:bg-white hover:shadow-sm"
                }`}
                style={
                  active
                    ? { background: l.bg, boxShadow: l.shadow }
                    : undefined
                }
                aria-pressed={active}
              >
                <span className="text-xl">{l.emoji}</span>
                <span>{l.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

type LearnCard = {
  status: string;
  statusTone: "done" | "new";
  emoji: string;
  iconBg: string;
  iconShadow: string;
  title: string;
  description: string;
  tags: [string, string];
  cta: string;
  ctaTone: "done" | "go";
  href?: string;
};

function LearnSection({
  category,
  level,
  categoryLabel,
  levelLabel,
}: {
  category: CategoryId;
  level: LevelId;
  categoryLabel: string;
  levelLabel: string;
}) {
  const query = `?category=${category}&level=${level}`;
  const cards: LearnCard[] = [
    {
      status: "חדש",
      statusTone: "new",
      emoji: "✍️",
      iconBg: "linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)",
      iconShadow: "0 14px 32px -12px rgba(14, 165, 233, 0.55)",
      title: "תרגול",
      description:
        "15 שאלות חדשות בכל פעם — בואי נראה כמה את יודעת!",
      tags: ["15 שאלות", categoryLabel],
      cta: "התחילי ←",
      ctaTone: "go",
      href: `/trivia/practice${query}`,
    },
    {
      status: "חדש",
      statusTone: "new",
      emoji: "🎯",
      iconBg: "linear-gradient(135deg, #10b981 0%, #22c55e 100%)",
      iconShadow: "0 14px 32px -12px rgba(16, 185, 129, 0.55)",
      title: "מבחן קצר",
      description: "10 שאלות עם מגבלת זמן של 5 דקות",
      tags: ["10 שאלות", "5 דק׳"],
      cta: "התחילי ←",
      ctaTone: "go",
      href: `/trivia/quiz${query}`,
    },
  ];

  return (
    <section className="mt-10">
      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl font-extrabold tracking-tight text-ink sm:text-[26px]">
          למידה ותרגול
        </h3>
        <span className="text-sm font-semibold text-ink-soft">
          {categoryLabel} <span className="text-ink/30">•</span> {levelLabel}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        {cards.map((c) => (
          <LearnCardView key={c.title} card={c} />
        ))}
      </div>
    </section>
  );
}

function LearnCardView({ card }: { card: LearnCard }) {
  const statusClass =
    card.statusTone === "done"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : "bg-teal-50 text-teal-700 border-teal-100";

  const ctaClass =
    card.ctaTone === "done"
      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
      : "bg-ink text-white hover:bg-[#14b8a6]";

  const CTA = (
    <span
      className={`inline-flex w-full items-center justify-center rounded-2xl px-5 py-3 text-base font-extrabold transition-colors duration-200 ${ctaClass}`}
    >
      {card.cta}
    </span>
  );

  return (
    <article className="group flex flex-col gap-5 rounded-[24px] border border-line bg-white p-6 shadow-[0_12px_32px_-20px_rgba(15,21,53,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-20px_rgba(15,21,53,0.3)]">
      <div className="flex items-start justify-between">
        <div
          className="grid h-14 w-14 place-items-center rounded-2xl text-2xl text-white"
          style={{ background: card.iconBg, boxShadow: card.iconShadow }}
          aria-hidden
        >
          {card.emoji}
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-extrabold ${statusClass}`}
        >
          {card.status}
        </span>
      </div>

      <div>
        <h4 className="text-[22px] font-extrabold tracking-tight text-ink">
          {card.title}
        </h4>
        <p className="mt-1.5 text-sm font-medium leading-relaxed text-ink-soft">
          {card.description}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {card.tags.map((t) => (
          <span
            key={t}
            className="rounded-full border border-line bg-bg-2 px-3 py-1 text-xs font-bold text-ink-soft"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-auto">
        {card.href ? <Link href={card.href}>{CTA}</Link> : CTA}
      </div>
    </article>
  );
}

