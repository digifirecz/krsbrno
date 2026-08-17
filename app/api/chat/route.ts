import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { CHURCH_INFO, REGULAR_MEETINGS, GROUPS_DATA, BELIEFS_PILLARS, VARIABLE_SYMBOLS } from "@/data/churchData";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Chybí zpráva" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        reply: "Omlouváme se, AI asistent je v tuto chvíli v režimu náhledu. Pro běžné informace prosím využijte sekce webu nebo kontaktujte info@krsbrno.cz.",
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const contextPrompt = `
Jsi přátelský a nápomocný AI asistent Křesťanského sboru Brno (KS Brno).
Odpovídáš zdvořile, srozumitelně a věcně v češtině.

O sboru víš tyto informace:
Název: ${CHURCH_INFO.name}
Adresa: ${CHURCH_INFO.address}
Doprava: ${CHURCH_INFO.transport}
Číslo účtu pro dary: ${CHURCH_INFO.accountNumber} (${CHURCH_INFO.bankName}), IBAN: ${CHURCH_INFO.iban}
Variabilní symboly: ${VARIABLE_SYMBOLS.map(s => `${s.code}: ${s.label}`).join(", ")}
E-maily: Obecný info@krsbrno.cz, Mládež elevate@krsbrno.cz, Dorost poutnickymail@gmail.com, Besídka besidka@krsbrno.cz

Pravidelná setkání:
${REGULAR_MEETINGS.map(m => `- ${m.title} (${m.day} ${m.time}): ${m.description}`).join("\n")}

Skupiny:
${GROUPS_DATA.map(g => `- ${g.name} (${g.ageRange}): ${g.meetingTime}. ${g.description}`).join("\n")}

Hlavní pilíře víry:
${BELIEFS_PILLARS.map(b => `- ${b.title}: ${b.summary}`).join("\n")}

Uživatel se ptá: "${message}"

Odpověz přívětivě, výstižně a přehledně. Pokud se ptá na něco, co přímo nesouvisí se sborem, spoj to jemně s tématem víry nebo informacemi o sboru.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contextPrompt,
    });

    return NextResponse.json({
      reply: response.text || "Děkujeme za dotaz! Těšíme se na vás na nedělní bohoslužbě v 9:30 na Šámalově 15a v Brně.",
    });
  } catch (err: unknown) {
    console.error("Gemini API error:", err);
    return NextResponse.json({
      reply: "Děkujeme za dotaz! Náš sbor se schází každou neděli od 9:30 na Šámalově 15a v Brně-Židenicích. Rádi vás uvidíme!",
    });
  }
}
