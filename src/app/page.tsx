"use client";

import Link from "next/link";
import { useProgress } from "@/lib/progress";

export default function Home() {
  const progress = useProgress();
  return (
    <main className="mx-auto w-full max-w-6xl px-5 pb-16 pt-6 sm:px-8">
      <Header totalStars={progress.totalStars} />
      <Hero />
      <SubjectGrid mathStats={progress.topicStats} />
      <BottomRow
        badges={progress.badges.length}
        streak={progress.streak}
      />
    </main>
  );
}

function Header({ totalStars }: { totalStars: number }) {
  return (
    <header className="flex items-center justify-between gap-3 py-4">
      <div className="flex items-center gap-3">
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
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/parent"
          aria-label="פאנל הורים"
          className="grid h-11 w-11 place-items-center rounded-2xl border border-line bg-white/80 text-lg shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md"
        >
          ⚙️
        </Link>

        <div className="flex h-11 items-center gap-2 rounded-full border border-line bg-white/80 px-4 text-sm font-bold text-ink shadow-sm backdrop-blur">
          <span>⭐</span>
          <span>{totalStars}</span>
        </div>

        <div
          className="grid h-11 w-11 place-items-center rounded-full text-xl shadow-md"
          style={{
            background: "linear-gradient(135deg, #fde68a 0%, #f59e0b 100%)",
          }}
          aria-label="ליה"
        >
          👧
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="mt-10 text-center sm:mt-14">
      <h2 className="text-[40px] font-extrabold leading-tight tracking-tight text-ink sm:text-5xl">
        שלום{" "}
        <span
          className="bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
          }}
        >
          ליה
        </span>
        ! 👋
      </h2>
      <p className="mt-3 text-lg font-medium text-ink-soft sm:text-xl">
        מה תרצי ללמוד היום?
      </p>
    </section>
  );
}

type SubjectCardProps = {
  href: string;
  emoji: string;
  title: string;
  subtitle: string;
  gradient: string;
  shadow: string;
  pills: [string, string, string];
};

function SubjectGrid({
  mathStats,
}: {
  mathStats: Record<
    string,
    { practiceCount: number; quizCount: number; bestScorePct: number }
  >;
}) {
  const byPrefix = (prefix: string) =>
    Object.entries(mathStats).filter(([k]) => k.startsWith(prefix));
  const noPrefix = (stats: Array<[string, typeof mathStats[string]]>) =>
    stats.filter(([k]) => !k.includes(":"));

  const mathTopics = noPrefix(Object.entries(mathStats)).map(([, s]) => s);
  const enTopics = byPrefix("en:").map(([, s]) => s);
  const triviaTopics = byPrefix("trivia:").map(([, s]) => s);

  const summaryPills = (
    topics: Array<typeof mathStats[string]>,
    emptyLabel: string,
  ): [string, string, string] => {
    const activities = topics.reduce(
      (n, s) => n + s.practiceCount + s.quizCount,
      0,
    );
    if (activities === 0) {
      return ["✨ חדש", "🎯 0 פעילויות", emptyLabel];
    }
    const avg = Math.round(
      topics.reduce((n, s) => n + s.bestScorePct, 0) / topics.length,
    );
    return [
      `⭐ ${activities * 10}`,
      `🎯 ${activities} פעילויות`,
      `📊 ${avg}%`,
    ];
  };

  return (
    <section className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <SubjectCard
        href="/math"
        emoji="🧮"
        title="מתמטיקה"
        subtitle="מספרים, חיבור וחיסור"
        gradient="linear-gradient(135deg, #8b5cf6 0%, #6366f1 55%, #ec4899 100%)"
        shadow="0 24px 60px -20px rgba(99, 102, 241, 0.55)"
        pills={summaryPills(mathTopics, "📊 חדש")}
      />
      <SubjectCard
        href="/english"
        emoji="🇬🇧"
        title="English"
        subtitle="אותיות, מילים וביטויים"
        gradient="linear-gradient(135deg, #f43f5e 0%, #f59e0b 55%, #fde047 100%)"
        shadow="0 24px 60px -20px rgba(244, 63, 94, 0.55)"
        pills={summaryPills(enTopics, "💬 חדש")}
      />
      <SubjectCard
        href="/trivia"
        emoji="🌍"
        title="ידע כללי"
        subtitle="גאוגרפיה, היסטוריה, מדע ועוד"
        gradient="linear-gradient(135deg, #14b8a6 0%, #10b981 55%, #06b6d4 100%)"
        shadow="0 24px 60px -20px rgba(20, 184, 166, 0.55)"
        pills={summaryPills(triviaTopics, "🦉 חדש")}
      />
    </section>
  );
}

function SubjectCard({
  href,
  emoji,
  title,
  subtitle,
  gradient,
  shadow,
  pills,
}: SubjectCardProps) {
  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-[28px] p-7 text-white transition-all duration-300 hover:-translate-y-1.5 sm:p-8"
      style={{
        background: gradient,
        boxShadow: shadow,
      }}
    >
      <div
        className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full opacity-30 blur-3xl"
        style={{ background: "rgba(255,255,255,0.55)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full opacity-20 blur-3xl"
        style={{ background: "rgba(255,255,255,0.45)" }}
        aria-hidden
      />

      <div className="relative flex flex-col gap-6">
        <div className="text-[72px] leading-none drop-shadow-sm">{emoji}</div>

        <div>
          <h3 className="text-4xl font-extrabold tracking-tight sm:text-[36px]">
            {title}
          </h3>
          <p className="mt-1 text-base font-medium text-white/85 sm:text-lg">
            {subtitle}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {pills.map((p) => (
            <span
              key={p}
              className="rounded-full border border-white/30 bg-white/20 px-3.5 py-1.5 text-sm font-bold text-white backdrop-blur-md"
            >
              {p}
            </span>
          ))}
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-base font-semibold text-white/85">
            התחילי ללמוד
          </span>
          <span
            className="grid h-14 w-14 place-items-center rounded-full bg-white text-2xl text-ink shadow-lg transition-transform duration-300 group-hover:-translate-x-1"
            aria-hidden
          >
            ←
          </span>
        </div>
      </div>
    </Link>
  );
}

function BottomRow({
  badges,
  streak,
}: {
  badges: number;
  streak: number;
}) {
  const streakLabel =
    streak === 0
      ? "התחילי היום!"
      : streak === 1
      ? "יום ראשון ברצף"
      : `${streak} ימי רצף`;
  const badgesLabel = badges === 0 ? "אין עדיין תגים" : `${badges} תגים`;
  const items: Array<{ emoji: string; label: string; href?: string }> = [
    { emoji: "🏆", label: badgesLabel },
    { emoji: "🔥", label: streakLabel },
    { emoji: "⚙️", label: "פאנל הורים", href: "/parent" },
  ];

  return (
    <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {items.map((item) => {
        const content = (
          <div className="flex items-center gap-3 rounded-[20px] border border-line bg-white/90 px-5 py-4 shadow-[0_8px_24px_-12px_rgba(15,21,53,0.12)] backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md">
            <span className="text-2xl">{item.emoji}</span>
            <span className="text-base font-bold text-ink">{item.label}</span>
          </div>
        );
        return item.href ? (
          <Link key={item.label} href={item.href}>
            {content}
          </Link>
        ) : (
          <div key={item.label}>{content}</div>
        );
      })}
    </section>
  );
}
