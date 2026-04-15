import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const rawUrl = req.nextUrl.searchParams.get("url");
  if (!rawUrl) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return NextResponse.json({ error: "Only http/https allowed" }, { status: 400 });
  }

  try {
    const res = await fetch(parsed.toString(), {
      headers: { "User-Agent": "seokit-bot/1.0" },
      redirect: "follow",
      signal: AbortSignal.timeout(10_000),
    });
    const text = await res.text();
    return new NextResponse(text, {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Fetch failed";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
