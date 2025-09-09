import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { texts, target } = await req.json(); // batch translation
    

    const res = await fetch(`https://translation.googleapis.com/language/translate/v2?key=AIzaSyCfIDqsAcDMUKSaqjOfD0qfdao8ZfeeUcI`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: texts,
          target,
          source: "en",
          format: "text",
        }),
      }
    );

    const data = await res.json();
    type Translation = { translatedText: string };
    const translations = data.data.translations.map((t: Translation) => t.translatedText);

    return NextResponse.json({ translations });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}