export interface RobotsRule {
  userAgent: string;
  allowed: string[];
  disallowed: string[];
}

export interface RobotsResult {
  rules: RobotsRule[];
  sitemaps: string[];
  raw: string;
}

export function parseRobots(txt: string): RobotsResult {
  const lines = txt.split(/\r?\n/);
  const rules: RobotsRule[] = [];
  const sitemaps: string[] = [];
  let current: RobotsRule | null = null;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim().toLowerCase();
    const value = line.slice(colonIdx + 1).trim();

    if (key === "user-agent") {
      if (!current || current.allowed.length || current.disallowed.length) {
        current = { userAgent: value, allowed: [], disallowed: [] };
        rules.push(current);
      } else {
        current.userAgent = value;
      }
    } else if (key === "allow" && current) {
      current.allowed.push(value);
    } else if (key === "disallow" && current) {
      if (value) current.disallowed.push(value);
    } else if (key === "sitemap") {
      sitemaps.push(value);
    }
  }

  return { rules, sitemaps, raw: txt };
}

export function testPath(
  result: RobotsResult,
  userAgent: string,
  path: string
): "allowed" | "blocked" {
  const ua = userAgent.toLowerCase();
  const specific = result.rules.find(
    (r) => r.userAgent.toLowerCase() === ua
  );
  const wildcard = result.rules.find((r) => r.userAgent === "*");
  const rule = specific ?? wildcard;
  if (!rule) return "allowed";

  const matchesPattern = (pattern: string) => {
    if (!pattern) return false;
    const escaped = pattern
      .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
      .replace(/\*/g, ".*");
    return new RegExp("^" + escaped).test(path);
  };

  const isAllowed = rule.allowed.some(matchesPattern);
  const isDisallowed = rule.disallowed.some(matchesPattern);

  if (isAllowed) return "allowed";
  if (isDisallowed) return "blocked";
  return "allowed";
}
