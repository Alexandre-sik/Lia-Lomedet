"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ACCENT_STYLES,
  getLesson,
  type Lesson,
  type Slide,
} from "@/lib/math-lessons";
import { isLevel, LEVEL_LABELS, type Level } from "@/lib/math-generator";
import { recordLessonComplete, useProgress } from "@/lib/progress";

export default function LessonPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <LessonInner />
    </Suspense>
  );
}

function Fallback() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-6">
      <p className="text-lg font-bold text-ink-soft">טוען שיעור…</p>
    </main>
  );
}

function LessonInner() {
  const params = useParams<{ id: string }>();
  const search = useSearchParams();
  const id = params?.id ?? "";
  const lesson = getLesson(id);
  const levelParam = search.get("level");
  const level: Level = isLevel(levelParam) ? levelParam : "normal";

  if (!lesson) return <LessonNotFound />;

  return <LessonView lesson={lesson} level={level} />;
}

function LessonNotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="text-7xl" aria-hidden>
        🙂
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        השיעור הזה עוד בהכנה
      </h1>
      <p className="text-base font-medium text-ink-soft">
        תבחרי נושא אחר מהמסך הראשי של מתמטיקה.
      </p>
      <Link
        href="/math"
        className="rounded-full border border-line bg-white/90 px-6 py-3 text-base font-bold text-ink shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      >
        ← חזרה למתמטיקה
      </Link>
    </main>
  );
}

function LessonView({ lesson, level }: { lesson: Lesson; level: Level }) {
  const [index, setIndex] = useState(0);
  const total = lesson.slides.length;
  const slide = lesson.slides[index];
  const isLast = index === total - 1;
  const isFirst = index === 0;
  const accent = ACCENT_STYLES[lesson.accent];
  const progress = useProgress();
  const recordedRef = useRef(false);

  const practiceHref = `/math/practice?topic=${lesson.id}&level=${level}`;

  useEffect(() => {
    if (isLast && !recordedRef.current) {
      recordedRef.current = true;
      recordLessonComplete(lesson.id, lesson.id);
    }
  }, [isLast, lesson.id]);

  return (
    <main className="mx-auto w-full max-w-4xl px-5 pb-20 pt-6 sm:px-8">
      <TopBar title={lesson.title} totalStars={progress.totalStars} />

      <LessonHeader
        title={lesson.title}
        subtitle={lesson.subtitle}
        accent={accent}
        levelLabel={LEVEL_LABELS[level]}
      />

      <ProgressDots total={total} current={index} onJump={setIndex} />

      <div className="relative mt-6 min-h-[380px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <SlideView slide={slide} isLast={isLast} />
          </motion.div>
        </AnimatePresence>
      </div>

      <NavRow
        isFirst={isFirst}
        isLast={isLast}
        onPrev={() => setIndex((i) => Math.max(0, i - 1))}
        onNext={() => setIndex((i) => Math.min(total - 1, i + 1))}
        practiceHref={practiceHref}
        accentBg={accent.bg}
        accentShadow={accent.shadow}
      />
    </main>
  );
}

function TopBar({ title, totalStars }: { title: string; totalStars: number }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 py-2">
      <div className="flex items-center gap-3">
        <Link
          href="/math"
          aria-label="חזרה למתמטיקה"
          className="grid h-11 w-11 place-items-center rounded-2xl border border-line bg-white/80 text-xl font-bold text-ink shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md"
        >
          →
        </Link>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
            שיעור <span className="text-ink-soft">·</span>{" "}
            <span className="text-primary">{title}</span>
          </h1>
        </div>
      </div>

      <div className="flex h-11 items-center gap-2 rounded-full border border-line bg-white/80 px-4 text-sm font-bold text-ink shadow-sm backdrop-blur">
        <span>⭐</span>
        <span>{totalStars}</span>
      </div>
    </header>
  );
}

function LessonHeader({
  title,
  subtitle,
  accent,
  levelLabel,
}: {
  title: string;
  subtitle: string;
  accent: { bg: string; shadow: string };
  levelLabel: string;
}) {
  return (
    <section
      className="relative mt-6 overflow-hidden rounded-[28px] p-6 text-white sm:p-7"
      style={{ background: accent.bg, boxShadow: accent.shadow }}
    >
      <div
        className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full opacity-30 blur-3xl"
        style={{ background: "rgba(255,255,255,0.5)" }}
        aria-hidden
      />
      <div className="relative flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-white/80">
            שיעור אינטראקטיבי
          </span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-[34px]">
            {title}
          </h2>
          <p className="mt-1 text-base font-medium text-white/90 sm:text-lg">
            {subtitle}
          </p>
        </div>
        <span className="rounded-full border border-white/30 bg-white/20 px-4 py-1.5 text-sm font-bold text-white backdrop-blur-md">
          רמה: {levelLabel}
        </span>
      </div>
    </section>
  );
}

function ProgressDots({
  total,
  current,
  onJump,
}: {
  total: number;
  current: number;
  onJump: (i: number) => void;
}) {
  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onJump(i)}
            aria-label={`מעבר לשקופית ${i + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              active
                ? "w-10 bg-primary shadow-[0_2px_10px_rgba(99,102,241,0.6)]"
                : done
                ? "w-2.5 bg-primary/60"
                : "w-2.5 bg-line"
            }`}
          />
        );
      })}
    </div>
  );
}

function SlideView({ slide, isLast }: { slide: Slide; isLast: boolean }) {
  return (
    <article className="rounded-[28px] border border-line bg-white p-7 shadow-[0_16px_40px_-20px_rgba(15,21,53,0.18)] sm:p-10">
      <div className="flex flex-col items-center text-center">
        <div className="text-[68px] leading-none" aria-hidden>
          {slide.emoji}
        </div>
        <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          {slide.title}
        </h3>
        <p className="mt-3 max-w-2xl text-base font-medium leading-relaxed text-ink-soft sm:text-lg">
          {slide.body}
        </p>

        {slide.examples && slide.examples.length > 0 && (
          <div className="mt-6 w-full max-w-md rounded-2xl border border-line bg-bg-2 p-5 text-right">
            <div className="text-xs font-bold uppercase tracking-wider text-ink-soft">
              דוגמאות
            </div>
            <ul className="mt-3 space-y-1.5 text-base font-semibold text-ink" dir="auto">
              {slide.examples.map((ex, i) => (
                <li key={i} className="tabular-nums">
                  {ex}
                </li>
              ))}
            </ul>
          </div>
        )}

        {slide.tip && (
          <div className="mt-5 flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-800">
            <span>💡</span>
            <span dir="auto">{slide.tip}</span>
          </div>
        )}

        {isLast && (
          <div className="mt-6 text-sm font-semibold text-ink-soft">
            לחצי על 'התחילי לתרגל' למטה כדי להמשיך ↓
          </div>
        )}
      </div>
    </article>
  );
}

function NavRow({
  isFirst,
  isLast,
  onPrev,
  onNext,
  practiceHref,
  accentBg,
  accentShadow,
}: {
  isFirst: boolean;
  isLast: boolean;
  onPrev: () => void;
  onNext: () => void;
  practiceHref: string;
  accentBg: string;
  accentShadow: string;
}) {
  return (
    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        onClick={onPrev}
        disabled={isFirst}
        className={`rounded-2xl border border-line bg-white px-6 py-3 text-base font-bold text-ink shadow-sm transition ${
          isFirst
            ? "cursor-not-allowed opacity-40"
            : "hover:-translate-y-0.5 hover:shadow-md"
        }`}
      >
        → הקודם
      </button>

      {isLast ? (
        <Link
          href={practiceHref}
          className="flex-1 rounded-2xl px-6 py-4 text-center text-lg font-extrabold text-white transition hover:-translate-y-0.5 sm:flex-none"
          style={{ background: accentBg, boxShadow: accentShadow }}
        >
          התחילי לתרגל ←
        </Link>
      ) : (
        <button
          type="button"
          onClick={onNext}
          className="flex-1 rounded-2xl px-6 py-4 text-base font-extrabold text-white transition hover:-translate-y-0.5 sm:flex-none sm:px-8"
          style={{ background: accentBg, boxShadow: accentShadow }}
        >
          הבא ←
        </button>
      )}
    </div>
  );
}
