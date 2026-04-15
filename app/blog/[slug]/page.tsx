import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div style={{ background: "var(--body-bg)", minHeight: "calc(100vh - 60px)" }}>
      <article className="max-w-2xl mx-auto px-6 py-12">
        <p
          className="text-xs mb-3"
          style={{ fontFamily: "var(--font-mono)", color: "var(--subtle)" }}
        >
          {post.date}
        </p>
        <h1
          className="text-3xl font-bold mb-8"
          style={{ color: "var(--fg)", letterSpacing: "-0.03em" }}
        >
          {post.title}
        </h1>
        {/* Content is generated from local markdown files only — not user input */}
        <div
          className="prose-content"
          style={{ color: "var(--fg)", lineHeight: 1.75 }}
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>
    </div>
  );
}
