export type Level = "easy" | "normal" | "hard";
export type Topic =
  | "add-sub"
  | "mul"
  | "div"
  | "frac"
  | "geo"
  | "money"
  | "word";

export type Visual =
  | { kind: "fraction"; num: number; den: number }
  | { kind: "compare-frac"; a: [number, number]; b: [number, number] }
  | {
      kind: "shape";
      shape:
        | "triangle"
        | "square"
        | "rectangle"
        | "circle"
        | "rhombus"
        | "parallelogram"
        | "trapezoid"
        | "kite"
        | "pentagon"
        | "hexagon";
    }
  | {
      kind: "triangle-type";
      type: "equilateral" | "isosceles" | "scalene" | "right";
    }
  | { kind: "angle-type"; type: "acute" | "right" | "obtuse" | "straight" }
  | { kind: "rect-area"; w: number; h: number; unit?: string }
  | { kind: "perimeter-rect"; w: number; h: number; unit?: string }
  | { kind: "symmetry-axes"; shape: "square" | "rectangle" | "equilateral" | "isosceles" | "circle" | "rhombus"; axes: number };

export type Question = {
  question: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
  visual?: Visual;
};

export const TOPIC_LABELS: Record<Topic, string> = {
  "add-sub": "חיבור וחיסור",
  mul: "כפל",
  div: "חילוק",
  frac: "שברים",
  geo: "גאומטריה",
  money: "כסף ומידות",
  word: "בעיות מילוליות",
};

export const LEVEL_LABELS: Record<Level, string> = {
  easy: "קל",
  normal: "רגיל",
  hard: "מאתגר",
};

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
    correctAnswer: String(correct),
    options: shuffle([correct, ...distractors]).map(String),
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

// =====================================================================
// MULTIPLICATION — CM1 EASY: tables 2-7 / NORMAL: tables 2-12 / HARD: 2-digit × 1-digit
// =====================================================================

function genMulEasy(): Question {
  const form = randInt(0, 4);
  if (form === 0) {
    const a = randInt(2, 7);
    const b = randInt(2, 9);
    const c = a * b;
    return numericQuestion(
      `${a} × ${b} = ?`,
      c,
      8,
      `${a} × ${b} = ${c}. חושבים על זה כ-${a} פעמים ${b}.`,
    );
  }
  if (form === 1) {
    const a = randInt(2, 9);
    const c = a * 10;
    return numericQuestion(
      `${a} × 10 = ?`,
      c,
      10,
      `כפל ב-10: מוסיפים אפס בסוף. ${a} × 10 = ${c}.`,
    );
  }
  if (form === 2) {
    const a = randInt(2, 9);
    const b = randInt(2, 9);
    const c = a * b;
    return numericQuestion(
      `? × ${b} = ${c}`,
      a,
      6,
      `${a} × ${b} = ${c}, אז המספר החסר הוא ${a}.`,
    );
  }
  if (form === 3) {
    const a = randInt(2, 7);
    const c = a * 5;
    return numericQuestion(
      `${a} × 5 = ?`,
      c,
      8,
      `כפל ב-5: ${a} × 5 = ${c}. טריק: כפל ב-10 ואז חצי.`,
    );
  }
  const groups = randInt(3, 8);
  const per = randInt(3, 8);
  const total = groups * per;
  return numericQuestion(
    `יש ${groups} קופסאות עם ${per} עפרונות בכל אחת. כמה עפרונות בסך הכל?`,
    total,
    10,
    `${groups} × ${per} = ${total}. קבוצות שוות → כפל.`,
  );
}

function genMulNormal(): Question {
  const form = randInt(0, 5);
  if (form === 0) {
    const a = randInt(3, 12);
    const b = randInt(3, 12);
    const c = a * b;
    return numericQuestion(`${a} × ${b} = ?`, c, 12, `${a} × ${b} = ${c}.`);
  }
  if (form === 1) {
    const a = randInt(2, 9);
    const c = a * 100;
    return numericQuestion(
      `${a} × 100 = ?`,
      c,
      150,
      `כפל ב-100: מוסיפים שתי אפסים. ${a} × 100 = ${c}.`,
    );
  }
  if (form === 2) {
    const a = randInt(2, 9);
    const b = randInt(2, 9);
    const k = pick([10, 20, 30, 40, 50]);
    const c = a * (b + k);
    return numericQuestion(
      `${a} × ${b + k} = ?`,
      c,
      30,
      `מפרקים: ${a} × (${b} + ${k}) = ${a} × ${b} + ${a} × ${k} = ${a * b} + ${a * k} = ${c}.`,
    );
  }
  if (form === 3) {
    const a = randInt(11, 19);
    const b = randInt(2, 9);
    const c = a * b;
    return numericQuestion(
      `${a} × ${b} = ?`,
      c,
      20,
      `${a} × ${b} = (10 + ${a - 10}) × ${b} = ${10 * b} + ${(a - 10) * b} = ${c}.`,
    );
  }
  if (form === 4) {
    const a = randInt(3, 12);
    const b = randInt(3, 12);
    const c = a * b;
    return numericQuestion(
      `${a} × __ = ${c}`,
      b,
      6,
      `${a} × ${b} = ${c}, אז המספר החסר הוא ${b}.`,
    );
  }
  const boxes = randInt(4, 9);
  const per = randInt(7, 12);
  const total = boxes * per;
  return numericQuestion(
    `בחנות ${boxes} מדפים, ועל כל מדף ${per} ספרים. כמה ספרים בחנות?`,
    total,
    20,
    `${boxes} × ${per} = ${total}. קבוצות שוות → כפל.`,
  );
}

function genMulHard(): Question {
  const form = randInt(0, 6);
  if (form === 0) {
    const a = randInt(13, 39);
    const b = randInt(3, 9);
    const c = a * b;
    return numericQuestion(
      `${a} × ${b} = ?`,
      c,
      30,
      `מחשבים בעמודה: יחידות ${a % 10} × ${b} = ${(a % 10) * b}, עשרות ${Math.floor(a / 10)} × ${b} × 10 = ${Math.floor(a / 10) * b * 10}. סכום: ${c}.`,
    );
  }
  if (form === 1) {
    const a = randInt(15, 25);
    const b = randInt(11, 25);
    const c = a * b;
    return numericQuestion(
      `${a} × ${b} = ?`,
      c,
      80,
      `${a} × ${b}: מפרקים ${b} ל-(${10 * Math.floor(b / 10)} + ${b % 10}) ומכפילים: ${a * 10 * Math.floor(b / 10)} + ${a * (b % 10)} = ${c}.`,
    );
  }
  if (form === 2) {
    const a = randInt(3, 9);
    const b = randInt(3, 9);
    const k = randInt(2, 6);
    const total = a * b * k;
    return numericQuestion(
      `${a} × ${b} × ${k} = ?`,
      total,
      40,
      `מכפילים בסדר: ${a} × ${b} = ${a * b}, ואז × ${k} = ${total}.`,
    );
  }
  if (form === 3) {
    const a = randInt(4, 9);
    const b = randInt(4, 9);
    const prod = a * b;
    const N = prod + randInt(20, 80);
    const c = N - prod;
    return numericQuestion(
      `${N} − ${a} × ${b} = ?`,
      c,
      25,
      `קודם כפל: ${a} × ${b} = ${prod}. אחר כך ${N} − ${prod} = ${c}.`,
    );
  }
  if (form === 4) {
    const a = randInt(11, 19);
    const c = a * 99;
    return numericQuestion(
      `${a} × 99 = ?`,
      c,
      80,
      `טריק: ${a} × 99 = ${a} × 100 − ${a} = ${a * 100} − ${a} = ${c}.`,
    );
  }
  if (form === 5) {
    const a = pick([12, 15, 18, 24, 25]);
    const b = randInt(4, 8);
    const c = a * b;
    return numericQuestion(
      `${a} × ${b} = ?`,
      c,
      30,
      `${a} × ${b} = ${c}.`,
    );
  }
  const items = randInt(8, 15);
  const price = pick([12, 15, 18, 25, 30]);
  const total = items * price;
  return numericQuestion(
    `קנינו ${items} ספרים ב-${price}₪ כל אחד. כמה שילמנו בסך הכל?`,
    total,
    50,
    `${items} × ${price} = ${total}₪.`,
  );
}

function genMul(level: Level): Question {
  if (level === "easy") return genMulEasy();
  if (level === "normal") return genMulNormal();
  return genMulHard();
}

// =====================================================================
// ADDITION/SUBTRACTION — CM1 EASY: 2 digits / NORMAL: 3 digits / HARD: 4-5 digits + decimals
// =====================================================================

function genAddSubEasy(): Question {
  const form = randInt(0, 5);
  if (form === 0) {
    const a = randInt(15, 95);
    const b = randInt(5, 90);
    const c = a + b;
    return numericQuestion(
      `${a} + ${b} = ?`,
      c,
      15,
      `${a} + ${b} = ${c}.`,
    );
  }
  if (form === 1) {
    const a = randInt(35, 99);
    const b = randInt(5, a - 5);
    const c = a - b;
    return numericQuestion(
      `${a} − ${b} = ?`,
      c,
      12,
      `${a} − ${b} = ${c}.`,
    );
  }
  if (form === 2) {
    const a = randInt(20, 60);
    const missing = randInt(15, 40);
    const c = a + missing;
    return numericQuestion(
      `${a} + __ = ${c}`,
      missing,
      10,
      `${a} + ${missing} = ${c}, אז המספר החסר הוא ${missing}.`,
    );
  }
  if (form === 3) {
    const a = randInt(50, 99);
    const missing = randInt(10, a - 5);
    const c = a - missing;
    return numericQuestion(
      `${a} − __ = ${c}`,
      missing,
      10,
      `${a} − ${missing} = ${c}, אז המספר החסר הוא ${missing}.`,
    );
  }
  if (form === 4) {
    const x = randInt(10, 30);
    const y = randInt(10, 30);
    const z = randInt(5, 20);
    const sum = x + y + z;
    return numericQuestion(
      `${x} + ${y} + ${z} = ?`,
      sum,
      15,
      `מחברים בסדר: ${x} + ${y} = ${x + y}, ואז + ${z} = ${sum}.`,
    );
  }
  const a = randInt(40, 90);
  const c = 100 - a;
  return numericQuestion(
    `${a} + __ = 100`,
    c,
    10,
    `${a} + ${c} = 100. כמה צריך להוסיף ל-${a} כדי להגיע ל-100? — ${c}.`,
  );
}

function genAddSubNormal(): Question {
  const form = randInt(0, 5);
  if (form === 0) {
    const a = randInt(250, 950);
    const b = randInt(150, 900);
    const c = a + b;
    return numericQuestion(
      `${a} + ${b} = ?`,
      c,
      40,
      `מחברים בעמודה. ${a} + ${b} = ${c}.`,
    );
  }
  if (form === 1) {
    const a = randInt(450, 950);
    const b = randInt(120, a - 50);
    const c = a - b;
    return numericQuestion(
      `${a} − ${b} = ?`,
      c,
      40,
      `מחסרים בעמודה. ${a} − ${b} = ${c}.`,
    );
  }
  if (form === 2) {
    const a = randInt(120, 450);
    const missing = randInt(120, 400);
    const c = a + missing;
    return numericQuestion(
      `${a} + __ = ${c}`,
      missing,
      30,
      `${a} + ${missing} = ${c}.`,
    );
  }
  if (form === 3) {
    const a = randInt(180, 450);
    const b = randInt(90, 200);
    const c = randInt(50, 150);
    const total = a + b - c;
    return numericQuestion(
      `${a} + ${b} − ${c} = ?`,
      total,
      30,
      `לפי הסדר: ${a} + ${b} = ${a + b}, ואז − ${c} = ${total}.`,
    );
  }
  if (form === 4) {
    const a = randInt(550, 990);
    const c = 1000 - a;
    return numericQuestion(
      `${a} + __ = 1000`,
      c,
      30,
      `כמה משלים ל-1000? ${a} + ${c} = 1000.`,
    );
  }
  const a = randInt(150, 450);
  const b = randInt(60, 180);
  const c = randInt(40, 120);
  const d = randInt(50, 150);
  const total = a + b - c + d;
  return numericQuestion(
    `${a} + ${b} − ${c} + ${d} = ?`,
    total,
    40,
    `לפי הסדר: ${a} + ${b} = ${a + b}, − ${c} = ${a + b - c}, + ${d} = ${total}.`,
  );
}

function genAddSubHard(): Question {
  const form = randInt(0, 5);
  if (form === 0) {
    const a = randInt(2500, 8500);
    const b = randInt(800, a - 200);
    const c = a + b;
    return numericQuestion(
      `${a} + ${b} = ?`,
      c,
      150,
      `מחברים בעמודה מהיחידות לאלפים. ${a} + ${b} = ${c}.`,
    );
  }
  if (form === 1) {
    const a = randInt(4000, 9500);
    const b = randInt(800, a - 500);
    const c = a - b;
    return numericQuestion(
      `${a} − ${b} = ?`,
      c,
      150,
      `מחסרים בעמודה. ${a} − ${b} = ${c}.`,
    );
  }
  if (form === 2) {
    // Decimals — CM2 territory
    const aWhole = randInt(5, 15);
    const aDec = randInt(1, 9);
    const bWhole = randInt(2, 8);
    const bDec = randInt(1, 9);
    const a = aWhole + aDec / 10;
    const b = bWhole + bDec / 10;
    const c = +(a + b).toFixed(1);
    return numericQuestion(
      `${a.toFixed(1)} + ${b.toFixed(1)} = ?`,
      c,
      5,
      `מחברים מספרים עשרוניים: מיישרים את הנקודה ומחברים. ${a.toFixed(1)} + ${b.toFixed(1)} = ${c.toFixed(1)}.`,
    );
  }
  if (form === 3) {
    const a = randInt(10, 25);
    const aDec = randInt(2, 9);
    const aTotal = a + aDec / 10;
    const bWhole = randInt(3, a - 2);
    const bDec = randInt(1, aDec - 1);
    const bTotal = bWhole + bDec / 10;
    const c = +(aTotal - bTotal).toFixed(1);
    return numericQuestion(
      `${aTotal.toFixed(1)} − ${bTotal.toFixed(1)} = ?`,
      c,
      5,
      `מחסרים מספרים עשרוניים: מיישרים את הנקודה. ${aTotal.toFixed(1)} − ${bTotal.toFixed(1)} = ${c.toFixed(1)}.`,
    );
  }
  if (form === 4) {
    const a = randInt(1500, 4500);
    const b = randInt(400, 1500);
    const c = randInt(200, 800);
    const d = randInt(200, 700);
    const total = a + b - c - d;
    return numericQuestion(
      `${a} + ${b} − ${c} − ${d} = ?`,
      total,
      120,
      `לפי הסדר: ${a} + ${b} − ${c} − ${d} = ${total}.`,
    );
  }
  const a = randInt(7500, 9999);
  const c = 10000 - a;
  return numericQuestion(
    `${a} + __ = 10,000`,
    c,
    150,
    `משלים ל-10,000: 10,000 − ${a} = ${c}.`,
  );
}

function genAddSub(level: Level): Question {
  if (level === "easy") return genAddSubEasy();
  if (level === "normal") return genAddSubNormal();
  return genAddSubHard();
}

// =====================================================================
// DIVISION — CM1 EASY: simple / NORMAL: with remainder / HARD: long division
// =====================================================================

function genDivEasy(): Question {
  const form = randInt(0, 4);
  if (form === 0) {
    const divisor = randInt(2, 6);
    const result = randInt(3, 10);
    const dividend = divisor * result;
    return numericQuestion(
      `${dividend} : ${divisor} = ?`,
      result,
      6,
      `${divisor} × ${result} = ${dividend}, אז ${dividend} : ${divisor} = ${result}.`,
    );
  }
  if (form === 1) {
    const result = randInt(4, 15);
    const n = result * 2;
    return numericQuestion(
      `חצי מ-${n} זה?`,
      result,
      5,
      `${n} : 2 = ${result}.`,
    );
  }
  if (form === 2) {
    const result = randInt(3, 12);
    const n = result * 4;
    return numericQuestion(
      `רבע מ-${n} זה?`,
      result,
      5,
      `${n} : 4 = ${result}.`,
    );
  }
  if (form === 3) {
    const result = randInt(3, 10);
    const n = result * 3;
    return numericQuestion(
      `שליש מ-${n} זה?`,
      result,
      5,
      `${n} : 3 = ${result}.`,
    );
  }
  const kids = randInt(3, 6);
  const per = randInt(4, 8);
  const total = kids * per;
  return numericQuestion(
    `יש ${total} ממתקים ו-${kids} ילדים. בחלוקה שווה — כמה לכל ילד?`,
    per,
    6,
    `${total} : ${kids} = ${per}.`,
  );
}

function genDivNormal(): Question {
  const form = randInt(0, 5);
  if (form === 0) {
    const divisor = randInt(3, 12);
    const result = randInt(4, 12);
    const dividend = divisor * result;
    return numericQuestion(
      `${dividend} : ${divisor} = ?`,
      result,
      8,
      `${divisor} × ${result} = ${dividend}, אז ${dividend} : ${divisor} = ${result}.`,
    );
  }
  if (form === 1) {
    const divisor = randInt(2, 9);
    const quotient = randInt(4, 12);
    const remainder = randInt(1, divisor - 1);
    const dividend = divisor * quotient + remainder;
    return numericQuestion(
      `שארית: ${dividend} : ${divisor} = ?, מה השארית?`,
      remainder,
      4,
      `${divisor} × ${quotient} = ${divisor * quotient}. שארית: ${dividend} − ${divisor * quotient} = ${remainder}.`,
    );
  }
  if (form === 2) {
    const divisor = randInt(2, 9);
    const quotient = randInt(4, 12);
    const remainder = randInt(1, divisor - 1);
    const dividend = divisor * quotient + remainder;
    return numericQuestion(
      `${dividend} : ${divisor} = ?, מה המנה (השלם)?`,
      quotient,
      5,
      `${divisor} × ${quotient} = ${divisor * quotient}, השארית ${remainder}. אז המנה היא ${quotient}.`,
    );
  }
  if (form === 3) {
    const a = pick([100, 200, 300, 400, 500]);
    const d = pick([2, 4, 5, 10]);
    const c = a / d;
    return numericQuestion(
      `${a} : ${d} = ?`,
      c,
      30,
      `${a} : ${d} = ${c}. ניתן לפרק: ${a} : ${d}.`,
    );
  }
  if (form === 4) {
    const result = randInt(8, 25);
    const n = result * 5;
    return numericQuestion(
      `חמישית מ-${n} זה?`,
      result,
      8,
      `${n} : 5 = ${result}. חמישית = 1 חלקי 5.`,
    );
  }
  const total = pick([60, 72, 84, 96, 108]);
  const parts = pick([4, 6, 8, 12]);
  const per = total / parts;
  return numericQuestion(
    `${total} עמודים נקראו ב-${parts} ימים שווים. כמה עמודים ליום?`,
    per,
    6,
    `${total} : ${parts} = ${per}.`,
  );
}

function genDivHard(): Question {
  const form = randInt(0, 5);
  if (form === 0) {
    // Long division (3-digit ÷ 1-digit)
    const divisor = randInt(3, 9);
    const quotient = randInt(20, 99);
    const dividend = divisor * quotient;
    return numericQuestion(
      `${dividend} : ${divisor} = ?`,
      quotient,
      20,
      `חילוק ארוך: ${dividend} : ${divisor} = ${quotient}.`,
    );
  }
  if (form === 1) {
    // 3-digit ÷ 1-digit with remainder
    const divisor = randInt(3, 9);
    const quotient = randInt(15, 80);
    const remainder = randInt(1, divisor - 1);
    const dividend = divisor * quotient + remainder;
    return numericQuestion(
      `${dividend} : ${divisor} = ?, השארית?`,
      remainder,
      4,
      `${divisor} × ${quotient} = ${divisor * quotient}. שארית: ${dividend} − ${divisor * quotient} = ${remainder}.`,
    );
  }
  if (form === 2) {
    const a = pick([1000, 2000, 3000, 5000]);
    const d = pick([4, 5, 8, 10, 25]);
    const c = a / d;
    return numericQuestion(
      `${a} : ${d} = ?`,
      c,
      80,
      `${a} : ${d} = ${c}.`,
    );
  }
  if (form === 3) {
    const a = pick([2, 4, 6, 8]);
    const b = pick([3, 5, 7, 9]);
    const total = a * b * randInt(3, 6);
    const result = total / (a * b);
    return numericQuestion(
      `${total} : ${a} : ${b} = ?`,
      result,
      6,
      `${total} : ${a} = ${total / a}, ואז : ${b} = ${result}.`,
    );
  }
  if (form === 4) {
    // Decimal division
    const result = randInt(15, 45);
    const result10 = result / 10;
    return numericQuestion(
      `${result} : 10 = ?`,
      result10,
      5,
      `חילוק ב-10: מזיזים את הנקודה העשרונית מקום אחד שמאלה. ${result} : 10 = ${result10.toFixed(1)}.`,
    );
  }
  const treesAdj = pick([4, 6, 8, 12]);
  const total = treesAdj * pick([7, 8, 9, 12]);
  const each = total / treesAdj;
  return numericQuestion(
    `${total} ממתקים חולקו שווה בין ${treesAdj} ילדים. כמה קיבל כל ילד?`,
    each,
    8,
    `${total} : ${treesAdj} = ${each}.`,
  );
}

function genDiv(level: Level): Question {
  if (level === "easy") return genDivEasy();
  if (level === "normal") return genDivNormal();
  return genDivHard();
}

// =====================================================================
// FRACTIONS — CM1 EASY: visual identification / NORMAL: equivalent + compare / HARD: add/sub same denominator + decimals
// =====================================================================

function fractionVisualEasy(): Question {
  const choices: Array<[number, number]> = [
    [1, 2],
    [1, 3],
    [1, 4],
    [2, 3],
    [2, 4],
    [3, 4],
    [1, 5],
    [2, 5],
    [3, 5],
    [4, 5],
    [1, 6],
    [5, 6],
    [3, 8],
    [5, 8],
  ];
  const [num, den] = pick(choices);
  const correct = `${num}/${den}`;
  const distractorsPool: string[] = [];
  for (const [n, d] of choices) {
    const v = `${n}/${d}`;
    if (v !== correct) distractorsPool.push(v);
  }
  const distractors = shuffle(distractorsPool).slice(0, 3);
  return {
    question: "איזה שבר מייצג הצורה הצבועה?",
    correctAnswer: correct,
    options: shuffle([correct, ...distractors]),
    explanation: `בצורה ${den} חלקים שווים, ${num} מהם צבועים — לכן השבר הוא ${correct}.`,
    visual: { kind: "fraction", num, den },
  };
}

function fractionFromTextEasy(): Question {
  const opts: Array<() => Question> = [
    () => numericQuestion("חצי מ-12 זה?", 6, 5, "חצי = 1 חלקי 2. 12 : 2 = 6."),
    () => numericQuestion("רבע מ-20 זה?", 5, 5, "רבע = 1 חלקי 4. 20 : 4 = 5."),
    () => numericQuestion("שליש מ-15 זה?", 5, 5, "שליש = 1 חלקי 3. 15 : 3 = 5."),
    () => numericQuestion("חמישית מ-25 זה?", 5, 5, "חמישית = 1 חלקי 5. 25 : 5 = 5."),
    () => numericQuestion("שישית מ-18 זה?", 3, 4, "שישית = 1 חלקי 6. 18 : 6 = 3."),
    () => numericQuestion("שמינית מ-32 זה?", 4, 5, "שמינית = 1 חלקי 8. 32 : 8 = 4."),
  ];
  return pick(opts)();
}

function fractionCompareNormal(): Question {
  const den = pick([4, 5, 6, 8, 10]);
  let a = randInt(1, den - 1);
  let b = randInt(1, den - 1);
  while (a === b) b = randInt(1, den - 1);
  const bigger = a > b ? `${a}/${den}` : `${b}/${den}`;
  return {
    question: "איזה שבר גדול יותר?",
    correctAnswer: bigger,
    options: shuffle([`${a}/${den}`, `${b}/${den}`, "שווים", "לא ניתן להשוות"]),
    explanation:
      "באותו מכנה, השבר עם המונה הגדול יותר גדול יותר.",
    visual: { kind: "compare-frac", a: [a, den], b: [b, den] },
  };
}

function fractionEquivalentNormal(): Question {
  // Find equivalent: 1/2 = ?/4, 1/3 = ?/6, 2/3 = ?/9 etc.
  const base: Array<{ n: number; d: number; mult: number }> = [
    { n: 1, d: 2, mult: 2 },
    { n: 1, d: 2, mult: 3 },
    { n: 1, d: 2, mult: 4 },
    { n: 1, d: 3, mult: 2 },
    { n: 1, d: 3, mult: 3 },
    { n: 2, d: 3, mult: 2 },
    { n: 2, d: 3, mult: 3 },
    { n: 1, d: 4, mult: 2 },
    { n: 3, d: 4, mult: 2 },
    { n: 1, d: 5, mult: 2 },
    { n: 2, d: 5, mult: 2 },
    { n: 3, d: 5, mult: 2 },
  ];
  const b = pick(base);
  const newN = b.n * b.mult;
  const newD = b.d * b.mult;
  const correct = `${newN}/${newD}`;
  const distractors = [
    `${b.n + 1}/${newD}`,
    `${newN}/${newD + 1}`,
    `${newN - 1}/${newD}`,
  ];
  return textQuestion(
    `איזה שבר שווה ל-${b.n}/${b.d}?`,
    correct,
    distractors,
    `שברים שווי-ערך: כפלנו את המונה והמכנה ב-${b.mult}. ${b.n}/${b.d} = ${correct}.`,
  );
}

function fractionToDecimalNormal(): Question {
  const opts: Array<() => Question> = [
    () => textQuestion("איזה מספר עשרוני שווה ל-1/2?", "0.5", ["0.2", "0.05", "1.5"], "1/2 = 0.5 (חצי)."),
    () => textQuestion("איזה מספר עשרוני שווה ל-1/4?", "0.25", ["0.4", "0.2", "0.75"], "1/4 = 0.25 (רבע)."),
    () => textQuestion("איזה מספר עשרוני שווה ל-3/4?", "0.75", ["0.34", "0.43", "0.4"], "3/4 = 0.75."),
    () => textQuestion("איזה מספר עשרוני שווה ל-1/10?", "0.1", ["0.01", "1.0", "0.10"], "1/10 = 0.1 (עשירית)."),
    () => textQuestion("איזה מספר עשרוני שווה ל-7/10?", "0.7", ["0.07", "7.0", "0.17"], "7/10 = 0.7."),
  ];
  return pick(opts)();
}

function fractionAddHard(): Question {
  const den = randInt(5, 12);
  const a = randInt(1, den - 2);
  const b = randInt(1, den - a);
  const sum = a + b;
  return textQuestion(
    `${a}/${den} + ${b}/${den} = ?`,
    `${sum}/${den}`,
    [
      `${sum}/${den * 2}`,
      `${a * b}/${den}`,
      `${sum + 1}/${den}`,
    ],
    `באותו מכנה: מחברים מונים. ${a} + ${b} = ${sum}. התוצאה: ${sum}/${den}.`,
  );
}

function fractionSubHard(): Question {
  const den = randInt(5, 12);
  const a = randInt(3, den - 1);
  const b = randInt(1, a - 1);
  const diff = a - b;
  return textQuestion(
    `${a}/${den} − ${b}/${den} = ?`,
    `${diff}/${den}`,
    [
      `${diff}/${den * 2}`,
      `${a + b}/${den}`,
      `${diff + 1}/${den}`,
    ],
    `באותו מכנה: מחסרים מונים. ${a} − ${b} = ${diff}. התוצאה: ${diff}/${den}.`,
  );
}

function fractionOfNumberHard(): Question {
  const den = pick([3, 4, 5, 6, 8, 10]);
  const num = randInt(1, den - 1);
  const total = den * randInt(3, 8);
  const result = (total / den) * num;
  return numericQuestion(
    `${num}/${den} מתוך ${total} =?`,
    result,
    8,
    `${num}/${den} מתוך ${total}: קודם מחלקים ${total} : ${den} = ${total / den}, ואז כופלים ב-${num} = ${result}.`,
  );
}

function genFrac(level: Level): Question {
  if (level === "easy") {
    const r = Math.random();
    if (r < 0.6) return fractionVisualEasy();
    return fractionFromTextEasy();
  }
  if (level === "normal") {
    const r = Math.random();
    if (r < 0.4) return fractionCompareNormal();
    if (r < 0.7) return fractionEquivalentNormal();
    return fractionToDecimalNormal();
  }
  // hard
  const r = Math.random();
  if (r < 0.35) return fractionAddHard();
  if (r < 0.55) return fractionSubHard();
  return fractionOfNumberHard();
}

// =====================================================================
// GEOMETRY — CM1/CM2 calibrated
// EASY: shape names, sides/vertices, axes of symmetry
// NORMAL: perimeter, triangle types, parallelograms, axes of symmetry
// HARD: areas, angle types/sums, complex geometry
// =====================================================================

const SHAPES_EASY: Array<{
  s:
    | "triangle"
    | "square"
    | "rectangle"
    | "circle"
    | "rhombus"
    | "parallelogram"
    | "trapezoid"
    | "pentagon"
    | "hexagon";
  name: string;
  why: string;
}> = [
  { s: "triangle", name: "משולש", why: "3 צלעות ו-3 זוויות — זה משולש." },
  { s: "square", name: "ריבוע", why: "4 צלעות שוות וכל הזוויות ישרות (90°) — זה ריבוע." },
  { s: "rectangle", name: "מלבן", why: "4 צלעות, זוגות שווים, כל הזוויות ישרות — זה מלבן." },
  { s: "circle", name: "עיגול", why: "צורה עגולה ללא צלעות — זה עיגול." },
  { s: "rhombus", name: "מעוין", why: "4 צלעות שוות, אבל הזוויות לא בהכרח ישרות — זה מעוין." },
  { s: "parallelogram", name: "מקבילית", why: "4 צלעות, צלעות נגדיות מקבילות ושוות — זו מקבילית." },
  { s: "trapezoid", name: "טרפז", why: "4 צלעות, רק זוג אחד של צלעות מקבילות — זה טרפז." },
  { s: "pentagon", name: "מחומש", why: "5 צלעות — זה מחומש." },
  { s: "hexagon", name: "משושה", why: "6 צלעות — זה משושה." },
];

function genGeoEasy(): Question {
  const form = randInt(0, 4);
  if (form === 0) {
    // Identify shape
    const subset = shuffle([...SHAPES_EASY]).slice(0, 5);
    const picked = pick(subset);
    const distractors = subset
      .filter((s) => s.name !== picked.name)
      .map((s) => s.name)
      .slice(0, 3);
    return {
      question: "איך נקראת הצורה הזאת?",
      correctAnswer: picked.name,
      options: shuffle([picked.name, ...distractors]),
      explanation: picked.why,
      visual: { kind: "shape", shape: picked.s },
    };
  }
  if (form === 1) {
    // Number of sides
    const shapes = [
      { name: "משולש", sides: 3 },
      { name: "ריבוע", sides: 4 },
      { name: "מלבן", sides: 4 },
      { name: "מעוין", sides: 4 },
      { name: "מחומש", sides: 5 },
      { name: "משושה", sides: 6 },
      { name: "מתומן", sides: 8 },
    ];
    const p = pick(shapes);
    return numericQuestion(
      `כמה צלעות יש ל${p.name}?`,
      p.sides,
      3,
      `ב${p.name} יש ${p.sides} צלעות.`,
    );
  }
  if (form === 2) {
    // Number of vertices (same as sides for polygons)
    const shapes = [
      { name: "משולש", v: 3 },
      { name: "ריבוע", v: 4 },
      { name: "מחומש", v: 5 },
      { name: "משושה", v: 6 },
    ];
    const p = pick(shapes);
    return numericQuestion(
      `כמה קודקודים יש ל${p.name}?`,
      p.v,
      3,
      `ב${p.name} יש ${p.v} קודקודים — בדיוק כמספר הצלעות.`,
    );
  }
  if (form === 3) {
    // Faces of 3D shapes (basic)
    const opts: Array<() => Question> = [
      () =>
        textQuestion(
          "איזו צורה תלת-ממדית יש לה 6 פאות שוות?",
          "קוביה",
          ["כדור", "פירמידה", "גליל"],
          "לקוביה יש 6 פאות, כל פאה היא ריבוע.",
        ),
      () =>
        textQuestion(
          "איזו צורה תלת-ממדית יש לה רק עיגול אחד ופני שטח עקומים?",
          "כדור",
          ["קוביה", "פירמידה", "תיבה"],
          "כדור הוא צורה תלת-ממדית עם משטח עקום אחד.",
        ),
      () =>
        textQuestion(
          "איזו צורה תלת-ממדית יש לה 2 עיגולים בקצוות?",
          "גליל (צילינדר)",
          ["כדור", "קוביה", "פירמידה"],
          "גליל יש לו 2 עיגולים זהים בקצוות וצדדים מעוגלים.",
        ),
    ];
    return pick(opts)();
  }
  // Symmetry axes
  const symData: Array<{
    shape: "square" | "rectangle" | "equilateral" | "isosceles" | "circle" | "rhombus";
    name: string;
    axes: number;
    why: string;
  }> = [
    { shape: "square", name: "ריבוע", axes: 4, why: "לריבוע יש 4 צירי סימטריה." },
    { shape: "rectangle", name: "מלבן", axes: 2, why: "למלבן יש 2 צירי סימטריה (אופקי ואנכי באמצע)." },
    { shape: "equilateral", name: "משולש שווה-צלעות", axes: 3, why: "למשולש שווה-צלעות יש 3 צירי סימטריה." },
    { shape: "isosceles", name: "משולש שווה-שוקיים", axes: 1, why: "למשולש שווה-שוקיים יש ציר סימטריה אחד." },
  ];
  const s = pick(symData);
  return {
    question: `כמה צירי סימטריה יש ל${s.name}?`,
    correctAnswer: String(s.axes),
    options: shuffle(["0", "1", "2", "3", "4"].slice(0, 4)),
    explanation: s.why,
    visual: { kind: "symmetry-axes", shape: s.shape, axes: s.axes },
  };
}

function genGeoNormal(): Question {
  const form = randInt(0, 5);
  if (form === 0) {
    // Triangle types
    const types: Array<{
      t: "equilateral" | "isosceles" | "scalene" | "right";
      name: string;
      why: string;
    }> = [
      { t: "equilateral", name: "שווה-צלעות", why: "כל 3 הצלעות באותו אורך." },
      { t: "isosceles", name: "שווה-שוקיים", why: "שתי צלעות שוות ואחת שונה." },
      { t: "scalene", name: "שונה-צלעות", why: "כל שלוש הצלעות באורך שונה." },
      { t: "right", name: "ישר-זווית", why: "אחת הזוויות שלו היא 90° (זווית ישרה)." },
    ];
    const p = pick(types);
    const distractors = types.filter((x) => x.name !== p.name).map((x) => x.name);
    return {
      question: "איזה סוג משולש זה?",
      correctAnswer: p.name,
      options: shuffle([p.name, ...distractors]),
      explanation: p.why,
      visual: { kind: "triangle-type", type: p.t },
    };
  }
  if (form === 1) {
    // Perimeter of rectangle
    const w = randInt(3, 12);
    const h = randInt(3, 12);
    const peri = 2 * (w + h);
    return {
      question: `מה ההיקף של מלבן עם צלעות ${w} ס״מ ו-${h} ס״מ?`,
      correctAnswer: `${peri} ס״מ`,
      options: shuffle([
        `${peri} ס״מ`,
        `${w * h} ס״מ`,
        `${w + h} ס״מ`,
        `${peri + 2} ס״מ`,
      ]),
      explanation: `היקף מלבן = 2 × (אורך + רוחב) = 2 × (${w} + ${h}) = ${peri} ס״מ.`,
      visual: { kind: "perimeter-rect", w, h, unit: "ס״מ" },
    };
  }
  if (form === 2) {
    // Perimeter of square
    const s = randInt(3, 15);
    const peri = 4 * s;
    return numericQuestion(
      `מה ההיקף של ריבוע עם צלע ${s} ס״מ? (במ״מ?, לא — בס״מ)`,
      peri,
      8,
      `היקף ריבוע = 4 × צלע = 4 × ${s} = ${peri} ס״מ.`,
    );
  }
  if (form === 3) {
    // Triangle perimeter
    const a = randInt(4, 12);
    const b = randInt(4, 12);
    const c = randInt(4, 12);
    const peri = a + b + c;
    return numericQuestion(
      `מה ההיקף של משולש עם צלעות ${a}, ${b}, ${c} ס״מ?`,
      peri,
      6,
      `היקף משולש = סכום הצלעות = ${a} + ${b} + ${c} = ${peri} ס״מ.`,
    );
  }
  if (form === 4) {
    // Quadrilateral types
    const opts: Array<() => Question> = [
      () =>
        textQuestion(
          "איזו צורה יש לה 4 צלעות שוות וכל הזוויות ישרות?",
          "ריבוע",
          ["מלבן", "מעוין", "מקבילית"],
          "ריבוע: 4 צלעות שוות + כל הזוויות 90°.",
        ),
      () =>
        textQuestion(
          "איזו צורה יש לה 4 צלעות שוות אבל הזוויות לא ישרות?",
          "מעוין",
          ["ריבוע", "מלבן", "טרפז"],
          "מעוין: 4 צלעות שוות, אבל הזוויות אינן 90° (אחרת זה ריבוע).",
        ),
      () =>
        textQuestion(
          "איזו צורה יש לה רק זוג אחד של צלעות מקבילות?",
          "טרפז",
          ["מלבן", "מעוין", "מקבילית"],
          "בטרפז יש רק זוג אחד של צלעות מקבילות.",
        ),
      () =>
        textQuestion(
          "איזו צורה יש לה זוגות של צלעות מקבילות אבל אינה ריבוע?",
          "מקבילית",
          ["טרפז", "משולש", "מחומש"],
          "במקבילית 2 זוגות של צלעות מקבילות. ריבוע הוא מקבילית מיוחדת.",
        ),
    ];
    return pick(opts)();
  }
  // Diameter / radius
  const r = randInt(3, 12);
  return numericQuestion(
    `אם הרדיוס של עיגול הוא ${r} ס״מ, מה אורך הקוטר?`,
    r * 2,
    5,
    `קוטר = 2 × רדיוס. ${r} × 2 = ${r * 2} ס״מ.`,
  );
}

function genGeoHard(): Question {
  const form = randInt(0, 6);
  if (form === 0) {
    // Angle types
    const types: Array<{
      t: "acute" | "right" | "obtuse" | "straight";
      name: string;
      why: string;
    }> = [
      { t: "acute", name: "חדה", why: "הזווית קטנה מ-90°." },
      { t: "right", name: "ישרה", why: "הזווית בדיוק 90°." },
      { t: "obtuse", name: "קהה", why: "הזווית בין 90° ל-180°." },
      { t: "straight", name: "שטוחה", why: "הזווית בדיוק 180°." },
    ];
    const p = pick(types.filter((x) => x.t !== "straight"));
    const distractors = types.filter((x) => x.name !== p.name).map((x) => x.name);
    return {
      question: "איזה סוג זווית זו?",
      correctAnswer: p.name,
      options: shuffle([p.name, ...distractors.slice(0, 3)]),
      explanation: p.why,
      visual: { kind: "angle-type", type: p.t },
    };
  }
  if (form === 1) {
    // Area of rectangle
    const w = randInt(4, 15);
    const h = randInt(3, 12);
    const area = w * h;
    return {
      question: `מה השטח של מלבן עם צלעות ${w} ס״מ ו-${h} ס״מ?`,
      correctAnswer: `${area} סמ״ר`,
      options: shuffle([
        `${area} סמ״ר`,
        `${2 * (w + h)} סמ״ר`,
        `${w + h} סמ״ר`,
        `${area + w} סמ״ר`,
      ]),
      explanation: `שטח מלבן = אורך × רוחב = ${w} × ${h} = ${area} סמ״ר.`,
      visual: { kind: "rect-area", w, h, unit: "ס״מ" },
    };
  }
  if (form === 2) {
    // Area of square
    const s = randInt(3, 14);
    const area = s * s;
    return numericQuestion(
      `מה השטח של ריבוע עם צלע ${s} ס״מ? (בסמ״ר)`,
      area,
      30,
      `שטח ריבוע = צלע × צלע = ${s} × ${s} = ${area} סמ״ר.`,
    );
  }
  if (form === 3) {
    // Sum of angles in a triangle
    const a = randInt(20, 70);
    const b = randInt(30, 80);
    const c = 180 - a - b;
    if (c < 10 || c > 130) {
      // fall back
      return numericQuestion(
        `במשולש זוויות 60° ו-70°. מה הזווית השלישית?`,
        50,
        15,
        `סכום זוויות במשולש = 180°. 180 − 60 − 70 = 50°.`,
      );
    }
    return numericQuestion(
      `במשולש זוויות ${a}° ו-${b}°. מה הזווית השלישית? (במעלות)`,
      c,
      15,
      `סכום זוויות במשולש = 180°. ${180} − ${a} − ${b} = ${c}°.`,
    );
  }
  if (form === 4) {
    // Find missing side from perimeter
    const w = randInt(5, 15);
    const peri = randInt(40, 80);
    const h = (peri - 2 * w) / 2;
    if (h < 2 || !Number.isInteger(h)) {
      // fallback safe
      return numericQuestion(
        `היקף מלבן הוא 30 ס״מ. אם אורכו 9 ס״מ, מה רוחבו?`,
        6,
        5,
        `2 × (אורך + רוחב) = 30, אורך + רוחב = 15, רוחב = 15 − 9 = 6 ס״מ.`,
      );
    }
    return numericQuestion(
      `היקף מלבן הוא ${peri} ס״מ. אם אורכו ${w} ס״מ, מה רוחבו?`,
      h,
      6,
      `2 × (${w} + רוחב) = ${peri}. ${w} + רוחב = ${peri / 2}. רוחב = ${peri / 2} − ${w} = ${h} ס״מ.`,
    );
  }
  if (form === 5) {
    // Compound area
    const w1 = randInt(4, 8);
    const h1 = randInt(3, 6);
    const w2 = randInt(2, 5);
    const h2 = randInt(2, 4);
    const total = w1 * h1 + w2 * h2;
    return numericQuestion(
      `צורה מורכבת משני מלבנים: אחד ${w1}×${h1} ס״מ, אחר ${w2}×${h2} ס״מ. מה השטח הכולל?`,
      total,
      20,
      `שטח 1: ${w1} × ${h1} = ${w1 * h1}. שטח 2: ${w2} × ${h2} = ${w2 * h2}. סה״כ: ${total} סמ״ר.`,
    );
  }
  // Volume of a cube
  const s = randInt(2, 8);
  const vol = s * s * s;
  return numericQuestion(
    `מה הנפח של קוביה עם צלע ${s} ס״מ? (בסמ״ק)`,
    vol,
    30,
    `נפח קוביה = צלע × צלע × צלע = ${s} × ${s} × ${s} = ${vol} סמ״ק.`,
  );
}

function genGeo(level: Level): Question {
  if (level === "easy") return genGeoEasy();
  if (level === "normal") return genGeoNormal();
  return genGeoHard();
}

// =====================================================================
// MONEY/UNITS
// =====================================================================

function genMoneyEasy(): Question {
  const form = randInt(0, 4);
  if (form === 0) {
    const items = randInt(3, 7);
    const price = randInt(4, 9);
    const total = items * price;
    return numericQuestion(
      `קנית ${items} מדבקות, כל אחת ${price}₪. כמה שילמת?`,
      total,
      8,
      `${items} × ${price} = ${total}₪.`,
    );
  }
  if (form === 1) {
    const have = randInt(40, 90);
    const spent = randInt(15, have - 5);
    const left = have - spent;
    return numericQuestion(
      `היו לך ${have}₪. הוצאת ${spent}₪. כמה נשאר?`,
      left,
      10,
      `${have} − ${spent} = ${left}₪.`,
    );
  }
  if (form === 2) {
    // Unit conversion: m to cm
    const m = randInt(2, 9);
    return numericQuestion(
      `${m} מטרים = ? ס״מ`,
      m * 100,
      80,
      `1 מטר = 100 ס״מ. ${m} × 100 = ${m * 100} ס״מ.`,
    );
  }
  if (form === 3) {
    // kg to grams
    const k = randInt(2, 8);
    return numericQuestion(
      `${k} ק״ג = ? גרם`,
      k * 1000,
      800,
      `1 ק״ג = 1,000 גרם. ${k} × 1,000 = ${k * 1000} גרם.`,
    );
  }
  // Time: minutes in hours
  const h = randInt(2, 6);
  return numericQuestion(
    `${h} שעות = ? דקות`,
    h * 60,
    50,
    `1 שעה = 60 דקות. ${h} × 60 = ${h * 60} דקות.`,
  );
}

function genMoneyNormal(): Question {
  const form = randInt(0, 5);
  if (form === 0) {
    const price = randInt(34, 89);
    const change = 100 - price;
    return numericQuestion(
      `שילמת 100₪ עבור מוצר שעלה ${price}₪. כמה עודף?`,
      change,
      15,
      `100 − ${price} = ${change}₪ עודף.`,
    );
  }
  if (form === 1) {
    const need = randInt(120, 250);
    const have = randInt(40, need - 30);
    const still = need - have;
    return numericQuestion(
      `צעצוע עולה ${need}₪. חסכת ${have}₪. כמה עוד צריך?`,
      still,
      30,
      `${need} − ${have} = ${still}₪.`,
    );
  }
  if (form === 2) {
    // km to m
    const k = randInt(2, 9);
    return numericQuestion(
      `${k} ק״מ = ? מטרים`,
      k * 1000,
      500,
      `1 ק״מ = 1,000 מטר. ${k} × 1,000 = ${k * 1000} מטרים.`,
    );
  }
  if (form === 3) {
    // hours and minutes
    const h = randInt(1, 4);
    const m = randInt(15, 55);
    return numericQuestion(
      `${h} שעות ו-${m} דקות = ? דקות`,
      h * 60 + m,
      40,
      `${h} שעות = ${h * 60} דקות. ${h * 60} + ${m} = ${h * 60 + m} דקות.`,
    );
  }
  if (form === 4) {
    // L to mL
    const l = randInt(2, 7);
    return numericQuestion(
      `${l} ליטר = ? מ״ל`,
      l * 1000,
      500,
      `1 ליטר = 1,000 מ״ל. ${l} × 1,000 = ${l * 1000} מ״ל.`,
    );
  }
  const items = randInt(4, 8);
  const price = pick([12, 15, 18, 25, 35]);
  const total = items * price;
  return numericQuestion(
    `${items} ילדים קנו כרטיס סרט ב-${price}₪ כל אחד. כמה שילמו בסך הכל?`,
    total,
    30,
    `${items} × ${price} = ${total}₪.`,
  );
}

function genMoneyHard(): Question {
  const form = randInt(0, 5);
  if (form === 0) {
    const p1 = randInt(45, 160);
    const p2 = randInt(35, 120);
    const paid = Math.max(p1 + p2 + 50, 250);
    const change = paid - (p1 + p2);
    return numericQuestion(
      `קנית ספר ב-${p1}₪ ומחברת ב-${p2}₪. שילמת ${paid}₪. כמה עודף?`,
      change,
      25,
      `${p1} + ${p2} = ${p1 + p2}. ${paid} − ${p1 + p2} = ${change}₪.`,
    );
  }
  if (form === 1) {
    const price = randInt(80, 250);
    const percent = pick([10, 20, 25, 50]);
    const discount = (price * percent) / 100;
    const final = price - discount;
    return numericQuestion(
      `מוצר עלה ${price}₪ והוצעה הנחה של ${percent}%. כמה עולה אחרי ההנחה?`,
      final,
      30,
      `${percent}% מתוך ${price} = ${discount}. ${price} − ${discount} = ${final}₪.`,
    );
  }
  if (form === 2) {
    const safeKids = pick([4, 6, 8, 12]);
    const safeTotal = safeKids * pick([15, 18, 25, 30]);
    return numericQuestion(
      `${safeKids} חברים חילקו ${safeTotal}₪ בחלוקה שווה. כמה קיבל כל אחד?`,
      safeTotal / safeKids,
      15,
      `${safeTotal} : ${safeKids} = ${safeTotal / safeKids}₪.`,
    );
  }
  if (form === 3) {
    // Decimal price
    const price = +(randInt(150, 350) / 10).toFixed(1);
    const items = randInt(3, 6);
    const total = +(price * items).toFixed(1);
    return numericQuestion(
      `${items} קופסאות חלב ב-${price}₪ כל אחת. כמה שילמת?`,
      total,
      10,
      `${items} × ${price} = ${total}₪.`,
    );
  }
  if (form === 4) {
    // Time conversion: seconds in minutes
    const h = randInt(1, 3);
    return numericQuestion(
      `${h} שעות = ? שניות`,
      h * 3600,
      1500,
      `1 שעה = 3,600 שניות. ${h} × 3,600 = ${h * 3600} שניות.`,
    );
  }
  // Average price (chosen sets to ensure integer averages)
  const triples: Array<[number, number, number]> = [
    [30, 45, 60],
    [25, 40, 55],
    [20, 35, 50],
    [40, 50, 60],
  ];
  const [aSafe, bSafe, cSafe] = pick(triples);
  return numericQuestion(
    `המחיר של 3 חולצות הוא ${aSafe}₪, ${bSafe}₪ ו-${cSafe}₪. מה המחיר הממוצע?`,
    Math.round((aSafe + bSafe + cSafe) / 3),
    10,
    `ממוצע = (${aSafe} + ${bSafe} + ${cSafe}) : 3 = ${aSafe + bSafe + cSafe} : 3 = ${(aSafe + bSafe + cSafe) / 3}₪.`,
  );
}

function genMoney(level: Level): Question {
  if (level === "easy") return genMoneyEasy();
  if (level === "normal") return genMoneyNormal();
  return genMoneyHard();
}

// =====================================================================
// WORD PROBLEMS
// =====================================================================

const NAMES = ["דני", "מיה", "נועה", "יובל", "רוני", "אלה", "יוסי", "ליה", "שוש", "תמר"];

function genWordEasy(): Question {
  const templates: Array<() => Question> = [
    () => {
      const name = pick(NAMES);
      const a = randInt(8, 25);
      const b = randInt(5, 18);
      return numericQuestion(
        `🐒 בגן החיות ${name} ראתה ${a} קופים ו-${b} זברות. כמה חיות בסך הכל?`,
        a + b,
        10,
        `${a} + ${b} = ${a + b}. "בסך הכל" → חיבור.`,
      );
    },
    () => {
      const name = pick(NAMES);
      const a = randInt(15, 40);
      const b = randInt(5, 12);
      return numericQuestion(
        `🐚 ${name} אספה ${a} קונכיות. ${b} מהן נשברו. כמה נשארו שלמות?`,
        a - b,
        10,
        `${a} − ${b} = ${a - b}. "נשברו" → חיסור.`,
      );
    },
    () => {
      const a = randInt(4, 8);
      const b = randInt(4, 9);
      return numericQuestion(
        `🍕 בפיצרייה ${a} שולחנות, ובכל שולחן ${b} ילדים. כמה ילדים בפיצרייה?`,
        a * b,
        10,
        `${a} × ${b} = ${a * b}. "בכל שולחן" → כפל.`,
      );
    },
    () => {
      const total = pick([24, 30, 36, 40, 48]);
      const per = pick([4, 5, 6, 8]);
      const groups = total / per;
      return numericQuestion(
        `🎈 חילקו ${total} בלונים ל-${per} בלונים בכל קבוצה. כמה קבוצות יש?`,
        groups,
        5,
        `${total} : ${per} = ${groups}. "בכל קבוצה" → חילוק.`,
      );
    },
    () => {
      const name = pick(NAMES);
      const a = randInt(20, 50);
      const b = randInt(10, 25);
      return numericQuestion(
        `🎒 ${name} קנתה מחברת ב-${a}₪ ועיפרון ב-${b}₪. כמה שילמה בסך הכל?`,
        a + b,
        10,
        `${a} + ${b} = ${a + b}₪.`,
      );
    },
  ];
  return pick(templates)();
}

function genWordNormal(): Question {
  const templates: Array<() => Question> = [
    () => {
      const name = pick(NAMES);
      const total = randInt(28, 36);
      const girls = randInt(12, total - 12);
      const boys = total - girls;
      const gone = randInt(3, 6);
      return numericQuestion(
        `🏫 בכיתה של ${name} ${total} תלמידים, ${girls} בנות. אחרי ש-${gone} בנים יצאו לחצר, כמה בנים נשארו בכיתה?`,
        boys - gone,
        5,
        `בנים: ${total} − ${girls} = ${boys}. נשארו: ${boys} − ${gone} = ${boys - gone}.`,
      );
    },
    () => {
      const bags = randInt(5, 9);
      const perBag = randInt(8, 12);
      const eaten = randInt(8, 20);
      const left = bags * perBag - eaten;
      const name = pick(NAMES);
      return numericQuestion(
        `🍬 ${name} קנתה ${bags} שקיות סוכריות, ${perBag} בכל אחת. אכלה ${eaten}. כמה נשארו?`,
        left,
        10,
        `סה״כ: ${bags} × ${perBag} = ${bags * perBag}. נשארו: ${bags * perBag} − ${eaten} = ${left}.`,
      );
    },
    () => {
      const pizzas = randInt(3, 5);
      const eaten = randInt(10, 20);
      const left = pizzas * 8 - eaten;
      return numericQuestion(
        `🍕 הזמינו ${pizzas} פיצות. כל פיצה 8 פרוסות. אכלו ${eaten} פרוסות. כמה נשארו?`,
        left,
        8,
        `סה״כ: ${pizzas} × 8 = ${pizzas * 8}. נשארו: ${pizzas * 8} − ${eaten} = ${left}.`,
      );
    },
    () => {
      const name = pick(NAMES);
      const saving = randInt(60, 120);
      const gift = randInt(30, 70);
      const book = randInt(40, 80);
      return numericQuestion(
        `💰 ל-${name} היו ${saving}₪. סבתא נתנה ${gift}₪ נוספים, ואז ${name} קנתה ספר ב-${book}₪. כמה נשאר לה?`,
        saving + gift - book,
        15,
        `${saving} + ${gift} − ${book} = ${saving + gift - book}₪.`,
      );
    },
    () => {
      const trees = pick([6, 8, 12]);
      const apples = pick([8, 12, 15]);
      const total = trees * apples;
      return numericQuestion(
        `🍎 בפרדס ${trees} עצים, מכל עץ קטפו ${apples} תפוחים. כמה תפוחים בסך הכל?`,
        total,
        20,
        `${trees} × ${apples} = ${total}.`,
      );
    },
    () => {
      const total = pick([60, 72, 84, 96, 120]);
      const days = pick([4, 6, 8, 12]);
      const per = total / days;
      const name = pick(NAMES);
      return numericQuestion(
        `📚 ${name} קראה ${total} עמודים ב-${days} ימים שווים. כמה עמודים ביום?`,
        per,
        8,
        `${total} : ${days} = ${per}.`,
      );
    },
  ];
  return pick(templates)();
}

function genWordHard(): Question {
  const templates: Array<() => Question> = [
    () => {
      const factor = pick([3, 4, 5]);
      const small = randInt(8, 15);
      const big = small * factor;
      const name1 = pick(NAMES);
      const name2 = pick(NAMES.filter((n) => n !== name1));
      return numericQuestion(
        `✏️ ל-${name1} יש ${big} עפרונות — פי ${factor} מאשר ל-${name2}. כמה עפרונות ל-${name2}?`,
        small,
        6,
        `"פי ${factor}" אומר ${factor} פעמים יותר. ${big} : ${factor} = ${small}.`,
      );
    },
    () => {
      // Two-step: cost + change
      const items = randInt(3, 6);
      const price = pick([12, 15, 18, 25]);
      const paid = Math.max(items * price + 20, 100);
      const change = paid - items * price;
      return numericQuestion(
        `🛒 קנית ${items} ספרים ב-${price}₪ כל אחד, ושילמת ${paid}₪. כמה עודף קיבלת?`,
        change,
        20,
        `${items} × ${price} = ${items * price}. ${paid} − ${items * price} = ${change}₪.`,
      );
    },
    () => {
      // Distance/speed/time
      const speed = pick([60, 70, 80, 90]);
      const time = pick([2, 3, 4, 5]);
      const dist = speed * time;
      return numericQuestion(
        `🚗 רכב נוסע במהירות ${speed} קמ״ש במשך ${time} שעות. כמה ק״מ עבר?`,
        dist,
        50,
        `מרחק = מהירות × זמן = ${speed} × ${time} = ${dist} ק״מ.`,
      );
    },
    () => {
      // Average
      const a = pick([15, 18, 22]);
      const b = pick([20, 24, 26]);
      const c = pick([25, 28, 30]);
      const avg = Math.round((a + b + c) / 3);
      return numericQuestion(
        `📊 בשלושה מבחנים קיבלתי ציונים: ${a}, ${b}, ${c}. מה הציון הממוצע?`,
        avg,
        5,
        `ממוצע = (${a} + ${b} + ${c}) : 3 = ${a + b + c} : 3 = ${avg}.`,
      );
    },
    () => {
      // Percentage
      const total = pick([60, 80, 100, 120, 200]);
      const percent = pick([10, 20, 25, 50]);
      const result = (total * percent) / 100;
      return numericQuestion(
        `💯 ${percent}% מתוך ${total} =?`,
        result,
        15,
        `${percent}% של ${total} = ${total} × ${percent} : 100 = ${result}.`,
      );
    },
    () => {
      // Compound multiplication problem
      const trees = pick([8, 10, 12]);
      const apples = pick([15, 18, 20]);
      const sold = pick([60, 80, 100]);
      const total = trees * apples;
      const left = total - sold;
      return numericQuestion(
        `🍎 בפרדס ${trees} עצים, מכל עץ ${apples} תפוחים. מכרו ${sold} תפוחים. כמה נשארו?`,
        left,
        30,
        `סה״כ: ${trees} × ${apples} = ${total}. נשארו: ${total} − ${sold} = ${left}.`,
      );
    },
    () => {
      // Reverse division
      const total = pick([84, 96, 108, 120]);
      const days = pick([6, 8, 12]);
      const per = total / days;
      const name = pick(NAMES);
      return numericQuestion(
        `📖 ${name} צריכה לקרוא ${total} עמודים ב-${days} ימים. כמה עמודים תקרא בכל יום?`,
        per,
        8,
        `${total} : ${days} = ${per}.`,
      );
    },
  ];
  return pick(templates)();
}

function genWord(level: Level): Question {
  if (level === "easy") return genWordEasy();
  if (level === "normal") return genWordNormal();
  return genWordHard();
}

// =====================================================================
// PUBLIC API
// =====================================================================

export function generateQuestion(topic: Topic, level: Level): Question {
  switch (topic) {
    case "mul":
      return genMul(level);
    case "add-sub":
      return genAddSub(level);
    case "div":
      return genDiv(level);
    case "frac":
      return genFrac(level);
    case "geo":
      return genGeo(level);
    case "money":
      return genMoney(level);
    case "word":
      return genWord(level);
    default:
      return genMul(level);
  }
}

export function generateQuestions(
  topic: Topic,
  level: Level,
  count: number,
): Question[] {
  const seen = new Set<string>();
  const out: Question[] = [];
  let guard = 0;
  while (out.length < count && guard < 600) {
    guard++;
    const q = generateQuestion(topic, level);
    const key = `${q.question}|${q.correctAnswer}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(q);
  }
  while (out.length < count) {
    out.push(generateQuestion(topic, level));
  }
  return out;
}

export function isTopic(v: string | null): v is Topic {
  return (
    v === "add-sub" ||
    v === "mul" ||
    v === "div" ||
    v === "frac" ||
    v === "geo" ||
    v === "money" ||
    v === "word"
  );
}

export function isLevel(v: string | null): v is Level {
  return v === "easy" || v === "normal" || v === "hard";
}
