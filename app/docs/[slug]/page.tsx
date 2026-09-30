import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { CodeBlock } from "@/components/CodeBlock";
import { Showreel } from "@/components/Showreel";
import { docChapters, docsSource, getDocChapter, getNextDocChapter } from "@/content/docs";
import { getTableOfContents, readDocMarkdown, resolveMarkdownHref } from "@/lib/docsMarkdown";

export function generateStaticParams() { return docChapters.map((chapter) => ({ slug: chapter.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const chapter = getDocChapter((await params).slug);
  if (!chapter) notFound();
  return { title: `${chapter.title} | MTPX Docs`, description: chapter.summary };
}
export default async function DocDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapter = getDocChapter(slug);
  if (!chapter) notFound();
  const next = getNextDocChapter(slug);
  const markdown = readDocMarkdown(chapter.sourcePath);
  const body = markdown.replace(/^# .+\r?\n/, "");
  const headings = getTableOfContents(body);
  const screenshot = slug === "tui-operating-guide" ? "tui-setup" : slug === "cli" ? "cli" : slug === "quickstart" ? "agent" : slug === "codebase-memory" ? "memory" : null;
  const sourceHref = chapter.sourcePath.startsWith("docs/website/") || chapter.sourcePath.startsWith("docs/providers/")
    ? `https://github.com/GodBoii/MTP-Model-Tools-Protocol-/blob/main/${chapter.sourcePath}`
    : `${docsSource.repository}/blob/${docsSource.revision}/${chapter.sourcePath}`;
  return (
    <main className="page-shell manual-page" id="main-content">
      <nav className="doc-breadcrumbs" aria-label="Breadcrumb"><Link href="/docs">Documentation</Link><span aria-hidden="true">/</span><span>{chapter.group}</span></nav>
      <header className="manual-header"><span className="release-tag">MTPX {docsSource.version} / {chapter.track}</span><h1>{chapter.title}</h1><p>{chapter.summary}</p><a className="source-link" href={sourceHref}>View source document ↗</a></header>
      {screenshot && <figure className="manual-capture"><Image src={`/media/${screenshot}.png`} alt={slug === "tui-operating-guide" ? "Groq setup in the actual MTP terminal UI with a masked key field, model ID, and Save, Providers, and Cancel controls" : `${chapter.title} recorded terminal output`} width={1440} height={960} sizes="(max-width: 900px) 100vw, 900px" /><figcaption>Captured from MTPX {docsSource.version}. Offline demo.{slug === "tui-operating-guide" && <Showreel />}</figcaption></figure>}
      <div className="manual-layout">
        <aside className="manual-sidebar"><nav aria-label="On this page"><h2>On this page</h2>{headings.map((heading) => <a key={heading.id} href={`#${heading.id}`}>{heading.title}</a>)}</nav><Link href="/docs/quickstart">Start with an agent ↗</Link><Link href="/docs/tui-operating-guide">Terminal operating guide ↗</Link><Link href="/docs/release-notes">Release notes ↗</Link></aside>
        <article className="manual-body">
          <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]} components={{
            a: ({ href, children }) => <a href={resolveMarkdownHref(href ?? "", chapter.sourcePath)}>{children}</a>,
            pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
            table: ({ children }) => <div className="manual-table"><table>{children}</table></div>,
            img: ({ src, alt }) => typeof src === "string" ? <a href={resolveMarkdownHref(src, chapter.sourcePath)}>{alt || "View source image"} ↗</a> : null,
          }}>{body}</Markdown>
          <div className="manual-next"><span>Next chapter</span><Link href={`/docs/${next.slug}`}>{next.title} ↗</Link></div>
        </article>
      </div>
    </main>
  );
}
