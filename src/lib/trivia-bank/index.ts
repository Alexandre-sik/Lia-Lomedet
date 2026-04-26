import type { TriviaQuestion } from "../trivia-types";
import { GEOGRAPHY_EASY } from "./geography-easy";
import { GEOGRAPHY_NORMAL } from "./geography-normal";
import { GEOGRAPHY_HARD } from "./geography-hard";
import { HISTORY_EASY } from "./history-easy";
import { HISTORY_NORMAL } from "./history-normal";
import { HISTORY_HARD } from "./history-hard";
import { SCIENCE_EASY } from "./science-easy";
import { SCIENCE_NORMAL } from "./science-normal";
import { SCIENCE_HARD } from "./science-hard";
import { ARTS_EASY } from "./arts-easy";
import { ARTS_NORMAL } from "./arts-normal";
import { ARTS_HARD } from "./arts-hard";
import { SPORTS_EASY } from "./sports-easy";
import { SPORTS_NORMAL } from "./sports-normal";
import { SPORTS_HARD } from "./sports-hard";
import { TRIVIA_EASY } from "./trivia-easy";
import { TRIVIA_NORMAL } from "./trivia-normal";
import { TRIVIA_HARD } from "./trivia-hard";

export type BankCategory =
  | "geography"
  | "history"
  | "science"
  | "arts"
  | "sports"
  | "trivia";
export type BankLevel = "easy" | "normal" | "hard";

const BANK: Record<BankCategory, Record<BankLevel, TriviaQuestion[]>> = {
  geography: { easy: GEOGRAPHY_EASY, normal: GEOGRAPHY_NORMAL, hard: GEOGRAPHY_HARD },
  history: { easy: HISTORY_EASY, normal: HISTORY_NORMAL, hard: HISTORY_HARD },
  science: { easy: SCIENCE_EASY, normal: SCIENCE_NORMAL, hard: SCIENCE_HARD },
  arts: { easy: ARTS_EASY, normal: ARTS_NORMAL, hard: ARTS_HARD },
  sports: { easy: SPORTS_EASY, normal: SPORTS_NORMAL, hard: SPORTS_HARD },
  trivia: { easy: TRIVIA_EASY, normal: TRIVIA_NORMAL, hard: TRIVIA_HARD },
};

const SEEN_KEY_PREFIX = "lia-lomedet:trivia-seen:";

function questionId(q: TriviaQuestion): string {
  return q.question;
}

function readSeen(category: BankCategory, level: BankLevel): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(
      `${SEEN_KEY_PREFIX}${category}-${level}`,
    );
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function writeSeen(
  category: BankCategory,
  level: BankLevel,
  seen: Set<string>,
) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      `${SEEN_KEY_PREFIX}${category}-${level}`,
      JSON.stringify(Array.from(seen)),
    );
  } catch {}
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getTriviaQuestions(
  category: BankCategory,
  level: BankLevel,
  count: number,
): TriviaQuestion[] {
  const pool = BANK[category]?.[level] ?? [];
  if (pool.length === 0) return [];

  let seen = readSeen(category, level);
  // If we have fewer fresh questions left than requested, reset the "seen" memory.
  const fresh = pool.filter((q) => !seen.has(questionId(q)));
  if (fresh.length < count) {
    seen = new Set();
  }

  const usable = pool.filter((q) => !seen.has(questionId(q)));
  const picked = shuffle(usable).slice(0, count);

  // If somehow not enough (very small pool), pad with shuffled pool.
  while (picked.length < count) {
    const padding = shuffle(pool).slice(0, count - picked.length);
    picked.push(...padding);
  }

  // Update seen memory.
  for (const q of picked) seen.add(questionId(q));
  writeSeen(category, level, seen);

  return picked;
}

export function getBankSize(
  category: BankCategory,
  level: BankLevel,
): number {
  return BANK[category]?.[level]?.length ?? 0;
}
