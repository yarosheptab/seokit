export interface SchemaResult {
  type: "json-ld" | "microdata";
  schemaType: string;
  data: unknown;
  issues: string[];
}

function extractJsonLd(html: string): SchemaResult[] {
  const results: SchemaResult[] = [];
  const matches = [
    ...html.matchAll(
      /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
    ),
  ];
  for (const m of matches) {
    try {
      const data = JSON.parse(m[1].trim());
      const items = Array.isArray(data) ? data : [data];
      for (const item of items) {
        const schemaType = item["@type"] ?? "Unknown";
        const issues: string[] = [];
        if (!item["@context"]) issues.push("Missing @context");
        if (!item["@type"]) issues.push("Missing @type");
        results.push({ type: "json-ld", schemaType, data: item, issues });
      }
    } catch {
      results.push({
        type: "json-ld",
        schemaType: "Invalid JSON",
        data: null,
        issues: ["JSON parse error — invalid JSON-LD block"],
      });
    }
  }
  return results;
}

function extractMicrodata(html: string): SchemaResult[] {
  const results: SchemaResult[] = [];
  const matches = [...html.matchAll(/itemtype=["']([^"']*)["']/gi)];
  for (const m of matches) {
    const schemaType = m[1].split("/").pop() ?? "Unknown";
    results.push({
      type: "microdata",
      schemaType,
      data: { itemtype: m[1] },
      issues: [],
    });
  }
  return results;
}

export function extractSchemas(html: string): SchemaResult[] {
  return [...extractJsonLd(html), ...extractMicrodata(html)];
}
