"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { recordPracticeComplete, useProgress } from "@/lib/progress";
import { generateCapitalsQuestions } from "@/lib/capitals";
import {
  getTriviaQuestions,
  type BankCategory,
  type BankLevel,
} from "@/lib/trivia-bank";
import type { TriviaQuestion } from "@/lib/trivia-types";

const TOTAL_QUESTIONS = 15;

const CATEGORY_LABELS: Record<string, string> = {
  geography: "גאוגרפיה",
  capitals: "בירות ודגלים",
  history: "היסטוריה",
  science: "מדע וטבע",
  arts: "אומנות ותרבות",
  sports: "ספורט",
  trivia: "טריוויה",
};

const LEVEL_LABELS_TRIVIA: Record<string, string> = {
  easy: "קל",
  normal: "רגיל",
  hard: "מאתגר",
};

const CATEGORIES = [
  "geography",
  "capitals",
  "history",
  "science",
  "arts",
  "sports",
  "trivia",
] as const;
const LEVELS = ["easy", "normal", "hard"] as const;

type CategoryId = (typeof CATEGORIES)[number];
type LevelId = (typeof LEVELS)[number];

const BANK_CATEGORIES = new Set<string>([
  "geography",
  "history",
  "science",
  "arts",
  "sports",
  "trivia",
]);

function isCategory(v: string | null): v is CategoryId {
  return v !== null && (CATEGORIES as readonly string[]).includes(v);
}
function isLevel(v: string | null): v is LevelId {
  return v !== null && (LEVELS as readonly string[]).includes(v);
}

export default function TriviaPracticePage() {
  return (
    <Suspense fallback={<LoadingShell />}>
      <PracticeInner />
    </Suspense>
  );
}

function LoadingShell() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-6">
      <p className="text-lg font-bold text-ink-soft">טוען...</p>
    </main>
  );
}

function PracticeInner() {
  const params = useSearchParams();
  const category: CategoryId = isCategory(params.get("category"))
    ? (params.get("category") as CategoryId)
    : "geography";
  const level: LevelId = isLevel(params.get("level"))
    ? (params.get("level") as LevelId)
    : "easy";
  const progress = useProgress();

  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const recordedRef = useRef(false);
  const startedAtRef = useRef<number>(Date.now());
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setErrorMsg("");

    const applyQuestions = (qs: TriviaQuestion[]) => {
      setQuestions(qs);
      setUserAnswers(Array(qs.length).fill(null));
      setCurrentIndex(0);
      setScore(0);
      setSelectedIndex(null);
      setShowFeedback(false);
      setIsComplete(false);
      setSeconds(0);
      recordedRef.current = false;
      startedAtRef.current = Date.now();
      setLoadState("ready");
    };

    try {
      if (category === "capitals") {
        const qs = generateCapitalsQuestions(level, TOTAL_QUESTIONS);
        applyQuestions(qs);
      } else if (BANK_CATEGORIES.has(category)) {
        const qs = getTriviaQuestions(
          category as BankCategory,
          level as BankLevel,
          TOTAL_QUESTIONS,
        );
        if (qs.length === 0) {
          throw new Error("שאלות לא נטענו");
        }
        applyQuestions(qs);
      } else {
        throw new Error("קטגוריה לא חוקית");
      }
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : String(e));
      setLoadState("error");
    }
  }, [category, level, reloadKey]);

  useEffect(() => {
    if (loadState !== "ready" || isComplete) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [loadState, isComplete]);

  const current = questions[currentIndex];
  const isCorrectSelected =
    selectedIndex !== null && current && selectedIndex === current.correctIndex;

  const handleAnswer = useCallback(
    (idx: number) => {
      if (selectedIndex !== null || !current) return;
      setSelectedIndex(idx);
      setShowFeedback(true);
      const correct = idx === current.correctIndex;
      if (correct) setScore((s) => s + 1);
      setUserAnswers((prev) => {
        const next = [...prev];
        next[currentIndex] = idx;
        return next;
      });
    },
    [current, currentIndex, selectedIndex],
  );

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return;
    setShowFeedback(false);
    setSelectedIndex(null);
    setCurrentIndex((i) => {
      if (i + 1 >= questions.length) {
        setIsComplete(true);
        return i;
      }
      return i + 1;
    });
  }, [questions.length, selectedIndex]);

  useEffect(() => {
    if (isComplete && !recordedRef.current && questions.length > 0) {
      recordedRef.current = true;
      const pct = Math.round((score / questions.length) * 100);
      const stars = pct >= 90 ? 30 : pct >= 70 ? 20 : 10;
      recordPracticeComplete(
        `trivia:${category}`,
        level,
        pct,
        stars,
        startedAtRef.current,
      );
    }
  }, [isComplete, score, questions.length, category, level]);

  const restart = useCallback(() => {
    setReloadKey((k) => k + 1);
  }, []);

  const timeLabel = useMemo(() => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }, [seconds]);

  const progressPct =
    questions.length === 0
      ? 0
      : ((currentIndex + (isComplete ? 1 : 0)) / questions.length) * 100;

  if (loadState === "loading") {
    return (
      <main className="mx-auto w-full max-w-3xl px-5 pb-20 pt-6 sm:px-8">
        <TopBar
          category={category}
          level={level}
          totalStars={progress.totalStars}
        />
        <LoadingState />
      </main>
    );
  }

  if (loadState === "error") {
    return (
      <main className="mx-auto w-full max-w-3xl px-5 pb-20 pt-6 sm:px-8">
        <TopBar
          category={category}
          level={level}
          totalStars={progress.totalStars}
        />
        <ErrorState errorMsg={errorMsg} onRetry={() => setReloadKey((k) => k + 1)} />
      </main>
    );
  }

  if (isComplete) {
    return (
      <main className="mx-auto w-full max-w-4xl px-5 pb-20 pt-6 sm:px-8">
        <TopBar
          category={category}
          level={level}
          totalStars={progress.totalStars}
        />
        <ResultScreen
          score={score}
          total={questions.length}
          seconds={seconds}
          onRestart={restart}
          questions={questions}
          userAnswers={userAnswers}
        />
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-5 pb-20 pt-6 sm:px-8">
      <TopBar
        category={category}
        level={level}
        totalStars={progress.totalStars}
      />
      <ProgressStrip
        current={currentIndex + 1}
        total={questions.length}
        progress={progressPct}
        timeLabel={timeLabel}
      />

      <div className="mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            {current && (
              <QuestionCard
                question={current}
                index={currentIndex + 1}
                selectedIndex={selectedIndex}
                onAnswer={handleAnswer}
              />
            )}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {showFeedback && current && (
            <FeedbackBand
              isCorrect={isCorrectSelected}
              correctAnswer={current.options[current.correctIndex]}
              explanation={current.explanation}
              funFact={current.funFact}
            />
          )}
        </AnimatePresence>

        {showFeedback && (
          <NextButton
            isLast={currentIndex === questions.length - 1}
            onClick={handleNext}
          />
        )}
      </div>
    </main>
  );
}

function NextButton({
  isLast,
  onClick,
}: {
  isLast: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.25 }}
      className="mt-5 flex justify-center"
    >
      <button
        type="button"
        onClick={onClick}
        autoFocus
        className="rounded-2xl px-8 py-4 text-lg font-extrabold text-white transition hover:-translate-y-0.5"
        style={{
          background:
            "linear-gradient(135deg, #14b8a6 0%, #10b981 50%, #06b6d4 100%)",
          boxShadow: "0 18px 40px -14px rgba(20, 184, 166, 0.55)",
        }}
      >
        {isLast ? "סיימי ←" : "לשאלה הבאה ←"}
      </button>
    </motion.div>
  );
}

function TopBar({
  category,
  level,
  totalStars,
}: {
  category: CategoryId;
  level: LevelId;
  totalStars: number;
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 py-2">
      <div className="flex items-center gap-3">
        <Link
          href="/trivia"
          aria-label="חזרה לידע כללי"
          className="grid h-11 w-11 place-items-center rounded-2xl border border-line bg-white/80 text-xl font-bold text-ink shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md"
        >
          →
        </Link>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
            תרגול <span className="text-ink-soft">·</span>{" "}
            <span className="text-teal-600">
              {CATEGORY_LABELS[category] ?? category}
            </span>
          </h1>
          <p className="text-sm font-semibold text-ink-soft">
            רמה: {LEVEL_LABELS_TRIVIA[level] ?? level}
          </p>
        </div>
      </div>

      <div className="flex h-11 items-center gap-2 rounded-full border border-line bg-white/80 px-4 text-sm font-bold text-ink shadow-sm backdrop-blur">
        <span>⭐</span>
        <span>{totalStars}</span>
      </div>
    </header>
  );
}

function LoadingState() {
  return (
    <section className="mt-10 flex flex-col items-center gap-5 text-center">
      <motion.div
        className="text-7xl sm:text-8xl"
        animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.3 }}
        aria-hidden
      >
        🦉
      </motion.div>
      <h2 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        ...חוחו מכין לך שאלות
      </h2>
      <div className="flex items-center gap-2" aria-hidden>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block h-3 w-3 rounded-full"
            style={{ background: "#14b8a6" }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 0.9,
              repeat: Infinity,
              delay: i * 0.18,
            }}
          />
        ))}
      </div>
      <p className="max-w-md text-sm font-medium text-ink-soft">
        טוענים שאלות חדשות בשבילך...
      </p>
    </section>
  );
}

function ErrorState({
  errorMsg,
  onRetry,
}: {
  errorMsg: string;
  onRetry: () => void;
}) {
  return (
    <section className="mt-10 flex flex-col items-center gap-4 text-center">
      <div className="text-6xl" aria-hidden>
        🙈
      </div>
      <h2 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        !אופס, חוחו נתקל בבעיה
      </h2>
      <p className="max-w-md text-base font-medium text-ink-soft">
        לא הצלחנו להכין לך שאלות. נסי שוב בעוד רגע.
      </p>
      {errorMsg && (
        <pre className="max-w-md overflow-x-auto rounded-2xl border border-line bg-white/80 p-3 text-xs text-ink-soft">
          {errorMsg}
        </pre>
      )}
      <div className="mt-2 flex flex-col gap-3 sm:flex-row-reverse">
        <button
          type="button"
          onClick={onRetry}
          className="rounded-2xl px-6 py-3 text-base font-extrabold text-white transition hover:-translate-y-0.5"
          style={{
            background: "linear-gradient(135deg, #14b8a6 0%, #10b981 100%)",
            boxShadow: "0 14px 32px -12px rgba(20, 184, 166, 0.55)",
          }}
        >
          נסי שוב ←
        </button>
        <Link
          href="/trivia"
          className="rounded-2xl border border-line bg-white px-6 py-3 text-center text-base font-bold text-ink shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          חזרה לידע כללי
        </Link>
      </div>
    </section>
  );
}

function ProgressStrip({
  current,
  total,
  progress,
  timeLabel,
}: {
  current: number;
  total: number;
  progress: number;
  timeLabel: string;
}) {
  return (
    <div className="mt-6 flex items-center gap-4 rounded-2xl border border-line bg-white/85 p-4 shadow-[0_8px_24px_-16px_rgba(15,21,53,0.2)] backdrop-blur">
      <div
        className="flex-shrink-0 text-lg font-extrabold tabular-nums text-ink"
        dir="ltr"
      >
        {current} / {total}
      </div>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-bg-2">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, #14b8a6 0%, #10b981 100%)",
            boxShadow: "0 0 12px 1px rgba(16, 185, 129, 0.55)",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        />
      </div>
      <div
        className="flex flex-shrink-0 items-center gap-1.5 text-sm font-bold tabular-nums text-ink-soft"
        dir="ltr"
      >
        <span>⏱️</span>
        <span>{timeLabel}</span>
      </div>
    </div>
  );
}

function QuestionCard({
  question,
  index,
  selectedIndex,
  onAnswer,
}: {
  question: TriviaQuestion;
  index: number;
  selectedIndex: number | null;
  onAnswer: (i: number) => void;
}) {
  const locked = selectedIndex !== null;
  return (
    <>
      <section
        className="relative overflow-hidden rounded-[28px] px-6 py-10 text-center shadow-[0_24px_60px_-20px_rgba(6,78,59,0.55)] sm:px-10 sm:py-12"
        style={{
          background:
            "linear-gradient(135deg, #0f1535 0%, #134e4a 55%, #115e59 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute -left-24 -top-20 h-80 w-80 rounded-full opacity-35 blur-3xl"
          style={{ background: "#14b8a6" }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full opacity-25 blur-3xl"
          style={{ background: "#06b6d4" }}
          aria-hidden
        />

        <div className="relative">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-teal-300">
            שאלה {index}
          </span>
          {question.emoji && (
            <motion.div
              key={`emoji-${index}`}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 16 }}
              className="mt-4 text-[96px] leading-none drop-shadow-md sm:text-[128px]"
              aria-hidden
            >
              {question.emoji}
            </motion.div>
          )}
          <div
            className={`font-extrabold leading-tight text-white ${
              question.emoji
                ? "mt-4 text-[22px] sm:text-[28px]"
                : "mt-4 text-[26px] sm:text-[36px]"
            }`}
            dir="auto"
          >
            {question.question}
          </div>
        </div>
      </section>

      <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {question.options.map((opt, i) => (
          <AnswerButton
            key={i}
            option={opt}
            index={i}
            correctIndex={question.correctIndex}
            selectedIndex={selectedIndex}
            locked={locked}
            onClick={() => onAnswer(i)}
          />
        ))}
      </div>
    </>
  );
}

function AnswerButton({
  option,
  index,
  correctIndex,
  selectedIndex,
  locked,
  onClick,
}: {
  option: string;
  index: number;
  correctIndex: number;
  selectedIndex: number | null;
  locked: boolean;
  onClick: () => void;
}) {
  const isPicked = selectedIndex === index;
  const isCorrect = index === correctIndex;
  const reveal = locked && (isPicked || isCorrect);

  let stateClasses =
    "border-line bg-white text-ink hover:border-teal-500 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-14px_rgba(20,184,166,0.5)]";
  let icon: string | null = null;

  if (reveal && isCorrect) {
    stateClasses = "border-emerald-300 text-emerald-700 bg-emerald-50";
    icon = "✓";
  } else if (reveal && isPicked && !isCorrect) {
    stateClasses = "border-rose-300 text-rose-700 bg-rose-50";
    icon = "✗";
  } else if (locked) {
    stateClasses = "border-line bg-white/70 text-ink-soft";
  }

  const shake = locked && isPicked && !isCorrect;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={locked}
      whileTap={!locked ? { scale: 0.97 } : undefined}
      animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative flex min-h-[72px] items-center justify-center gap-3 rounded-2xl border-2 px-5 py-4 text-lg font-extrabold transition-all duration-200 sm:min-h-[80px] sm:text-[20px] ${stateClasses} ${
        locked ? "cursor-default" : "cursor-pointer"
      }`}
    >
      <span dir="auto" className="text-center">
        {option}
      </span>
      {icon && (
        <span
          className={`grid h-8 w-8 flex-shrink-0 place-items-center rounded-full text-lg text-white ${
            isCorrect ? "bg-emerald-500" : "bg-rose-500"
          }`}
          aria-hidden
        >
          {icon}
        </span>
      )}
    </motion.button>
  );
}

function FeedbackBand({
  isCorrect,
  correctAnswer,
  explanation,
  funFact,
}: {
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
  funFact?: string;
}) {
  if (isCorrect) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="mt-5 flex items-start gap-4 rounded-2xl border border-emerald-200 p-5 shadow-[0_14px_32px_-18px_rgba(16,185,129,0.5)]"
        style={{
          background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
        }}
      >
        <div className="text-4xl" aria-hidden>
          🎉
        </div>
        <div>
          <div className="text-lg font-extrabold text-emerald-800 sm:text-xl">
            !נכון מאוד
          </div>
          <div className="mt-1 text-sm font-medium text-emerald-700 sm:text-base" dir="auto">
            {explanation}
          </div>
          {funFact && (
            <div
              className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-900"
              dir="auto"
            >
              💡 הידעת? {funFact}
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="mt-5 flex items-start gap-4 rounded-2xl border border-rose-200 p-5 shadow-[0_14px_32px_-18px_rgba(244,63,94,0.45)]"
      style={{
        background: "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)",
      }}
    >
      <div className="text-4xl" aria-hidden>
        🦉
      </div>
      <div>
        <div className="text-lg font-extrabold text-rose-800 sm:text-xl">
          לא נורא — ננסה להבין
        </div>
        <div className="text-sm font-semibold text-rose-700 sm:text-base" dir="auto">
          התשובה הנכונה:{" "}
          <span className="font-extrabold">{correctAnswer}</span>
        </div>
        <div className="mt-1 text-sm font-medium text-rose-700/90" dir="auto">
          {explanation}
        </div>
        {funFact && (
          <div
            className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-900"
            dir="auto"
          >
            💡 הידעת? {funFact}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ResultScreen({
  score,
  total,
  seconds,
  onRestart,
  questions,
  userAnswers,
}: {
  score: number;
  total: number;
  seconds: number;
  onRestart: () => void;
  questions: TriviaQuestion[];
  userAnswers: (number | null)[];
}) {
  const pct = Math.round((score / total) * 100);
  const stars = pct >= 90 ? 3 : pct >= 70 ? 2 : 1;
  const newStars = stars === 3 ? 30 : stars === 2 ? 20 : 10;
  const mm = Math.floor(seconds / 60);
  const ss = seconds % 60;
  const timeLabel = `${mm}:${String(ss).padStart(2, "0")}`;

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  return (
    <motion.section
      className="mt-10 flex flex-col items-center text-center"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div
        className="text-7xl sm:text-8xl"
        aria-hidden
        animate={{ y: [0, -12, 0, -6, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 0.6 }}
      >
        🦉
      </motion.div>

      <motion.h2
        className="mt-4 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl"
        variants={item}
      >
        !כל הכבוד{" "}
        <span
          className="bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #14b8a6 0%, #10b981 50%, #06b6d4 100%)",
          }}
        >
          ליה
        </span>
      </motion.h2>

      <motion.p
        className="mt-2 text-lg font-semibold text-ink-soft sm:text-xl"
        variants={item}
      >
        למדת דברים חדשים על העולם
      </motion.p>

      <motion.div
        className="mt-6 flex items-center gap-3 text-5xl sm:text-6xl"
        variants={item}
      >
        {[0, 1, 2].map((i) => {
          const filled = i < stars;
          return (
            <motion.span
              key={i}
              initial={{ scale: 0.3, rotate: -30, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{
                delay: 0.35 + i * 0.18,
                type: "spring",
                stiffness: 240,
                damping: 14,
              }}
              className={
                filled
                  ? "drop-shadow-[0_6px_14px_rgba(245,158,11,0.5)]"
                  : ""
              }
              aria-hidden
            >
              {filled ? "⭐" : "☆"}
            </motion.span>
          );
        })}
      </motion.div>

      <motion.div
        className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3"
        variants={item}
      >
        <StatCard label="תשובות נכונות" value={`${score} / ${total}`} />
        <StatCard label="דיוק" value={`${pct}%`} />
        <StatCard label="כוכבים חדשים" value={`+${newStars}`} accent />
      </motion.div>

      <motion.p
        className="mt-4 text-sm font-semibold text-ink-soft"
        variants={item}
        dir="ltr"
      >
        ⏱️ {timeLabel}
      </motion.p>

      <motion.div className="w-full" variants={item}>
        <ReviewSection questions={questions} userAnswers={userAnswers} />
      </motion.div>

      <motion.div
        className="mt-8 flex w-full max-w-xl flex-col gap-3 sm:flex-row-reverse"
        variants={item}
      >
        <button
          type="button"
          onClick={onRestart}
          className="flex-1 rounded-2xl px-6 py-4 text-lg font-extrabold text-white shadow-[0_18px_40px_-14px_rgba(20,184,166,0.6)] transition hover:-translate-y-0.5"
          style={{
            background:
              "linear-gradient(135deg, #14b8a6 0%, #10b981 50%, #06b6d4 100%)",
          }}
        >
          10 שאלות חדשות ←
        </button>
        <Link
          href="/trivia"
          className="flex-1 rounded-2xl border border-line bg-white px-6 py-4 text-center text-lg font-bold text-ink shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          חזרה לידע כללי
        </Link>
      </motion.div>
    </motion.section>
  );
}

function ReviewSection({
  questions,
  userAnswers,
}: {
  questions: TriviaQuestion[];
  userAnswers: (number | null)[];
}) {
  const mistakes = questions
    .map((q, i) => ({ q, ua: userAnswers[i], i }))
    .filter(({ q, ua }) => ua !== null && ua !== q.correctIndex);

  if (mistakes.length === 0) {
    return (
      <div className="mt-10 w-full max-w-2xl rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 text-center">
        <div className="text-3xl" aria-hidden>
          💯
        </div>
        <p className="mt-2 text-lg font-extrabold text-emerald-800">
          כל התשובות נכונות — !מושלם
        </p>
      </div>
    );
  }

  return (
    <section className="mt-10 w-full max-w-3xl text-right">
      <h3 className="mb-4 text-xl font-extrabold text-ink sm:text-2xl">
        סקירת טעויות ({mistakes.length})
      </h3>
      <div className="flex flex-col gap-3">
        {mistakes.map(({ q, ua, i }) => (
          <article
            key={i}
            className="rounded-2xl border border-line bg-white p-5 shadow-[0_8px_24px_-16px_rgba(15,21,53,0.2)]"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                שאלה {i + 1}
              </span>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-extrabold text-rose-700">
                טעות
              </span>
            </div>
            <p
              className="mt-2 text-base font-bold text-ink sm:text-lg"
              dir="auto"
            >
              {q.question}
            </p>
            <dl className="mt-3 flex flex-col gap-1.5 text-sm sm:text-base">
              <div className="flex items-baseline gap-2">
                <dt className="font-semibold text-ink-soft">התשובה שלך:</dt>
                <dd className="font-extrabold text-rose-700" dir="auto">
                  {ua !== null ? q.options[ua] : "—"}
                </dd>
              </div>
              <div className="flex items-baseline gap-2">
                <dt className="font-semibold text-ink-soft">התשובה הנכונה:</dt>
                <dd className="font-extrabold text-emerald-700" dir="auto">
                  {q.options[q.correctIndex]}
                </dd>
              </div>
            </dl>
            <p
              className="mt-2 text-sm font-medium leading-relaxed text-ink-soft"
              dir="auto"
            >
              💡 {q.explanation}
            </p>
            {q.funFact && (
              <p
                className="mt-1 rounded-xl border border-amber-200 bg-amber-50 p-2 text-sm font-semibold text-amber-900"
                dir="auto"
              >
                🔎 הידעת? {q.funFact}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 text-center shadow-[0_12px_32px_-20px_rgba(15,21,53,0.25)] ${
        accent
          ? "border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-100"
          : "border-line bg-white"
      }`}
    >
      <div className="text-sm font-bold uppercase tracking-wider text-ink-soft">
        {label}
      </div>
      <div
        className={`mt-1 text-3xl font-extrabold tabular-nums ${
          accent ? "text-amber-700" : "text-ink"
        }`}
        dir="ltr"
      >
        {value}
      </div>
    </div>
  );
}
