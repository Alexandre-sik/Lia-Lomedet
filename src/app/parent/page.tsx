"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  resetProgress,
  useProgress,
  type Activity,
  type Progress,
} from "@/lib/progress";

type SubjectKey = "math" | "english" | "trivia" | "game";

const SUBJECTS: Record<
  SubjectKey,
  { label: string; emoji: string; color: string }
> = {
  math: { label: "מתמטיקה", emoji: "🧮", color: "#8b5cf6" },
  english: { label: "אנגלית", emoji: "🇬🇧", color: "#f43f5e" },
  trivia: { label: "ידע כללי", emoji: "🌍", color: "#14b8a6" },
  game: { label: "משחקים", emoji: "🎮", color: "#f59e0b" },
};

function activitySubject(a: Activity): SubjectKey {
  if (a.type === "game") return "game";
  if (a.topic.startsWith("en:")) return "english";
  if (a.topic.startsWith("trivia:")) return "trivia";
  return "math";
}

function dateKeyOf(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function todayKey(): string {
  return dateKeyOf(Date.now());
}

function formatMin(min: number): string {
  if (min < 1) return "0 דק׳";
  if (min < 60) return `${min} דק׳`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h} שעות` : `${h}ש ${m}ד`;
}

function formatMinShort(min: number): string {
  if (min < 1) return "—";
  if (min < 60) return `${min}d`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h}h` : `${h}h${m}`;
}

function dayName(date: Date): string {
  const days = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"];
  return days[date.getDay()];
}

function relativeDate(date: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diff = Math.round((today.getTime() - target.getTime()) / 86400000);
  if (diff === 0) return "היום";
  if (diff === 1) return "אתמול";
  if (diff < 7) return `לפני ${diff} ימים`;
  return `${date.getDate()}/${date.getMonth() + 1}`;
}

export default function ParentPage() {
  const progress = useProgress();
  return (
    <main className="mx-auto w-full max-w-4xl px-5 pb-20 pt-6 sm:px-8">
      <TopBar />
      <Hero streak={progress.streak} totalStars={progress.totalStars} />
      <TodayCard progress={progress} />
      <WeekCard progress={progress} />
      <SubjectTotals progress={progress} />
      <RecentActivities progress={progress} />
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

function Hero({
  streak,
  totalStars,
}: {
  streak: number;
  totalStars: number;
}) {
  const streakLabel =
    streak === 0 ? "0 ימים" : streak === 1 ? "יום אחד" : `${streak} ימים`;
  return (
    <section className="mt-6 rounded-[24px] bg-gradient-to-br from-indigo-900 to-violet-900 p-6 text-white shadow-lg sm:p-7">
      <h2 className="text-2xl font-extrabold sm:text-3xl">
        ההתקדמות של ליה
      </h2>
      <div className="mt-4 flex flex-wrap gap-3">
        <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur">
          ⭐ {totalStars} כוכבים
        </span>
        <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur">
          🔥 רצף: {streakLabel}
        </span>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------
// TODAY — big number + subject breakdown
// ---------------------------------------------------------------------

type SubjectStats = Record<SubjectKey, number>; // seconds

function emptyStats(): SubjectStats {
  return { math: 0, english: 0, trivia: 0, game: 0 };
}

function aggregateBySubject(activities: Activity[]): SubjectStats {
  const stats = emptyStats();
  for (const a of activities) {
    stats[activitySubject(a)] += a.durationSec ?? 0;
  }
  return stats;
}

function TodayCard({ progress }: { progress: Progress }) {
  const today = todayKey();
  const todayActivities = useMemo(
    () => progress.history.filter((a) => dateKeyOf(a.at) === today),
    [progress.history, today],
  );
  const stats = useMemo(
    () => aggregateBySubject(todayActivities),
    [todayActivities],
  );
  const totalSec = Object.values(stats).reduce((n, v) => n + v, 0);
  const totalMin = Math.round(totalSec / 60);

  return (
    <section className="mt-8">
      <h3 className="text-lg font-bold uppercase tracking-wider text-ink-soft">
        היום
      </h3>

      {totalMin === 0 ? (
        <div className="mt-3 rounded-2xl border border-line bg-white p-6 text-center shadow-sm">
          <div className="text-4xl" aria-hidden>
            💤
          </div>
          <p className="mt-2 text-base font-medium text-ink-soft">
            ליה עוד לא למדה היום.
          </p>
        </div>
      ) : (
        <div className="mt-3 rounded-2xl border border-line bg-white p-6 shadow-sm">
          <div className="text-center">
            <div className="text-5xl font-extrabold text-ink sm:text-6xl">
              {formatMin(totalMin)}
            </div>
            <p className="mt-1 text-sm font-semibold text-ink-soft">
              {todayActivities.length} פעילויות
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(["math", "english", "trivia", "game"] as SubjectKey[]).map(
              (s) => {
                const min = Math.round(stats[s] / 60);
                const sub = SUBJECTS[s];
                return (
                  <div
                    key={s}
                    className="rounded-xl border border-line bg-bg-2 p-3 text-center"
                    style={
                      min > 0
                        ? {
                            borderColor: sub.color,
                            background: `${sub.color}14`,
                          }
                        : undefined
                    }
                  >
                    <div className="text-2xl">{sub.emoji}</div>
                    <div className="mt-1 text-xs font-bold text-ink-soft">
                      {sub.label}
                    </div>
                    <div
                      className="mt-1 text-lg font-extrabold tabular-nums"
                      style={{ color: min > 0 ? sub.color : "#94a3b8" }}
                      dir="ltr"
                    >
                      {min > 0 ? formatMinShort(min) : "—"}
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------
// WEEK — last 7 days, simple bars
// ---------------------------------------------------------------------

function WeekCard({ progress }: { progress: Progress }) {
  const days = useMemo(() => {
    const arr: Array<{
      key: string;
      date: Date;
      label: string;
      relLabel: string;
      stats: SubjectStats;
      totalMin: number;
    }> = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      const key = dateKeyOf(d.getTime());
      const acts = progress.history.filter((a) => dateKeyOf(a.at) === key);
      const stats = aggregateBySubject(acts);
      const totalSec = Object.values(stats).reduce((n, v) => n + v, 0);
      arr.push({
        key,
        date: d,
        label: dayName(d),
        relLabel: relativeDate(d),
        stats,
        totalMin: Math.round(totalSec / 60),
      });
    }
    return arr;
  }, [progress.history]);

  const weekTotalMin = days.reduce((n, d) => n + d.totalMin, 0);
  const maxDayMin = Math.max(1, ...days.map((d) => d.totalMin));

  return (
    <section className="mt-8">
      <div className="flex items-baseline justify-between">
        <h3 className="text-lg font-bold uppercase tracking-wider text-ink-soft">
          השבוע (7 ימים אחרונים)
        </h3>
        <span className="text-sm font-extrabold text-ink" dir="ltr">
          {formatMin(weekTotalMin)}
        </span>
      </div>

      <div className="mt-3 rounded-2xl border border-line bg-white p-5 shadow-sm">
        <div className="flex h-40 items-end gap-2">
          {days.map((d) => {
            const heightPct = (d.totalMin / maxDayMin) * 100;
            const isToday = d.key === todayKey();
            return (
              <div
                key={d.key}
                className="flex flex-1 flex-col items-center gap-2"
                title={`${d.relLabel} — ${formatMin(d.totalMin)}`}
              >
                <div className="text-[11px] font-bold tabular-nums text-ink-soft" dir="ltr">
                  {d.totalMin > 0 ? `${d.totalMin}d` : ""}
                </div>
                <div
                  className="relative w-full overflow-hidden rounded-md bg-bg-2"
                  style={{
                    height: `${Math.max(heightPct, 4)}%`,
                    minHeight: 8,
                  }}
                >
                  {(["math", "english", "trivia", "game"] as SubjectKey[]).map(
                    (s) => {
                      const min = Math.round(d.stats[s] / 60);
                      const segPct =
                        d.totalMin === 0 ? 0 : (min / d.totalMin) * 100;
                      if (segPct === 0) return null;
                      return (
                        <div
                          key={s}
                          style={{
                            height: `${segPct}%`,
                            background: SUBJECTS[s].color,
                          }}
                        />
                      );
                    },
                  )}
                </div>
                <div
                  className={`text-xs font-bold ${
                    isToday ? "text-ink" : "text-ink-soft"
                  }`}
                >
                  {d.label}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-ink-soft">
          {(["math", "english", "trivia", "game"] as SubjectKey[]).map((s) => (
            <span key={s} className="flex items-center gap-1.5">
              <span
                className="inline-block h-3 w-3 rounded-sm"
                style={{ background: SUBJECTS[s].color }}
              />
              {SUBJECTS[s].label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------
// TOTAL TIME PER SUBJECT (over last 30 days)
// ---------------------------------------------------------------------

function SubjectTotals({ progress }: { progress: Progress }) {
  const stats = useMemo(() => {
    const cutoff = Date.now() - 30 * 24 * 3600 * 1000;
    return aggregateBySubject(
      progress.history.filter((a) => a.at >= cutoff),
    );
  }, [progress.history]);

  const totalSec = Object.values(stats).reduce((n, v) => n + v, 0);
  if (totalSec === 0) return null;

  const totalMin = Math.round(totalSec / 60);

  return (
    <section className="mt-8">
      <h3 className="text-lg font-bold uppercase tracking-wider text-ink-soft">
        ב-30 הימים האחרונים
      </h3>

      <div className="mt-3 rounded-2xl border border-line bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3">
          {(["math", "english", "trivia", "game"] as SubjectKey[])
            .map((s) => ({ s, min: Math.round(stats[s] / 60) }))
            .sort((a, b) => b.min - a.min)
            .map(({ s, min }) => {
              const sub = SUBJECTS[s];
              const pct = totalMin > 0 ? Math.round((min / totalMin) * 100) : 0;
              return (
                <div key={s} className="flex items-center gap-3">
                  <span className="text-xl">{sub.emoji}</span>
                  <span className="w-20 text-sm font-bold text-ink sm:w-24">
                    {sub.label}
                  </span>
                  <div className="relative h-7 flex-1 overflow-hidden rounded-md bg-bg-2">
                    <div
                      className="h-full rounded-md transition-all"
                      style={{
                        width: `${pct}%`,
                        background: sub.color,
                      }}
                    />
                  </div>
                  <span
                    className="w-20 text-end text-sm font-extrabold tabular-nums text-ink"
                    dir="ltr"
                  >
                    {min > 0 ? formatMin(min) : "—"}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------
// RECENT ACTIVITIES — simple list
// ---------------------------------------------------------------------

function RecentActivities({ progress }: { progress: Progress }) {
  const recent = useMemo(
    () => [...progress.history].reverse().slice(0, 15),
    [progress.history],
  );

  if (recent.length === 0) {
    return (
      <section className="mt-8">
        <h3 className="text-lg font-bold uppercase tracking-wider text-ink-soft">
          פעילויות אחרונות
        </h3>
        <div className="mt-3 rounded-2xl border border-line bg-white p-8 text-center text-sm font-medium text-ink-soft">
          אין פעילות עדיין.
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <h3 className="text-lg font-bold uppercase tracking-wider text-ink-soft">
        פעילויות אחרונות
      </h3>
      <ul className="mt-3 flex flex-col gap-2">
        {recent.map((a, i) => (
          <ActivityRow key={`${a.at}-${i}`} activity={a} />
        ))}
      </ul>
    </section>
  );
}

const TYPE_LABEL: Record<Activity["type"], string> = {
  practice: "תרגול",
  quiz: "מבחן",
  game: "משחק",
};

function ActivityRow({ activity }: { activity: Activity }) {
  const subject = activitySubject(activity);
  const sub = SUBJECTS[subject];
  const date = new Date(activity.at);
  const minutes = activity.durationSec
    ? Math.max(1, Math.round(activity.durationSec / 60))
    : 0;
  const time = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

  return (
    <li
      className="flex items-center gap-3 rounded-xl border bg-white p-3 shadow-sm"
      style={{ borderColor: `${sub.color}40` }}
    >
      <span
        className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl text-xl"
        style={{ background: `${sub.color}1a` }}
      >
        {sub.emoji}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-sm font-extrabold text-ink">
            {sub.label}
          </span>
          <span className="text-xs font-semibold text-ink-soft">
            · {TYPE_LABEL[activity.type]}
          </span>
        </div>
        <div className="mt-0.5 flex flex-wrap items-baseline gap-2 text-xs font-medium text-ink-soft">
          <span>{relativeDate(date)}</span>
          <span dir="ltr">· {time}</span>
          {minutes > 0 && <span>· ⏱️ {minutes} דק׳</span>}
          {activity.scorePct !== undefined && (
            <span>
              · ציון:{" "}
              <span className="font-extrabold text-ink">
                {activity.scorePct}%
              </span>
            </span>
          )}
        </div>
      </div>
    </li>
  );
}

// ---------------------------------------------------------------------
// DANGER ZONE
// ---------------------------------------------------------------------

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
        פעולה זו תמחק את כל הנתונים. לא ניתן לבטל.
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
        {confirming ? "לחצי שוב לאישור" : "אפסי הכל"}
      </button>
    </section>
  );
}
