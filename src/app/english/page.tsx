"use client";

import Link from "next/link";
import { useState } from "react";

type SubjectId =
  | "letters"
  | "vocab"
  | "reading"
  | "writing"
  | "speaking"
  | "grammar"
  | "songs";

type LevelId = "easy" | "normal" | "hard";

type Subject = { id: SubjectId; emoji: string; label: string };
type Level = {
  id: LevelId;
  emoji: string;
  label: string;
  bg: string;
  shadow: string;
};

const SUBJECTS: Subject[] = [
  { id: "letters", emoji: "🔤", label: "אותיות וצלילים" },
  { id: "vocab", emoji: "💬", label: "אוצר מילים" },
  { id: "reading", emoji: "📖", label: "קריאה" },
  { id: "writing", emoji: "✏️", label: "כתיבה" },
  { id: "speaking", emoji: "🗣️", label: "דיבור והאזנה" },
  { id: "grammar", emoji: "📝", label: "דקדוק בסיסי" },
  { id: "songs", emoji: "🎵", label: "שירים וחרוזים" },
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

const SUBJECT_ACTIVE_BG =
  "linear-gradient(135deg, #f43f5e 0%, #f97316 100%)";
const SUBJECT_ACTIVE_SHADOW =
  "0 14px 32px -12px rgba(244, 63, 94, 0.55)";

export default function EnglishDashboard() {
  const [subject, setSubject] = useState<SubjectId>("vocab");
  const [level, setLevel] = useState<LevelId>("easy");

  const subjectLabel =
    SUBJECTS.find((s) => s.id === subject)?.label ?? "";
  const levelLabel = LEVELS.find((l) => l.id === level)?.label ?? "";

  return (
    <main className="mx-auto w-full max-w-6xl px-5 pb-20 pt-6 sm:px-8">
      <Header />
      <Hero />
      <MascotBand />
      <Controls
        subject={subject}
        setSubject={setSubject}
        level={level}
        setLevel={setLevel}
      />
      <MissionBar />
      <LearnSection
        subject={subject}
        level={level}
        subjectLabel={subjectLabel}
        levelLabel={levelLabel}
      />
      <GamesSection />
    </main>
  );
}

function Header() {
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
          <span className="font-bold text-ink">אנגלית</span>
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          aria-label="פאנל הורים"
          className="grid h-11 w-11 place-items-center rounded-2xl border border-line bg-white/80 text-lg shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md"
        >
          ⚙️
        </button>
        <div className="flex h-11 items-center gap-2 rounded-full border border-line bg-white/80 px-4 text-sm font-bold text-ink shadow-sm backdrop-blur">
          <span>⭐</span>
          <span>87</span>
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
              "linear-gradient(135deg, #f43f5e 0%, #f97316 50%, #fbbf24 100%)",
          }}
        >
          ליה
        </span>{" "}
        🌟
      </h2>
      <p className="mt-2 text-lg font-medium text-ink-soft sm:text-xl">
        בחרי נושא, רמה ומה את רוצה ללמוד היום
      </p>
    </section>
  );
}

function MascotBand() {
  return (
    <section
      className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl border border-orange-200 p-5 shadow-[0_12px_32px_-20px_rgba(249,115,22,0.4)] sm:flex-nowrap"
      style={{
        background:
          "linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fde68a 100%)",
      }}
    >
      <div className="flex-1 order-2 text-center sm:text-right">
        <h3 className="text-lg font-extrabold text-orange-900 sm:text-xl">
          !Hi Lia! I&apos;m Pepe 🎉
        </h3>
        <p className="mt-1 text-sm font-medium leading-relaxed text-orange-700 sm:text-base">
          היום נלמד מילים חדשות על חיות ומשפחה. לחצי על הרמקול כדי לשמוע אותי!
        </p>
      </div>

      <button
        type="button"
        aria-label="השמיעי את פפה"
        className="order-3 grid h-12 w-12 flex-shrink-0 place-items-center rounded-xl border border-orange-300 bg-white text-xl text-orange-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      >
        🔊
      </button>

      <div
        className="order-1 text-[40px] leading-none drop-shadow-sm"
        aria-hidden
      >
        🦜
      </div>
    </section>
  );
}

type ControlsProps = {
  subject: SubjectId;
  setSubject: (s: SubjectId) => void;
  level: LevelId;
  setLevel: (l: LevelId) => void;
};

function Controls({ subject, setSubject, level, setLevel }: ControlsProps) {
  return (
    <section className="mt-8 rounded-[28px] border border-line bg-white/90 p-6 shadow-[0_16px_40px_-20px_rgba(15,21,53,0.15)] backdrop-blur sm:p-7">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-ink-soft">
          בחרי נושא
        </h3>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {SUBJECTS.map((s) => {
            const active = s.id === subject;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSubject(s.id)}
                className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-all duration-200 ${
                  active
                    ? "text-white"
                    : "border border-line bg-bg-2 text-ink hover:-translate-y-0.5 hover:bg-white hover:shadow-sm"
                }`}
                style={
                  active
                    ? {
                        background: SUBJECT_ACTIVE_BG,
                        boxShadow: SUBJECT_ACTIVE_SHADOW,
                      }
                    : undefined
                }
                aria-pressed={active}
              >
                <span className="text-base">{s.emoji}</span>
                <span>{s.label}</span>
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

function MissionBar() {
  const progress = 33;
  return (
    <section
      className="relative mt-8 overflow-hidden rounded-[28px] p-6 shadow-[0_20px_50px_-20px_rgba(127,29,29,0.55)] sm:p-7"
      style={{
        background:
          "linear-gradient(135deg, #0f1535 0%, #4c1d1d 50%, #7f1d1d 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full opacity-40 blur-3xl"
        style={{ background: "#f43f5e" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-10 h-56 w-56 rounded-full opacity-25 blur-3xl"
        style={{ background: "#f97316" }}
        aria-hidden
      />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
        <div
          className="grid h-16 w-16 flex-shrink-0 place-items-center rounded-2xl text-3xl shadow-lg"
          style={{
            background: "linear-gradient(135deg, #fde047 0%, #f59e0b 100%)",
            boxShadow: "0 14px 32px -12px rgba(245, 158, 11, 0.6)",
          }}
          aria-hidden
        >
          🎯
        </div>

        <div className="flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-lg font-bold text-white sm:text-xl">
              המשימה היומית שלך
            </h3>
            <div className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #fde047 0%, #34d399 100%)",
                }}
              >
                1
              </span>
              <span className="text-white/60"> / 3</span>
            </div>
          </div>

          <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background:
                  "linear-gradient(90deg, #34d399 0%, #10b981 100%)",
                boxShadow: "0 0 16px 2px rgba(16, 185, 129, 0.7)",
              }}
            />
          </div>
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
  subject,
  level,
  subjectLabel,
  levelLabel,
}: {
  subject: SubjectId;
  level: LevelId;
  subjectLabel: string;
  levelLabel: string;
}) {
  const query = `?topic=${subject}&level=${level}`;
  const cards: LearnCard[] = [
    {
      status: "✓ הושלם",
      statusTone: "done",
      emoji: "📖",
      iconBg: "linear-gradient(135deg, #fb7185 0%, #ec4899 100%)",
      iconShadow: "0 14px 32px -12px rgba(244, 63, 94, 0.55)",
      title: "שיעור · Animals",
      description:
        "10 חיות באנגלית עם הגייה ותמונות — dog, cat, bird...",
      tags: ["🔊 עם קול", "10 דק׳"],
      cta: "צפי שוב",
      ctaTone: "done",
      href: `/english/lesson/${subject}${query}`,
    },
    {
      status: "חדש",
      statusTone: "new",
      emoji: "✍️",
      iconBg: "linear-gradient(135deg, #fb923c 0%, #f59e0b 100%)",
      iconShadow: "0 14px 32px -12px rgba(249, 115, 22, 0.55)",
      title: "תרגול · Match",
      description:
        "התאימי תמונות למילים באנגלית — משחקי התאמה ושמיעה",
      tags: ["12 שאלות", "🔊"],
      cta: "התחילי ←",
      ctaTone: "go",
      href: `/english/practice${query}`,
    },
    {
      status: "חדש",
      statusTone: "new",
      emoji: "🎯",
      iconBg: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
      iconShadow: "0 14px 32px -12px rgba(99, 102, 241, 0.55)",
      title: "מבחן קצר",
      description: "בדקי את עצמך — 8 שאלות מעורבות באוצר מילים",
      tags: ["8 שאלות", "5 דק׳"],
      cta: "התחילי ←",
      ctaTone: "go",
      href: `/english/quiz${query}`,
    },
  ];

  return (
    <section className="mt-10">
      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl font-extrabold tracking-tight text-ink sm:text-[26px]">
          למידה ותרגול
        </h3>
        <span className="text-sm font-semibold text-ink-soft">
          {subjectLabel} <span className="text-ink/30">•</span> {levelLabel}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
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
      : "bg-rose-50 text-rose-700 border-rose-100";

  const ctaClass =
    card.ctaTone === "done"
      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
      : "bg-ink text-white hover:bg-[#f43f5e]";

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
          style={{
            background: card.iconBg,
            boxShadow: card.iconShadow,
          }}
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

type Game = {
  emoji: string;
  title: string;
  bg: string;
};

function GamesSection() {
  const games: Game[] = [
    {
      emoji: "🦁",
      title: "Word Safari",
      bg: "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)",
    },
    {
      emoji: "🐝",
      title: "Spelling Bee",
      bg: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
    },
    {
      emoji: "🏴‍☠️",
      title: "האוצר האבוד",
      bg: "linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)",
    },
    {
      emoji: "🎭",
      title: "Story Builder",
      bg: "linear-gradient(135deg, #fce7f3 0%, #f9a8d4 100%)",
    },
  ];

  return (
    <section className="mt-10">
      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl font-extrabold tracking-tight text-ink sm:text-[26px]">
          עולמות המשחק
        </h3>
        <span className="text-sm font-semibold text-ink-soft">
          פרס אחרי המשימה
        </span>
      </div>

      <div className="relative mt-5 overflow-hidden rounded-[28px] border border-line bg-white p-5 shadow-[0_16px_40px_-20px_rgba(15,21,53,0.18)] sm:p-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {games.map((g) => (
            <div
              key={g.title}
              className="flex aspect-[4/5] flex-col items-center justify-center gap-3 rounded-[20px] p-4 text-center"
              style={{ background: g.bg }}
            >
              <div className="text-5xl">{g.emoji}</div>
              <div className="text-base font-extrabold text-ink">
                {g.title}
              </div>
            </div>
          ))}
        </div>

        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-[28px] text-center"
          style={{
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <div
            className="grid h-16 w-16 place-items-center rounded-2xl text-2xl text-white"
            style={{
              background:
                "linear-gradient(135deg, #f43f5e 0%, #f97316 100%)",
              boxShadow: "0 14px 32px -12px rgba(244, 63, 94, 0.6)",
            }}
            aria-hidden
          >
            🔒
          </div>
          <p className="max-w-sm px-4 text-lg font-extrabold text-ink sm:text-xl">
            סיימי את המשימה היומית כדי לשחק!
          </p>
          <p className="text-sm font-medium text-ink-soft">
            נשארו לך עוד 2 פעילויות להשלים
          </p>
          <div className="mt-1 flex items-center gap-2 rounded-full border border-line bg-white/90 px-4 py-1.5 text-sm font-bold text-ink shadow-sm">
            <span>⭐</span>
            <span>1 / 3 הושלמו</span>
          </div>
        </div>
      </div>
    </section>
  );
}
