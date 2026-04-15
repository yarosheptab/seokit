"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

interface Hop { url: string; status: number; ms: number; }

const TABS = [{ key: "url", label: "Enter URL" }];

function statusColor(s: number): string {
  if (s >= 200 && s < 300) return "var(--accent)";
  if (s >= 300 && s < 400) return "var(--score-yellow)";
  return "var(--score-red)";
}

export default function RedirectCheckerPage() {
  const [url, setUrl] = useState("");
  const [hops, setHops] = useState<Hop[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function check() {
    if (!url) return;
    setLoading(true); setError(""); setHops([]);
    try {
      const res = await fetch(`/api/redirects?url=${encodeURIComponent(url)}`);
      const j = await res.json();
      if (j.error) { setError(j.error); return; }
      setHops(j.hops ?? []);
    } catch { setError("Network error"); }
    finally { setLoading(false); }
  }

  const inputArea = (
    <>
      <div className="flex overflow-hidden rounded" style={{ border: "1px solid var(--border-2)" }}>
        <input type="url" value={url} onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && check()}
          placeholder="https://example.com/redirect-me"
          className="flex-1 px-4 py-3 text-sm outline-none bg-transparent"
          style={{ fontFamily: "var(--font-mono)", color: "var(--fg)", minWidth: 0 }}
        />
        <button onClick={check} disabled={loading}
          className="px-5 py-3 text-sm font-semibold text-white"
          style={{ background: "var(--accent)", border: "none", cursor: "pointer" }}>
          {loading ? "Tracing…" : "Trace Redirects →"}
        </button>
      </div>
      {error && <p className="mt-3 text-sm" style={{ color: "var(--score-red)" }}>{error}</p>}
    </>
  );

  const resultsArea = hops.length > 0 ? (
    <div>
      <p className="text-xs font-medium uppercase tracking-widest mb-4"
        style={{ fontFamily: "var(--font-mono)", color: "var(--subtle)" }}>
        Redirect Chain — {hops.length} hop{hops.length !== 1 ? "s" : ""}
      </p>
      <div className="rounded overflow-hidden"
        style={{ background: "var(--surface)", border: "1px solid var(--border-2)" }}>
        {hops.map((hop, i) => {
          const isFinal = i === hops.length - 1;
          return (
            <div key={i} className="flex items-start gap-4 px-4 py-3"
              style={{
                borderBottom: !isFinal ? "1px solid var(--border)" : "none",
                background: isFinal ? "var(--accent-light)" : "transparent",
              }}>
              <span className="text-xs font-semibold min-w-[2rem] mt-0.5"
                style={{ fontFamily: "var(--font-mono)", color: "var(--subtle)" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-sm font-bold min-w-[3.5rem]"
                style={{ color: statusColor(hop.status), fontFamily: "var(--font-mono)" }}>
                {hop.status}
              </span>
              <span className="flex-1 text-sm break-all"
                style={{ color: "var(--fg)", fontFamily: "var(--font-mono)" }}>
                {hop.url}
                {isFinal && (
                  <span className="ml-2 text-xs font-semibold" style={{ color: "var(--accent)" }}>
                    ← final
                  </span>
                )}
              </span>
              <span className="text-xs ml-2 whitespace-nowrap"
                style={{ color: "var(--subtle)" }}>{hop.ms}ms</span>
            </div>
          );
        })}
      </div>
    </div>
  ) : null;

  return (
    <ToolLayout
      title="Redirect Checker"
      description="Trace redirect chains from any URL — see each hop, status code, and final destination."
      tabs={TABS} activeTab="url" onTabChange={() => {}}
      inputArea={inputArea} resultsArea={resultsArea}
    />
  );
}
