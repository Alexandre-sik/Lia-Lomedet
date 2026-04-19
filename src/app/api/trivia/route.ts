import { NextRequest, NextResponse } from "next/server";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-haiku-4-5-20251001";

const CATEGORIES = {
  geography:
    "גאוגרפיה - מדינות, בירות, יבשות, אוקיינוסים, הרים, נהרות, מפות",
  history:
    "היסטוריה - תרבויות עתיקות, המצאות, דמויות חשובות, אירועים היסטוריים",
  science:
    "מדע וטבע - חיות, צמחים, מערכת השמש, גוף האדם, מזג אוויר, המצאות מדעיות",
  arts: "אומנות ותרבות - מוזיקה, ציור, חגים מסביב לעולם, מסורות, ספרים מפורסמים",
  sports:
    "ספורט - אולימפיאדה, ספורט פופולרי, שיאים, כללי משחק, ספורטאים מפורסמים",
  trivia:
    "טריוויה - עובדות מפתיעות, חידות משעשעות, 'האם ידעת?' על העולם",
} as const;

const LEVELS = {
  easy: "ילדה בת 8, שאלות פשוטות וברורות, מילים פשוטות, מושגים בסיסיים",
  normal:
    "ילדה בת 8, שאלות מעניינות שדורשות קצת חשיבה, פרטים לא טריוויאליים",
  hard: "ילדה בת 8-9, שאלות מאתגרות עם פרטים מפתיעים ולא ידועים, אבל עדיין בהישג יד",
} as const;

type Category = keyof typeof CATEGORIES;
type Level = keyof typeof LEVELS;

function isCategory(v: unknown): v is Category {
  return typeof v === "string" && v in CATEGORIES;
}

function isLevel(v: unknown): v is Level {
  return typeof v === "string" && v in LEVELS;
}

const SYSTEM_PROMPT = `אתה מורה ישראלי מנוסה ביצירת חידוני ידע כללי לילדים. אתה יוצר שאלות בעברית לילדה בת 8 בשם ליה, תלמידת כיתה ג'.

הכללים שלך:
1. כל שאלה חייבת להיות בעברית ברורה, קצרה וקולחת — בלי מילים קשות.
2. התשובות חייבות להיות נכונות עובדתית ומדויקות.
3. כל שאלה חייבת 4 אפשרויות תשובה — אחת נכונה ושלוש מסיחים (distractors) פלאוזיביליים אבל שגויים.
4. אורך התשובות דומה — לא תשובה ארוכה אחת ושלוש קצרות (כדי שהתלמידה לא תנחש לפי האורך).
5. ההסבר אחרי כל שאלה צריך להיות ידידותי, קצר (משפט או שניים), ולהסביר למה התשובה נכונה.
6. ה-funFact הוא עובדה מפתיעה וכיפית הקשורה לשאלה — משהו שיעניין ילדה סקרנית.
7. השאלות צריכות לגוון נושאים — לא כל השאלות על אותו פרט.
8. הימנע מנושאים רגישים, מפחידים או לא מתאימים לגיל.
9. עודד סקרנות, אל תבייש שאלה טיפשית.

הנחיות emoji (חשוב מאוד — קראי בעיון):
⚠️ כלל זהב: ה-emoji חייב להיות **דקורטיבי וכללי לנושא**, אף פעם **לא חושף את התשובה**.

דוגמאות למה **אסור**:
- שאלה: "איזו חיה הכי גבוהה?" → אל תחזיר 🦒 (התשובה). החזר 🐾 (כללי).
- שאלה: "איזה כוכב לכת הכי גדול?" → אל תחזיר 🪐. החזר 🔭 (כללי).
- שאלה: "מה הבירה של צרפת?" → אל תחזיר 🇫🇷 (חושף). החזר 🗺️ (כללי).
- שאלה: "מי הצייר של המונה ליזה?" → אל תחזיר פרצוף אמנותי. החזר 🎨.

השתמש באמוג'י כלליים שמייצגים את **הקטגוריה/הנושא**, לא את התשובה:
- גאוגרפיה / מדינות → 🗺️ 🌍 🌐 🧭 📍
- חיות → 🐾 🦴 🌿 🦴
- גוף האדם → 🏃 👶 🩺
- חלל / מערכת השמש → 🔭 🚀 🌌 ⭐
- אוכל → 🍽️ 👨‍🍳 🛒
- ספורט → 🏟️ 🥇 ⚽ 🏃
- מוזיקה → 🎵 🎤 🎼 🎧
- מזג אוויר / טבע → 🌿 🌦️ 🏞️ 🌋
- אומנות / תרבות → 🎨 🖼️ 🎭
- היסטוריה → 📜 ⏳ 🏺
- המצאות / טכנולוגיה → 💡 🔬 🔭 ⚙️
- טריוויה כללית → 💡 🔎 ❓

⚠️ אסור להשתמש ב-emoji שהוא התשובה (כולל דגלים ספציפיים של מדינות, חיות ספציפיות, אובייקטים ספציפיים).
אם בספק, השתמש ב-"💡" או ב-"🔎".
השתמש באמוג'י אחד בלבד (לא שניים).

אתה מחזיר תמיד JSON array תקין עם 10 שאלות בפורמט המדויק הזה:
[
  {
    "question": "השאלה בעברית",
    "options": ["תשובה א", "תשובה ב", "תשובה ג", "תשובה ד"],
    "correctIndex": 0,
    "explanation": "הסבר ידידותי של משפט-שניים למה זו התשובה הנכונה",
    "funFact": "עובדה מפתיעה וכיפית שתעניין ילדה בת 8",
    "emoji": "🗺️"
  }
]

חשוב: החזר רק את ה-JSON array, בלי שום טקסט נוסף, בלי הערות, בלי code fences. מתחיל ב-[ וגומר ב-].`;

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server is missing ANTHROPIC_API_KEY" },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { category, level } =
    (body as { category?: unknown; level?: unknown }) ?? {};

  if (!isCategory(category) || !isLevel(level)) {
    return NextResponse.json(
      { error: "Invalid category or level" },
      { status: 400 },
    );
  }

  const userMessage = `קטגוריה: ${CATEGORIES[category]}
רמה: ${LEVELS[level]}

צור בבקשה 10 שאלות חידון על הקטגוריה הזו, ברמה המתאימה.`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 4000,
        system: [
          {
            type: "text",
            text: SYSTEM_PROMPT,
            cache_control: { type: "ephemeral" },
          },
        ],
        messages: [{ role: "user", content: userMessage }],
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error:", response.status, errText);
      let detail = errText.slice(0, 300);
      try {
        const j = JSON.parse(errText);
        detail = j.error?.message ?? detail;
      } catch {}
      return NextResponse.json(
        { error: `Anthropic ${response.status}: ${detail}` },
        { status: 502 },
      );
    }

    const data = (await response.json()) as {
      content?: Array<{ type: string; text: string }>;
    };
    const text = data.content?.[0]?.text ?? "";
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) {
      console.error("No JSON array in response:", text.slice(0, 200));
      return NextResponse.json(
        { error: "Invalid response from AI" },
        { status: 502 },
      );
    }

    let questions: unknown;
    try {
      questions = JSON.parse(match[0]);
    } catch (e) {
      console.error("JSON parse failed:", e);
      return NextResponse.json(
        { error: "Could not parse questions" },
        { status: 502 },
      );
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: "No questions returned" },
        { status: 502 },
      );
    }

    return NextResponse.json({ questions });
  } catch (e) {
    clearTimeout(timeout);
    console.error("Trivia route error:", e);
    if (e instanceof Error && e.name === "AbortError") {
      return NextResponse.json(
        { error: "Timeout — Claude a pris trop de temps. Nsi שוב." },
        { status: 504 },
      );
    }
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { error: `Server error: ${msg}` },
      { status: 500 },
    );
  }
}
