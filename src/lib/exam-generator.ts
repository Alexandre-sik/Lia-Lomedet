import type { Question, Visual } from "./math-generator";

export type ExamTopic =
  | "place-value"
  | "distributive"
  | "estimation"
  | "div-remainder"
  | "mul-by-pow10"
  | "quadrilaterals";

export const EXAM_TOPIC_LABELS: Record<ExamTopic, string> = {
  "place-value": "מבנה עשרוני עד הרבבה",
  distributive: "חוק הפילוג",
  estimation: "אומדן מספרים",
  "div-remainder": "חילוק עם שארית",
  "mul-by-pow10": "כפל ב-10, 100, 1,000",
  quadrilaterals: "משפחת המרובעים",
};

export const EXAM_TOPIC_EMOJIS: Record<ExamTopic, string> = {
  "place-value": "🔢",
  distributive: "🧩",
  estimation: "🎯",
  "div-remainder": "✂️",
  "mul-by-pow10": "🚀",
  quadrilaterals: "📐",
};

export const EXAM_TOPIC_DESCRIPTIONS: Record<ExamTopic, string> = {
  "place-value": "קריאה, כתיבה, סדרות והשוואה של מספרים",
  distributive: "פיצול מספר ופירוק לכפל וחילוק קל יותר",
  estimation: "עיגול לעשרות ולמאות הקרובות",
  "div-remainder": "חילוק שיש בו שארית",
  "mul-by-pow10": "כפל וחילוק במספרים עגולים",
  quadrilaterals: "טרפז, מקבילית, מעוין, מלבן, ריבוע ודלתון",
};

export function isExamTopic(v: string | null): v is ExamTopic {
  return (
    v === "place-value" ||
    v === "distributive" ||
    v === "estimation" ||
    v === "div-remainder" ||
    v === "mul-by-pow10" ||
    v === "quadrilaterals"
  );
}

// =====================================================================
// Helpers
// =====================================================================

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function fmt(n: number): string {
  return n.toLocaleString("en-US");
}

function numericDistractors(
  correct: number,
  count: number,
  spread: number,
  floor = 0,
): number[] {
  const used = new Set<number>([correct]);
  const out: number[] = [];
  let guard = 0;
  while (out.length < count && guard < 400) {
    guard++;
    const sign = Math.random() < 0.5 ? -1 : 1;
    const delta = randInt(1, spread);
    const v = correct + sign * delta;
    if (v < floor) continue;
    if (used.has(v)) continue;
    used.add(v);
    out.push(v);
  }
  let pad = 1;
  while (out.length < count) {
    const v = correct + pad * 7;
    if (!used.has(v)) {
      used.add(v);
      out.push(v);
    }
    pad++;
  }
  return out;
}

function numericQuestion(
  question: string,
  correct: number,
  spread: number,
  explanation: string,
  visual?: Visual,
): Question {
  const distractors = numericDistractors(correct, 3, spread, 0);
  return {
    question,
    correctAnswer: fmt(correct),
    options: shuffle([correct, ...distractors]).map(fmt),
    explanation,
    visual,
  };
}

function textQuestion(
  question: string,
  correct: string,
  distractors: string[],
  explanation: string,
  visual?: Visual,
): Question {
  return {
    question,
    correctAnswer: correct,
    options: shuffle([correct, ...distractors]),
    explanation,
    visual,
  };
}

const NAMES = ["דני", "מיה", "נועה", "יובל", "רוני", "אלה", "יוסי", "ליה", "שוש", "תמר"];

// =====================================================================
// 1) PLACE VALUE — מבנה עשרוני עד הרבבה (up to ~10,000s)
// =====================================================================

const NUMBER_WORDS: Array<{ digits: number; words: string }> = [
  { digits: 1008, words: "אלף ושמונה" },
  { digits: 1200, words: "אלף ומאתיים" },
  { digits: 2050, words: "אלפיים וחמישים" },
  { digits: 3600, words: "שלושת אלפים ושש מאות" },
  { digits: 4006, words: "ארבעת אלפים ושש" },
  { digits: 4700, words: "ארבעת אלפים ושבע מאות" },
  { digits: 5300, words: "חמשת אלפים ושלוש מאות" },
  { digits: 6020, words: "ששת אלפים ועשרים" },
  { digits: 7212, words: "שבעת אלפים מאתיים ושתים-עשרה" },
  { digits: 8000, words: "שמונת אלפים" },
  { digits: 8539, words: "שמונת אלפים חמש מאות שלושים ותשע" },
  { digits: 9050, words: "תשעת אלפים וחמישים" },
  { digits: 9903, words: "תשעת אלפים תשע מאות ושלוש" },
];

function genPlaceValueWordsToDigits(): Question {
  const target = pick(NUMBER_WORDS);
  const others = shuffle(
    NUMBER_WORDS.filter((n) => n.digits !== target.digits),
  ).slice(0, 3);
  return textQuestion(
    `כתבו בספרות: "${target.words}"`,
    fmt(target.digits),
    others.map((o) => fmt(o.digits)),
    `${target.words} = ${fmt(target.digits)}.`,
  );
}

function genPlaceValueDigitsToWords(): Question {
  const target = pick(NUMBER_WORDS);
  const others = shuffle(
    NUMBER_WORDS.filter((n) => n.digits !== target.digits),
  ).slice(0, 3);
  return textQuestion(
    `איך כותבים במילים את המספר ${fmt(target.digits)}?`,
    target.words,
    others.map((o) => o.words),
    `${fmt(target.digits)} = ${target.words}.`,
  );
}

function genPlaceValueSequence(): Question {
  const step = pick([10, 100, 1000]);
  const start = pick([
    randInt(2, 8) * 1000 + randInt(0, 99) * 10,
    randInt(20, 80) * 100,
    randInt(2, 9) * 1000,
  ]);
  // Build 5 numbers, hide one (not the first)
  const seq = [start, start + step, start + 2 * step, start + 3 * step, start + 4 * step];
  const hideIdx = randInt(1, 4);
  const correct = seq[hideIdx];
  const display = seq.map((n, i) => (i === hideIdx ? "___" : fmt(n))).join(" , ");
  return numericQuestion(
    `השלימו את הסדרה (כל מספר גדול מקודמו ב-${fmt(step)}): ${display}`,
    correct,
    step * 2,
    `הצעד בסדרה הוא +${fmt(step)}. המספר החסר הוא ${fmt(correct)}.`,
  );
}

function genPlaceValueCompare(): Question {
  const a = randInt(1000, 9999);
  // Generate b close to a but different
  const variants = [
    a + randInt(-50, -1),
    a + randInt(1, 50),
    Math.floor(a / 100) * 100 + randInt(0, 99),
  ];
  let b = pick(variants);
  if (b === a) b = a + randInt(1, 9);
  const bigger = a > b ? a : b;
  const smaller = a > b ? b : a;
  return textQuestion(
    `איזה סימן מתאים? ${fmt(a)} __ ${fmt(b)}`,
    a > b ? ">" : "<",
    a > b ? ["<", "="] : [">", "="],
    `${fmt(bigger)} > ${fmt(smaller)}, לכן הסימן הוא ${a > b ? ">" : "<"}.`,
  );
}

function genPlaceValueDigitMeaning(): Question {
  const num = randInt(1000, 9999);
  const positionIdx = randInt(0, 3); // 0=units, 1=tens, 2=hundreds, 3=thousands
  const digits = String(num).split("").map(Number); // e.g. 4536 -> [4,5,3,6]
  // digits[0]=thousands, digits[1]=hundreds, digits[2]=tens, digits[3]=units
  const placeNames = ["יחידות", "עשרות", "מאות", "אלפים"];
  const placeMul = [1, 10, 100, 1000];
  const digit = digits[3 - positionIdx];
  const value = digit * placeMul[positionIdx];
  if (digit === 0) {
    // pick another position
    return genPlaceValueDigitMeaning();
  }
  return numericQuestion(
    `במספר ${fmt(num)}, מהו הערך של ספרת ה${placeNames[positionIdx]}?`,
    value,
    Math.max(50, value),
    `ספרת ה${placeNames[positionIdx]} היא ${digit}, וערכה הוא ${digit} × ${fmt(placeMul[positionIdx])} = ${fmt(value)}.`,
  );
}

function genPlaceValueExpanded(): Question {
  const th = randInt(2, 9);
  const h = randInt(0, 9);
  const t = randInt(0, 9);
  const u = randInt(1, 9);
  const total = th * 1000 + h * 100 + t * 10 + u;
  return numericQuestion(
    `מהו המספר: ${fmt(th * 1000)} + ${h * 100} + ${t * 10} + ${u}?`,
    total,
    100,
    `מחברים: ${fmt(th * 1000)} + ${h * 100} + ${t * 10} + ${u} = ${fmt(total)}.`,
  );
}

function genPlaceValueWordProblem(): Question {
  const templates: Array<() => Question> = [
    () => {
      const a = randInt(2000, 4500);
      const add = randInt(50, 800);
      return numericQuestion(
        `📚 בספרייה ${fmt(a)} ספרים. הוסיפו ${fmt(add)} ספרים חדשים. כמה ספרים עכשיו?`,
        a + add,
        200,
        `${fmt(a)} + ${fmt(add)} = ${fmt(a + add)}.`,
      );
    },
    () => {
      const a = randInt(5000, 9000);
      const sub = randInt(200, 1500);
      return numericQuestion(
        `🎟️ באצטדיון ${fmt(a)} צופים. ${fmt(sub)} הלכו הביתה. כמה נשארו?`,
        a - sub,
        500,
        `${fmt(a)} − ${fmt(sub)} = ${fmt(a - sub)}.`,
      );
    },
    () => {
      const num = pick([3070, 5040, 6005, 8200, 4001, 7300]);
      const digits = String(num).split("").map(Number);
      const zeros = digits.filter((d) => d === 0).length;
      return numericQuestion(
        `כמה אפסים יש במספר ${fmt(num)}?`,
        zeros,
        2,
        `במספר ${fmt(num)} יש ${zeros} אפסים.`,
      );
    },
  ];
  return pick(templates)();
}

function genPlaceValue(): Question {
  const r = Math.random();
  if (r < 0.18) return genPlaceValueWordsToDigits();
  if (r < 0.32) return genPlaceValueDigitsToWords();
  if (r < 0.5) return genPlaceValueSequence();
  if (r < 0.65) return genPlaceValueCompare();
  if (r < 0.78) return genPlaceValueDigitMeaning();
  if (r < 0.9) return genPlaceValueExpanded();
  return genPlaceValueWordProblem();
}

// =====================================================================
// 2) DISTRIBUTIVE LAW — חוק הפילוג
// =====================================================================

function genDistribMul(): Question {
  // Two-digit × one-digit, encouraging distributive split
  const a = randInt(13, 98);
  const b = randInt(2, 9);
  const tens = Math.floor(a / 10) * 10;
  const units = a - tens;
  const total = a * b;
  return numericQuestion(
    `${a} × ${b} = ?  (רמז: ${tens} + ${units})`,
    total,
    Math.max(20, total / 5),
    `פירוק לפי חוק הפילוג: ${a} × ${b} = (${tens} × ${b}) + (${units} × ${b}) = ${tens * b} + ${units * b} = ${total}.`,
  );
}

function genDistribDiv(): Question {
  // Pick a × b that's "easy to split"
  const tens = pick([20, 30, 40, 50, 60, 70, 80]);
  const units = pick([4, 6, 8, 10, 12, 14, 16]);
  const divisor = pick([2, 3, 4, 5, 7]);
  if (tens % divisor !== 0 || units % divisor !== 0) return genDistribDiv();
  const total = tens + units;
  const result = total / divisor;
  return numericQuestion(
    `${total} : ${divisor} = ?  (רמז: ${tens} + ${units})`,
    result,
    8,
    `פירוק: ${total} : ${divisor} = (${tens} : ${divisor}) + (${units} : ${divisor}) = ${tens / divisor} + ${units / divisor} = ${result}.`,
  );
}

function genDistribRecognize(): Question {
  // Recognize the distributive expansion of a × b
  const tens = pick([20, 30, 40, 50, 60, 70]);
  const units = randInt(2, 9);
  const a = tens + units;
  const b = randInt(3, 8);
  const correct = `(${tens} × ${b}) + (${units} × ${b})`;
  const distractors = [
    `(${tens} + ${b}) × (${units} + ${b})`,
    `(${tens} × ${units}) + ${b}`,
    `${tens} × ${units} × ${b}`,
  ];
  return textQuestion(
    `איזה ביטוי שווה ל-${a} × ${b} לפי חוק הפילוג?`,
    correct,
    distractors,
    `מפרקים ${a} = ${tens} + ${units}, ולכן ${a} × ${b} = (${tens} × ${b}) + (${units} × ${b}).`,
  );
}

function genDistribFromExpansion(): Question {
  const tens = pick([20, 30, 40, 50, 60, 70, 80]);
  const units = randInt(2, 9);
  const b = randInt(2, 9);
  const total = (tens + units) * b;
  return numericQuestion(
    `(${tens} × ${b}) + (${units} × ${b}) = ?`,
    total,
    Math.max(20, total / 4),
    `${tens * b} + ${units * b} = ${total}. (זה כמו ${tens + units} × ${b}.)`,
  );
}

function genDistribWordProblem(): Question {
  const templates: Array<() => Question> = [
    () => {
      const items = randInt(13, 28);
      const price = randInt(3, 8);
      const total = items * price;
      const tens = Math.floor(items / 10) * 10;
      const units = items - tens;
      return numericQuestion(
        `🛒 קנו ${items} מחברות ב-${price}₪ כל אחת. כמה שולם?`,
        total,
        20,
        `${items} × ${price} = (${tens} × ${price}) + (${units} × ${price}) = ${tens * price} + ${units * price} = ${total}₪.`,
      );
    },
    () => {
      const rows = pick([12, 14, 16, 18, 24]);
      const perRow = randInt(3, 6);
      const total = rows * perRow;
      const tens = Math.floor(rows / 10) * 10;
      const units = rows - tens;
      return numericQuestion(
        `🌳 בגינה ${rows} שורות של ${perRow} עצים. כמה עצים בסך הכל?`,
        total,
        15,
        `${rows} × ${perRow} = (${tens} × ${perRow}) + (${units} × ${perRow}) = ${tens * perRow} + ${units * perRow} = ${total}.`,
      );
    },
    () => {
      const total = pick([60, 72, 84, 96, 108, 120]);
      const div = pick([3, 4, 6]);
      if (total % div !== 0) return numericQuestion(`72 : 6 = ?`, 12, 5, `72 : 6 = 12.`);
      const result = total / div;
      const name = pick(NAMES);
      return numericQuestion(
        `🍪 ${name} חילקה ${total} עוגיות ל-${div} ילדים בחלוקה שווה. כמה כל אחד קיבל?`,
        result,
        8,
        `${total} : ${div} = ${result}. אפשר לפצל: למשל ${Math.floor(total / 10) * 10} : ${div} + ${total - Math.floor(total / 10) * 10} : ${div}.`,
      );
    },
  ];
  return pick(templates)();
}

function genDistributive(): Question {
  const r = Math.random();
  if (r < 0.35) return genDistribMul();
  if (r < 0.55) return genDistribDiv();
  if (r < 0.7) return genDistribRecognize();
  if (r < 0.85) return genDistribFromExpansion();
  return genDistribWordProblem();
}

// =====================================================================
// 3) ESTIMATION — אומדן לעשרות ולמאות
// =====================================================================

function roundTo(n: number, m: number): number {
  return Math.round(n / m) * m;
}

function genEstRoundTen(): Question {
  const n = randInt(11, 999);
  const correct = roundTo(n, 10);
  return numericQuestion(
    `עגלו את ${fmt(n)} לעשרת הקרובה`,
    correct,
    20,
    `הספרה האחרונה היא ${n % 10}. ${n % 10 < 5 ? "פחות מ-5" : "5 או יותר"} → ${n % 10 < 5 ? "מעגלים למטה" : "מעגלים למעלה"}: ${fmt(correct)}.`,
  );
}

function genEstRoundHundred(): Question {
  const n = randInt(101, 9999);
  const correct = roundTo(n, 100);
  const lastTwo = n % 100;
  return numericQuestion(
    `עגלו את ${fmt(n)} למאה הקרובה`,
    correct,
    150,
    `שתי הספרות האחרונות הן ${String(lastTwo).padStart(2, "0")}. ${lastTwo < 50 ? "פחות מ-50 → מעגלים למטה" : "50 או יותר → מעגלים למעלה"}: ${fmt(correct)}.`,
  );
}

function genEstRoundThousand(): Question {
  const n = randInt(501, 9499);
  const correct = roundTo(n, 1000);
  return numericQuestion(
    `עגלו את ${fmt(n)} לאלף הקרוב`,
    correct,
    1500,
    `${n % 1000 < 500 ? "פחות מ-500 → מעגלים למטה" : "500 או יותר → מעגלים למעלה"}: ${fmt(correct)}.`,
  );
}

function genEstSum(): Question {
  const a = randInt(120, 480);
  const b = randInt(140, 460);
  const exact = a + b;
  const ra = roundTo(a, 100);
  const rb = roundTo(b, 100);
  const est = ra + rb;
  return numericQuestion(
    `אמדו את התוצאה (עיגול למאות): ${fmt(a)} + ${fmt(b)} ≈ ?`,
    est,
    150,
    `${fmt(a)} ≈ ${fmt(ra)}, ${fmt(b)} ≈ ${fmt(rb)}. אומדן: ${fmt(ra)} + ${fmt(rb)} = ${fmt(est)} (התוצאה האמיתית: ${fmt(exact)}).`,
  );
}

function genEstSubtract(): Question {
  const a = randInt(500, 950);
  const b = randInt(120, a - 100);
  const exact = a - b;
  const ra = roundTo(a, 100);
  const rb = roundTo(b, 100);
  const est = ra - rb;
  return numericQuestion(
    `אמדו את התוצאה (עיגול למאות): ${fmt(a)} − ${fmt(b)} ≈ ?`,
    est,
    150,
    `${fmt(a)} ≈ ${fmt(ra)}, ${fmt(b)} ≈ ${fmt(rb)}. אומדן: ${fmt(ra)} − ${fmt(rb)} = ${fmt(est)} (התוצאה האמיתית: ${fmt(exact)}).`,
  );
}

function genEstWordProblem(): Question {
  const templates: Array<() => Question> = [
    () => {
      const price1 = randInt(180, 350);
      const price2 = randInt(160, 320);
      const r1 = roundTo(price1, 100);
      const r2 = roundTo(price2, 100);
      const est = r1 + r2;
      return numericQuestion(
        `💰 משחק עולה ${fmt(price1)}₪ וספר עולה ${fmt(price2)}₪. הערכה גסה למחיר הכולל (במאות):`,
        est,
        150,
        `${fmt(price1)} ≈ ${fmt(r1)}, ${fmt(price2)} ≈ ${fmt(r2)}. הערכה: ${fmt(r1)} + ${fmt(r2)} = ${fmt(est)}₪.`,
      );
    },
    () => {
      const total = randInt(720, 980);
      const r = roundTo(total, 10);
      return numericQuestion(
        `🚌 באוטובוס ${fmt(total)} נוסעים השבוע. עגלו לעשרות.`,
        r,
        25,
        `${fmt(total)} ≈ ${fmt(r)} לעשרות.`,
      );
    },
  ];
  return pick(templates)();
}

function genEstimation(): Question {
  const r = Math.random();
  if (r < 0.25) return genEstRoundTen();
  if (r < 0.5) return genEstRoundHundred();
  if (r < 0.62) return genEstRoundThousand();
  if (r < 0.78) return genEstSum();
  if (r < 0.9) return genEstSubtract();
  return genEstWordProblem();
}

// =====================================================================
// 4) DIVISION WITH REMAINDER — חילוק עם שארית
// =====================================================================

function genDivRemBasic(): Question {
  const divisor = randInt(3, 9);
  const quotient = randInt(3, 12);
  const remainder = randInt(1, divisor - 1);
  const dividend = divisor * quotient + remainder;
  return textQuestion(
    `${dividend} : ${divisor} = ?`,
    `${quotient} ושארית ${remainder}`,
    [
      `${quotient + 1} ושארית ${remainder}`,
      `${quotient} ושארית ${(remainder % (divisor - 1)) + 1}`,
      `${quotient - 1} ושארית ${remainder}`,
    ],
    `${divisor} × ${quotient} = ${divisor * quotient}, נשאר ${dividend} − ${divisor * quotient} = ${remainder}.`,
  );
}

function genDivRemQuotient(): Question {
  const divisor = randInt(3, 9);
  const quotient = randInt(4, 11);
  const remainder = randInt(1, divisor - 1);
  const dividend = divisor * quotient + remainder;
  return numericQuestion(
    `${dividend} : ${divisor} — מה המנה השלמה?`,
    quotient,
    4,
    `${divisor} × ${quotient} = ${divisor * quotient} (קרוב הכי הרבה ל-${dividend} מבלי לעבור). שארית: ${remainder}.`,
  );
}

function genDivRemRemainder(): Question {
  const divisor = randInt(3, 9);
  const quotient = randInt(4, 11);
  const remainder = randInt(1, divisor - 1);
  const dividend = divisor * quotient + remainder;
  return numericQuestion(
    `${dividend} : ${divisor} — מה השארית?`,
    remainder,
    Math.min(divisor - 1, 4),
    `${divisor} × ${quotient} = ${divisor * quotient}, ולכן השארית היא ${dividend} − ${divisor * quotient} = ${remainder}.`,
  );
}

function genDivRemWordProblem(): Question {
  const templates: Array<() => Question> = [
    () => {
      const divisor = pick([4, 5, 6, 7, 8]);
      const quotient = randInt(4, 9);
      const remainder = randInt(1, divisor - 1);
      const total = divisor * quotient + remainder;
      const name = pick(NAMES);
      return textQuestion(
        `🍬 ל-${name} יש ${total} סוכריות. היא מחלקת אותן ל-${divisor} חברים שווה בשווה. כמה כל אחד מקבל וכמה נשארות?`,
        `${quotient} סוכריות, נשארות ${remainder}`,
        [
          `${quotient + 1} סוכריות, נשארות ${remainder - 1 || 1}`,
          `${quotient} סוכריות, נשארות 0`,
          `${quotient - 1} סוכריות, נשארות ${remainder}`,
        ],
        `${total} : ${divisor} = ${quotient} ושארית ${remainder} (כי ${divisor} × ${quotient} = ${divisor * quotient}, נשאר ${remainder}).`,
      );
    },
    () => {
      const perBox = pick([6, 8, 10]);
      const boxes = randInt(4, 9);
      const remainder = randInt(1, perBox - 1);
      const total = perBox * boxes + remainder;
      return numericQuestion(
        `📦 רוצים לארוז ${total} ביצים בקופסאות של ${perBox}. כמה קופסאות מלאות יהיו?`,
        boxes,
        3,
        `${total} : ${perBox} = ${boxes} ושארית ${remainder}. ${boxes} קופסאות מלאות (ועוד ${remainder} ביצים בודדות).`,
      );
    },
    () => {
      const seats = pick([4, 5, 6]);
      const groups = randInt(5, 10);
      const remainder = randInt(1, seats - 1);
      const kids = seats * groups + remainder;
      return numericQuestion(
        `🚐 ${kids} ילדים נכנסים לרכבים של ${seats} מקומות כל אחד. כמה רכבים צריך לפחות?`,
        groups + 1,
        3,
        `${kids} : ${seats} = ${groups} ושארית ${remainder}. צריך עוד רכב בשביל ${remainder} הילדים שנשארו → סך הכל ${groups + 1} רכבים.`,
      );
    },
  ];
  return pick(templates)();
}

function genDivRemainder(): Question {
  const r = Math.random();
  if (r < 0.3) return genDivRemBasic();
  if (r < 0.5) return genDivRemQuotient();
  if (r < 0.7) return genDivRemRemainder();
  return genDivRemWordProblem();
}

// =====================================================================
// 5) MULTIPLY/DIVIDE BY 10, 100, 1000 — כפל ב-10, 100, 1000
// =====================================================================

function genMulPow10Direct(): Question {
  const a = randInt(2, 99);
  const power = pick([10, 100, 1000]);
  const result = a * power;
  const zeros = power === 10 ? 1 : power === 100 ? 2 : 3;
  return numericQuestion(
    `${a} × ${fmt(power)} = ?`,
    result,
    Math.max(50, result / 10),
    `כפל ב-${fmt(power)}: מוסיפים ${zeros} אפסים בסוף. ${a} × ${fmt(power)} = ${fmt(result)}.`,
  );
}

function genMulPow10Reverse(): Question {
  const a = randInt(2, 9);
  const power = pick([10, 100, 1000]);
  const result = a * power;
  return numericQuestion(
    `? × ${fmt(power)} = ${fmt(result)}`,
    a,
    5,
    `${fmt(result)} : ${fmt(power)} = ${a}, אז המספר החסר הוא ${a}.`,
  );
}

function genDivPow10(): Question {
  const a = randInt(2, 9);
  const power = pick([10, 100, 1000]);
  const dividend = a * power;
  return numericQuestion(
    `${fmt(dividend)} : ${fmt(power)} = ?`,
    a,
    5,
    `חילוק ב-${fmt(power)}: מסירים ${power === 10 ? 1 : power === 100 ? 2 : 3} אפסים. ${fmt(dividend)} : ${fmt(power)} = ${a}.`,
  );
}

function genMulPow10Compound(): Question {
  // Combine: e.g., 30 × 200 = ?  (using ×10/×100)
  const a = pick([2, 3, 4, 5, 6, 7, 8]);
  const b = pick([2, 3, 4, 5, 6]);
  const pa = pick([10, 100]);
  const pb = pick([10, 100]);
  const result = a * b * pa * pb;
  return numericQuestion(
    `${a * pa} × ${b * pb} = ?`,
    result,
    Math.max(100, result / 10),
    `${a * pa} × ${b * pb} = (${a} × ${b}) × (${fmt(pa)} × ${fmt(pb)}) = ${a * b} × ${fmt(pa * pb)} = ${fmt(result)}.`,
  );
}

function genMulPow10WordProblem(): Question {
  const templates: Array<() => Question> = [
    () => {
      const boxes = randInt(3, 9);
      const perBox = pick([10, 100]);
      const total = boxes * perBox;
      return numericQuestion(
        `📦 ${boxes} קופסאות, בכל אחת ${fmt(perBox)} כפתורים. כמה כפתורים בסך הכל?`,
        total,
        50,
        `${boxes} × ${fmt(perBox)} = ${fmt(total)}.`,
      );
    },
    () => {
      const total = pick([2000, 3000, 5000, 6000, 8000]);
      const groups = total / 1000;
      return numericQuestion(
        `🎈 ${fmt(total)} בלונים מחולקים ל-1,000 בלונים בכל קבוצה. כמה קבוצות?`,
        groups,
        3,
        `${fmt(total)} : 1,000 = ${groups}.`,
      );
    },
    () => {
      const km = pick([3, 5, 7, 9]);
      return numericQuestion(
        `📏 ${km} ק״מ = ? מטרים`,
        km * 1000,
        500,
        `1 ק״מ = 1,000 מ׳. ${km} × 1,000 = ${fmt(km * 1000)} מטרים.`,
      );
    },
  ];
  return pick(templates)();
}

function genMulByPow10(): Question {
  const r = Math.random();
  if (r < 0.35) return genMulPow10Direct();
  if (r < 0.55) return genMulPow10Reverse();
  if (r < 0.7) return genDivPow10();
  if (r < 0.85) return genMulPow10Compound();
  return genMulPow10WordProblem();
}

// =====================================================================
// 6) QUADRILATERALS FAMILY — משפחת המרובעים
// =====================================================================

const QUADS: Array<{
  s: "square" | "rectangle" | "rhombus" | "parallelogram" | "trapezoid" | "kite";
  name: string;
  why: string;
}> = [
  {
    s: "square",
    name: "ריבוע",
    why: "ריבוע: 4 צלעות שוות וכל הזוויות ישרות (90°).",
  },
  {
    s: "rectangle",
    name: "מלבן",
    why: "מלבן: צלעות נגדיות שוות וכל הזוויות ישרות.",
  },
  {
    s: "rhombus",
    name: "מעוין",
    why: "מעוין: 4 צלעות שוות, אך הזוויות לא בהכרח ישרות.",
  },
  {
    s: "parallelogram",
    name: "מקבילית",
    why: "מקבילית: שני זוגות של צלעות מקבילות, צלעות נגדיות שוות.",
  },
  {
    s: "trapezoid",
    name: "טרפז",
    why: "טרפז: זוג אחד בלבד של צלעות מקבילות.",
  },
  {
    s: "kite",
    name: "דלתון",
    why: "דלתון: שני זוגות של צלעות סמוכות שוות.",
  },
];

function genQuadIdentify(): Question {
  const target = pick(QUADS);
  const others = shuffle(QUADS.filter((q) => q.s !== target.s)).slice(0, 3);
  return {
    question: "איך נקרא המרובע הזה?",
    correctAnswer: target.name,
    options: shuffle([target.name, ...others.map((o) => o.name)]),
    explanation: target.why,
    visual: { kind: "shape", shape: target.s },
  };
}

function genQuadProperty(): Question {
  const items: Array<{ q: string; a: string; d: string[]; w: string }> = [
    {
      q: "באיזה מרובע כל הצלעות שוות וכל הזוויות ישרות?",
      a: "ריבוע",
      d: ["מלבן", "מעוין", "טרפז"],
      w: "רק לריבוע יש גם 4 צלעות שוות וגם 4 זוויות ישרות.",
    },
    {
      q: "באיזה מרובע יש 4 צלעות שוות, אבל הזוויות לאו דווקא ישרות?",
      a: "מעוין",
      d: ["ריבוע", "מקבילית", "מלבן"],
      w: "מעוין: 4 צלעות שוות. אם גם הזוויות ישרות, זה ריבוע.",
    },
    {
      q: "באיזה מרובע יש זוג אחד בלבד של צלעות מקבילות?",
      a: "טרפז",
      d: ["מקבילית", "מעוין", "מלבן"],
      w: "טרפז: רק זוג אחד של צלעות מקבילות.",
    },
    {
      q: "באיזה מרובע יש שני זוגות של צלעות סמוכות שוות?",
      a: "דלתון",
      d: ["מקבילית", "טרפז", "מעוין"],
      w: "דלתון: שני זוגות של צלעות סמוכות (לא נגדיות) שוות.",
    },
    {
      q: "באיזה מרובע צלעות נגדיות שוות, וכל הזוויות ישרות?",
      a: "מלבן",
      d: ["ריבוע", "מקבילית", "טרפז"],
      w: "מלבן: צלעות נגדיות שוות + זוויות ישרות. (ריבוע הוא מקרה מיוחד עם 4 צלעות שוות.)",
    },
    {
      q: "באיזה מרובע שני זוגות של צלעות מקבילות, אך הזוויות אינן בהכרח 90°?",
      a: "מקבילית",
      d: ["טרפז", "ריבוע", "דלתון"],
      w: "מקבילית: 2 זוגות של צלעות מקבילות. אם כל הזוויות 90° → מלבן.",
    },
  ];
  const it = pick(items);
  return textQuestion(it.q, it.a, it.d, it.w);
}

function genQuadTrueFalse(): Question {
  const items: Array<{ q: string; a: "נכון" | "לא נכון"; w: string }> = [
    {
      q: 'נכון או לא נכון: "כל ריבוע הוא גם מלבן".',
      a: "נכון",
      w: "ריבוע הוא מלבן עם 4 צלעות שוות (יש לו את כל תכונות המלבן).",
    },
    {
      q: 'נכון או לא נכון: "כל מלבן הוא ריבוע".',
      a: "לא נכון",
      w: "מלבן יכול להיות עם צלעות שונות באורכן. רק אם כולן שוות זה ריבוע.",
    },
    {
      q: 'נכון או לא נכון: "כל מעוין הוא מקבילית".',
      a: "נכון",
      w: "במעוין הצלעות הנגדיות מקבילות, אז הוא גם מקבילית.",
    },
    {
      q: 'נכון או לא נכון: "כל טרפז הוא מקבילית".',
      a: "לא נכון",
      w: "בטרפז יש רק זוג אחד של צלעות מקבילות, ובמקבילית — שני זוגות.",
    },
    {
      q: 'נכון או לא נכון: "במלבן כל הזוויות שוות (90°)".',
      a: "נכון",
      w: "כן: בכל מלבן 4 זוויות ישרות (90°).",
    },
    {
      q: 'נכון או לא נכון: "בדלתון יש שני זוגות של צלעות נגדיות שוות".',
      a: "לא נכון",
      w: "בדלתון השוויון הוא בין צלעות סמוכות (לא נגדיות). זה ההבדל ממקבילית.",
    },
    {
      q: 'נכון או לא נכון: "כל ריבוע הוא גם מעוין".',
      a: "נכון",
      w: "לריבוע 4 צלעות שוות, אז הוא מקיים גם את הגדרת המעוין.",
    },
  ];
  const it = pick(items);
  return textQuestion(it.q, it.a, [it.a === "נכון" ? "לא נכון" : "נכון"], it.w);
}

function genQuadParallelSides(): Question {
  const items: Array<{ name: string; pairs: number; why: string }> = [
    { name: "ריבוע", pairs: 2, why: "בריבוע 2 זוגות של צלעות מקבילות." },
    { name: "מלבן", pairs: 2, why: "במלבן 2 זוגות של צלעות מקבילות." },
    { name: "מעוין", pairs: 2, why: "במעוין 2 זוגות של צלעות מקבילות." },
    { name: "מקבילית", pairs: 2, why: "במקבילית 2 זוגות של צלעות מקבילות." },
    { name: "טרפז", pairs: 1, why: "בטרפז יש רק זוג אחד של צלעות מקבילות." },
    { name: "דלתון", pairs: 0, why: "בדלתון אין צלעות מקבילות (יש זוגות שוות אך לא מקבילות)." },
  ];
  const it = pick(items);
  return numericQuestion(
    `כמה זוגות של צלעות מקבילות יש ל${it.name}?`,
    it.pairs,
    2,
    it.why,
  );
}

function genQuadWordProblem(): Question {
  const templates: Array<() => Question> = [
    () => {
      const w = randInt(4, 12);
      const h = randInt(3, 10);
      const peri = 2 * (w + h);
      return numericQuestion(
        `📏 גינה בצורת מלבן באורך ${w} מ׳ וברוחב ${h} מ׳. מה ההיקף שלה?`,
        peri,
        12,
        `היקף מלבן = 2 × (אורך + רוחב) = 2 × (${w} + ${h}) = ${peri} מ׳.`,
      );
    },
    () => {
      const s = randInt(4, 14);
      const peri = 4 * s;
      return numericQuestion(
        `🟦 לרצפת ריבוע צלע באורך ${s} ס״מ. מה ההיקף?`,
        peri,
        12,
        `היקף ריבוע = 4 × צלע = 4 × ${s} = ${peri} ס״מ.`,
      );
    },
    () => {
      return textQuestion(
        "🪁 לקלי דלתון. הוא ראה שלצלעות הסמוכות אורכים שווים. איזה מרובע זה?",
        "דלתון",
        ["טרפז", "מקבילית", "מעוין"],
        "דלתון: שני זוגות של צלעות סמוכות שוות.",
      );
    },
  ];
  return pick(templates)();
}

function genQuadrilaterals(): Question {
  const r = Math.random();
  if (r < 0.3) return genQuadIdentify();
  if (r < 0.55) return genQuadProperty();
  if (r < 0.75) return genQuadTrueFalse();
  if (r < 0.88) return genQuadParallelSides();
  return genQuadWordProblem();
}

// =====================================================================
// PUBLIC API
// =====================================================================

export function generateExamQuestion(topic: ExamTopic): Question {
  switch (topic) {
    case "place-value":
      return genPlaceValue();
    case "distributive":
      return genDistributive();
    case "estimation":
      return genEstimation();
    case "div-remainder":
      return genDivRemainder();
    case "mul-by-pow10":
      return genMulByPow10();
    case "quadrilaterals":
      return genQuadrilaterals();
    default:
      return genPlaceValue();
  }
}

export function generateExamQuestions(topic: ExamTopic, count: number): Question[] {
  const seen = new Set<string>();
  const out: Question[] = [];
  let guard = 0;
  while (out.length < count && guard < 600) {
    guard++;
    const q = generateExamQuestion(topic);
    const key = `${q.question}|${q.correctAnswer}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(q);
  }
  while (out.length < count) {
    out.push(generateExamQuestion(topic));
  }
  return out;
}

export function generateMixedExam(count: number): Question[] {
  const topics: ExamTopic[] = [
    "place-value",
    "distributive",
    "estimation",
    "div-remainder",
    "mul-by-pow10",
    "quadrilaterals",
  ];
  const seen = new Set<string>();
  const out: Question[] = [];
  let guard = 0;
  while (out.length < count && guard < 800) {
    guard++;
    const t = topics[guard % topics.length];
    const q = generateExamQuestion(t);
    const key = `${q.question}|${q.correctAnswer}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(q);
  }
  return out;
}
