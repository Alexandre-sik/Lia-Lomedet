"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { recordGamePlay, useProgress } from "@/lib/progress";

const GAME_DURATION = 90;

type Order = {
  num: number;
  den: number;
  text: string;
};

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const ORDER_TEMPLATES: Array<() => Order> = [
  () => {
    const den = pick([2, 3, 4, 5, 6, 8]);
    const num = randInt(1, den - 1);
    return { num, den, text: `${num}/${den} מהפיצה` };
  },
  () => {
    const den = pick([2, 4]);
    const num = 1;
    return {
      num,
      den,
      text: den === 2 ? "חצי פיצה" : "רבע פיצה",
    };
  },
  () => {
    return { num: 1, den: 3, text: "שליש פיצה" };
  },
  () => {
    return { num: 2, den: 4, text: "2/4 פיצה (כמה זה בעצם?)" };
  },
  () => {
    return { num: 3, den: 6, text: "3/6 פיצה" };
  },
  () => {
    const den = pick([4, 8]);
    const num = randInt(1, den - 1);
    return { num, den, text: `${num}/${den} פיצה` };
  },
];

function nextOrder(prev?: Order): Order {
  let o = ORDER_TEMPLATES[Math.floor(Math.random() * ORDER_TEMPLATES.length)]();
  let guard = 0;
  while (prev && o.num === prev.num && o.den === prev.den && guard < 10) {
    o = ORDER_TEMPLATES[Math.floor(Math.random() * ORDER_TEMPLATES.length)]();
    guard++;
  }
  return o;
}

export default function PizzeriaGamePage() {
  const progress = useProgress();
  const [phase, setPhase] = useState<"intro" | "playing" | "done">("intro");
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [order, setOrder] = useState<Order>(() => nextOrder());
  const [pizzaSlices, setPizzaSlices] = useState<boolean[]>(() =>
    Array(8).fill(false),
  );
  const [pizzaDen, setPizzaDen] = useState<number>(8);
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
      recordGamePlay("frac", score, startedAtRef.current ?? undefined);
    }
  }, [phase, score]);

  // Reset slices when order changes
  useEffect(() => {
    // Pick the right denominator to display (use the order's den, or smallest visual fit)
    const baseDen =
      order.den === 2 ? 8 :
      order.den === 3 ? 6 :
      order.den === 4 ? 8 :
      order.den === 5 ? 10 :
      order.den === 6 ? 6 :
      order.den === 8 ? 8 :
      order.den;
    setPizzaDen(baseDen);
    setPizzaSlices(Array(baseDen).fill(false));
  }, [order]);

  const filledCount = pizzaSlices.filter(Boolean).length;
  // Reduce filledCount/pizzaDen to compare with order.num/order.den
  // a/b == c/d iff a*d == b*c
  const isMatch =
    filledCount * order.den === order.num * pizzaDen && filledCount > 0;

  const toggleSlice = useCallback(
    (i: number) => {
      if (phase !== "playing" || feedback !== null) return;
      setPizzaSlices((prev) => {
        const next = [...prev];
        next[i] = !next[i];
        return next;
      });
    },
    [phase, feedback],
  );

  const handleServe = useCallback(() => {
    if (phase !== "playing" || feedback !== null) return;
    if (isMatch) {
      const points = 5 + Math.floor(combo / 2);
      setScore((s) => s + points);
      setCombo((c) => c + 1);
      setFeedback("correct");
      window.setTimeout(() => {
        setFeedback(null);
        setOrder((prev) => nextOrder(prev));
      }, 800);
    } else {
      setCombo(0);
      setFeedback("wrong");
      window.setTimeout(() => {
        setFeedback(null);
      }, 700);
    }
  }, [phase, feedback, isMatch, combo]);

  const start = () => {
    recordedRef.current = false;
    startedAtRef.current = Date.now();
    setPhase("playing");
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setCombo(0);
    setOrder(nextOrder());
    setFeedback(null);
  };

  const playAgain = () => {
    start();
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-5 pb-20 pt-6 sm:px-8">
      <TopBar totalStars={progress.totalStars} />

      {phase === "intro" && (
        <IntroScreen onStart={start} />
      )}

      {phase === "playing" && (
        <GameScreen
          timeLeft={timeLeft}
          score={score}
          combo={combo}
          order={order}
          pizzaDen={pizzaDen}
          pizzaSlices={pizzaSlices}
          onSlice={toggleSlice}
          onServe={handleServe}
          feedback={feedback}
          filledCount={filledCount}
        />
      )}

      {phase === "done" && (
        <DoneScreen score={score} onPlayAgain={playAgain} />
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
          🍕 פיצרייה
        </h1>
      </div>
      <div className="flex h-11 items-center gap-2 rounded-full border border-line bg-white/80 px-4 text-sm font-bold text-ink shadow-sm backdrop-blur">
        <span>⭐</span>
        <span>{totalStars}</span>
      </div>
    </header>
  );
}

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <section className="mt-10 flex flex-col items-center gap-6 text-center">
      <div className="text-7xl sm:text-8xl" aria-hidden>
        🍕
      </div>
      <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        ברוכה הבאה לפיצרייה!
      </h2>
      <p className="max-w-md text-base font-medium leading-relaxed text-ink-soft sm:text-lg">
        לקוחות מבקשים חלקי פיצה. הקליקי על פרוסות הפיצה כדי לסמן את החלק הנכון, ואז תני להם את ההזמנה.
        כל הזמנה נכונה — נקודות. רצף נכון = יותר נקודות!
      </p>
      <ul className="flex flex-col gap-2 text-right text-sm font-semibold text-ink-soft sm:text-base">
        <li>👆 לחצי על פרוסה כדי לבחור או לבטל</li>
        <li>✅ &quot;תני הזמנה&quot; כשהחלק נכון</li>
        <li>⏱️ 90 שניות לכמה שיותר הזמנות</li>
      </ul>
      <button
        type="button"
        onClick={onStart}
        className="mt-2 rounded-2xl px-8 py-4 text-lg font-extrabold text-white transition hover:-translate-y-0.5"
        style={{
          background:
            "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #ec4899 100%)",
          boxShadow: "0 18px 40px -14px rgba(245, 158, 11, 0.55)",
        }}
      >
        בואי נתחיל! ←
      </button>
    </section>
  );
}

function GameScreen({
  timeLeft,
  score,
  combo,
  order,
  pizzaDen,
  pizzaSlices,
  onSlice,
  onServe,
  feedback,
  filledCount,
}: {
  timeLeft: number;
  score: number;
  combo: number;
  order: Order;
  pizzaDen: number;
  pizzaSlices: boolean[];
  onSlice: (i: number) => void;
  onServe: () => void;
  feedback: "correct" | "wrong" | null;
  filledCount: number;
}) {
  return (
    <>
      <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-line bg-white/85 p-4 shadow-[0_8px_24px_-16px_rgba(15,21,53,0.2)] backdrop-blur">
        <div className="flex items-center gap-2 text-base font-extrabold tabular-nums text-ink" dir="ltr">
          <span>⏱️</span>
          <span className={timeLeft < 15 ? "text-rose-600" : ""}>
            {String(Math.floor(timeLeft / 60)).padStart(1, "0")}:
            {String(timeLeft % 60).padStart(2, "0")}
          </span>
        </div>
        <div className="flex items-center gap-2 text-base font-extrabold tabular-nums text-amber-700" dir="ltr">
          ⭐ <span>{score}</span>
        </div>
        {combo >= 2 && (
          <div className="flex items-center gap-1 rounded-full bg-rose-100 px-3 py-1 text-xs font-extrabold text-rose-700">
            🔥 רצף {combo}
          </div>
        )}
      </div>

      <section className="mt-5 rounded-2xl border border-line bg-gradient-to-br from-amber-50 to-orange-100 p-5 text-center shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-amber-800">
          הזמנה
        </p>
        <p className="mt-1 text-2xl font-extrabold text-ink sm:text-3xl">
          {order.text}
        </p>
        <p className="mt-1 text-sm font-medium text-ink-soft">
          (= {order.num}/{order.den})
        </p>
      </section>

      <section className="mt-6 flex flex-col items-center gap-4">
        <PizzaSlicer
          den={pizzaDen}
          slices={pizzaSlices}
          onSlice={onSlice}
          flash={feedback}
        />
        <div className="text-sm font-semibold text-ink-soft" dir="ltr">
          בחירה: {filledCount}/{pizzaDen}
        </div>

        <button
          type="button"
          onClick={onServe}
          disabled={filledCount === 0 || feedback !== null}
          className={`rounded-2xl px-8 py-4 text-lg font-extrabold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
            feedback === "correct"
              ? ""
              : feedback === "wrong"
              ? ""
              : "hover:-translate-y-0.5"
          }`}
          style={{
            background:
              feedback === "correct"
                ? "linear-gradient(135deg, #34d399 0%, #10b981 100%)"
                : feedback === "wrong"
                ? "linear-gradient(135deg, #fb7185 0%, #f43f5e 100%)"
                : "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #ec4899 100%)",
            boxShadow: "0 18px 40px -14px rgba(245, 158, 11, 0.55)",
          }}
        >
          {feedback === "correct"
            ? "✅ מצויין!"
            : feedback === "wrong"
            ? "❌ נסי שוב"
            : "תני הזמנה ←"}
        </button>
      </section>

      <AnimatePresence>
        {feedback === "correct" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
          >
            <div className="text-9xl">🎉</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function PizzaSlicer({
  den,
  slices,
  onSlice,
  flash,
  size = 280,
}: {
  den: number;
  slices: boolean[];
  onSlice: (i: number) => void;
  flash: "correct" | "wrong" | null;
  size?: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 10;
  const angle = (2 * Math.PI) / den;

  const slicePaths = [];
  for (let i = 0; i < den; i++) {
    const start = -Math.PI / 2 + i * angle;
    const end = start + angle;
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    const largeArc = angle > Math.PI ? 1 : 0;
    const d = `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`;
    slicePaths.push({ d, i });
  }

  const baseFill = flash === "correct" ? "#fef3c7" : flash === "wrong" ? "#fee2e2" : "#fef3c7";
  const fillSelected =
    flash === "correct" ? "#fbbf24" : flash === "wrong" ? "#ef4444" : "#fbbf24";

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      animate={
        flash === "wrong"
          ? { x: [0, -8, 8, -6, 6, 0] }
          : flash === "correct"
          ? { scale: [1, 1.08, 1] }
          : { scale: 1, x: 0 }
      }
      transition={{ duration: 0.4 }}
      role="img"
      aria-label="פיצה"
      className="drop-shadow-md"
    >
      {/* Pizza crust outline */}
      <circle
        cx={cx}
        cy={cy}
        r={r + 4}
        fill="#d97706"
        stroke="#0f1535"
        strokeWidth={2}
      />
      {slicePaths.map(({ d, i }) => {
        const filled = slices[i];
        return (
          <g key={i} onClick={() => onSlice(i)} style={{ cursor: "pointer" }}>
            <path
              d={d}
              fill={filled ? fillSelected : baseFill}
              stroke="#0f1535"
              strokeWidth={2}
              strokeLinejoin="round"
            />
            {filled && (
              <>
                {/* toppings */}
                {(() => {
                  const mid = -Math.PI / 2 + i * angle + angle / 2;
                  const tx = cx + r * 0.55 * Math.cos(mid);
                  const ty = cy + r * 0.55 * Math.sin(mid);
                  return (
                    <>
                      <circle cx={tx - 8} cy={ty - 4} r={5} fill="#dc2626" />
                      <circle cx={tx + 6} cy={ty + 6} r={4} fill="#dc2626" />
                      <circle cx={tx} cy={ty - 8} r={3} fill="#15803d" />
                    </>
                  );
                })()}
              </>
            )}
          </g>
        );
      })}
    </motion.svg>
  );
}

function DoneScreen({
  score,
  onPlayAgain,
}: {
  score: number;
  onPlayAgain: () => void;
}) {
  const stars = score >= 50 ? 3 : score >= 25 ? 2 : score >= 10 ? 1 : 0;

  return (
    <section className="mt-10 flex flex-col items-center gap-5 text-center">
      <div className="text-7xl sm:text-8xl" aria-hidden>
        🏆
      </div>
      <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        סיימת את המשמרת!
      </h2>

      <div className="flex items-center gap-3 text-5xl">
        {[0, 1, 2].map((i) => (
          <span key={i} aria-hidden>
            {i < stars ? "⭐" : "☆"}
          </span>
        ))}
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-4 text-center shadow-sm">
        <div className="text-xs font-bold uppercase tracking-wider text-amber-700">
          ניקוד
        </div>
        <div className="text-4xl font-extrabold text-amber-700 tabular-nums" dir="ltr">
          {score}
        </div>
      </div>

      <div className="mt-2 flex flex-col gap-3 sm:flex-row-reverse">
        <button
          type="button"
          onClick={onPlayAgain}
          className="rounded-2xl px-6 py-3 text-base font-extrabold text-white transition hover:-translate-y-0.5"
          style={{
            background:
              "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #ec4899 100%)",
          }}
        >
          לשחק שוב ←
        </button>
        <Link
          href="/math"
          className="rounded-2xl border border-line bg-white px-6 py-3 text-center text-base font-bold text-ink shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          חזרה למתמטיקה
        </Link>
      </div>
    </section>
  );
}
