"use client";

interface Tab {
  key: string;
  label: string;
}

interface ToolLayoutProps {
  title: string;
  description: string;
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
  inputArea: React.ReactNode;
  resultsArea: React.ReactNode;
}

export default function ToolLayout({
  title,
  description,
  tabs,
  activeTab,
  onTabChange,
  inputArea,
  resultsArea,
}: ToolLayoutProps) {
  return (
    <div
      style={{
        background: "var(--body-bg)",
        minHeight: "calc(100vh - 60px)",
      }}
    >
      {/* Tool header */}
      <div
        className="px-6 py-5"
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--border-2)",
        }}
      >
        <div className="max-w-3xl mx-auto">
          <h1
            className="text-2xl font-bold mb-1"
            style={{ color: "var(--fg)", letterSpacing: "-0.03em" }}
          >
            {title}
          </h1>
          <p className="text-sm" style={{ color: "var(--muted-fg)" }}>
            {description}
          </p>
        </div>
      </div>

      {/* Input tabs */}
      <div
        className="px-6 py-5"
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--border-2)",
        }}
      >
        <div className="max-w-3xl mx-auto">
          {tabs.length > 1 && (
            <div className="flex gap-1 mb-5">
              {tabs.map((t) => {
                const active = t.key === activeTab;
                return (
                  <button
                    key={t.key}
                    onClick={() => onTabChange(t.key)}
                    className="text-sm px-3 py-1.5 transition-colors duration-150"
                    style={{
                      background: "transparent",
                      color: active ? "var(--accent)" : "var(--subtle)",
                      border: "none",
                      borderBottom: active ? "2px solid var(--accent)" : "2px solid transparent",
                      cursor: "pointer",
                      fontWeight: active ? 600 : 500,
                      paddingBottom: "0.5rem",
                    }}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          )}
          {inputArea}
        </div>
      </div>

      {/* Results */}
      {resultsArea && (
        <div className="px-6 py-6">
          <div className="max-w-3xl mx-auto">{resultsArea}</div>
        </div>
      )}
    </div>
  );
}
