"use client";

import Link from "next/link";
import { useState } from "react";
import {
  DAILY_GOAL,
  dailyCompleted,
  isDailyMissionComplete,
  useProgress,
} from "@/lib/progress";

type SubjectId =
  | "add-sub"
  | "mul"
  | "div"
  | "frac"
  | "geo"
  | "money"
  | "word";

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
  { id: "add-sub", emoji: "➕", label: "חיבור וחיסור" },
  { id: "mul", emoji: "✖️", label: "כפל" },
  { id: "div", emoji: "➗", label: "חילוק" },
  { id: "frac", emoji: "🍕", label: "שברים" },
  { id: "geo", emoji: "📐", label: "גאומטריה" },
  { id: "money", emoji: "💰", label: "כסף ומידות" },
  { id: "word", emoji: "📝", label: "בעיות מילוליות" },
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
  "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)";
const SUBJECT_ACTIVE_SHADOW =
  "0 14px 32px -12px rgba(99, 102, 241, 0.55)";

export default function MathDashboard() {
  const [subject, setSubject] = useState<SubjectId>("mul");
  const [level, setLevel] = useState<LevelId>("normal");
  const progress = useProgress();

  const subjectLabel =
    SUBJECTS.find((s) => s.id === subject)?.label ?? "";
  const levelLabel = LEVELS.find((l) => l.id === level)?.label ?? "";
  const done = dailyCompleted(progress);
  const missionDone = isDailyMissionComplete(progress);

  return (
    <main className="mx-auto w-full max-w-6xl px-5 pb-20 pt-6 sm:px-8">
      <Header totalStars={progress.totalStars} />
      <Hero />
      <Controls
        subject={subject}
        setSubject={setSubject}
        level={level}
        setLevel={setLevel}
      />
      <MissionBar done={done} goal={DAILY_GOAL} />
      <LearnSection
        subject={subject}
        level={level}
        subjectLabel={subjectLabel}
        levelLabel={levelLabel}
      />
      <GamesSection
        missionDone={missionDone}
        done={done}
        goal={DAILY_GOAL}
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
          <span className="font-bold text-ink">מתמטיקה</span>
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
              "linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #ec4899 100%)",
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

function MissionBar({ done, goal }: { done: number; goal: number }) {
  const pct = Math.min(100, Math.round((done / goal) * 100));
  const isDone = done >= goal;
  return (
    <section className="relative mt-8 overflow-hidden rounded-[28px] p-6 shadow-[0_20px_50px_-20px_rgba(15,27,75,0.55)] sm:p-7"
      style={{
        background:
          "linear-gradient(135deg, #0f1535 0%, #1e1b4b 60%, #312e81 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full opacity-40 blur-3xl"
        style={{ background: "#8b5cf6" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-10 h-56 w-56 rounded-full opacity-25 blur-3xl"
        style={{ background: "#ec4899" }}
        aria-hidden
      />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
        <div
          className="grid h-16 w-16 flex-shrink-0 place-items-center rounded-2xl text-3xl shadow-lg"
          style={{
            background: isDone
              ? "linear-gradient(135deg, #34d399 0%, #10b981 100%)"
              : "linear-gradient(135deg, #fde047 0%, #f59e0b 100%)",
            boxShadow: isDone
              ? "0 14px 32px -12px rgba(16, 185, 129, 0.6)"
              : "0 14px 32px -12px rgba(245, 158, 11, 0.6)",
          }}
          aria-hidden
        >
          {isDone ? "✅" : "🎯"}
        </div>

        <div className="flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-lg font-bold text-white sm:text-xl">
              {isDone ? "המשימה היומית הושלמה!" : "המשימה היומית שלך"}
            </h3>
            <div className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #fde047 0%, #34d399 100%)",
                }}
              >
                {done}
              </span>
              <span className="text-white/60"> / {goal}</span>
            </div>
          </div>

          <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
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
      iconBg: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
      iconShadow: "0 14px 32px -12px rgba(99, 102, 241, 0.55)",
      title: "שיעור",
      description:
        "שיעור אינטראקטיבי עם דוגמאות וטריקים — לפי הנושא שבחרת",
      tags: ["10 דק׳", subjectLabel],
      cta: "צפי שוב",
      ctaTone: "done",
      href: `/math/lesson/${subject}${query}`,
    },
    {
      status: "חדש",
      statusTone: "new",
      emoji: "✍️",
      iconBg: "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)",
      iconShadow: "0 14px 32px -12px rgba(14, 165, 233, 0.55)",
      title: "תרגול",
      description: "15 תרגילים שנוצרים במיוחד עבורך לפי הנושא והרמה",
      tags: ["15 שאלות", subjectLabel],
      cta: "התחילי ←",
      ctaTone: "go",
      href: `/math/practice${query}`,
    },
    {
      status: "חדש",
      statusTone: "new",
      emoji: "🎯",
      iconBg: "linear-gradient(135deg, #fb7185 0%, #ec4899 100%)",
      iconShadow: "0 14px 32px -12px rgba(236, 72, 153, 0.55)",
      title: "מבחן קצר",
      description: "10 שאלות מעורבות עם מגבלת זמן של 5 דקות",
      tags: ["10 שאלות", "5 דק׳"],
      cta: "התחילי ←",
      ctaTone: "go",
      href: `/math/quiz${query}`,
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
      : "bg-indigo-50 text-indigo-700 border-indigo-100";

  const ctaClass =
    card.ctaTone === "done"
      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
      : "bg-ink text-white hover:bg-[#6366f1]";

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

function GamesSection({
  missionDone,
  done,
  goal,
}: {
  missionDone: boolean;
  done: number;
  goal: number;
}) {
  const games: Array<Game & { href?: string }> = [
    {
      emoji: "🚀",
      title: "מסע הכפל",
      bg: "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)",
      href: "/math/games/mul-race",
    },
    {
      emoji: "🍕",
      title: "פיצרייה",
      bg: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
    },
    {
      emoji: "🛒",
      title: "הסופר",
      bg: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
    },
    {
      emoji: "🏰",
      title: "טירת הצורות",
      bg: "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)",
    },
  ];

  const remaining = Math.max(0, goal - done);

  return (
    <section className="mt-10">
      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl font-extrabold tracking-tight text-ink sm:text-[26px]">
          עולמות המשחק
        </h3>
        <span className="text-sm font-semibold text-ink-soft">
          {missionDone ? "פותחת — שחקי חופשי!" : "פרס אחרי המשימה"}
        </span>
      </div>

      <div className="relative mt-5 overflow-hidden rounded-[28px] border border-line bg-white p-5 shadow-[0_16px_40px_-20px_rgba(15,21,53,0.18)] sm:p-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {games.map((g) => {
            const unlocked = missionDone && !!g.href;
            const content = (
              <div
                className={`flex aspect-[4/5] flex-col items-center justify-center gap-3 rounded-[20px] p-4 text-center transition ${
                  unlocked
                    ? "hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(15,21,53,0.3)]"
                    : ""
                }`}
                style={{ background: g.bg }}
              >
                <div className="text-5xl">{g.emoji}</div>
                <div className="text-base font-extrabold text-ink">
                  {g.title}
                </div>
                {unlocked && (
                  <div className="rounded-full bg-white/80 px-3 py-1 text-xs font-extrabold text-ink shadow-sm">
                    שחקי ←
                  </div>
                )}
              </div>
            );
            return unlocked && g.href ? (
              <Link key={g.title} href={g.href} className="block">
                {content}
              </Link>
            ) : (
              <div key={g.title}>{content}</div>
            );
          })}
        </div>

        {!missionDone && (
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
                  "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
                boxShadow: "0 14px 32px -12px rgba(99, 102, 241, 0.6)",
              }}
              aria-hidden
            >
              🔒
            </div>
            <p className="max-w-sm px-4 text-lg font-extrabold text-ink sm:text-xl">
              סיימי את המשימה היומית כדי לשחק!
            </p>
            <p className="text-sm font-medium text-ink-soft">
              {remaining > 0
                ? `נשארו לך עוד ${remaining} פעילויות להשלים`
                : "עוד פעילות אחת!"}
            </p>
            <div className="mt-1 flex items-center gap-2 rounded-full border border-line bg-white/90 px-4 py-1.5 text-sm font-bold text-ink shadow-sm">
              <span>⭐</span>
              <span>
                {done} / {goal} הושלמו
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
