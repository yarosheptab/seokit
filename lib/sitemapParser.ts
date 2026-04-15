export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

export interface SitemapResult {
  valid: boolean;
  urlCount: number;
  hasUrlset: boolean;
  hasLastmod: boolean;
  issues: string[];
  urls: SitemapUrl[];
}

const VALID_CHANGEFREQ = [
  "always","hourly","daily","weekly","monthly","yearly","never",
];

export function parseSitemap(xml: string): SitemapResult {
  const issues: string[] = [];
  const hasUrlset = /<urlset/i.test(xml);
  if (!hasUrlset) issues.push("Missing <urlset> root element");

  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((m) =>
    m[1].trim()
  );
  const lastmods = [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/gi)].map(
    (m) => m[1].trim()
  );
  const changefreqs = [
    ...xml.matchAll(/<changefreq>([^<]+)<\/changefreq>/gi),
  ].map((m) => m[1].trim());
  const priorities = [
    ...xml.matchAll(/<priority>([^<]+)<\/priority>/gi),
  ].map((m) => m[1].trim());

  const hasLastmod = lastmods.length > 0;

  changefreqs.forEach((cf) => {
    if (!VALID_CHANGEFREQ.includes(cf.toLowerCase())) {
      issues.push(`Invalid changefreq value: "${cf}"`);
    }
  });

  if (locs.length === 0) issues.push("No <url> entries found");

  const urls: SitemapUrl[] = locs.map((loc, i) => ({
    loc,
    lastmod: lastmods[i],
    changefreq: changefreqs[i],
    priority: priorities[i],
  }));

  return { valid: issues.length === 0, urlCount: locs.length, hasUrlset, hasLastmod, issues, urls };
}
