import Link from "next/link"

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", padding: "0 24px", height: "52px", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "11px", color: "var(--muted-fg)" }}>
      <a href="https://yaro-labs.com" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
        © {new Date().getFullYear()} Yaro Labs
      </a>
      <div style={{ display: "flex", gap: "14px" }}>
        {["/privacy|Privacy", "/terms|Terms", "/cookies|Cookies", "/about|About", "/blog|Blog"].map(s => {
          const [href, label] = s.split("|")
          return <Link key={href} href={href} style={{ color: "inherit", textDecoration: "none" }}>{label}</Link>
        })}
      </div>
    </footer>
  )
}
