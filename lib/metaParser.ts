export interface MetaTag {
  key: string;
  value: string;
  status: "pass" | "warn" | "fail";
  note: string;
}

export interface MetaResult {
  score: number;
  titleLength: number;
  descLength: number;
  tags: MetaTag[];
}

export function parseMeta(html: string): MetaResult {
  const get = (pattern: RegExp) => {
    const m = html.match(pattern);
    return m ? m[1].replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim() : "";
  };

  const title = get(/<title[^>]*>([^<]*)<\/title>/i);
  const desc =
    get(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) ||
    get(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
  const ogTitle =
    get(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["']/i) ||
    get(/<meta[^>]+content=["']([^"']*)["'][^>]+property=["']og:title["']/i);
  const ogDesc =
    get(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["']/i) ||
    get(/<meta[^>]+content=["']([^"']*)["'][^>]+property=["']og:description["']/i);
  const ogImage =
    get(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']*)["']/i) ||
    get(/<meta[^>]+content=["']([^"']*)["'][^>]+property=["']og:image["']/i);
  const twCard =
    get(/<meta[^>]+name=["']twitter:card["'][^>]+content=["']([^"']*)["']/i) ||
    get(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']twitter:card["']/i);
  const canonical =
    get(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i) ||
    get(/<link[^>]+href=["']([^"']*)["'][^>]+rel=["']canonical["']/i);

  const tLen = title.length;
  const dLen = desc.length;

  const tags: MetaTag[] = [
    {
      key: "title",
      value: title || "—",
      status: !title ? "fail" : tLen >= 50 && tLen <= 60 ? "pass" : "warn",
      note: !title
        ? "Missing"
        : tLen < 50
        ? "Too short (<50 chars)"
        : tLen > 60
        ? "Too long (>60 chars)"
        : "Good length",
    },
    {
      key: "description",
      value: desc ? desc.slice(0, 80) + (desc.length > 80 ? "…" : "") : "—",
      status: !desc ? "fail" : dLen >= 120 && dLen <= 160 ? "pass" : "warn",
      note: !desc
        ? "Missing"
        : dLen < 120
        ? "Too short (<120 chars)"
        : dLen > 160
        ? "Too long (>160 chars)"
        : "Good length",
    },
    {
      key: "og:title",
      value: ogTitle || "—",
      status: ogTitle ? "pass" : "fail",
      note: ogTitle ? "Present" : "Missing",
    },
    {
      key: "og:description",
      value: ogDesc
        ? ogDesc.slice(0, 80) + (ogDesc.length > 80 ? "…" : "")
        : "—",
      status: ogDesc ? "pass" : "fail",
      note: ogDesc ? "Present" : "Missing",
    },
    {
      key: "og:image",
      value: ogImage || "—",
      status: ogImage ? "pass" : "warn",
      note: ogImage ? "Present" : "Missing (recommended)",
    },
    {
      key: "twitter:card",
      value: twCard || "—",
      status: twCard ? "pass" : "warn",
      note: twCard ? "Present" : "Missing (recommended)",
    },
    {
      key: "canonical",
      value: canonical || "—",
      status: canonical ? "pass" : "warn",
      note: canonical ? "Present" : "Not set",
    },
  ];

  const passes = tags.filter((t) => t.status === "pass").length;
  const score = Math.round((passes / tags.length) * 100);

  return { score, titleLength: tLen, descLength: dLen, tags };
}
