"use client";

import { useEffect, useState } from "react";

export type ActivityType = "lesson" | "practice" | "quiz" | "game";

export type Activity = {
  type: ActivityType;
  topic: string;
  level?: string;
  scorePct?: number;
  stars?: number;
  at: number;
};

export type Progress = {
  totalStars: number;
  streak: number;
  lastActiveDate: string;
  completedLessons: string[];
  daily: { date: string; activities: Activity[] };
  history: Activity[];
  badges: string[];
  topicStats: Record<
    string,
    { practiceCount: number; quizCount: number; bestScorePct: number }
  >;
};

const STORAGE_KEY = "lia-lomedet:progress:v1";
const HISTORY_MAX = 300;
export const DAILY_GOAL = 2;

function todayStr(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function daysBetween(a: string, b: string): number {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  const da = Date.UTC(ay, am - 1, ad);
  const db = Date.UTC(by, bm - 1, bd);
  return Math.round((db - da) / (24 * 3600 * 1000));
}

const DEFAULT: Progress = {
  totalStars: 0,
  streak: 0,
  lastActiveDate: "",
  completedLessons: [],
  daily: { date: "", activities: [] },
  history: [],
  badges: [],
  topicStats: {},
};

let state: Progress | null = null;
const listeners = new Set<() => void>();

function read(): Progress {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT, daily: { date: todayStr(), activities: [] } };
    const parsed = JSON.parse(raw) as Partial<Progress>;
    const merged: Progress = {
      ...DEFAULT,
      ...parsed,
      daily: parsed.daily ?? { date: todayStr(), activities: [] },
      history: parsed.history ?? [],
      completedLessons: parsed.completedLessons ?? [],
      badges: parsed.badges ?? [],
      topicStats: parsed.topicStats ?? {},
    };
    if (merged.daily.date !== todayStr()) {
      merged.daily = { date: todayStr(), activities: [] };
    }
    return merged;
  } catch {
    return DEFAULT;
  }
}

function write(next: Progress) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {}
}

function notify() {
  listeners.forEach((l) => l());
}

export function getProgress(): Progress {
  if (state === null) state = read();
  return state;
}

export function setProgress(updater: (p: Progress) => Progress) {
  const next = updater(getProgress());
  state = next;
  write(next);
  notify();
}

export function useProgress(): Progress {
  const [snap, setSnap] = useState<Progress>(() =>
    typeof window === "undefined" ? DEFAULT : getProgress(),
  );
  useEffect(() => {
    setSnap(getProgress());
    const l = () => setSnap(getProgress());
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return snap;
}

function maybeBumpStreak(p: Progress): Progress {
  const t = todayStr();
  if (p.lastActiveDate === t) return p;
  if (!p.lastActiveDate) return { ...p, streak: 1, lastActiveDate: t };
  const gap = daysBetween(p.lastActiveDate, t);
  const streak = gap === 1 ? p.streak + 1 : 1;
  return { ...p, streak, lastActiveDate: t };
}

function addActivity(p: Progress, a: Activity): Progress {
  const t = todayStr();
  const daily =
    p.daily.date === t
      ? { date: t, activities: [...p.daily.activities, a] }
      : { date: t, activities: [a] };
  const history = [...p.history, a].slice(-HISTORY_MAX);
  return { ...p, daily, history };
}

function upsertTopicStat(
  p: Progress,
  topic: string,
  update: (
    s: Progress["topicStats"][string],
  ) => Progress["topicStats"][string],
): Progress {
  const cur = p.topicStats[topic] ?? {
    practiceCount: 0,
    quizCount: 0,
    bestScorePct: 0,
  };
  return { ...p, topicStats: { ...p.topicStats, [topic]: update(cur) } };
}

function maybeGrantBadges(p: Progress): Progress {
  const badges = new Set(p.badges);
  if (p.streak >= 3) badges.add("streak-3");
  if (p.streak >= 7) badges.add("streak-7");
  if (p.totalStars >= 50) badges.add("stars-50");
  if (p.totalStars >= 200) badges.add("stars-200");
  const practiceCount = Object.values(p.topicStats).reduce(
    (n, s) => n + s.practiceCount,
    0,
  );
  const quizCount = Object.values(p.topicStats).reduce(
    (n, s) => n + s.quizCount,
    0,
  );
  if (practiceCount >= 1) badges.add("first-practice");
  if (quizCount >= 1) badges.add("first-quiz");
  if (practiceCount >= 10) badges.add("ten-practices");
  const hasPerfect = Object.values(p.topicStats).some((s) => s.bestScorePct === 100);
  if (hasPerfect) badges.add("perfect-score");
  return { ...p, badges: Array.from(badges) };
}

export function recordLessonComplete(lessonId: string, topic: string) {
  setProgress((p) => {
    let next = maybeBumpStreak(p);
    if (!next.completedLessons.includes(lessonId)) {
      next = {
        ...next,
        completedLessons: [...next.completedLessons, lessonId],
        totalStars: next.totalStars + 3,
      };
    }
    next = addActivity(next, { type: "lesson", topic, at: Date.now() });
    next = maybeGrantBadges(next);
    return next;
  });
}

export function recordPracticeComplete(
  topic: string,
  level: string,
  scorePct: number,
  starsEarned: number,
) {
  setProgress((p) => {
    let next = maybeBumpStreak(p);
    next = { ...next, totalStars: next.totalStars + starsEarned };
    next = upsertTopicStat(next, topic, (s) => ({
      ...s,
      practiceCount: s.practiceCount + 1,
      bestScorePct: Math.max(s.bestScorePct, scorePct),
    }));
    next = addActivity(next, {
      type: "practice",
      topic,
      level,
      scorePct,
      stars: starsEarned,
      at: Date.now(),
    });
    next = maybeGrantBadges(next);
    return next;
  });
}

export function recordQuizComplete(
  topic: string,
  level: string,
  scorePct: number,
  starsEarned: number,
) {
  setProgress((p) => {
    let next = maybeBumpStreak(p);
    next = { ...next, totalStars: next.totalStars + starsEarned };
    next = upsertTopicStat(next, topic, (s) => ({
      ...s,
      quizCount: s.quizCount + 1,
      bestScorePct: Math.max(s.bestScorePct, scorePct),
    }));
    next = addActivity(next, {
      type: "quiz",
      topic,
      level,
      scorePct,
      stars: starsEarned,
      at: Date.now(),
    });
    next = maybeGrantBadges(next);
    return next;
  });
}

export function recordGamePlay(topic: string, score: number) {
  setProgress((p) => {
    let next = maybeBumpStreak(p);
    next = { ...next, totalStars: next.totalStars + score };
    next = addActivity(next, {
      type: "game",
      topic,
      stars: score,
      at: Date.now(),
    });
    next = maybeGrantBadges(next);
    return next;
  });
}

export function hasDoneTodayByType(
  p: Progress,
  type: ActivityType,
): boolean {
  if (p.daily.date !== todayStr()) return false;
  return p.daily.activities.some((a) => a.type === type);
}

export function dailyCompleted(p: Progress): number {
  let n = 0;
  if (hasDoneTodayByType(p, "practice")) n++;
  if (hasDoneTodayByType(p, "quiz")) n++;
  return n;
}

export function isDailyMissionComplete(p: Progress): boolean {
  return (
    hasDoneTodayByType(p, "practice") && hasDoneTodayByType(p, "quiz")
  );
}

export function resetProgress() {
  state = { ...DEFAULT, daily: { date: todayStr(), activities: [] } };
  write(state);
  notify();
}
