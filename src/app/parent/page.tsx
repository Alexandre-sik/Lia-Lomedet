"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  resetProgress,
  useProgress,
  type Activity,
  type ActivityType,
  type Progress,
} from "@/lib/progress";
import {
  TOPIC_LABELS as MATH_TOPIC_LABELS,
  LEVEL_LABELS,
  isTopic as isMathTopic,
  isLevel,
} from "@/lib/math-generator";
import {
  EN_TOPIC_LABELS,
  isEnTopic,
  isEnLevel,
} from "@/lib/english-generator";

export default function ParentPage() {
  const progress = useProgress();
  return (
    <main className="mx-auto w-full max-w-5xl px-5 pb-20 pt-6 sm:px-8">
      <TopBar />
      <Hero />
      <SummaryGrid progress={progress} />
      <TopicBreakdown progress={progress} />
      <ActivityLog progress={progress} />
      <DangerZone />
    </main>
  );
}

function TopBar() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 py-2">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          aria-label="חזרה לדף הבית"
          className="grid h-11 w-11 place-items-center rounded-2xl border border-line bg-white/80 text-xl font-bold text-ink shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md"
        >
          →
        </Link>
        <h1 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
          פאנל הורים
        </h1>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="mt-6 sm:mt-8">
      <div
        className="relative overflow-hidden rounded-[28px] p-6 text-white shadow-[0_20px_50px_-20px_rgba(15,21,53,0.5)] sm:p-7"
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
        <div className="relative">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-300">
            Dashboard
          </span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            ההתקדמות של{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #fde047 0%, #34d399 100%)",
              }}
            >
              ליה
            </span>
          </h2>
          <p className="mt-1 text-base font-medium text-white/85 sm:text-lg">
            כל הפעילויות, הכוכבים וההתמדה — במקום אחד
          </p>
        </div>
      </div>
    </section>
  );
}

function SummaryGrid({ progress }: { progress: Progress }) {
  const streakLabel =
    progress.streak === 0
      ? "עוד לא התחילה"
      : progress.streak === 1
      ? "יום אחד"
      : `${progress.streak} ימים`;

  const allActivities = progress.history.length;
  const lessonsDone = progress.completedLessons.length;

  const cards: Array<{
    emoji: string;
    label: string;
    value: string;
    tone: "amber" | "coral" | "violet" | "mint";
  }> = [
    {
      emoji: "⭐",
      label: "כוכבים שנצברו",
      value: String(progress.totalStars),
      tone: "amber",
    },
    {
      emoji: "🔥",
      label: "רצף ימים",
      value: streakLabel,
      tone: "coral",
    },
    {
      emoji: "🎯",
      label: "סה״כ פעילויות",
      value: String(allActivities),
      tone: "violet",
    },
    {
      emoji: "🏆",
      label: "תגים שהושגו",
      value: String(progress.badges.length),
      tone: "mint",
    },
  ];

  return (
    <section className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cards.map((c) => (
        <SummaryCard key={c.label} {...c} />
      ))}
      {lessonsDone > 0 && (
        <div className="col-span-2 rounded-2xl border border-line bg-white p-5 text-center shadow-sm sm:col-span-4">
          <div className="text-sm font-bold uppercase tracking-wider text-ink-soft">
            שיעורים שהושלמו בעבר
          </div>
          <div className="mt-1 text-lg font-extrabold text-ink">
            {lessonsDone} שיעורים
          </div>
        </div>
      )}
    </section>
  );
}

function SummaryCard({
  emoji,
  label,
  value,
  tone,
}: {
  emoji: string;
  label: string;
  value: string;
  tone: "amber" | "coral" | "violet" | "mint";
}) {
  const toneClasses: Record<string, string> = {
    amber: "border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-100 text-amber-800",
    coral: "border-rose-200 bg-gradient-to-br from-rose-50 to-orange-100 text-rose-800",
    violet: "border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-100 text-indigo-800",
    mint: "border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-100 text-emerald-800",
  };
  return (
    <div className={`rounded-2xl border p-5 shadow-[0_12px_32px_-20px_rgba(15,21,53,0.25)] ${toneClasses[tone]}`}>
      <div className="text-3xl" aria-hidden>
        {emoji}
      </div>
      <div className="mt-2 text-xs font-bold uppercase tracking-wider opacity-80">
        {label}
      </div>
      <div className="mt-1 text-xl font-extrabold sm:text-2xl">{value}</div>
    </div>
  );
}

function topicLabel(key: string): string {
  if (key.startsWith("en:")) {
    const id = key.slice(3);
    if (isEnTopic(id)) return `🇬🇧 ${EN_TOPIC_LABELS[id]}`;
    return `🇬🇧 ${id}`;
  }
  if (isMathTopic(key)) return `🧮 ${MATH_TOPIC_LABELS[key]}`;
  return key;
}

function levelLabel(level?: string): string {
  if (!level) return "";
  if (isLevel(level)) return LEVEL_LABELS[level];
  if (isEnLevel(level)) return LEVEL_LABELS[level];
  return level;
}

function TopicBreakdown({ progress }: { progress: Progress }) {
  const entries = Object.entries(progress.topicStats);
  if (entries.length === 0) {
    return (
      <section className="mt-10">
        <h3 className="text-2xl font-extrabold tracking-tight text-ink sm:text-[26px]">
          סטטיסטיקה לפי נושא
        </h3>
        <div className="mt-4 rounded-2xl border border-line bg-white p-8 text-center text-base font-medium text-ink-soft">
          עדיין אין נתונים. כשליה תתחיל לתרגל, הסטטיסטיקה תופיע כאן.
        </div>
      </section>
    );
  }

  const sorted = [...entries].sort(
    (a, b) =>
      b[1].practiceCount +
      b[1].quizCount -
      (a[1].practiceCount + a[1].quizCount),
  );

  return (
    <section className="mt-10">
      <h3 className="text-2xl font-extrabold tracking-tight text-ink sm:text-[26px]">
        סטטיסטיקה לפי נושא
      </h3>
      <div className="mt-4 flex flex-col gap-3">
        {sorted.map(([topic, s]) => (
          <article
            key={topic}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-white p-5 shadow-sm"
          >
            <div className="flex-1 min-w-0">
              <div className="text-base font-extrabold text-ink" dir="auto">
                {topicLabel(topic)}
              </div>
              <div className="mt-1 text-sm font-medium text-ink-soft">
                {s.practiceCount} תרגולים · {s.quizCount} מבחנים
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BestScoreBadge pct={s.bestScorePct} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function BestScoreBadge({ pct }: { pct: number }) {
  if (pct === 0) {
    return (
      <span className="rounded-full border border-line bg-bg-2 px-3 py-1 text-xs font-bold text-ink-soft">
        אין ציון עדיין
      </span>
    );
  }
  const tone =
    pct >= 90
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : pct >= 70
      ? "border-sky-200 bg-sky-50 text-sky-700"
      : "border-amber-200 bg-amber-50 text-amber-700";
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-extrabold ${tone}`}>
      מיטב: {pct}%
    </span>
  );
}

type DayGroup = { date: string; activities: Activity[] };

function groupByDay(activities: Activity[]): DayGroup[] {
  const map = new Map<string, Activity[]>();
  for (const a of activities) {
    const d = new Date(a.at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const list = map.get(key) ?? [];
    list.push(a);
    map.set(key, list);
  }
  const groups: DayGroup[] = [];
  for (const [date, acts] of map) {
    groups.push({ date, activities: acts.sort((x, y) => y.at - x.at) });
  }
  return groups.sort((a, b) => (a.date < b.date ? 1 : -1));
}

function formatDateHe(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  if (key === todayKey) return "היום";
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
  if (key === yKey) return "אתמול";
  return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`;
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

const ACTIVITY_META: Record<
  ActivityType,
  { emoji: string; label: string; tone: string }
> = {
  lesson: {
    emoji: "📖",
    label: "שיעור",
    tone: "border-indigo-200 bg-indigo-50 text-indigo-700",
  },
  practice: {
    emoji: "✍️",
    label: "תרגול",
    tone: "border-sky-200 bg-sky-50 text-sky-700",
  },
  quiz: {
    emoji: "🎯",
    label: "מבחן",
    tone: "border-rose-200 bg-rose-50 text-rose-700",
  },
  game: {
    emoji: "🎮",
    label: "משחק",
    tone: "border-amber-200 bg-amber-50 text-amber-700",
  },
};

function ActivityLog({ progress }: { progress: Progress }) {
  const [filter, setFilter] = useState<"all" | ActivityType>("all");
  const groups = useMemo(() => {
    const filtered =
      filter === "all"
        ? progress.history
        : progress.history.filter((a) => a.type === filter);
    return groupByDay(filtered);
  }, [progress.history, filter]);

  const types: Array<"all" | ActivityType> = [
    "all",
    "practice",
    "quiz",
    "game",
    "lesson",
  ];

  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="text-2xl font-extrabold tracking-tight text-ink sm:text-[26px]">
          היסטוריית פעילות
        </h3>
        <div className="flex flex-wrap gap-2">
          {types.map((t) => {
            const active = t === filter;
            const label =
              t === "all" ? "הכל" : ACTIVITY_META[t].label;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setFilter(t)}
                className={`rounded-full border px-3 py-1 text-xs font-bold transition ${
                  active
                    ? "border-ink bg-ink text-white"
                    : "border-line bg-white text-ink-soft hover:text-ink"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-line bg-white p-8 text-center text-base font-medium text-ink-soft">
          אין פעילות להצגה עדיין.
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-6">
          {groups.map((g) => (
            <DayGroupView key={g.date} group={g} />
          ))}
        </div>
      )}
    </section>
  );
}

function DayGroupView({ group }: { group: DayGroup }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline gap-2">
        <h4 className="text-base font-extrabold text-ink">
          {formatDateHe(group.date)}
        </h4>
        <span className="text-sm font-semibold text-ink-soft">
          · {group.activities.length} פעילויות
        </span>
      </div>
      <ul className="flex flex-col gap-2">
        {group.activities.map((a, i) => (
          <ActivityItem key={`${a.at}-${i}`} activity={a} />
        ))}
      </ul>
    </div>
  );
}

function ActivityItem({ activity }: { activity: Activity }) {
  const meta = ACTIVITY_META[activity.type];
  return (
    <li className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3 shadow-[0_6px_20px_-14px_rgba(15,21,53,0.2)]">
      <span
        className={`grid h-10 w-10 place-items-center rounded-xl text-lg ${meta.tone} border`}
        aria-hidden
      >
        {meta.emoji}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-sm font-extrabold text-ink">
            {meta.label}
          </span>
          <span className="text-sm font-semibold text-ink-soft" dir="auto">
            · {topicLabel(activity.topic)}
          </span>
          {activity.level && (
            <span className="text-xs font-semibold text-ink-soft">
              · {levelLabel(activity.level)}
            </span>
          )}
        </div>
        <div className="mt-0.5 flex flex-wrap items-baseline gap-2 text-xs font-semibold text-ink-soft">
          <span dir="ltr">{formatTime(activity.at)}</span>
          {activity.scorePct !== undefined && (
            <span>
              · ציון:{" "}
              <span className="font-extrabold text-ink">
                {activity.scorePct}%
              </span>
            </span>
          )}
          {activity.stars !== undefined && activity.stars > 0 && (
            <span>
              · ⭐ <span className="font-extrabold text-ink">+{activity.stars}</span>
            </span>
          )}
        </div>
      </div>
    </li>
  );
}

function DangerZone() {
  const [confirming, setConfirming] = useState(false);

  const handleReset = () => {
    if (!confirming) {
      setConfirming(true);
      window.setTimeout(() => setConfirming(false), 4000);
      return;
    }
    resetProgress();
    setConfirming(false);
  };

  return (
    <section className="mt-12 rounded-2xl border border-rose-200 bg-rose-50/60 p-5">
      <h3 className="text-base font-extrabold text-rose-800">
        איפוס התקדמות
      </h3>
      <p className="mt-1 text-sm font-medium text-rose-700">
        פעולה זו תמחק את כל הנתונים: כוכבים, תגים, רצף, היסטוריה. לא ניתן לבטל.
      </p>
      <button
        type="button"
        onClick={handleReset}
        className={`mt-4 rounded-2xl px-5 py-3 text-sm font-extrabold transition ${
          confirming
            ? "bg-rose-600 text-white shadow-md"
            : "border border-rose-300 bg-white text-rose-700 hover:shadow-sm"
        }`}
      >
        {confirming ? "לחצי שוב לאישור המחיקה" : "אפסי הכל"}
      </button>
    </section>
  );
}
