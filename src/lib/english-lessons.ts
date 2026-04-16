import type { EnTopic } from "./english-generator";

export type EnSlide = {
  emoji: string;
  title: string;
  body: string;
  examples?: Array<{ en: string; he: string; emoji?: string }>;
  tip?: string;
};

export type EnLesson = {
  id: EnTopic;
  title: string;
  subtitle: string;
  slides: EnSlide[];
};

export const EN_LESSONS: Record<EnTopic, EnLesson> = {
  letters: {
    id: "letters",
    title: "אותיות וצלילים",
    subtitle: "מכירים את ה-Alphabet",
    slides: [
      {
        emoji: "🔤",
        title: "The English Alphabet",
        body: "באנגלית יש 26 אותיות. חשוב לדעת איך כל אות נשמעת — זה הצליל שלה.",
      },
      {
        emoji: "🎵",
        title: "תנועות (vowels)",
        body: "5 אותיות מיוחדות: A, E, I, O, U. הן נקראות תנועות. אלה האותיות החשובות ביותר — כמעט כל מילה מכילה אותן.",
        examples: [
          { en: "cat", he: "חתול — יש A", emoji: "🐱" },
          { en: "dog", he: "כלב — יש O", emoji: "🐶" },
          { en: "fish", he: "דג — יש I", emoji: "🐟" },
        ],
      },
      {
        emoji: "🔊",
        title: "איך לומדים צלילים?",
        body: "הכי טוב להאזין ולחזור אחרי. לחצי על הרמקול בכל מילה ותחזרי בקול רם.",
      },
      {
        emoji: "🎯",
        title: "מוכנה לתרגל?",
        body: "נזהה אותיות בתחילת ובסוף מילים!",
      },
    ],
  },
  vocab: {
    id: "vocab",
    title: "אוצר מילים",
    subtitle: "מילים שימושיות לחיי היום-יום",
    slides: [
      {
        emoji: "💬",
        title: "מה זה אוצר מילים?",
        body: "אוצר מילים = כל המילים שאני מכירה. ככל שיש לי יותר מילים, ככה קל לי יותר להבין ולדבר!",
      },
      {
        emoji: "🐱",
        title: "חיות — Animals",
        body: "המילים שימושיות בסיפורים, בשירים, ובכל חיי היום-יום.",
        examples: [
          { en: "cat", he: "חתול", emoji: "🐱" },
          { en: "dog", he: "כלב", emoji: "🐶" },
          { en: "bird", he: "ציפור", emoji: "🐦" },
          { en: "fish", he: "דג", emoji: "🐟" },
        ],
      },
      {
        emoji: "🎨",
        title: "צבעים — Colors",
        body: "הצבעים פשוטים ונחמדים לזכור כי אפשר להצביע עליהם בכל מקום!",
        examples: [
          { en: "red", he: "אדום", emoji: "🔴" },
          { en: "blue", he: "כחול", emoji: "🔵" },
          { en: "green", he: "ירוק", emoji: "🟢" },
          { en: "yellow", he: "צהוב", emoji: "🟡" },
        ],
      },
      {
        emoji: "🍎",
        title: "אוכל — Food",
        body: "המילים שתשתמשי בהן הכי הרבה במסעדה ובבית.",
        examples: [
          { en: "apple", he: "תפוח", emoji: "🍎" },
          { en: "pizza", he: "פיצה", emoji: "🍕" },
          { en: "milk", he: "חלב", emoji: "🥛" },
          { en: "water", he: "מים", emoji: "💧" },
        ],
      },
      {
        emoji: "🎯",
        title: "מוכנה לתרגל?",
        body: "בואי נבדוק כמה מילים את מכירה!",
      },
    ],
  },
  reading: {
    id: "reading",
    title: "קריאה",
    subtitle: "קוראים משפטים פשוטים",
    slides: [
      {
        emoji: "📖",
        title: "איך קוראים באנגלית?",
        body: "קראי מילה אחת בכל פעם. נסי להשמיע אותה בקול — לפעמים הצליל עוזר להבין.",
      },
      {
        emoji: "🔑",
        title: "Sight Words",
        body: "יש מילים קצרות שחוזרות כל הזמן — 'the', 'is', 'and', 'a'. כדאי לזכור אותן בעל-פה.",
        examples: [
          { en: "the", he: "ה- (הידיעה)" },
          { en: "is", he: "הוא/היא" },
          { en: "and", he: "ו-" },
          { en: "a", he: "אחד, אחת" },
        ],
      },
      {
        emoji: "💡",
        title: "דוגמה",
        body: "'The cat is on the table' = 'החתול נמצא על השולחן'. מילה אחר מילה!",
        examples: [
          { en: "The", he: "ה-" },
          { en: "cat", he: "חתול" },
          { en: "is", he: "נמצא" },
          { en: "on", he: "על" },
          { en: "the table", he: "השולחן" },
        ],
      },
      {
        emoji: "🎯",
        title: "מוכנה לתרגל?",
        body: "נקרא משפטים קצרים ונענה על שאלות!",
      },
    ],
  },
  writing: {
    id: "writing",
    title: "כתיבה",
    subtitle: "לומדות לאיית נכון",
    slides: [
      {
        emoji: "✏️",
        title: "איות — Spelling",
        body: "כדי לכתוב מילה צריך לדעת את סדר האותיות. באנגלית זה לא תמיד כמו שזה נשמע!",
      },
      {
        emoji: "👀",
        title: "הסתכלי, הגידי, כתבי",
        body: "שיטה מצוינת: 1) הסתכלי על המילה. 2) הגידי אותה בקול. 3) סגרי עיניים ונסי לכתוב.",
      },
      {
        emoji: "💡",
        title: "מילים קצרות תחילה",
        body: "מתחילים ממילים קטנות של 3 אותיות — cat, dog, sun, red.",
        examples: [
          { en: "cat", he: "ח-ת-ו-ל", emoji: "🐱" },
          { en: "sun", he: "ש-מ-ש", emoji: "☀️" },
          { en: "red", he: "א-ד-ו-ם", emoji: "🔴" },
        ],
      },
      {
        emoji: "🎯",
        title: "מוכנה לתרגל?",
        body: "נסדר אותיות למילים נכונות!",
      },
    ],
  },
  speaking: {
    id: "speaking",
    title: "דיבור והאזנה",
    subtitle: "מאזינים ומבינים",
    slides: [
      {
        emoji: "👂",
        title: "למה להאזין?",
        body: "האזנה היא הדרך הכי טובה ללמוד איך מילים באמת נשמעות. לפעמים כתוב אחרת ממה שאומרים!",
      },
      {
        emoji: "🔊",
        title: "טיפ: חזרי בקול",
        body: "אחרי שאת שומעת מילה, נסי להגיד אותה. זה עוזר למוח לזכור.",
      },
      {
        emoji: "💬",
        title: "ברכות בסיסיות",
        body: "המילים שתשמעי הכי הרבה כשפוגשים אנשים.",
        examples: [
          { en: "Hello", he: "שלום" },
          { en: "Thank you", he: "תודה" },
          { en: "Please", he: "בבקשה" },
          { en: "Goodbye", he: "להתראות" },
        ],
      },
      {
        emoji: "🎯",
        title: "מוכנה לתרגל?",
        body: "נאזין למילים ונבחר את המשמעות הנכונה!",
      },
    ],
  },
  grammar: {
    id: "grammar",
    title: "דקדוק בסיסי",
    subtitle: "הכללים שעוזרים לבנות משפטים",
    slides: [
      {
        emoji: "📏",
        title: "a או an?",
        body: "לפני מילה שמתחילה ב-תנועה (a, e, i, o, u) → an. אחרת → a.",
        examples: [
          { en: "a dog", he: "כלב (d = עיצור)" },
          { en: "an apple", he: "תפוח (a = תנועה)" },
          { en: "a book", he: "ספר (b = עיצור)" },
          { en: "an orange", he: "תפוז (o = תנועה)" },
        ],
      },
      {
        emoji: "🔗",
        title: "is / are / am",
        body: "I → am. He/She/It (יחיד) → is. We/They (רבים) → are.",
        examples: [
          { en: "I am happy", he: "אני שמחה" },
          { en: "She is nice", he: "היא נחמדה" },
          { en: "They are friends", he: "הם חברים" },
        ],
      },
      {
        emoji: "⏰",
        title: "עבר פשוט",
        body: "כשמדברים על אתמול — התאומן את הפעלים. לפעמים מוסיפים -ed, ולפעמים המילה משתנה לגמרי.",
        examples: [
          { en: "play → played", he: "משחק → שיחק" },
          { en: "go → went", he: "הולך → הלך" },
          { en: "eat → ate", he: "אוכל → אכל" },
        ],
      },
      {
        emoji: "🎯",
        title: "מוכנה לתרגל?",
        body: "נבחר את הצורה הדקדוקית הנכונה!",
      },
    ],
  },
  songs: {
    id: "songs",
    title: "שירים וחרוזים",
    subtitle: "לומדים דרך שירה",
    slides: [
      {
        emoji: "🎵",
        title: "למה שירים?",
        body: "שירים וחרוזים עוזרים לזכור מילים חדשות — כי הקצב והמנגינה מעגנים את המילים במוח.",
      },
      {
        emoji: "🎤",
        title: "מה זה חרוז?",
        body: "חרוז = שתי מילים שנגמרות באותו צליל. cat - bat, dog - frog, star - car.",
        examples: [
          { en: "cat / bat", he: "חתול / עטלף" },
          { en: "star / car", he: "כוכב / מכונית" },
          { en: "bee / tree", he: "דבורה / עץ" },
        ],
      },
      {
        emoji: "⭐",
        title: "Twinkle Twinkle",
        body: "השיר הכי מפורסם לילדים. שימי לב לחרוז בין 'star' ו-'are'.",
        examples: [
          { en: "Twinkle twinkle little star", he: "נצנצי נצנצי כוכב קטן" },
          { en: "How I wonder what you are", he: "כמה שאני תוהה מי אתה" },
        ],
      },
      {
        emoji: "🎯",
        title: "מוכנה לתרגל?",
        body: "נמצא חרוזים ונשלים שירים!",
      },
    ],
  },
};

export function getEnLesson(id: string): EnLesson | null {
  if (id in EN_LESSONS) return EN_LESSONS[id as EnTopic];
  return null;
}
