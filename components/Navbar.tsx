"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Tools" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      style={{ background: "var(--nav-bg)", height: 60 }}
      className="flex items-center justify-between px-6 w-full sticky top-0 z-50"
    >
      <Link
        href="/"
        className="text-white font-semibold text-base tracking-tight"
      >
        seo<span style={{ color: "var(--accent)" }}>kit</span>
      </Link>

      <div className="flex gap-1">
        {links.map((l) => {
          const toolPaths = ["/meta-analyzer", "/sitemap-validator", "/keyword-density", "/robots-tester", "/redirect-checker", "/schema-validator"];
          const isToolPage = toolPaths.some((p) => pathname.startsWith(p));
          const active =
            l.href === "/"
              ? pathname === "/" || isToolPage
              : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-1 rounded text-sm transition-colors duration-150"
              style={{ color: active ? "#ffffff" : "var(--nav-text)" }}
            >
              {l.label}
            </Link>
          );
        })}
      </div>

      <Link
        href="/#tools"
        className="text-white text-sm font-semibold px-4 py-2 rounded transition-colors duration-150 hover:opacity-90"
        style={{ background: "var(--accent)", borderRadius: "var(--radius)" }}
      >
        Try a tool →
      </Link>
    </nav>
  );
}
