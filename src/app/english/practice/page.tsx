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
import {
  EN_LEVEL_LABELS,
  EN_TOPIC_LABELS,
  generateEnQuestions,
  isEnLevel,
  isEnTopic,
  type EnLevel,
  type EnQuestion,
  type EnTopic,
} from "@/lib/english-generator";
import { SpeakButton } from "@/components/SpeakButton";
import { speak } from "@/lib/speech";
import { recordPracticeComplete, useProgress } from "@/lib/progress";

const TOTAL_QUESTIONS = 15;

export default function EnglishPracticePage() {
  return (
    <Suspense fallback={<Loading />}>
      <PracticeInner />
    </Suspense>
  );
}

function Loading() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-6">
      <p className="text-lg font-bold text-ink-soft">טוען תרגול…</p>
    </main>
  );
}

function PracticeInner() {
  const params = useSearchParams();
  const topic: EnTopic = isEnTopic(params.get("topic"))
    ? (params.get("topic") as EnTopic)
    : "vocab";
  const level: EnLevel = isEnLevel(params.get("level"))
    ? (params.get("level") as EnLevel)
    : "easy";
  const progress = useProgress();

  const [questions, setQuestions] = useState<EnQuestion[]>(() =>
    generateEnQuestions(topic, level, TOTAL_QUESTIONS),
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>(() =>
    Array(TOTAL_QUESTIONS).fill(null),
  );
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const recordedRef = useRef(false);
  const startedAtRef = useRef<number>(Date.now());

  useEffect(() => {
    if (isComplete) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [isComplete]);

  const current = questions[currentIndex];

  // Auto-play audio on new question (for speaking/listening topic especially)
  useEffect(() => {
    if (topic === "speaking" && current?.audio) {
      const id = window.setTimeout(() => speak(current.audio!), 400);
      return () => window.clearTimeout(id);
    }
  }, [currentIndex, topic, current?.audio]);

  const isCorrectSelected =
    selectedAnswer !== null && current && selectedAnswer === current.correctAnswer;

  const handleAnswer = useCallback(
    (option: string) => {
      if (selectedAnswer !== null) return;
      setSelectedAnswer(option);
      setShowFeedback(true);
      const correct = option === current?.correctAnswer;
      if (correct) setScore((s) => s + 1);
      setUserAnswers((prev) => {
        const next = [...prev];
        next[currentIndex] = option;
        return next;
      });
    },
    [current, currentIndex, selectedAnswer],
  );

  const handleNext = useCallback(() => {
    if (selectedAnswer === null) return;
    setShowFeedback(false);
    setSelectedAnswer(null);
    setCurrentIndex((idx) => {
      if (idx + 1 >= questions.length) {
        setIsComplete(true);
        return idx;
      }
      return idx + 1;
    });
  }, [questions.length, selectedAnswer]);

  useEffect(() => {
    if (isComplete && !recordedRef.current) {
      recordedRef.current = true;
      const pct = Math.round((score / questions.length) * 100);
      const stars = pct >= 90 ? 30 : pct >= 70 ? 20 : 10;
      recordPracticeComplete(`en:${topic}`, level, pct, stars, startedAtRef.current);
    }
  }, [isComplete, score, questions.length, topic, level]);

  const restart = useCallback(() => {
    recordedRef.current = false;
    startedAtRef.current = Date.now();
    setQuestions(generateEnQuestions(topic, level, TOTAL_QUESTIONS));
    setCurrentIndex(0);
    setScore(0);
    setUserAnswers(Array(TOTAL_QUESTIONS).fill(null));
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsComplete(false);
    setSeconds(0);
  }, [topic, level]);

  const timeLabel = useMemo(() => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }, [seconds]);

  const progressPct =
    ((currentIndex + (isComplete ? 1 : 0)) / questions.length) * 100;

  if (isComplete) {
    return (
      <main className="mx-auto w-full max-w-4xl px-5 pb-20 pt-6 sm:px-8">
        <TopBar topic={topic} level={level} totalStars={progress.totalStars} />
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
      <TopBar topic={topic} level={level} totalStars={progress.totalStars} />
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
                selectedAnswer={selectedAnswer}
                onAnswer={handleAnswer}
                topic={topic}
              />
            )}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {showFeedback && current && (
            <FeedbackBand
              isCorrect={isCorrectSelected}
              correctAnswer={current.correctAnswer}
              explanation={current.explanation}
              audio={current.audio}
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
            "linear-gradient(135deg, #fb7185 0%, #f43f5e 50%, #f97316 100%)",
          boxShadow: "0 18px 40px -14px rgba(244, 63, 94, 0.6)",
        }}
      >
        {isLast ? "Finish ←" : "Next ←"}
      </button>
    </motion.div>
  );
}

function TopBar({
  topic,
  level,
  totalStars,
}: {
  topic: EnTopic;
  level: EnLevel;
  totalStars: number;
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 py-2">
      <div className="flex items-center gap-3">
        <Link
          href="/english"
          aria-label="חזרה לאנגלית"
          className="grid h-11 w-11 place-items-center rounded-2xl border border-line bg-white/80 text-xl font-bold text-ink shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md"
        >
          →
        </Link>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
            English Practice <span className="text-ink-soft">·</span>{" "}
            <span className="text-coral">{EN_TOPIC_LABELS[topic]}</span>
          </h1>
          <p className="text-sm font-semibold text-ink-soft">
            רמה: {EN_LEVEL_LABELS[level]}
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
            background:
              "linear-gradient(90deg, #fb923c 0%, #f97316 50%, #f43f5e 100%)",
            boxShadow: "0 0 12px 1px rgba(249, 115, 22, 0.55)",
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
  selectedAnswer,
  onAnswer,
  topic,
}: {
  question: EnQuestion;
  index: number;
  selectedAnswer: string | null;
  onAnswer: (opt: string) => void;
  topic: EnTopic;
}) {
  const locked = selectedAnswer !== null;
  const optionIsEnglish = question.direction === "ltr";
  return (
    <>
      <section
        className="relative overflow-hidden rounded-[28px] px-6 py-10 text-center shadow-[0_24px_60px_-20px_rgba(127,29,29,0.55)] sm:px-10 sm:py-12"
        style={{
          background:
            "linear-gradient(135deg, #0f1535 0%, #7c2d12 55%, #9a3412 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute -left-24 -top-20 h-80 w-80 rounded-full opacity-35 blur-3xl"
          style={{ background: "#f97316" }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full opacity-25 blur-3xl"
          style={{ background: "#fbbf24" }}
          aria-hidden
        />

        <div className="relative flex flex-col items-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-orange-300">
            Question {index}
          </span>

          <h2 className="mt-3 text-xl font-bold text-white sm:text-2xl" dir="auto">
            {question.question}
          </h2>

          {question.promptEmoji && (
            <div className="mt-5 text-[84px] leading-none drop-shadow-md sm:text-[110px]" aria-hidden>
              {question.promptEmoji}
            </div>
          )}

          {question.prompt && (
            <div
              className="mt-5 flex max-w-2xl items-center gap-3 rounded-2xl bg-white/10 px-5 py-4 text-2xl font-extrabold text-white sm:text-[30px]"
              dir={question.direction ?? "auto"}
            >
              <span className="text-center">{question.prompt}</span>
              {question.audio && (
                <SpeakButton
                  text={question.audio}
                  size="md"
                  tone="white"
                  label={`השמיעי: ${question.audio}`}
                />
              )}
            </div>
          )}

          {!question.prompt && question.audio && (
            <div className="mt-5 flex flex-col items-center gap-2">
              <SpeakButton text={question.audio} size="xl" tone="white" />
              {topic === "speaking" && (
                <span className="text-sm font-semibold text-orange-200">
                  לחצי לשמוע שוב
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {question.options.map((opt) => (
          <AnswerButton
            key={opt}
            option={opt}
            correctAnswer={question.correctAnswer}
            selectedAnswer={selectedAnswer}
            locked={locked}
            onClick={() => onAnswer(opt)}
            speakOnClick={optionIsEnglish}
          />
        ))}
      </div>
    </>
  );
}

function AnswerButton({
  option,
  correctAnswer,
  selectedAnswer,
  locked,
  onClick,
  speakOnClick,
}: {
  option: string;
  correctAnswer: string;
  selectedAnswer: string | null;
  locked: boolean;
  onClick: () => void;
  speakOnClick: boolean;
}) {
  const isPicked = selectedAnswer === option;
  const isCorrect = option === correctAnswer;
  const reveal = locked && (isPicked || isCorrect);

  let stateClasses =
    "border-line bg-white text-ink hover:border-coral hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-14px_rgba(244,63,94,0.5)]";
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

  const handleClick = () => {
    if (speakOnClick && !locked) {
      speak(option);
    }
    onClick();
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={locked}
      whileTap={!locked ? { scale: 0.97 } : undefined}
      animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative flex min-h-[68px] items-center justify-center gap-3 rounded-2xl border-2 px-5 py-4 text-2xl font-extrabold transition-all duration-200 sm:min-h-[76px] sm:text-[28px] ${stateClasses} ${
        locked ? "cursor-default" : "cursor-pointer"
      }`}
    >
      <span dir="auto">{option}</span>
      {icon && (
        <span
          className={`grid h-8 w-8 place-items-center rounded-full text-lg text-white ${
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
  audio,
}: {
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
  audio?: string;
}) {
  if (isCorrect) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="mt-5 flex items-center gap-4 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 p-5 shadow-[0_14px_32px_-18px_rgba(16,185,129,0.5)]"
      >
        <div className="text-4xl" aria-hidden>
          🎉
        </div>
        <div className="flex-1">
          <div className="text-lg font-extrabold text-emerald-800 sm:text-xl">
            Great job, Lia!
          </div>
          <div className="text-sm font-semibold text-emerald-700 sm:text-base">
            !תשובה נכונה
          </div>
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
      className="mt-5 flex items-start gap-4 rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 to-rose-100 p-5 shadow-[0_14px_32px_-18px_rgba(244,63,94,0.45)]"
    >
      <div className="text-4xl" aria-hidden>
        😅
      </div>
      <div className="flex-1">
        <div className="text-lg font-extrabold text-rose-800 sm:text-xl">
          Not quite!
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-rose-700 sm:text-base">
          <span>
            התשובה הנכונה היא{" "}
            <span className="font-extrabold" dir="auto">
              {correctAnswer}
            </span>
          </span>
          {audio && <SpeakButton text={audio} size="sm" tone="orange" />}
        </div>
        <div className="mt-1 text-sm font-medium text-rose-700/90" dir="auto">
          💡 {explanation}
        </div>
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
  questions: EnQuestion[];
  userAnswers: (string | null)[];
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
        🦜
      </motion.div>

      <motion.h2
        className="mt-4 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl"
        variants={item}
      >
        Well done,{" "}
        <span
          className="bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #f43f5e 0%, #f97316 50%, #fbbf24 100%)",
          }}
        >
          Lia
        </span>
        !
      </motion.h2>

      <motion.p
        className="mt-2 text-lg font-semibold text-ink-soft sm:text-xl"
        variants={item}
      >
        סיימת את התרגול באנגלית
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
          className="flex-1 rounded-2xl px-6 py-4 text-lg font-extrabold text-white shadow-[0_18px_40px_-14px_rgba(244,63,94,0.6)] transition hover:-translate-y-0.5"
          style={{
            background:
              "linear-gradient(135deg, #fb7185 0%, #f43f5e 50%, #f97316 100%)",
          }}
        >
          עוד תרגול ←
        </button>
        <Link
          href="/english"
          className="flex-1 rounded-2xl border border-line bg-white px-6 py-4 text-center text-lg font-bold text-ink shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          חזרה לאנגלית
        </Link>
      </motion.div>
    </motion.section>
  );
}

function ReviewSection({
  questions,
  userAnswers,
}: {
  questions: EnQuestion[];
  userAnswers: (string | null)[];
}) {
  const mistakes = questions
    .map((q, i) => ({ q, ua: userAnswers[i], i }))
    .filter(({ q, ua }) => ua !== null && ua !== q.correctAnswer);

  if (mistakes.length === 0) {
    return (
      <div className="mt-10 w-full max-w-2xl rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 text-center">
        <div className="text-3xl" aria-hidden>
          💯
        </div>
        <p className="mt-2 text-lg font-extrabold text-emerald-800">
          Perfect — all correct!
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
            <p className="mt-2 text-base font-bold text-ink sm:text-lg" dir="auto">
              {q.question}
            </p>
            {q.prompt && (
              <p className="mt-1 text-base font-semibold text-ink-soft" dir={q.direction ?? "auto"}>
                {q.promptEmoji ? `${q.promptEmoji} ` : ""}{q.prompt}
              </p>
            )}
            <dl className="mt-3 flex flex-col gap-1.5 text-sm sm:text-base">
              <div className="flex items-baseline gap-2">
                <dt className="font-semibold text-ink-soft">התשובה שלך:</dt>
                <dd className="font-extrabold text-rose-700" dir="auto">
                  {ua}
                </dd>
              </div>
              <div className="flex items-baseline gap-2">
                <dt className="font-semibold text-ink-soft">התשובה הנכונה:</dt>
                <dd className="font-extrabold text-emerald-700" dir="auto">
                  {q.correctAnswer}
                </dd>
                {q.audio && <SpeakButton text={q.audio} size="sm" />}
              </div>
            </dl>
            <p className="mt-2 text-sm font-medium leading-relaxed text-ink-soft" dir="auto">
              💡 {q.explanation}
            </p>
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
