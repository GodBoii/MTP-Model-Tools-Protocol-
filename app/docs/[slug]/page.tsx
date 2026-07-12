import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { TextReveal } from "@/components/TextReveal";
import { Visual } from "@/components/Visual";
import { docChapters, getDocChapter, getNextDocChapter } from "@/content/docs";
import { InlineToken, MarkdownBlock, parseMarkdown, readDocMarkdown } from "@/lib/docsMarkdown";

export function generateStaticParams() {
  return docChapters.map((chapter) => ({ slug: chapter.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapter = getDocChapter(slug);

  return {
    title: `${chapter.title} | MTPX Docs`,
    description: chapter.summary
  };
}

export default async function DocDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapter = getDocChapter(slug);
  const next = getNextDocChapter(slug);
  const markdown = readDocMarkdown(chapter.sourcePath);
  const parsed = parseMarkdown(markdown);

  return (
    <main className="page-shell doc-detail">
      <section className="case-hero doc-hero">
        <TextReveal text={parsed.title} as="h1" />
        <p>{chapter.summary}</p>
        <Visual title={chapter.title} colors={chapter.palette} />
      </section>

      <section className="doc-chapter-bar" aria-label="Chapter information">
        <span>Chapter {chapter.order}</span>
        <span>{chapter.group}</span>
        <span>{chapter.track}</span>
        <Link href="/docs">Index <ArrowUpRight size={16} /></Link>
      </section>

      <section className="doc-primer">
        <div className="doc-primer__label"><span>01</span><strong>Orientation</strong></div>
        <div className="doc-primer__copy">
          <p>{chapter.explanation}</p>
          <h2>Use this when</h2>
          <p>{chapter.useCase}</p>
          <ul>{chapter.bullets.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div className="doc-primer__code">
          <span>02 / {parsed.hasCode ? "syntax starter" : "minimal pattern"}</span>
          <pre><code>{chapter.code}</code></pre>
        </div>
      </section>

      <section className="doc-manual-section" aria-labelledby="full-documentation">
        <div className="doc-manual-section__intro">
          <span>03 / manual</span>
          <h2 id="full-documentation">Read the system</h2>
          <p>The complete source manual—syntax, examples, linked references, edge cases, and implementation notes.</p>
          <Link href="/docs">Documentation index ↗</Link>
        </div>
        <article className="doc-manual">
          {groupManualBlocks(parsed.blocks).map((blocks, sectionIndex) => (
            <section className="doc-content-section" key={sectionIndex}>
              <div className="doc-content-section__label">
                <span>{String(sectionIndex + 1).padStart(2, "0")}</span>
                <span>{sectionLabel(blocks)}</span>
              </div>
              <div className="doc-markdown">
                {blocks.map((block, blockIndex) => (
                  <MarkdownBlockView
                    block={block}
                    chapterSourcePath={chapter.sourcePath}
                    key={`${block.type}-${blockIndex}`}
                  />
                ))}
              </div>
            </section>
          ))}
        </article>
      </section>

      <section className="case-process doc-process" aria-label="Implementation sequence">
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

function processCopy(step: string, title: string) {
  if (step === "Read") return `Understand where ${title} sits in the agent loop before adding abstractions.`;
  if (step === "Wire") return "Connect the smallest useful provider, registry, store, or event stream first.";
  if (step === "Observe") return "Expose events, logs, results, and failure states while the runtime is still moving.";
  return "Add policy, tests, retries, and audit traces after the behavior is visible.";
}

function groupManualBlocks(blocks: MarkdownBlock[]) {
  const groups: MarkdownBlock[][] = [];
  let current: MarkdownBlock[] = [];

  blocks.forEach((block) => {
    const startsSection = block.type === "heading" && block.level === 2;
    const currentHasSection = current.some((item) => item.type === "heading" && item.level === 2);
    if (startsSection && currentHasSection) {
      groups.push(current);
      current = [];
    }
    current.push(block);
  });
  if (current.length) groups.push(current);

  return groups.reduce<MarkdownBlock[][]>((merged, group) => {
    const previous = merged[merged.length - 1];
    if (previous && previous.length === 1 && previous[0].type === "heading") {
      previous.push(...group);
      return merged;
    }
    merged.push(group);
    return merged;
  }, []);
}

function sectionLabel(blocks: MarkdownBlock[]) {
  const heading = blocks.find((block) => block.type === "heading");
  if (!heading || heading.type !== "heading") return "overview";
  return heading.tokens.map((token) => token.value).join("").slice(0, 28);
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
