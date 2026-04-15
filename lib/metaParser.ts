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

// Extract an attribute value from a single HTML tag string,
// handling both single-quoted and double-quoted attribute values.
function getAttr(tag: string, attr: string): string {
  const dq = new RegExp(`\\b${attr}="([^"]*)"`, "i").exec(tag);
  if (dq) return dq[1].replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
  const sq = new RegExp(`\\b${attr}='([^']*)'`, "i").exec(tag);
  if (sq) return sq[1].replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
  return "";
}

export function parseMeta(html: string): MetaResult {
  const get = (pattern: RegExp) => {
    const m = html.match(pattern);
    return m ? m[1].replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim() : "";
  };

  // Extract all meta/link tags for robust attribute-order-independent parsing
  const metaTags = [...html.matchAll(/<meta\s[^>]+\/?>/gi)].map((m) => m[0]);
  const linkTags = [...html.matchAll(/<link\s[^>]+\/?>/gi)].map((m) => m[0]);

  const getMetaContent = (attrName: string, attrValue: string): string => {
    for (const tag of metaTags) {
      const val = getAttr(tag, attrName);
      if (val.toLowerCase() === attrValue.toLowerCase()) {
        return getAttr(tag, "content");
      }
    }
    return "";
  };

  const title = get(/<title[^>]*>([^<]*)<\/title>/i);
  const desc = getMetaContent("name", "description");
  const ogTitle = getMetaContent("property", "og:title");
  const ogDesc = getMetaContent("property", "og:description");
  const ogImage = getMetaContent("property", "og:image");
  const twCard = getMetaContent("name", "twitter:card");

  let canonical = "";
  for (const tag of linkTags) {
    const rel = getAttr(tag, "rel");
    if (rel.toLowerCase() === "canonical") {
      canonical = getAttr(tag, "href");
      break;
    }
  }

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
