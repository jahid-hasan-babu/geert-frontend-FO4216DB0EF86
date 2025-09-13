// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     const { texts, target } = await req.json();

//     const res = await fetch(`https://translation.googleapis.com/language/translate/v2?key=AIzaSyCfIDqsAcDMUKSaqjOfD0qfdao8ZfeeUcI`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           q: texts,
//           target,
//           source: "en",
//           format: "text",
//         }),
//       }
//     );

//     const data = await res.json();
//     type Translation = { translatedText: string };
//     const translations = data.data.translations.map((t: Translation) => t.translatedText);

//     return NextResponse.json({ translations });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Translation failed" }, { status: 500 });
//   }
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { texts, target } = await req.json();

    const customGlossary: Record<string, string> = {
      Student: " Cursist ",
      Save: " Opslaan ",
    };

    // Always use glossary translation if exists
    texts.map((text: string) => {
      if (customGlossary[text]) return customGlossary[text]; // override
      return text; // fallback: send to API later
    });

    // Only send texts not in glossary to API
    const textsToTranslate = texts.filter((t: string) => !customGlossary[t]);

    let apiTranslations: string[] = [];
    if (textsToTranslate.length > 0) {
      const res = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=AIzaSyCfIDqsAcDMUKSaqjOfD0qfdao8ZfeeUcI`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            q: textsToTranslate,
            target,
            source: "en",
            format: "text",
          }),
        }
      );

      const data = await res.json();
      apiTranslations = data.data.translations.map(
        (t: any) => t.translatedText
      );
    }

    // Merge API results with glossary
    let apiIndex = 0;
    const merged = texts.map((t: string) =>
      customGlossary[t] ? customGlossary[t] : apiTranslations[apiIndex++]
    );

    return NextResponse.json({ translations: merged });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
