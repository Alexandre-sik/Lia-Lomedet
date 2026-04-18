import type { TriviaQuestion } from "./trivia-types";

export type Country = {
  name: string;
  capital: string;
  flag: string;
  difficulty: 1 | 2 | 3;
  funFact: string;
};

export const COUNTRIES: Country[] = [
  // Difficulty 1 — well-known countries
  {
    name: "ישראל",
    capital: "ירושלים",
    flag: "🇮🇱",
    difficulty: 1,
    funFact: "ירושלים היא אחת הערים העתיקות ביותר בעולם — בת יותר מ-3000 שנה!",
  },
  {
    name: "צרפת",
    capital: "פריז",
    flag: "🇫🇷",
    difficulty: 1,
    funFact: "בפריז נמצא מגדל אייפל, גובהו 324 מטר.",
  },
  {
    name: "ארצות הברית",
    capital: "וושינגטון",
    flag: "🇺🇸",
    difficulty: 1,
    funFact: "בוושינגטון יש גם את הבית הלבן וגם את פסל החירות לא רחוק.",
  },
  {
    name: "בריטניה",
    capital: "לונדון",
    flag: "🇬🇧",
    difficulty: 1,
    funFact: "ביג בן הוא מגדל השעון המפורסם של לונדון.",
  },
  {
    name: "גרמניה",
    capital: "ברלין",
    flag: "🇩🇪",
    difficulty: 1,
    funFact: "פעם עברה בברלין חומה שחילקה את העיר לשניים.",
  },
  {
    name: "ספרד",
    capital: "מדריד",
    flag: "🇪🇸",
    difficulty: 1,
    funFact: "במדריד יש את אחד המוזיאונים הגדולים בעולם — הפראדו.",
  },
  {
    name: "איטליה",
    capital: "רומא",
    flag: "🇮🇹",
    difficulty: 1,
    funFact: "ברומא נמצא הקולוסיאום — אצטדיון בן כמעט 2000 שנה.",
  },
  {
    name: "יפן",
    capital: "טוקיו",
    flag: "🇯🇵",
    difficulty: 1,
    funFact: "טוקיו היא העיר הגדולה ביותר בעולם — יותר מ-37 מיליון תושבים!",
  },
  {
    name: "סין",
    capital: "בייג'ינג",
    flag: "🇨🇳",
    difficulty: 1,
    funFact: "בסין נמצאת החומה הסינית הגדולה — ניתן לראות אותה אפילו מהחלל!",
  },
  {
    name: "מצרים",
    capital: "קהיר",
    flag: "🇪🇬",
    difficulty: 1,
    funFact: "ליד קהיר נמצאות הפירמידות של גיזה — הן בנות יותר מ-4500 שנה.",
  },
  {
    name: "רוסיה",
    capital: "מוסקבה",
    flag: "🇷🇺",
    difficulty: 1,
    funFact: "רוסיה היא המדינה הגדולה בעולם — כל כך גדולה שיש בה 11 אזורי זמן!",
  },
  {
    name: "ברזיל",
    capital: "ברזיליה",
    flag: "🇧🇷",
    difficulty: 1,
    funFact: "בברזיל נמצא יער האמזונס — היער הגדול בעולם.",
  },
  {
    name: "קנדה",
    capital: "אוטווה",
    flag: "🇨🇦",
    difficulty: 1,
    funFact: "הסמל על דגל קנדה הוא עלה אדר — עץ שממנו מכינים סירופ מתוק.",
  },
  {
    name: "אוסטרליה",
    capital: "קנברה",
    flag: "🇦🇺",
    difficulty: 1,
    funFact: "באוסטרליה חיות הקנגורו — הן קופצות עד 9 מטר!",
  },
  {
    name: "הודו",
    capital: "ניו דלהי",
    flag: "🇮🇳",
    difficulty: 1,
    funFact: "בהודו חיים יותר ממיליארד וחצי אנשים — המדינה המאוכלסת בעולם.",
  },

  // Difficulty 2 — moderately known
  {
    name: "פורטוגל",
    capital: "ליסבון",
    flag: "🇵🇹",
    difficulty: 2,
    funFact: "הפורטוגזים היו הראשונים שהגיעו להודו דרך הים.",
  },
  {
    name: "יוון",
    capital: "אתונה",
    flag: "🇬🇷",
    difficulty: 2,
    funFact: "האולימפיאדה הראשונה התקיימה ביוון העתיקה, לפני 2800 שנה.",
  },
  {
    name: "הולנד",
    capital: "אמסטרדם",
    flag: "🇳🇱",
    difficulty: 2,
    funFact: "באמסטרדם יש יותר מ-100 תעלות מים וגשרים רבים.",
  },
  {
    name: "בלגיה",
    capital: "בריסל",
    flag: "🇧🇪",
    difficulty: 2,
    funFact: "בלגיה מפורסמת בשוקולדים ובצ'יפס (זה מקור ה-French fries!).",
  },
  {
    name: "שוויץ",
    capital: "ברן",
    flag: "🇨🇭",
    difficulty: 2,
    funFact: "בשוויץ יש 4 שפות רשמיות: גרמנית, צרפתית, איטלקית ורומאנש.",
  },
  {
    name: "אוסטריה",
    capital: "וינה",
    flag: "🇦🇹",
    difficulty: 2,
    funFact: "בוינה נולד מוצרט — אחד המלחינים הגדולים בהיסטוריה.",
  },
  {
    name: "פולין",
    capital: "ורשה",
    flag: "🇵🇱",
    difficulty: 2,
    funFact: "בפולין יש יער עתיק שבו חיים הביזונים האחרונים באירופה.",
  },
  {
    name: "מקסיקו",
    capital: "מקסיקו סיטי",
    flag: "🇲🇽",
    difficulty: 2,
    funFact: "מקסיקו סיטי בנויה על אגם עתיק של תרבות האצטקים.",
  },
  {
    name: "ארגנטינה",
    capital: "בואנוס איירס",
    flag: "🇦🇷",
    difficulty: 2,
    funFact: "הטנגו — ריקוד מפורסם — נולד בארגנטינה.",
  },
  {
    name: "תאילנד",
    capital: "בנגקוק",
    flag: "🇹🇭",
    difficulty: 2,
    funFact: "בתאילנד יש יותר מ-1400 מקדשים בודהיסטים מוזהבים.",
  },

  // Difficulty 3 — less common
  {
    name: "קוריאה הדרומית",
    capital: "סיאול",
    flag: "🇰🇷",
    difficulty: 3,
    funFact: "סיאול היא בירת ה-K-pop וה-K-drama.",
  },
  {
    name: "ירדן",
    capital: "עמאן",
    flag: "🇯🇴",
    difficulty: 3,
    funFact: "בירדן נמצאת פטרה — עיר חצובה בסלע ורוד.",
  },
  {
    name: "טורקיה",
    capital: "אנקרה",
    flag: "🇹🇷",
    difficulty: 3,
    funFact: "איסטנבול (לא הבירה!) היא העיר היחידה בעולם שנמצאת ב-2 יבשות.",
  },
  {
    name: "ערב הסעודית",
    capital: "ריאד",
    flag: "🇸🇦",
    difficulty: 3,
    funFact: "בערב הסעודית נמצאות מכה ומדינה — הערים הקדושות באיסלאם.",
  },
  {
    name: "איחוד האמירויות",
    capital: "אבו דאבי",
    flag: "🇦🇪",
    difficulty: 3,
    funFact: "בדובאי (באמירויות) נמצא בורג' ח'ליפה — הבניין הגבוה בעולם.",
  },
  {
    name: "צ'ילה",
    capital: "סנטיאגו",
    flag: "🇨🇱",
    difficulty: 3,
    funFact: "צ'ילה היא מדינה צרה וארוכה מאוד — יותר מ-4300 ק״מ אורך.",
  },
  {
    name: "ניו זילנד",
    capital: "ולינגטון",
    flag: "🇳🇿",
    difficulty: 3,
    funFact: "בניו זילנד צולמו סרטי 'שר הטבעות'.",
  },
  {
    name: "דרום אפריקה",
    capital: "פרטוריה",
    flag: "🇿🇦",
    difficulty: 3,
    funFact: "דרום אפריקה היא המדינה היחידה עם שלוש ערי בירה.",
  },
  {
    name: "קניה",
    capital: "ניירובי",
    flag: "🇰🇪",
    difficulty: 3,
    funFact: "בקניה נולד המרתון — הרצים הכי טובים בעולם משם.",
  },
  {
    name: "מרוקו",
    capital: "רבאט",
    flag: "🇲🇦",
    difficulty: 3,
    funFact: "במרוקו יש את הגן הכחול של ישב סן לורן במרקש.",
  },
  {
    name: "שבדיה",
    capital: "שטוקהולם",
    flag: "🇸🇪",
    difficulty: 3,
    funFact: "בשטוקהולם מוענק פרס נובל בכל שנה.",
  },
  {
    name: "נורבגיה",
    capital: "אוסלו",
    flag: "🇳🇴",
    difficulty: 3,
    funFact: "בנורבגיה אפשר לראות את הזוהר הצפוני בשמיים.",
  },
  {
    name: "דנמרק",
    capital: "קופנהגן",
    flag: "🇩🇰",
    difficulty: 3,
    funFact: "בקופנהגן יש פסל של בת הים הקטנה — דמות של הנס כריסטיאן אנדרסן.",
  },
  {
    name: "פינלנד",
    capital: "הלסינקי",
    flag: "🇫🇮",
    difficulty: 3,
    funFact: "בפינלנד יש יותר מ-187,000 אגמים!",
  },
  {
    name: "אירלנד",
    capital: "דבלין",
    flag: "🇮🇪",
    difficulty: 3,
    funFact: "באירלנד הסמל הלאומי הוא התלתן הירוק — לסמליות של מזל.",
  },
];

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickNotEqual<T>(
  pool: T[],
  exclude: T,
  count: number,
  keyOf: (x: T) => string,
): T[] {
  const excludedKey = keyOf(exclude);
  const filtered = pool.filter((x) => keyOf(x) !== excludedKey);
  return shuffle(filtered).slice(0, count);
}

export type CapitalsLevel = "easy" | "normal" | "hard";

function poolForLevel(level: CapitalsLevel): Country[] {
  const max = level === "easy" ? 1 : level === "normal" ? 2 : 3;
  return COUNTRIES.filter((c) => c.difficulty <= max);
}

function countryToCapital(pool: Country[]): TriviaQuestion {
  const country = pool[Math.floor(Math.random() * pool.length)];
  const distractors = pickNotEqual(
    pool,
    country,
    3,
    (c) => c.capital,
  ).map((c) => c.capital);
  const options = shuffle([country.capital, ...distractors]);
  return {
    question: `מה הבירה של ${country.name}?`,
    options,
    correctIndex: options.indexOf(country.capital),
    explanation: `${country.flag} הבירה של ${country.name} היא ${country.capital}.`,
    funFact: country.funFact,
    emoji: "🗺️",
  };
}

function capitalToCountry(pool: Country[]): TriviaQuestion {
  const country = pool[Math.floor(Math.random() * pool.length)];
  const distractors = pickNotEqual(pool, country, 3, (c) => c.name).map(
    (c) => c.name,
  );
  const options = shuffle([country.name, ...distractors]);
  return {
    question: `${country.capital} היא הבירה של איזו מדינה?`,
    options,
    correctIndex: options.indexOf(country.name),
    explanation: `${country.flag} ${country.capital} היא הבירה של ${country.name}.`,
    funFact: country.funFact,
    emoji: "🏛️",
  };
}

export function generateCapitalsQuestion(
  level: CapitalsLevel,
): TriviaQuestion {
  const pool = poolForLevel(level);
  const variant = randInt(0, 1);
  if (variant === 0) return countryToCapital(pool);
  return capitalToCountry(pool);
}

export function generateCapitalsQuestions(
  level: CapitalsLevel,
  count: number,
): TriviaQuestion[] {
  const seen = new Set<string>();
  const out: TriviaQuestion[] = [];
  let guard = 0;
  while (out.length < count && guard < 200) {
    guard++;
    const q = generateCapitalsQuestion(level);
    const key = `${q.question}|${q.emoji ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(q);
  }
  while (out.length < count) {
    out.push(generateCapitalsQuestion(level));
  }
  return out;
}
