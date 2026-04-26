"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { recordGamePlay, useProgress } from "@/lib/progress";

const GAME_DURATION = 60;
const GRID_SIZE = 6;

type Cell = {
  a: number;
  b: number;
  product: number;
};

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeRound(): { target: number; cells: Cell[] } {
  const a = randInt(2, 9);
  const b = randInt(2, 9);
  const target = a * b;

  const used = new Set<string>();
  const cells: Cell[] = [];
  used.add(`${a}x${b}`);
  used.add(`${b}x${a}`);
  cells.push({ a, b, product: target });

  let guard = 0;
  while (cells.length < GRID_SIZE && guard < 200) {
    guard++;
    const x = randInt(2, 9);
    const y = randInt(2, 9);
    const key = `${x}x${y}`;
    const keyRev = `${y}x${x}`;
    if (used.has(key) || used.has(keyRev)) continue;
    if (x * y === target) continue;
    used.add(key);
    cells.push({ a: x, b: y, product: x * y });
  }

  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }

  return { target, cells };
}

export default function MulRacePage() {
  const progress = useProgress();
  const [phase, setPhase] = useState<"intro" | "playing" | "done">("intro");
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [round, setRound] = useState(() => makeRound());
  const [picked, setPicked] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const recordedRef = useRef(false);
  const startedAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (phase === "playing" && startedAtRef.current === null) {
      startedAtRef.current = Date.now();
    }
    if (phase !== "playing") return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setPhase("done");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase === "done" && !recordedRef.current) {
      recordedRef.current = true;
      recordGamePlay("mul", score, startedAtRef.current ?? undefined);
    }
  }, [phase, score]);

  const handleCell = useCallback(
    (idx: number, cell: Cell) => {
      if (phase !== "playing" || picked !== null) return;
      setPicked(idx);
      if (cell.product === round.target) {
        setScore((s) => s + 1 + Math.floor(combo / 3));
        setCombo((c) => c + 1);
        setFeedback("correct");
        window.setTimeout(() => {
          setPicked(null);
          setFeedback(null);
          setRound(makeRound());
        }, 450);
      } else {
        setCombo(0);
        setFeedback("wrong");
        window.setTimeout(() => {
          setPicked(null);
          setFeedback(null);
        }, 650);
      }
    },
    [phase, picked, round.target, combo],
  );

  const start = () => {
    recordedRef.current = false;
    startedAtRef.current = Date.now();
    setPhase("playing");
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setCombo(0);
    setRound(makeRound());
    setPicked(null);
    setFeedback(null);
  };

  return (
    <main className="mx-auto w-full max-w-4xl px-5 pb-20 pt-6 sm:px-8">
      <TopBar totalStars={progress.totalStars} />
      {phase === "intro" && <Intro onStart={start} />}
      {phase === "playing" && (
        <PlayingView
          timeLeft={timeLeft}
          score={score}
          combo={combo}
          round={round}
          picked={picked}
          feedback={feedback}
          onCell={handleCell}
        />
      )}
      {phase === "done" && (
        <DoneView score={score} onRestart={start} />
      )}
    </main>
  );
}

function TopBar({ totalStars }: { totalStars: number }) {
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
        <h1 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
          🚀 מסע הכפל
        </h1>
      </div>
      <div className="flex h-11 items-center gap-2 rounded-full border border-line bg-white/80 px-4 text-sm font-bold text-ink shadow-sm backdrop-blur">
        <span>⭐</span>
        <span>{totalStars}</span>
      </div>
    </header>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <section className="mt-10 flex flex-col items-center gap-5 text-center">
      <div
        className="text-7xl sm:text-8xl"
        aria-hidden
      >
        🚀
      </div>
      <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        מצאי את הכפל הנכון!
      </h2>
      <p className="max-w-xl text-base font-medium text-ink-soft sm:text-lg">
        יוצג לך מספר — תמצאי בתוך הרשת את תרגיל הכפל שתוצאתו זהה. כמה שיותר מהר,
        ככה יותר נקודות. יש לך 60 שניות!
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-semibold text-ink-soft">
        <span className="rounded-full border border-line bg-bg-2 px-3 py-1">⏱️ 60 שניות</span>
        <span className="rounded-full border border-line bg-bg-2 px-3 py-1">🎯 כל פעם מספר אחר</span>
        <span className="rounded-full border border-line bg-bg-2 px-3 py-1">🔥 קומבו = יותר נקודות</span>
      </div>
      <button
        type="button"
        onClick={onStart}
        className="mt-4 rounded-2xl px-8 py-4 text-xl font-extrabold text-white shadow-[0_18px_40px_-14px_rgba(99,102,241,0.6)] transition hover:-translate-y-0.5"
        style={{
          background:
            "linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #ec4899 100%)",
        }}
      >
        התחילי משחק ←
      </button>
    </section>
  );
}

function PlayingView({
  timeLeft,
  score,
  combo,
  round,
  picked,
  feedback,
  onCell,
}: {
  timeLeft: number;
  score: number;
  combo: number;
  round: { target: number; cells: Cell[] };
  picked: number | null;
  feedback: "correct" | "wrong" | null;
  onCell: (idx: number, cell: Cell) => void;
}) {
  const mm = Math.floor(timeLeft / 60);
  const ss = timeLeft % 60;
  const timeLabel = `${mm}:${String(ss).padStart(2, "0")}`;
  const critical = timeLeft <= 10;

  return (
    <>
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-line bg-white/90 p-3 text-center shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-ink-soft">
            ניקוד
          </div>
          <div className="text-2xl font-extrabold text-ink tabular-nums" dir="ltr">
            {score}
          </div>
        </div>
        <div
          className={`rounded-2xl border p-3 text-center shadow-sm ${
            combo >= 3
              ? "border-amber-300 bg-gradient-to-br from-amber-50 to-orange-100"
              : "border-line bg-white/90"
          }`}
        >
          <div className="text-xs font-bold uppercase tracking-wider text-ink-soft">
            קומבו
          </div>
          <div
            className={`text-2xl font-extrabold tabular-nums ${
              combo >= 3 ? "text-amber-700" : "text-ink"
            }`}
            dir="ltr"
          >
            {combo >= 3 ? `🔥 ${combo}` : combo}
          </div>
        </div>
        <motion.div
          className={`rounded-2xl border p-3 text-center shadow-sm ${
            critical
              ? "border-rose-300 bg-rose-50"
              : "border-line bg-white/90"
          }`}
          animate={critical ? { scale: [1, 1.06, 1] } : { scale: 1 }}
          transition={{ duration: 0.6, repeat: critical ? Infinity : 0 }}
        >
          <div className="text-xs font-bold uppercase tracking-wider text-ink-soft">
            זמן
          </div>
          <div
            className={`text-2xl font-extrabold tabular-nums ${
              critical ? "text-rose-700" : "text-ink"
            }`}
            dir="ltr"
          >
            ⏱️ {timeLabel}
          </div>
        </motion.div>
      </div>

      <section
        className="relative mt-5 overflow-hidden rounded-[28px] px-6 py-8 text-center shadow-[0_24px_60px_-20px_rgba(15,21,53,0.6)]"
        style={{
          background:
            "linear-gradient(135deg, #0f1535 0%, #1e1b4b 60%, #312e81 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute -left-20 -top-16 h-56 w-56 rounded-full opacity-40 blur-3xl"
          style={{ background: "#8b5cf6" }}
          aria-hidden
        />
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-300">
          המטרה
        </span>
        <AnimatePresence mode="wait">
          <motion.div
            key={round.target}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="mt-2 text-6xl font-extrabold text-white tabular-nums sm:text-7xl"
            dir="ltr"
          >
            {round.target}
          </motion.div>
        </AnimatePresence>
      </section>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {round.cells.map((cell, idx) => {
          const isPicked = picked === idx;
          const isCorrect = cell.product === round.target;
          const showGreen =
            isPicked && feedback === "correct" && isCorrect;
          const showRed =
            isPicked && feedback === "wrong" && !isCorrect;
          let extra = "border-line bg-white text-ink hover:border-primary hover:-translate-y-0.5";
          if (showGreen) extra = "border-emerald-400 bg-emerald-100 text-emerald-800";
          else if (showRed) extra = "border-rose-400 bg-rose-100 text-rose-800";

          return (
            <motion.button
              key={`${cell.a}-${cell.b}-${idx}`}
              type="button"
              onClick={() => onCell(idx, cell)}
              whileTap={{ scale: 0.95 }}
              animate={showRed ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
              transition={{ duration: 0.35 }}
              className={`flex min-h-[80px] items-center justify-center rounded-2xl border-2 px-4 py-4 text-2xl font-extrabold transition-colors sm:min-h-[96px] sm:text-3xl ${extra}`}
              dir="ltr"
            >
              {cell.a} × {cell.b}
            </motion.button>
          );
        })}
      </div>
    </>
  );
}

function DoneView({
  score,
  onRestart,
}: {
  score: number;
  onRestart: () => void;
}) {
  const emoji = score >= 20 ? "🏆" : score >= 10 ? "🎉" : score >= 5 ? "💪" : "🌱";
  const headline =
    score >= 20
      ? "!מדהים"
      : score >= 10
      ? "!כל הכבוד"
      : score >= 5
      ? "!התחלה טובה"
      : "!נסי שוב";

  return (
    <section className="mt-10 flex flex-col items-center text-center">
      <motion.div
        className="text-7xl sm:text-8xl"
        aria-hidden
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.5 }}
      >
        {emoji}
      </motion.div>
      <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
        {headline}
      </h2>
      <p className="mt-2 text-lg font-semibold text-ink-soft sm:text-xl">
        הצלחת להשיג{" "}
        <span className="font-extrabold text-primary tabular-nums" dir="ltr">
          {score}
        </span>{" "}
        נקודות
      </p>

      <div className="mt-6 flex items-center gap-2 rounded-full border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-100 px-5 py-2 text-base font-extrabold text-amber-800">
        <span>⭐</span>
        <span dir="ltr">+{score}</span>
        <span>כוכבים חדשים</span>
      </div>

      <div className="mt-8 flex w-full max-w-2xl flex-col gap-3 sm:flex-row-reverse">
        <button
          type="button"
          onClick={onRestart}
          className="flex-1 rounded-2xl px-6 py-4 text-lg font-extrabold text-white shadow-[0_18px_40px_-14px_rgba(99,102,241,0.6)] transition hover:-translate-y-0.5"
          style={{
            background:
              "linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #ec4899 100%)",
          }}
        >
          שחקי שוב ←
        </button>
        <Link
          href="/math"
          className="flex-1 rounded-2xl border border-line bg-white px-6 py-4 text-center text-lg font-bold text-ink shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          משחקים אחרים
        </Link>
      </div>
    </section>
  );
}
