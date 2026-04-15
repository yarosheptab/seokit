"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { parseRobots, testPath, RobotsResult } from "@/lib/robotsParser";

const TABS = [{ key: "url", label: "Enter URL" }];

export default function RobotsTesterPage() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<RobotsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [testUa, setTestUa] = useState("Googlebot");
  const [testPathInput, setTestPathInput] = useState("/");
  const [pathResult, setPathResult] = useState<"allowed" | "blocked" | null>(null);

  async function fetchAndParse() {
    if (!url) return;
    setLoading(true); setError(""); setResult(null); setPathResult(null);
    try {
      let target = url;
      if (!url.includes("robots.txt")) {
        const u = new URL(url.startsWith("http") ? url : "https://" + url);
        target = u.origin + "/robots.txt";
      }
      const res = await fetch(`/api/fetch?url=${encodeURIComponent(target)}`);
      if (!res.ok) { setError("Fetch failed"); return; }
      const text = await res.text();
      setResult(parseRobots(text));
    } catch { setError("Network error"); }
    finally { setLoading(false); }
  }

  const inputArea = (
    <>
      <div className="flex overflow-hidden rounded" style={{ border: "1px solid var(--border-2)" }}>
        <input type="url" value={url} onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchAndParse()}
          placeholder="https://example.com"
          className="flex-1 px-4 py-3 text-sm outline-none bg-transparent"
          style={{ fontFamily: "var(--font-mono)", color: "var(--fg)", minWidth: 0 }}
        />
        <button onClick={fetchAndParse} disabled={loading}
          className="px-5 py-3 text-sm font-semibold text-white"
          style={{ background: "var(--accent)", border: "none", cursor: "pointer" }}>
          {loading ? "Fetching…" : "Fetch Robots.txt →"}
        </button>
      </div>
      {error && <p className="mt-3 text-sm" style={{ color: "var(--score-red)" }}>{error}</p>}
    </>
  );

  const resultsArea = result ? (
    <div>
      <p className="text-xs font-medium uppercase tracking-widest mb-4"
        style={{ fontFamily: "var(--font-mono)", color: "var(--subtle)" }}>Parsed Rules</p>
      <div className="rounded overflow-hidden mb-6"
        style={{ background: "var(--surface)", border: "1px solid var(--border-2)" }}>
        {result.rules.length === 0 && (
          <p className="px-4 py-3 text-sm" style={{ color: "var(--muted-fg)" }}>No rules found.</p>
        )}
        {result.rules.map((rule, i) => (
          <div key={i} className="px-4 py-3"
            style={{ borderBottom: i < result.rules.length - 1 ? "1px solid var(--border)" : "none" }}>
            <p className="text-xs font-semibold mb-1.5"
              style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}>
              User-agent: {rule.userAgent}
            </p>
            {rule.disallowed.map((d, j) => (
              <p key={j} className="text-xs" style={{ color: "var(--score-red)", fontFamily: "var(--font-mono)" }}>
                Disallow: {d}
              </p>
            ))}
            {rule.allowed.map((a, j) => (
              <p key={j} className="text-xs" style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}>
                Allow: {a}
              </p>
            ))}
          </div>
        ))}
        {result.sitemaps.map((s, i) => (
          <div key={i} className="px-4 py-2" style={{ borderTop: "1px solid var(--border)" }}>
            <p className="text-xs" style={{ fontFamily: "var(--font-mono)", color: "var(--muted-fg)" }}>
              Sitemap: {s}
            </p>
          </div>
        ))}
      </div>

      <p className="text-xs font-medium uppercase tracking-widest mb-3"
        style={{ fontFamily: "var(--font-mono)", color: "var(--subtle)" }}>Test a Path</p>
      <div className="flex gap-3 mb-3 flex-wrap">
        <input value={testUa} onChange={(e) => setTestUa(e.target.value)}
          placeholder="User-agent (e.g. Googlebot)"
          className="rounded px-3 py-2 text-sm outline-none"
          style={{ border: "1px solid var(--border-2)", fontFamily: "var(--font-mono)", color: "var(--fg)", background: "var(--surface)", flex: "0 0 200px" }}
        />
        <input value={testPathInput} onChange={(e) => setTestPathInput(e.target.value)}
          placeholder="/path/to/test"
          className="rounded px-3 py-2 text-sm outline-none flex-1"
          style={{ border: "1px solid var(--border-2)", fontFamily: "var(--font-mono)", color: "var(--fg)", background: "var(--surface)", minWidth: 120 }}
        />
        <button onClick={() => setPathResult(testPath(result, testUa, testPathInput))}
          className="px-4 py-2 text-sm font-semibold text-white rounded"
          style={{ background: "var(--accent)", border: "none", cursor: "pointer" }}>
          Test
        </button>
      </div>
      {pathResult && (
        <div className="rounded p-4"
          style={{
            background: pathResult === "allowed" ? "var(--accent-light)" : "#fef2f2",
            border: `1px solid ${pathResult === "allowed" ? "#a7f3d0" : "#fecaca"}`,
          }}>
          <p className="text-sm font-semibold"
            style={{ color: pathResult === "allowed" ? "var(--accent)" : "var(--score-red)" }}>
            {pathResult === "allowed" ? "✓ Allowed" : "✗ Blocked"} — {testUa} is {pathResult} on {testPathInput}
          </p>
        </div>
      )}
    </div>
  ) : null;

  return (
    <ToolLayout
      title="Robots.txt Tester"
      description="Fetch and parse robots.txt files. Test which paths are allowed or blocked for any user-agent."
      tabs={TABS} activeTab="url" onTabChange={() => {}}
      inputArea={inputArea} resultsArea={resultsArea}
    />
  );
}
