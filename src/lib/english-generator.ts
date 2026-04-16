import { pickWord, pickWordsNotEqual, WORDS, type Word } from "./english-vocabulary";

export type EnLevel = "easy" | "normal" | "hard";
export type EnTopic =
  | "letters"
  | "vocab"
  | "reading"
  | "writing"
  | "speaking"
  | "grammar"
  | "songs";

export type EnQuestion = {
  question: string;
  prompt?: string;
  promptEmoji?: string;
  audio?: string;
  direction?: "ltr" | "rtl" | "auto";
  correctAnswer: string;
  options: string[];
  explanation: string;
};

export const EN_TOPIC_LABELS: Record<EnTopic, string> = {
  letters: "אותיות וצלילים",
  vocab: "אוצר מילים",
  reading: "קריאה",
  writing: "כתיבה",
  speaking: "דיבור והאזנה",
  grammar: "דקדוק בסיסי",
  songs: "שירים וחרוזים",
};

export const EN_LEVEL_LABELS: Record<EnLevel, string> = {
  easy: "קל",
  normal: "רגיל",
  hard: "מאתגר",
};

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

function vocabQuestionEmojiToEn(w: Word): EnQuestion {
  const distractors = pickWordsNotEqual(w, 3).map((x) => x.en);
  return {
    question: "איך אומרים את זה באנגלית?",
    promptEmoji: w.emoji,
    audio: w.en,
    direction: "ltr",
    correctAnswer: w.en,
    options: shuffle([w.en, ...distractors]),
    explanation: `${w.emoji ?? ""} = "${w.en}" (${w.he})`,
  };
}

function vocabQuestionHeToEn(w: Word): EnQuestion {
  const distractors = pickWordsNotEqual(w, 3).map((x) => x.en);
  return {
    question: "מה הפירוש באנגלית?",
    prompt: w.he,
    audio: w.en,
    direction: "ltr",
    correctAnswer: w.en,
    options: shuffle([w.en, ...distractors]),
    explanation: `"${w.he}" באנגלית זה "${w.en}".`,
  };
}

function vocabQuestionEnToHe(w: Word): EnQuestion {
  const distractors = pickWordsNotEqual(w, 3).map((x) => x.he);
  return {
    question: "מה הפירוש בעברית?",
    prompt: w.en,
    audio: w.en,
    direction: "rtl",
    correctAnswer: w.he,
    options: shuffle([w.he, ...distractors]),
    explanation: `"${w.en}" בעברית זה "${w.he}".`,
  };
}

function genVocab(level: EnLevel): EnQuestion {
  const w = pickWord();
  if (level === "easy") {
    if (w.emoji) return vocabQuestionEmojiToEn(w);
    return vocabQuestionHeToEn(w);
  }
  if (level === "normal") return vocabQuestionHeToEn(w);
  return vocabQuestionEnToHe(w);
}

function genLetters(level: EnLevel): EnQuestion {
  const w = pickWord();
  if (level === "easy") {
    const first = w.en.charAt(0).toUpperCase();
    const all = ["A", "B", "C", "D", "E", "F", "G", "H", "M", "P", "S", "T", "L", "R"];
    const distractors = shuffle(all.filter((l) => l !== first)).slice(0, 3);
    return {
      question: "באיזו אות מתחילה המילה?",
      prompt: `${w.emoji ?? ""} ${w.en}`,
      audio: w.en,
      direction: "ltr",
      correctAnswer: first,
      options: shuffle([first, ...distractors]),
      explanation: `"${w.en}" מתחילה באות ${first}.`,
    };
  }
  if (level === "normal") {
    const last = w.en.charAt(w.en.length - 1).toUpperCase();
    const all = ["A", "E", "G", "L", "N", "O", "R", "S", "T", "Y", "K", "M", "P", "D"];
    const distractors = shuffle(all.filter((l) => l !== last)).slice(0, 3);
    return {
      question: "באיזו אות מסתיימת המילה?",
      prompt: w.en,
      audio: w.en,
      direction: "ltr",
      correctAnswer: last,
      options: shuffle([last, ...distractors]),
      explanation: `"${w.en}" נגמרת באות ${last}.`,
    };
  }
  const short = WORDS.filter((x) => x.en.length <= 6 && !x.en.includes(" "));
  const target = pick(short);
  const idx = Math.floor(target.en.length / 2);
  const missing = target.en.charAt(idx);
  const masked = target.en.substring(0, idx) + "_" + target.en.substring(idx + 1);
  const pool = ["a", "e", "i", "o", "u", "r", "s", "t", "n"];
  const distractors = shuffle(pool.filter((l) => l !== missing)).slice(0, 3);
  return {
    question: "איזו אות חסרה?",
    prompt: masked,
    audio: target.en,
    direction: "ltr",
    correctAnswer: missing,
    options: shuffle([missing, ...distractors]),
    explanation: `המילה המלאה היא "${target.en}" — האות החסרה היא "${missing}".`,
  };
}

function genWriting(level: EnLevel): EnQuestion {
  const w = pickWord();
  if (level === "easy") {
    const short = WORDS.filter((x) => x.en.length <= 5 && !x.en.includes(" "));
    const target = pick(short);
    const scrambled = shuffle(target.en.split("")).join("");
    const wrongs = pickWordsNotEqual(target, 3).map((x) => x.en);
    return {
      question: "איזו מילה נכונה?",
      prompt: `האותיות: ${scrambled}`,
      audio: target.en,
      direction: "ltr",
      correctAnswer: target.en,
      options: shuffle([target.en, ...wrongs]),
      explanation: `סידור נכון: "${target.en}" (${target.he}).`,
    };
  }
  if (level === "normal") {
    const short = WORDS.filter((x) => x.en.length <= 6 && !x.en.includes(" "));
    const target = pick(short);
    const idx = target.en.length - 1;
    const missing = target.en.charAt(idx);
    const masked = target.en.substring(0, idx) + "_";
    const letters = ["a", "e", "i", "o", "u", "t", "g", "n", "s", "r", "d", "y"];
    const distractors = shuffle(letters.filter((l) => l !== missing)).slice(0, 3);
    return {
      question: "איזו אות חסרה בסוף המילה?",
      prompt: masked,
      audio: target.en,
      direction: "ltr",
      correctAnswer: missing,
      options: shuffle([missing, ...distractors]),
      explanation: `המילה המלאה: "${target.en}".`,
    };
  }
  const target = pickWord();
  const correct = target.en;
  const misspelled: string[] = [];
  const vowelMap: Record<string, string> = { a: "e", e: "a", i: "y", o: "u", u: "o" };
  let swapped = "";
  for (const c of correct) {
    swapped += vowelMap[c] ?? c;
  }
  if (swapped !== correct) misspelled.push(swapped);
  if (correct.length > 2) {
    misspelled.push(correct.slice(0, -1) + "x");
    misspelled.push(correct.charAt(0) + correct.slice(1).split("").reverse().join(""));
  }
  const distractors = shuffle(misspelled.filter((x) => x !== correct)).slice(0, 3);
  while (distractors.length < 3) {
    distractors.push(correct + "s".repeat(distractors.length + 1));
  }
  return {
    question: "איזו מילה מאויתת נכון?",
    prompt: `${target.emoji ?? ""} (${target.he})`,
    audio: correct,
    direction: "ltr",
    correctAnswer: correct,
    options: shuffle([correct, ...distractors]),
    explanation: `האיות הנכון: "${correct}".`,
  };
}

function genSpeaking(level: EnLevel): EnQuestion {
  const w = pickWord();
  const distractors = pickWordsNotEqual(w, 3).map((x) => x.en);
  const base: EnQuestion = {
    question: "🎧 האזיני וסמני את המילה הנכונה",
    audio: w.en,
    direction: "ltr",
    correctAnswer: w.en,
    options: shuffle([w.en, ...distractors]),
    explanation: `המילה שנאמרה: "${w.en}" (${w.he}).`,
  };
  if (level === "easy") return { ...base, promptEmoji: "🔊" };
  if (level === "normal") return base;
  const distractorsH = pickWordsNotEqual(w, 3).map((x) => x.he);
  return {
    question: "🎧 האזיני ובחרי את הפירוש בעברית",
    audio: w.en,
    direction: "rtl",
    correctAnswer: w.he,
    options: shuffle([w.he, ...distractorsH]),
    explanation: `"${w.en}" בעברית זה "${w.he}".`,
  };
}

function genReading(level: EnLevel): EnQuestion {
  if (level === "easy") {
    const w = pickWord();
    const distractors = pickWordsNotEqual(w, 3).map((x) => x.en);
    return {
      question: "איזו מילה מתאימה לתמונה?",
      promptEmoji: w.emoji,
      audio: w.en,
      direction: "ltr",
      correctAnswer: w.en,
      options: shuffle([w.en, ...distractors]),
      explanation: `${w.emoji ?? ""} = "${w.en}".`,
    };
  }
  if (level === "normal") {
    const templates: Array<() => EnQuestion> = [
      () => {
        const animal = pick(WORDS.filter((w) => w.category === "animals"));
        return {
          question: "קראי את המשפט ותעני:",
          prompt: `The ${animal.en} is big. What animal?`,
          audio: `The ${animal.en} is big.`,
          direction: "ltr",
          correctAnswer: animal.en,
          options: shuffle([
            animal.en,
            ...pickWordsNotEqual(animal, 3).map((x) => x.en),
          ]),
          explanation: `המשפט מדבר על "${animal.en}" (${animal.he}).`,
        };
      },
      () => {
        const food = pick(WORDS.filter((w) => w.category === "food"));
        return {
          question: "קראי את המשפט ותעני:",
          prompt: `I like to eat ${food.en}. What food?`,
          audio: `I like to eat ${food.en}.`,
          direction: "ltr",
          correctAnswer: food.en,
          options: shuffle([
            food.en,
            ...pickWordsNotEqual(food, 3).map((x) => x.en),
          ]),
          explanation: `המשפט מדבר על "${food.en}" (${food.he}).`,
        };
      },
      () => {
        const color = pick(WORDS.filter((w) => w.category === "colors"));
        return {
          question: "קראי את המשפט ותעני:",
          prompt: `My shirt is ${color.en}. What color?`,
          audio: `My shirt is ${color.en}.`,
          direction: "ltr",
          correctAnswer: color.en,
          options: shuffle([
            color.en,
            ...pickWordsNotEqual(color, 3).map((x) => x.en),
          ]),
          explanation: `הצבע של החולצה: "${color.en}" (${color.he}).`,
        };
      },
    ];
    return pick(templates)();
  }
  const templates: Array<() => EnQuestion> = [
    () => ({
      question: "קראי וענה: איפה החתול?",
      prompt: "The cat is on the table.",
      audio: "The cat is on the table.",
      direction: "ltr",
      correctAnswer: "on the table",
      options: shuffle([
        "on the table",
        "under the table",
        "in the bag",
        "near the door",
      ]),
      explanation: "'on the table' = על השולחן.",
    }),
    () => ({
      question: "קראי וענה: מה דן אוהב?",
      prompt: "Dan likes to play with his dog in the park.",
      audio: "Dan likes to play with his dog in the park.",
      direction: "ltr",
      correctAnswer: "play with his dog",
      options: shuffle([
        "play with his dog",
        "sleep in the park",
        "read a book",
        "eat a banana",
      ]),
      explanation: "Dan likes to play with his dog = דן אוהב לשחק עם הכלב.",
    }),
    () => ({
      question: "קראי וענה: מה הבנות עושות?",
      prompt: "The girls are singing a song.",
      audio: "The girls are singing a song.",
      direction: "ltr",
      correctAnswer: "singing",
      options: shuffle(["singing", "reading", "running", "eating"]),
      explanation: "'singing' = שרות. 'The girls are singing' = הבנות שרות.",
    }),
  ];
  return pick(templates)();
}

function genGrammar(level: EnLevel): EnQuestion {
  if (level === "easy") {
    const templates: Array<() => EnQuestion> = [
      () => ({
        question: "השלימי: a או an?",
        prompt: "___ apple",
        audio: "an apple",
        direction: "ltr",
        correctAnswer: "an",
        options: ["a", "an"],
        explanation: "לפני מילה שמתחילה בתנועה (a, e, i, o, u) → an.",
      }),
      () => ({
        question: "השלימי: a או an?",
        prompt: "___ dog",
        audio: "a dog",
        direction: "ltr",
        correctAnswer: "a",
        options: ["a", "an"],
        explanation: "לפני מילה שמתחילה בעיצור → a.",
      }),
      () => ({
        question: "השלימי: a או an?",
        prompt: "___ elephant",
        audio: "an elephant",
        direction: "ltr",
        correctAnswer: "an",
        options: ["a", "an"],
        explanation: "'elephant' מתחילה ב-'e' (תנועה) → an.",
      }),
      () => ({
        question: "השלימי: a או an?",
        prompt: "___ orange",
        audio: "an orange",
        direction: "ltr",
        correctAnswer: "an",
        options: ["a", "an"],
        explanation: "'orange' מתחילה ב-'o' (תנועה) → an.",
      }),
      () => ({
        question: "השלימי: a או an?",
        prompt: "___ book",
        audio: "a book",
        direction: "ltr",
        correctAnswer: "a",
        options: ["a", "an"],
        explanation: "'book' מתחילה בעיצור → a.",
      }),
    ];
    return pick(templates)();
  }
  if (level === "normal") {
    const templates: Array<() => EnQuestion> = [
      () => ({
        question: "השלימי: is או are?",
        prompt: "The cat ___ running.",
        audio: "The cat is running.",
        direction: "ltr",
        correctAnswer: "is",
        options: shuffle(["is", "are", "am", "be"]),
        explanation: "יחיד (the cat) → is.",
      }),
      () => ({
        question: "השלימי: is או are?",
        prompt: "The dogs ___ big.",
        audio: "The dogs are big.",
        direction: "ltr",
        correctAnswer: "are",
        options: shuffle(["is", "are", "am", "be"]),
        explanation: "רבים (the dogs) → are.",
      }),
      () => ({
        question: "השלימי:",
        prompt: "I ___ happy today.",
        audio: "I am happy today.",
        direction: "ltr",
        correctAnswer: "am",
        options: shuffle(["am", "is", "are", "be"]),
        explanation: "אחרי 'I' תמיד 'am'.",
      }),
      () => ({
        question: "השלימי: he, she, או it?",
        prompt: "My sister is nice. ___ is my friend.",
        audio: "She is my friend.",
        direction: "ltr",
        correctAnswer: "She",
        options: shuffle(["She", "He", "It", "They"]),
        explanation: "אחות = בת → she.",
      }),
    ];
    return pick(templates)();
  }
  const templates: Array<() => EnQuestion> = [
    () => ({
      question: "בחרי את הצורה הנכונה (עבר):",
      prompt: "Yesterday I ___ to school.",
      audio: "Yesterday I went to school.",
      direction: "ltr",
      correctAnswer: "went",
      options: shuffle(["went", "go", "going", "goes"]),
      explanation: "'yesterday' = אתמול (עבר). Past of 'go' = went.",
    }),
    () => ({
      question: "בחרי את הצורה הנכונה:",
      prompt: "She ___ a cake yesterday.",
      audio: "She made a cake yesterday.",
      direction: "ltr",
      correctAnswer: "made",
      options: shuffle(["made", "make", "makes", "making"]),
      explanation: "'yesterday' = עבר. Past of 'make' = made.",
    }),
    () => ({
      question: "בחרי את הצורה הנכונה (הווה מתמשך):",
      prompt: "Look! The boy ___ running.",
      audio: "Look! The boy is running.",
      direction: "ltr",
      correctAnswer: "is",
      options: shuffle(["is", "are", "was", "were"]),
      explanation: "הווה מתמשך: the boy (יחיד) → is running.",
    }),
    () => ({
      question: "בחרי: much או many?",
      prompt: "How ___ apples do you have?",
      audio: "How many apples do you have?",
      direction: "ltr",
      correctAnswer: "many",
      options: ["much", "many"],
      explanation: "many = עם שם עצם ספיר (apples = ספיר).",
    }),
  ];
  return pick(templates)();
}

function genSongs(level: EnLevel): EnQuestion {
  if (level === "easy") {
    const pairs: Array<[string, string, string[]]> = [
      ["cat", "bat", ["dog", "fish", "cow"]],
      ["dog", "frog", ["cat", "bird", "fish"]],
      ["star", "car", ["moon", "sun", "tree"]],
      ["bee", "tree", ["sun", "cat", "book"]],
      ["cake", "lake", ["dog", "fish", "cow"]],
      ["rain", "train", ["sun", "cloud", "tree"]],
    ];
    const [word, rhyme, distractors] = pick(pairs);
    return {
      question: "איזו מילה מתחרזת?",
      prompt: word,
      audio: `${word}, ${rhyme}`,
      direction: "ltr",
      correctAnswer: rhyme,
      options: shuffle([rhyme, ...distractors]),
      explanation: `"${word}" ו-"${rhyme}" נגמרות באותו צליל.`,
    };
  }
  if (level === "normal") {
    const rhymes: Array<[string, string, string[]]> = [
      [
        "Twinkle twinkle little ___",
        "star",
        ["moon", "sun", "cat"],
      ],
      [
        "Baa baa black ___",
        "sheep",
        ["bird", "dog", "cow"],
      ],
      [
        "Mary had a little ___",
        "lamb",
        ["cat", "bird", "duck"],
      ],
      [
        "Old MacDonald had a ___",
        "farm",
        ["car", "bag", "box"],
      ],
      [
        "Row row row your ___",
        "boat",
        ["house", "car", "dog"],
      ],
    ];
    const [line, answer, distractors] = pick(rhymes);
    const full = line.replace("___", answer);
    return {
      question: "השלימי את השיר:",
      prompt: line,
      audio: full,
      direction: "ltr",
      correctAnswer: answer,
      options: shuffle([answer, ...distractors]),
      explanation: `השורה המלאה: "${full}".`,
    };
  }
  const sets: Array<[string, string, string[]]> = [
    ["cat, bat, hat", "rat", ["dog", "sun", "bird"]],
    ["sun, run, fun", "bun", ["dog", "cat", "moon"]],
    ["tree, bee, see", "free", ["cat", "book", "dog"]],
    ["light, night, bright", "right", ["dark", "sun", "day"]],
  ];
  const [group, answer, distractors] = pick(sets);
  return {
    question: "איזו מילה מצטרפת לחרוז?",
    prompt: group,
    audio: `${group}, ${answer}`,
    direction: "ltr",
    correctAnswer: answer,
    options: shuffle([answer, ...distractors]),
    explanation: `כל המילים בקבוצה נגמרות באותו צליל.`,
  };
}

export function generateEnQuestion(topic: EnTopic, level: EnLevel): EnQuestion {
  switch (topic) {
    case "vocab":
      return genVocab(level);
    case "letters":
      return genLetters(level);
    case "writing":
      return genWriting(level);
    case "speaking":
      return genSpeaking(level);
    case "reading":
      return genReading(level);
    case "grammar":
      return genGrammar(level);
    case "songs":
      return genSongs(level);
    default:
      return genVocab(level);
  }
}

export function generateEnQuestions(
  topic: EnTopic,
  level: EnLevel,
  count: number,
): EnQuestion[] {
  return Array.from({ length: count }, () => generateEnQuestion(topic, level));
}

export function isEnTopic(v: string | null): v is EnTopic {
  return (
    v === "letters" ||
    v === "vocab" ||
    v === "reading" ||
    v === "writing" ||
    v === "speaking" ||
    v === "grammar" ||
    v === "songs"
  );
}

export function isEnLevel(v: string | null): v is EnLevel {
  return v === "easy" || v === "normal" || v === "hard";
}
