interface ScoreRingProps {
  score: number;
  label: string;
  size?: number;
  strokeWidth?: number;
}

function scoreColor(score: number): string {
  if (score >= 80) return "#10b981";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
}

export default function ScoreRing({
  score,
  label,
  size = 80,
  strokeWidth = 6,
}: ScoreRingProps) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = scoreColor(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            transform: "rotate(90deg)",
            transformOrigin: `${size / 2}px ${size / 2}px`,
            fontFamily: "var(--font-mono, monospace)",
            fontSize: size * 0.22,
            fontWeight: 700,
            fill: color,
          }}
        >
          {score}
        </text>
      </svg>
      <span className="text-xs font-medium" style={{ color: "var(--muted-fg)" }}>
        {label}
      </span>
    </div>
  );
}
