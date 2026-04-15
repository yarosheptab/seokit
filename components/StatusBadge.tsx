type Status = "pass" | "warn" | "fail";

interface StatusBadgeProps {
  status: Status;
  label?: string;
}

const config: Record<Status, { icon: string; bg: string; color: string }> = {
  pass: { icon: "✓", bg: "#ecfdf5", color: "#10b981" },
  warn: { icon: "⚠", bg: "#fffbeb", color: "#d97706" },
  fail: { icon: "✗", bg: "#fef2f2", color: "#ef4444" },
};

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const c = config[status];
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded whitespace-nowrap"
      style={{
        background: c.bg,
        color: c.color,
        fontFamily: "var(--font-mono, monospace)",
      }}
    >
      {c.icon} {label ?? status}
    </span>
  );
}
