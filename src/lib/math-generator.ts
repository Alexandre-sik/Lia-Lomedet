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
      shape: "triangle" | "square" | "rectangle" | "circle";
    }
  | {
      kind: "triangle-type";
      type: "equilateral" | "isosceles" | "scalene";
    }
  | { kind: "angle-type"; type: "acute" | "right" | "obtuse" };

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

function genMul(level: Level): Question {
  if (level === "easy") {
    const a = randInt(2, 5);
    const b = randInt(2, 5);
    const c = a * b;
    return numericQuestion(
      `${a} × ${b} = ?`,
      c,
      6,
      `${a} × ${b} = ${c}. חושבים על זה כ-${a} פעמים ${b}.`,
    );
  }
  if (level === "normal") {
    const a = randInt(2, 9);
    const b = randInt(2, 9);
    const c = a * b;
    return numericQuestion(
      `${a} × ${b} = ?`,
      c,
      10,
      `${a} × ${b} = ${c}`,
    );
  }
  const form = randInt(0, 2);
  if (form === 0) {
    const a = randInt(3, 9);
    const b = randInt(3, 9);
    const prod = a * b;
    const N = prod + randInt(10, 40);
    const c = N - prod;
    return numericQuestion(
      `${N} − ${a} × ${b} = ?`,
      c,
      12,
      `קודם כפל: ${a} × ${b} = ${prod}. אחר כך ${N} − ${prod} = ${c}.`,
    );
  }
  if (form === 1) {
    const a = randInt(2, 9);
    const b = randInt(2, 9);
    const prod = a * b;
    const N = randInt(3, 25);
    const c = N + prod;
    return numericQuestion(
      `${N} + ${a} × ${b} = ?`,
      c,
      12,
      `קודם כפל: ${a} × ${b} = ${prod}. אחר כך ${N} + ${prod} = ${c}.`,
    );
  }
  const a = randInt(2, 12);
  const b = randInt(2, 10);
  const c = a * b;
  return numericQuestion(`${a} × ${b} = ?`, c, 15, `${a} × ${b} = ${c}`);
}

function noCarryAdd(digits: number): [number, number] {
  let a = 0;
  let b = 0;
  for (let i = 0; i < digits; i++) {
    const leading = i === 0;
    const aDigit = randInt(leading ? 1 : 0, 4);
    const bDigit = randInt(0, Math.max(0, 9 - aDigit - 1));
    a = a * 10 + aDigit;
    b = b * 10 + bDigit;
  }
  return [a, b];
}

function genAddSub(level: Level): Question {
  const op = Math.random() < 0.5 ? "+" : "−";
  if (level === "easy") {
    const [a, b] = noCarryAdd(2);
    if (op === "+") {
      const c = a + b;
      return numericQuestion(
        `${a} + ${b} = ?`,
        c,
        8,
        `${a} + ${b} = ${c}. מחברים יחידות ואז עשרות.`,
      );
    }
    const big = Math.max(a, b);
    const small = Math.min(a, b);
    const c = big - small;
    return numericQuestion(
      `${big} − ${small} = ?`,
      c,
      8,
      `${big} − ${small} = ${c}. מחסרים יחידות ואז עשרות.`,
    );
  }
  if (level === "normal") {
    const a = randInt(150, 950);
    const b = randInt(50, 900);
    if (op === "+") {
      const c = a + b;
      return numericQuestion(
        `${a} + ${b} = ?`,
        c,
        30,
        `שימי לב להחזר: ${a} + ${b} = ${c}.`,
      );
    }
    const big = Math.max(a, b);
    const small = Math.min(a, b);
    const c = big - small;
    return numericQuestion(
      `${big} − ${small} = ?`,
      c,
      30,
      `שימי לב לשאילה: ${big} − ${small} = ${c}.`,
    );
  }
  const a = randInt(2000, 9000);
  const b = randInt(200, a - 100);
  if (op === "+") {
    const c = a + b;
    return numericQuestion(
      `${a} + ${b} = ?`,
      c,
      80,
      `מחברים בטור מהיחידות לאלפים: ${a} + ${b} = ${c}.`,
    );
  }
  const c = a - b;
  return numericQuestion(
    `${a} − ${b} = ?`,
    c,
    80,
    `מחסרים בטור מהיחידות: ${a} − ${b} = ${c}.`,
  );
}

function genDiv(level: Level): Question {
  if (level === "easy") {
    const divisor = randInt(2, 5);
    const result = randInt(2, 10);
    const dividend = divisor * result;
    return numericQuestion(
      `${dividend} : ${divisor} = ?`,
      result,
      4,
      `${divisor} × ${result} = ${dividend}, אז ${dividend} : ${divisor} = ${result}.`,
    );
  }
  if (level === "normal") {
    const divisor = randInt(2, 9);
    const result = randInt(3, 9);
    const dividend = divisor * result;
    return numericQuestion(
      `${dividend} : ${divisor} = ?`,
      result,
      4,
      `${divisor} × ${result} = ${dividend}, אז ${dividend} : ${divisor} = ${result}.`,
    );
  }
  const divisor = randInt(3, 12);
  const result = randInt(3, 9);
  const dividend = divisor * result;
  return numericQuestion(
    `${dividend} : __ = ${result}`,
    divisor,
    4,
    `אם ${dividend} : x = ${result}, אז x = ${dividend} : ${result} = ${divisor}.`,
  );
}

function fractionVisualEasy(): Question {
  const choices: Array<[number, number]> = [
    [1, 2],
    [1, 3],
    [1, 4],
    [2, 3],
    [2, 4],
    [3, 4],
    [2, 5],
    [3, 5],
    [1, 6],
    [5, 6],
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
    explanation: `בצורה יש ${den} חלקים שווים, ${num} מהם צבועים — לכן השבר הוא ${correct}.`,
    visual: { kind: "fraction", num, den },
  };
}

function fractionCompareNormal(): Question {
  const den = pick([4, 5, 6, 8]);
  let a = randInt(1, den - 1);
  let b = randInt(1, den - 1);
  while (a === b) b = randInt(1, den - 1);
  const bigger = a > b ? `${a}/${den}` : `${b}/${den}`;
  return {
    question: "איזה שבר גדול יותר?",
    correctAnswer: bigger,
    options: shuffle([`${a}/${den}`, `${b}/${den}`, "שווים", "לא ניתן להשוות"]),
    explanation:
      "באותו מכנה, השבר עם המונה הגדול יותר גדול יותר. תסתכלי על הצורות!",
    visual: { kind: "compare-frac", a: [a, den], b: [b, den] },
  };
}

function genFrac(level: Level): Question {
  if (level === "easy") {
    const roll = Math.random();
    if (roll < 0.6) return fractionVisualEasy();
    const textOptions = [
      () =>
        numericQuestion(
          "חצי מ-10 זה?",
          5,
          3,
          "חצי זה 1 חלקי 2. 10 : 2 = 5.",
        ),
      () =>
        numericQuestion("רבע מ-8 זה?", 2, 3, "רבע זה 1 חלקי 4. 8 : 4 = 2."),
      () =>
        numericQuestion(
          "שליש מ-9 זה?",
          3,
          3,
          "שליש זה 1 חלקי 3. 9 : 3 = 3.",
        ),
    ];
    return pick(textOptions)();
  }
  if (level === "normal") {
    const roll = Math.random();
    if (roll < 0.6) return fractionCompareNormal();
    const opts = [
      () =>
        textQuestion(
          "איזה שבר שווה ל-1/2?",
          "2/4",
          ["2/3", "1/3", "3/5"],
          "1/2 = 2/4 = 3/6 — אלה שברים שווי-ערך.",
        ),
      () => numericQuestion("חצי מ-20 זה?", 10, 4, "20 : 2 = 10."),
      () => numericQuestion("שליש מ-18 זה?", 6, 4, "18 : 3 = 6."),
    ];
    return pick(opts)();
  }
  const a = randInt(1, 4);
  const b = randInt(1, 5 - a);
  const den = randInt(6, 10);
  const sum = a + b;
  return textQuestion(
    `${a}/${den} + ${b}/${den} = ?`,
    `${sum}/${den}`,
    [`${sum}/${den * 2}`, `${a * b}/${den}`, `${sum + 1}/${den}`],
    `באותו מכנה — מחברים את המונים: ${a} + ${b} = ${sum}. התוצאה: ${sum}/${den}.`,
    { kind: "compare-frac", a: [a, den], b: [b, den] },
  );
}

function genGeoEasy(): Question {
  const shapes: Array<{
    s: "triangle" | "square" | "rectangle" | "circle";
    name: string;
    why: string;
  }> = [
    {
      s: "triangle",
      name: "משולש",
      why: "3 צלעות ו-3 זוויות — זה משולש.",
    },
    {
      s: "square",
      name: "ריבוע",
      why: "4 צלעות שוות וכל הזוויות ישרות — זה ריבוע.",
    },
    {
      s: "rectangle",
      name: "מלבן",
      why: "4 צלעות, זוגות של צלעות שוות, כל הזוויות ישרות — זה מלבן.",
    },
    {
      s: "circle",
      name: "עיגול",
      why: "צורה עגולה בלי צלעות — זה עיגול.",
    },
  ];
  const picked = pick(shapes);
  const distractors = shapes
    .filter((s) => s.name !== picked.name)
    .map((s) => s.name);
  return {
    question: "איך נקראת הצורה הזאת?",
    correctAnswer: picked.name,
    options: shuffle([picked.name, ...shuffle(distractors).slice(0, 3)]),
    explanation: picked.why,
    visual: { kind: "shape", shape: picked.s },
  };
}

function genGeoNormal(): Question {
  const types: Array<{
    t: "equilateral" | "isosceles" | "scalene";
    name: string;
    why: string;
  }> = [
    {
      t: "equilateral",
      name: "שווה-צלעות",
      why: "כל 3 הצלעות באותו אורך (שימי לב לסימני הזהוּת).",
    },
    {
      t: "isosceles",
      name: "שווה-שוקיים",
      why: "שתי צלעות שוות ואחת שונה — זה שווה-שוקיים.",
    },
    {
      t: "scalene",
      name: "שונה-צלעות",
      why: "כל שלוש הצלעות באורך שונה.",
    },
  ];
  const picked = pick(types);
  const distractors = types
    .filter((x) => x.name !== picked.name)
    .map((x) => x.name);
  return {
    question: "איזה סוג משולש זה?",
    correctAnswer: picked.name,
    options: shuffle([picked.name, ...distractors, "ישר-זווית"]),
    explanation: picked.why,
    visual: { kind: "triangle-type", type: picked.t },
  };
}

function genGeoHard(): Question {
  const types: Array<{
    t: "acute" | "right" | "obtuse";
    name: string;
    why: string;
  }> = [
    {
      t: "acute",
      name: "חדה",
      why: "הזווית קטנה מ-90° — זו זווית חדה.",
    },
    {
      t: "right",
      name: "ישרה",
      why: "הזווית היא בדיוק 90° (שימי לב לריבוע הקטן) — זווית ישרה.",
    },
    {
      t: "obtuse",
      name: "קהה",
      why: "הזווית גדולה מ-90° וקטנה מ-180° — זווית קהה.",
    },
  ];
  const picked = pick(types);
  const distractors = types
    .filter((x) => x.name !== picked.name)
    .map((x) => x.name);
  return {
    question: "איזה סוג זווית זו?",
    correctAnswer: picked.name,
    options: shuffle([picked.name, ...distractors, "שטוחה"]),
    explanation: picked.why,
    visual: { kind: "angle-type", type: picked.t },
  };
}

function genGeo(level: Level): Question {
  if (level === "easy") return genGeoEasy();
  if (level === "normal") return genGeoNormal();
  return genGeoHard();
}

function genMoney(level: Level): Question {
  if (level === "easy") {
    const coins10 = randInt(1, 6);
    const coins5 = randInt(0, 5);
    const sum = coins10 * 10 + coins5 * 5;
    return numericQuestion(
      `${coins10} מטבעות של 10₪ ו-${coins5} מטבעות של 5₪ — כמה יש בסך הכל?`,
      sum,
      9,
      `${coins10} × 10 + ${coins5} × 5 = ${coins10 * 10} + ${coins5 * 5} = ${sum} שקלים.`,
    );
  }
  if (level === "normal") {
    const price = randInt(23, 89);
    const change = 100 - price;
    return numericQuestion(
      `שילמת 100₪ עבור מוצר שעלה ${price}₪. כמה עודף מגיע לך?`,
      change,
      12,
      `100 − ${price} = ${change}₪ עודף.`,
    );
  }
  const p1 = randInt(45, 160);
  const p2 = randInt(35, 120);
  const paid = Math.max(p1 + p2 + 20, 200);
  const change = paid - (p1 + p2);
  return numericQuestion(
    `קנית ספר ב-${p1}₪ ומחברת ב-${p2}₪. שילמת ${paid}₪. כמה עודף?`,
    change,
    25,
    `סכום הקניות: ${p1} + ${p2} = ${p1 + p2}. עודף: ${paid} − ${p1 + p2} = ${change}₪.`,
  );
}

const NAMES = ["דני", "מיה", "נועה", "יובל", "רוני", "אלה", "יוסי", "ליה", "שוש"];

function genWordEasy(): Question {
  const templates: Array<() => Question> = [
    () => {
      const name = pick(NAMES);
      const a = randInt(4, 9);
      const b = randInt(2, 7);
      return numericQuestion(
        `🐒 בגן החיות ${name} ראתה ${a} קופים ו-${b} זברות. כמה חיות ראתה בסך הכל?`,
        a + b,
        5,
        `${a} + ${b} = ${a + b}. "בסך הכל" → חיבור.`,
      );
    },
    () => {
      const a = randInt(5, 12);
      const b = randInt(3, 8);
      return numericQuestion(
        `🎈 בחגיגה של יום העצמאות היו ${a} בלונים כחולים ו-${b} לבנים. כמה בלונים היו?`,
        a + b,
        6,
        `${a} + ${b} = ${a + b}. "היו... ועוד" → חיבור.`,
      );
    },
    () => {
      const name = pick(NAMES);
      const a = randInt(8, 18);
      const b = randInt(3, 7);
      return numericQuestion(
        `🐚 בחוף ${name} אספה ${a} קונכיות. ${b} מהן נשברו בדרך הביתה. כמה נשארו שלמות?`,
        a - b,
        5,
        `${a} − ${b} = ${a - b}. "נשברו" → חיסור.`,
      );
    },
    () => {
      const a = randInt(3, 6);
      const b = randInt(3, 6);
      return numericQuestion(
        `🍕 בפיצרייה ${a} שולחנות, ובכל שולחן יושבים ${b} ילדים. כמה ילדים יש בפיצרייה?`,
        a * b,
        6,
        `${a} × ${b} = ${a * b}. "בכל שולחן" → כפל.`,
      );
    },
    () => {
      const name = pick(NAMES);
      const a = randInt(10, 20);
      const b = randInt(4, 9);
      return numericQuestion(
        `🍪 ${name} אפתה ${a} עוגיות לחברים. ${b} נאכלו מיד. כמה נשארו?`,
        a - b,
        5,
        `${a} − ${b} = ${a - b}. "נאכלו" → חיסור.`,
      );
    },
    () => {
      const name = pick(NAMES);
      const a = randInt(6, 15);
      const b = randInt(4, 10);
      return numericQuestion(
        `🚌 באוטובוס של ${name} היו ${a} נוסעים. בתחנה נוספו עוד ${b}. כמה נוסעים באוטובוס?`,
        a + b,
        5,
        `${a} + ${b} = ${a + b}. "נוספו" → חיבור.`,
      );
    },
    () => {
      const a = randInt(3, 5);
      const b = randInt(4, 8);
      return numericQuestion(
        `🎒 בחנות יש ${a} קופסאות עפרונות, בכל קופסה ${b} עפרונות. כמה עפרונות בחנות?`,
        a * b,
        6,
        `${a} × ${b} = ${a * b}. קבוצות שוות → כפל.`,
      );
    },
    () => {
      const name = pick(NAMES);
      const a = randInt(12, 20);
      const b = randInt(3, 8);
      return numericQuestion(
        `🐟 באקווריום של ${name} היו ${a} דגים. היא נתנה ${b} לחברה שלה. כמה נשארו?`,
        a - b,
        5,
        `${a} − ${b} = ${a - b}. "נתנה" → חיסור.`,
      );
    },
    () => {
      const a = randInt(6, 14);
      const b = randInt(3, 10);
      return numericQuestion(
        `🦋 בגינה ראיתי ${a} פרפרים ו-${b} דבורים. כמה חרקים ראיתי?`,
        a + b,
        6,
        `${a} + ${b} = ${a + b}. "כמה... ועוד" → חיבור.`,
      );
    },
    () => {
      const a = randInt(2, 5);
      const b = randInt(5, 10);
      return numericQuestion(
        `🎨 ${pick(NAMES)} ציירה ${a} שורות פרחים. בכל שורה ${b} פרחים. כמה פרחים ציירה?`,
        a * b,
        6,
        `${a} × ${b} = ${a * b}. שורות שוות → כפל.`,
      );
    },
  ];
  return pick(templates)();
}

function genWordNormal(): Question {
  const templates: Array<() => Question> = [
    () => {
      const name = pick(NAMES);
      const total = randInt(22, 32);
      const girls = randInt(10, total - 10);
      const boys = total - girls;
      const gone = randInt(2, 5);
      const left = boys - gone;
      return numericQuestion(
        `🏫 בכיתה ג' של ${name} יש ${total} תלמידים, ${girls} בנות. אחרי ש-${gone} בנים יצאו לחצר, כמה בנים נשארו?`,
        left,
        4,
        `בנים: ${total} − ${girls} = ${boys}. נשארו: ${boys} − ${gone} = ${left}.`,
      );
    },
    () => {
      const bags = randInt(4, 8);
      const perBag = randInt(5, 9);
      const eaten = randInt(4, 10);
      const left = bags * perBag - eaten;
      const name = pick(NAMES);
      return numericQuestion(
        `🍬 ${name} קנתה ${bags} שקיות סוכריות, ${perBag} סוכריות בכל אחת. אכלה ${eaten}. כמה נשארו?`,
        left,
        6,
        `סה״כ: ${bags} × ${perBag} = ${bags * perBag}. נשארו: ${bags * perBag} − ${eaten} = ${left}.`,
      );
    },
    () => {
      const pizzas = randInt(2, 4);
      const eaten = randInt(6, 15);
      const left = pizzas * 8 - eaten;
      return numericQuestion(
        `🍕 אבא הזמין ${pizzas} פיצות. כל פיצה מחולקת ל-8 פרוסות. המשפחה אכלה ${eaten} פרוסות. כמה נשארו?`,
        left,
        5,
        `סה״כ פרוסות: ${pizzas} × 8 = ${pizzas * 8}. נשארו: ${pizzas * 8} − ${eaten} = ${left}.`,
      );
    },
    () => {
      const saving = randInt(40, 80);
      const gift = randInt(20, 50);
      const book = randInt(15, 40);
      const name = pick(NAMES);
      return numericQuestion(
        `💰 ל-${name} היו ${saving}₪ בחסכון. סבתא נתנה לה עוד ${gift}₪, ואז ${name} קנתה ספר ב-${book}₪. כמה כסף נשאר לה?`,
        saving + gift - book,
        8,
        `${saving} + ${gift} − ${book} = ${saving + gift - book}₪.`,
      );
    },
    () => {
      const name = pick(NAMES);
      const fish = randInt(12, 20);
      const per = randInt(2, 3);
      const returned = randInt(5, 10);
      const kept = fish * per - returned;
      return numericQuestion(
        `🎣 בדיג בכנרת ${name} וחברים תפסו ${fish} דגים, כל דג שוקל בערך ${per} ק"ג. הם החזירו למים ${returned} ק"ג. כמה ק"ג הם לקחו הביתה?`,
        kept,
        8,
        `משקל כולל: ${fish} × ${per} = ${fish * per} ק״ג. לקחו: ${fish * per} − ${returned} = ${kept} ק״ג.`,
      );
    },
    () => {
      const rows = randInt(4, 7);
      const per = randInt(4, 8);
      const empty = randInt(3, 8);
      const filled = rows * per - empty;
      return numericQuestion(
        `🎪 באולם יש ${rows} שורות של ${per} כיסאות. בהצגה ${empty} כיסאות נשארו ריקים. כמה ילדים ישבו?`,
        filled,
        8,
        `כיסאות סה״כ: ${rows} × ${per} = ${rows * per}. ישבו: ${rows * per} − ${empty} = ${filled}.`,
      );
    },
    () => {
      const buckets = randInt(3, 6);
      const per = randInt(4, 8);
      const extra = randInt(3, 7);
      const total = buckets * per + extra;
      return numericQuestion(
        `🏖️ בחוף בנו מגדלים מחול. ${buckets} ילדים מילאו דלי אחד כל אחד עם ${per} כוסות חול, ועוד ${extra} כוסות נוספו בסוף. כמה כוסות חול בסך הכל?`,
        total,
        8,
        `${buckets} × ${per} + ${extra} = ${buckets * per} + ${extra} = ${total}.`,
      );
    },
  ];
  return pick(templates)();
}

function genWordHard(): Question {
  const templates: Array<() => Question> = [
    () => {
      const groups = pick([4, 6, 8]);
      const per = randInt(4, 9);
      const total = groups * per;
      return numericQuestion(
        `🎈 בפסטיבל חילקו ${total} בלונים שווה בשווה ל-${groups} ילדים. כמה בלונים קיבל כל ילד?`,
        per,
        6,
        `${total} : ${groups} = ${per}. "שווה בשווה" → חילוק.`,
      );
    },
    () => {
      const groups = pick([3, 4, 6]);
      const per = randInt(4, 8);
      const total = groups * per;
      return numericQuestion(
        `🎼 בתזמורת של בית הספר ${total} ילדים, מחולקים ל-${groups} כלים שונים (חליל, כינור, תוף). כמה ילדים בכל כלי?`,
        per,
        6,
        `${total} : ${groups} = ${per}. קבוצות שוות → חילוק.`,
      );
    },
    () => {
      const name = pick(NAMES);
      const pages = pick([60, 72, 84, 96]);
      const perDay = pick([6, 8, 12]);
      const days = pages / perDay;
      return numericQuestion(
        `📚 ${name} קראה ספר של ${pages} עמודים, ${perDay} עמודים כל יום. כמה ימים לקח לה לגמור?`,
        days,
        5,
        `${pages} : ${perDay} = ${days}. כמה קבוצות של ${perDay} יש ב-${pages}? → חילוק.`,
      );
    },
    () => {
      const kids = randInt(4, 7);
      const balloons = randInt(4, 8);
      const total = kids * balloons;
      return numericQuestion(
        `🎂 ב-${kids} ימי הולדת חילקו ${total} בלונים שווה בשווה. כמה בלונים היו בכל יום הולדת?`,
        balloons,
        6,
        `${total} : ${kids} = ${balloons}. חילוק שווה בשווה.`,
      );
    },
    () => {
      const small = randInt(4, 8);
      const factor = pick([3, 4, 5]);
      const big = small * factor;
      const name1 = pick(NAMES);
      const name2 = pick(NAMES.filter((n) => n !== name1));
      return numericQuestion(
        `✏️ בקלמר של ${name1} יש ${big} עפרונות — פי ${factor} מאשר בקלמר של ${name2}. כמה עפרונות יש ל-${name2}?`,
        small,
        5,
        `"פי ${factor}" אומר שיש ${factor} פעמים יותר. אז ${big} : ${factor} = ${small}.`,
      );
    },
    () => {
      const trees = randInt(5, 9);
      const apples = pick([6, 8, 10]);
      const total = trees * apples;
      return numericQuestion(
        `🍎 בפרדס ${trees} עצי תפוחים. מכל עץ קטפו ${apples} תפוחים. כמה תפוחים קטפו בסך הכל?`,
        total,
        12,
        `${trees} × ${apples} = ${total}. "מכל עץ" → כפל.`,
      );
    },
    () => {
      const kids = pick([6, 7, 8]);
      const each = randInt(3, 6);
      const total = kids * each;
      return numericQuestion(
        `🎟️ בקולנוע ${kids} חברים קנו כרטיסים, כל אחד שילם ${each}0₪. כמה שילמו סה״כ?`,
        total * 10,
        30,
        `כל אחד שילם ${each}0₪. ${kids} × ${each}0 = ${total * 10}₪.`,
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
  return Array.from({ length: count }, () => generateQuestion(topic, level));
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
