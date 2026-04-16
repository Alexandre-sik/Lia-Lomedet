export type Category =
  | "animals"
  | "family"
  | "colors"
  | "numbers"
  | "food"
  | "body"
  | "clothes"
  | "school"
  | "home"
  | "nature"
  | "verbs";

export type Word = {
  en: string;
  he: string;
  emoji?: string;
  category: Category;
};

export const WORDS: Word[] = [
  // Animals
  { en: "cat", he: "חתול", emoji: "🐱", category: "animals" },
  { en: "dog", he: "כלב", emoji: "🐶", category: "animals" },
  { en: "bird", he: "ציפור", emoji: "🐦", category: "animals" },
  { en: "fish", he: "דג", emoji: "🐟", category: "animals" },
  { en: "cow", he: "פרה", emoji: "🐄", category: "animals" },
  { en: "horse", he: "סוס", emoji: "🐴", category: "animals" },
  { en: "rabbit", he: "ארנב", emoji: "🐰", category: "animals" },
  { en: "elephant", he: "פיל", emoji: "🐘", category: "animals" },
  { en: "lion", he: "אריה", emoji: "🦁", category: "animals" },
  { en: "monkey", he: "קוף", emoji: "🐵", category: "animals" },
  { en: "duck", he: "ברווז", emoji: "🦆", category: "animals" },
  { en: "pig", he: "חזיר", emoji: "🐷", category: "animals" },
  { en: "sheep", he: "כבש", emoji: "🐑", category: "animals" },
  { en: "mouse", he: "עכבר", emoji: "🐭", category: "animals" },
  { en: "snake", he: "נחש", emoji: "🐍", category: "animals" },
  { en: "bear", he: "דוב", emoji: "🐻", category: "animals" },

  // Family
  { en: "mother", he: "אמא", emoji: "👩", category: "family" },
  { en: "father", he: "אבא", emoji: "👨", category: "family" },
  { en: "sister", he: "אחות", emoji: "👧", category: "family" },
  { en: "brother", he: "אח", emoji: "👦", category: "family" },
  { en: "baby", he: "תינוק", emoji: "👶", category: "family" },
  { en: "grandma", he: "סבתא", emoji: "👵", category: "family" },
  { en: "grandpa", he: "סבא", emoji: "👴", category: "family" },

  // Colors
  { en: "red", he: "אדום", emoji: "🔴", category: "colors" },
  { en: "blue", he: "כחול", emoji: "🔵", category: "colors" },
  { en: "green", he: "ירוק", emoji: "🟢", category: "colors" },
  { en: "yellow", he: "צהוב", emoji: "🟡", category: "colors" },
  { en: "black", he: "שחור", emoji: "⚫", category: "colors" },
  { en: "white", he: "לבן", emoji: "⚪", category: "colors" },
  { en: "pink", he: "ורוד", emoji: "🩷", category: "colors" },
  { en: "orange", he: "כתום", emoji: "🟠", category: "colors" },
  { en: "purple", he: "סגול", emoji: "🟣", category: "colors" },

  // Numbers
  { en: "one", he: "אחד", emoji: "1️⃣", category: "numbers" },
  { en: "two", he: "שתיים", emoji: "2️⃣", category: "numbers" },
  { en: "three", he: "שלוש", emoji: "3️⃣", category: "numbers" },
  { en: "four", he: "ארבע", emoji: "4️⃣", category: "numbers" },
  { en: "five", he: "חמש", emoji: "5️⃣", category: "numbers" },
  { en: "six", he: "שש", emoji: "6️⃣", category: "numbers" },
  { en: "seven", he: "שבע", emoji: "7️⃣", category: "numbers" },
  { en: "eight", he: "שמונה", emoji: "8️⃣", category: "numbers" },
  { en: "nine", he: "תשע", emoji: "9️⃣", category: "numbers" },
  { en: "ten", he: "עשר", emoji: "🔟", category: "numbers" },

  // Food
  { en: "apple", he: "תפוח", emoji: "🍎", category: "food" },
  { en: "banana", he: "בננה", emoji: "🍌", category: "food" },
  { en: "bread", he: "לחם", emoji: "🍞", category: "food" },
  { en: "pizza", he: "פיצה", emoji: "🍕", category: "food" },
  { en: "water", he: "מים", emoji: "💧", category: "food" },
  { en: "milk", he: "חלב", emoji: "🥛", category: "food" },
  { en: "cheese", he: "גבינה", emoji: "🧀", category: "food" },
  { en: "egg", he: "ביצה", emoji: "🥚", category: "food" },
  { en: "cake", he: "עוגה", emoji: "🎂", category: "food" },
  { en: "chicken", he: "עוף", emoji: "🍗", category: "food" },
  { en: "orange fruit", he: "תפוז", emoji: "🍊", category: "food" },
  { en: "strawberry", he: "תות", emoji: "🍓", category: "food" },
  { en: "ice cream", he: "גלידה", emoji: "🍦", category: "food" },

  // Body
  { en: "head", he: "ראש", emoji: "🧠", category: "body" },
  { en: "hand", he: "יד", emoji: "✋", category: "body" },
  { en: "foot", he: "רגל", emoji: "🦶", category: "body" },
  { en: "eye", he: "עין", emoji: "👁️", category: "body" },
  { en: "nose", he: "אף", emoji: "👃", category: "body" },
  { en: "mouth", he: "פה", emoji: "👄", category: "body" },
  { en: "ear", he: "אוזן", emoji: "👂", category: "body" },
  { en: "hair", he: "שיער", emoji: "💇", category: "body" },

  // Clothes
  { en: "shirt", he: "חולצה", emoji: "👕", category: "clothes" },
  { en: "pants", he: "מכנסיים", emoji: "👖", category: "clothes" },
  { en: "dress", he: "שמלה", emoji: "👗", category: "clothes" },
  { en: "shoes", he: "נעליים", emoji: "👟", category: "clothes" },
  { en: "hat", he: "כובע", emoji: "🎩", category: "clothes" },
  { en: "coat", he: "מעיל", emoji: "🧥", category: "clothes" },

  // School
  { en: "book", he: "ספר", emoji: "📖", category: "school" },
  { en: "pencil", he: "עיפרון", emoji: "✏️", category: "school" },
  { en: "pen", he: "עט", emoji: "🖊️", category: "school" },
  { en: "bag", he: "תיק", emoji: "🎒", category: "school" },
  { en: "chair", he: "כיסא", emoji: "🪑", category: "school" },
  { en: "table", he: "שולחן", emoji: "🪵", category: "school" },
  { en: "teacher", he: "מורה", emoji: "👩‍🏫", category: "school" },

  // Home
  { en: "house", he: "בית", emoji: "🏠", category: "home" },
  { en: "bed", he: "מיטה", emoji: "🛏️", category: "home" },
  { en: "door", he: "דלת", emoji: "🚪", category: "home" },
  { en: "window", he: "חלון", emoji: "🪟", category: "home" },
  { en: "key", he: "מפתח", emoji: "🔑", category: "home" },

  // Nature
  { en: "sun", he: "שמש", emoji: "☀️", category: "nature" },
  { en: "moon", he: "ירח", emoji: "🌙", category: "nature" },
  { en: "star", he: "כוכב", emoji: "⭐", category: "nature" },
  { en: "tree", he: "עץ", emoji: "🌳", category: "nature" },
  { en: "flower", he: "פרח", emoji: "🌸", category: "nature" },
  { en: "cloud", he: "ענן", emoji: "☁️", category: "nature" },
  { en: "rain", he: "גשם", emoji: "🌧️", category: "nature" },
  { en: "snow", he: "שלג", emoji: "❄️", category: "nature" },

  // Verbs
  { en: "run", he: "רץ", emoji: "🏃", category: "verbs" },
  { en: "walk", he: "הולך", emoji: "🚶", category: "verbs" },
  { en: "eat", he: "אוכל", emoji: "🍴", category: "verbs" },
  { en: "drink", he: "שותה", emoji: "🥤", category: "verbs" },
  { en: "sleep", he: "ישן", emoji: "😴", category: "verbs" },
  { en: "play", he: "משחק", emoji: "🎮", category: "verbs" },
  { en: "read", he: "קורא", emoji: "📚", category: "verbs" },
  { en: "write", he: "כותב", emoji: "✍️", category: "verbs" },
  { en: "jump", he: "קופץ", emoji: "🤸", category: "verbs" },
  { en: "swim", he: "שוחה", emoji: "🏊", category: "verbs" },
  { en: "sing", he: "שר", emoji: "🎤", category: "verbs" },
  { en: "dance", he: "רוקד", emoji: "💃", category: "verbs" },
];

export function wordsByCategory(cat: Category): Word[] {
  return WORDS.filter((w) => w.category === cat);
}

export function pickWord(): Word {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

export function pickWordsNotEqual(exclude: Word, count: number): Word[] {
  const pool = WORDS.filter((w) => w.en !== exclude.en);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
