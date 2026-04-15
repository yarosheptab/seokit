import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const revalidate = false;

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div style={{ background: "var(--body-bg)", minHeight: "calc(100vh - 60px)" }}>
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1
          className="text-2xl font-bold mb-8"
          style={{ color: "var(--fg)", letterSpacing: "-0.03em" }}
        >
          Blog
        </h1>
        {posts.length === 0 ? (
          <p style={{ color: "var(--muted-fg)" }}>No posts yet.</p>
        ) : (
          <div>
            {posts.map((post, i) => (
              <div key={post.slug}>
                {i > 0 && (
                  <div style={{ borderTop: "1px solid var(--border)" }} />
                )}
                <Link href={`/blog/${post.slug}`} className="block py-5">
                  <div className="flex items-baseline gap-3 mb-1">
                    <span
                      className="text-xs"
                      style={{
                        fontFamily: "var(--font-mono)",
                        color: "var(--subtle)",
                      }}
                    >
                      {post.date}
                    </span>
                  </div>
                  <h2
                    className="text-base font-semibold mb-1"
                    style={{ color: "var(--fg)" }}
                  >
                    {post.title}
                  </h2>
                  <p className="text-sm" style={{ color: "var(--muted-fg)" }}>
                    {post.excerpt}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
