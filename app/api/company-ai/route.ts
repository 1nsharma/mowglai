import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type GeminiPart = { text?: string };
type GeminiResponse = { candidates?: Array<{ content?: { parts?: GeminiPart[] } }> };

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI gateway is not configured. Set GEMINI_API_KEY in the server environment, then restart the app." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || !("prompt" in body) || typeof body.prompt !== "string") {
    return NextResponse.json({ error: "Provide a string prompt." }, { status: 400 });
  }
  const prompt = body.prompt.trim();
  if (!prompt) return NextResponse.json({ error: "Prompt cannot be empty." }, { status: 400 });
  if (prompt.length > 2000) return NextResponse.json({ error: "Prompt must be 2,000 characters or fewer." }, { status: 413 });

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/" + encodeURIComponent(model) + ":generateContent?key=" + encodeURIComponent(apiKey),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 1200 },
        }),
        signal: AbortSignal.timeout(30000),
      },
    );

    if (!response.ok) {
      const status = response.status;
      // Do not return upstream response bodies: they may contain provider details.
      return NextResponse.json(
        { error: status === 429 ? "AI rate limit reached. Try again shortly." : "AI provider request failed (HTTP " + status + "). Check the server configuration." },
        { status: status === 429 ? 429 : 502 },
      );
    }
    const data = (await response.json()) as GeminiResponse;
    const text = data.candidates?.flatMap((candidate) => candidate.content?.parts ?? []).map((part) => part.text ?? "").join("\n").trim();
    if (!text) return NextResponse.json({ error: "The AI provider returned no text." }, { status: 502 });
    return NextResponse.json({ text, model });
  } catch {
    return NextResponse.json({ error: "AI provider timed out or could not be reached." }, { status: 504 });
  }
}
