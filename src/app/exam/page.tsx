"use client";

import Link from "next/link";
import { useProgress } from "@/lib/progress";
import {
  EXAM_TOPIC_DESCRIPTIONS,
  EXAM_TOPIC_EMOJIS,
  EXAM_TOPIC_LABELS,
  type ExamTopic,
} from "@/lib/exam-generator";

const TOPIC_ORDER: ExamTopic[] = [
  "place-value",
  "distributive",
  "estimation",
  "div-remainder",
  "mul-by-pow10",
  "quadrilaterals",
];

const GRADIENTS: Record<ExamTopic, { bg: string; shadow: string }> = {
  "place-value": {
    bg: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    shadow: "0 18px 40px -16px rgba(99, 102, 241, 0.55)",
  },
  distributive: {
    bg: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
    shadow: "0 18px 40px -16px rgba(236, 72, 153, 0.55)",
  },
  estimation: {
    bg: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
    shadow: "0 18px 40px -16px rgba(245, 158, 11, 0.55)",
  },
  "div-remainder": {
    bg: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    shadow: "0 18px 40px -16px rgba(16, 185, 129, 0.55)",
  },
  "mul-by-pow10": {
    bg: "linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)",
    shadow: "0 18px 40px -16px rgba(14, 165, 233, 0.55)",
  },
  quadrilaterals: {
    bg: "linear-gradient(135deg, #f97316 0%, #fb923c 100%)",
    shadow: "0 18px 40px -16px rgba(249, 115, 22, 0.55)",
  },
};

export default function ExamDashboard() {
  const progress = useProgress();
  return (
    <main className="mx-auto w-full max-w-6xl px-5 pb-20 pt-6 sm:px-8">
      <Header totalStars={progress.totalStars} />
      <Hero />
      <TopicGrid stats={progress.topicStats} />
      <FullExamCta />
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
          <span>← חזרה לדף הבית</span>
          <span className="text-ink/30">·</span>
          <span className="font-bold text-ink">הכנה למבחן</span>
        </Link>
      </div>

      <div className="flex h-11 items-center gap-2 rounded-full border border-line bg-white/80 px-4 text-sm font-bold text-ink shadow-sm backdrop-blur">
        <span>⭐</span>
        <span>{totalStars}</span>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="mt-6 sm:mt-10">
      <h2 className="text-[40px] font-extrabold leading-tight tracking-tight text-ink sm:text-5xl">
        הכנה{" "}
        <span
          className="bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
          }}
        >
          למבחן
        </span>{" "}
        📘
      </h2>
      <p className="mt-2 text-lg font-medium text-ink-soft sm:text-xl">
        בחרי נושא ותתרגלי כמה שתרצי. כל סבב — 12 שאלות.
      </p>
    </section>
  );
}

function TopicGrid({
  stats,
}: {
  stats: Record<
    string,
    { practiceCount: number; quizCount: number; bestScorePct: number }
  >;
}) {
  return (
    <section className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {TOPIC_ORDER.map((t) => {
        const stat = stats[`exam:${t}`];
        return (
          <TopicCard
            key={t}
            topic={t}
            practiceCount={stat?.practiceCount ?? 0}
            best={stat?.bestScorePct ?? 0}
          />
        );
      })}
    </section>
  );
}

function TopicCard({
  topic,
  practiceCount,
  best,
}: {
  topic: ExamTopic;
  practiceCount: number;
  best: number;
}) {
  const g = GRADIENTS[topic];
  return (
    <Link
      href={`/exam/practice?topic=${topic}`}
      className="group relative block overflow-hidden rounded-[24px] p-6 text-white transition-all duration-300 hover:-translate-y-1.5"
      style={{ background: g.bg, boxShadow: g.shadow }}
    >
      <div
        className="pointer-events-none absolute -left-12 -top-16 h-52 w-52 rounded-full opacity-25 blur-3xl"
        style={{ background: "rgba(255,255,255,0.6)" }}
        aria-hidden
      />
      <div className="relative flex flex-col gap-4">
        <div className="text-[56px] leading-none drop-shadow-sm">
          {EXAM_TOPIC_EMOJIS[topic]}
        </div>
        <div>
          <h3 className="text-[26px] font-extrabold tracking-tight leading-tight">
            {EXAM_TOPIC_LABELS[topic]}
          </h3>
          <p className="mt-1.5 text-sm font-medium text-white/85 sm:text-base">
            {EXAM_TOPIC_DESCRIPTIONS[topic]}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-md">
            🎯 {practiceCount} סבבים
          </span>
          {best > 0 && (
            <span className="rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-md">
              🏆 שיא: {best}%
            </span>
          )}
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-base font-semibold text-white/90">התחילי ←</span>
          <span
            className="grid h-12 w-12 place-items-center rounded-full bg-white text-2xl text-ink shadow-lg transition-transform duration-300 group-hover:-translate-x-1"
            aria-hidden
          >
            ←
          </span>
        </div>
      </div>
    </Link>
  );
}

function FullExamCta() {
  return (
    <section className="mt-10">
      <Link
        href="/exam/practice?topic=mixed"
        className="block rounded-[24px] border border-line bg-white p-6 shadow-[0_16px_40px_-20px_rgba(15,21,53,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-20px_rgba(15,21,53,0.25)] sm:p-7"
      >
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div
              className="grid h-14 w-14 place-items-center rounded-2xl text-2xl text-white shadow-md"
              style={{
                background:
                  "linear-gradient(135deg, #0f1535 0%, #1e1b4b 60%, #312e81 100%)",
              }}
            >
              📝
            </div>
            <div>
              <h3 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
                סימולציה — מבחן מעורב
              </h3>
              <p className="mt-1 text-sm font-medium text-ink-soft sm:text-base">
                15 שאלות מכל הנושאים, כמו במבחן האמיתי
              </p>
            </div>
          </div>
          <span
            className="rounded-2xl px-5 py-3 text-base font-extrabold text-white"
            style={{
              background:
                "linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #ec4899 100%)",
            }}
          >
            התחילי סימולציה ←
          </span>
        </div>
      </Link>
    </section>
  );
}
