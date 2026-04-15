import { NextRequest, NextResponse } from "next/server";

interface Hop {
  url: string;
  status: number;
  ms: number;
}

export async function GET(req: NextRequest) {
  const rawUrl = req.nextUrl.searchParams.get("url");
  if (!rawUrl) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  let current: string;
  try {
    current = new URL(rawUrl).toString();
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const hops: Hop[] = [];
  const MAX_HOPS = 10;

  while (hops.length < MAX_HOPS) {
    const t0 = Date.now();
    let res: Response;
    try {
      res = await fetch(current, {
        method: "HEAD",
        redirect: "manual",
        headers: { "User-Agent": "seokit-bot/1.0" },
        signal: AbortSignal.timeout(8_000),
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Fetch failed";
      return NextResponse.json({ error: msg, hops }, { status: 502 });
    }
    const ms = Date.now() - t0;
    hops.push({ url: current, status: res.status, ms });

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get("location");
      if (!location) break;
      try {
        current = new URL(location, current).toString();
      } catch {
        break;
      }
    } else {
      break;
    }
  }

  return NextResponse.json({ hops });
}
