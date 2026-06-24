import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { TextReveal } from "@/components/TextReveal";
import { Visual } from "@/components/Visual";
import { docChapters, getDocChapter, getNextDocChapter } from "@/content/docs";
import { InlineToken, MarkdownBlock, parseMarkdown, readDocMarkdown } from "@/lib/docsMarkdown";

export function generateStaticParams() {
  return docChapters.map((chapter) => ({ slug: chapter.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const chapter = getDocChapter(params.slug);

  return {
    title: `${chapter.title} | MTPX Docs`,
    description: chapter.summary
  };
}

export default function DocDetailPage({ params }: { params: { slug: string } }) {
  const chapter = getDocChapter(params.slug);
  const next = getNextDocChapter(params.slug);
  const markdown = readDocMarkdown(chapter.sourcePath);
  const parsed = parseMarkdown(markdown);

  return (
    <main className="page-shell doc-detail">
      <section className="case-hero doc-hero">
        <TextReveal text={parsed.title} as="h1" />
        <div className="case-hero__info">
          <Meta label="Section" value={chapter.group} />
          <Meta label="Track" value={chapter.track} />
          <Meta label="Order" value={`No.${chapter.order}`} />
          <Link href="/docs">All docs <ArrowUpRight size={18} /></Link>
        </div>
        <p>{chapter.summary}</p>
        <Visual title={chapter.title} colors={chapter.palette} />
      </section>

      <section className="case-overview doc-overview">
        <h2>use case</h2>
        <p>{chapter.useCase}</p>
        <ul>{chapter.bullets.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>

      <section className="doc-explain">
        <div>
          <span>01 / explanation</span>
          <h2>What this page is responsible for</h2>
        </div>
        <p>{chapter.explanation}</p>
      </section>

      <section className="doc-code-block">
        <div>
          <span>02 / implementation</span>
          <h2>{parsed.hasCode ? "Syntax starter" : "Minimal pattern"}</h2>
        </div>
        <pre>
          <code>{chapter.code}</code>
        </pre>
      </section>

      <section className="doc-manual-section" aria-labelledby="full-documentation">
        <div className="doc-manual-section__intro">
          <span>03 / documentation</span>
          <h2 id="full-documentation">Full documentation</h2>
          <p>
            This section renders the selected source manual with its syntax,
            code snippets, tables, linked references, and implementation notes.
          </p>
        </div>
        <article className="doc-markdown">
          {parsed.blocks.map((block, index) => (
            <MarkdownBlockView
              block={block}
              chapterSourcePath={chapter.sourcePath}
              key={`${block.type}-${index}`}
            />
          ))}
        </article>
      </section>

      <section className="case-process doc-process">
        {["Read", "Wire", "Observe", "Harden"].map((step, index) => (
          <div key={step}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{step}</h3>
            <p>{processCopy(step, chapter.title)}</p>
          </div>
        ))}
      </section>

      <section className="next-project doc-next">
        <span>Next doc</span>
        <Link href={`/docs/${next.slug}`}>{next.title}</Link>
      </section>
    </main>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function processCopy(step: string, title: string) {
  if (step === "Read") return `Understand where ${title} sits in the agent loop before adding abstractions.`;
  if (step === "Wire") return "Connect the smallest useful provider, registry, store, or event stream first.";
  if (step === "Observe") return "Expose events, logs, results, and failure states while the runtime is still moving.";
  return "Add policy, tests, retries, and audit traces after the behavior is visible.";
}

function MarkdownBlockView({ block, chapterSourcePath }: { block: MarkdownBlock; chapterSourcePath: string }) {
  if (block.type === "heading") {
    const HeadingTag = `h${Math.min(Math.max(block.level, 2), 4)}` as "h2" | "h3" | "h4";
    return (
      <HeadingTag id={block.id}>
        <InlineTokens tokens={block.tokens} chapterSourcePath={chapterSourcePath} />
      </HeadingTag>
    );
  }

  if (block.type === "paragraph") {
    return (
      <p>
        <InlineTokens tokens={block.tokens} chapterSourcePath={chapterSourcePath} />
      </p>
    );
  }

  if (block.type === "quote") {
    return (
      <blockquote>
        <InlineTokens tokens={block.tokens} chapterSourcePath={chapterSourcePath} />
      </blockquote>
    );
  }

  if (block.type === "list") {
    const ListTag = block.ordered ? "ol" : "ul";
    return (
      <ListTag>
        {block.items.map((item, index) => (
          <li key={index}>
            <InlineTokens tokens={item} chapterSourcePath={chapterSourcePath} />
          </li>
        ))}
      </ListTag>
    );
  }

  if (block.type === "table") {
    return (
      <div className="doc-markdown__table-wrap">
        <table>
          <thead>
            <tr>
              {block.headers.map((header, index) => (
                <th key={index}>
                  <InlineTokens tokens={header} chapterSourcePath={chapterSourcePath} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>
                    <InlineTokens tokens={cell} chapterSourcePath={chapterSourcePath} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <pre className="doc-markdown__code">
      <span>{block.language}</span>
      <code>{block.value}</code>
    </pre>
  );
}

function InlineTokens({ tokens, chapterSourcePath }: { tokens: InlineToken[]; chapterSourcePath: string }) {
  return (
    <>
      {tokens.map((token, index) => {
        if (token.type === "code") return <code key={index}>{token.value}</code>;
        if (token.type === "strong") return <strong key={index}>{token.value}</strong>;
        if (token.type === "link") {
          return (
            <Link href={resolveMarkdownHref(token.href, chapterSourcePath)} key={index}>
              {token.value}
            </Link>
          );
        }
        return <span key={index}>{token.value}</span>;
      })}
    </>
  );
}

function resolveMarkdownHref(href: string, chapterSourcePath: string) {
  if (/^(https?:|mailto:|#)/.test(href)) return href;

  const [targetPath, hash = ""] = href.split("#");
  const sourceDir = chapterSourcePath.split("/").slice(0, -1).join("/");
  const normalizedTarget = normalizeDocPath(`${sourceDir}/${targetPath}`);
  const linkedChapter = docChapters.find((chapter) => normalizeDocPath(chapter.sourcePath) === normalizedTarget);
  const suffix = hash ? `#${hash}` : "";

  return linkedChapter ? `/docs/${linkedChapter.slug}${suffix}` : href;
}

function normalizeDocPath(value: string) {
  const parts: string[] = [];

  value
    .replace(/\\/g, "/")
    .split("/")
    .forEach((part) => {
      if (!part || part === ".") return;
      if (part === "..") {
        parts.pop();
        return;
      }
      parts.push(part);
    });

  return parts.join("/");
}
