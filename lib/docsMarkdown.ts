import fs from "node:fs";
import path from "node:path";

export type InlineToken =
  | { type: "text"; value: string }
  | { type: "code"; value: string }
  | { type: "link"; value: string; href: string };

export type MarkdownBlock =
  | { type: "heading"; level: number; id: string; tokens: InlineToken[] }
  | { type: "paragraph"; tokens: InlineToken[] }
  | { type: "list"; ordered: boolean; items: InlineToken[][] }
  | { type: "code"; language: string; value: string }
  | { type: "table"; headers: InlineToken[][]; rows: InlineToken[][][] }
  | { type: "quote"; tokens: InlineToken[] };

export type ParsedMarkdown = {
  title: string;
  blocks: MarkdownBlock[];
  hasCode: boolean;
};

export function readDocMarkdown(sourcePath: string) {
  const docsRoot = path.resolve(process.cwd(), "docs");
  const relativeDocPath = sourcePath.replace(/^docs[\\/]/, "");
  const absolutePath = path.resolve(docsRoot, relativeDocPath);

  if (!absolutePath.startsWith(docsRoot)) {
    throw new Error(`Doc path escapes workspace: ${sourcePath}`);
  }

  return fs.readFileSync(absolutePath, "utf8");
}

export function parseMarkdown(markdown: string): ParsedMarkdown {
  const normalized = markdown.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");
  const blocks: MarkdownBlock[] = [];
  let title = "Documentation";
  let firstHeadingConsumed = false;
  let hasCode = false;
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    const fence = line.match(/^```([\w-]*)\s*$/);
    if (fence) {
      const language = fence[1] || "text";
      const codeLines: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }
      if (index < lines.length) index += 1;
      hasCode = true;
      blocks.push({ type: "code", language, value: codeLines.join("\n") });
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      const text = stripMarkdownText(heading[2]);
      if (!firstHeadingConsumed && heading[1].length === 1) {
        title = text;
        firstHeadingConsumed = true;
        index += 1;
        continue;
      }
      blocks.push({
        type: "heading",
        level: heading[1].length,
        id: slugify(text),
        tokens: parseInline(heading[2])
      });
      index += 1;
      continue;
    }

    if (isTableStart(lines, index)) {
      const tableLines: string[] = [];
      while (index < lines.length && /^\s*\|.*\|\s*$/.test(lines[index])) {
        tableLines.push(lines[index]);
        index += 1;
      }
      const [headerLine, , ...rowLines] = tableLines;
      blocks.push({
        type: "table",
        headers: splitTableRow(headerLine).map(parseInline),
        rows: rowLines.map((row) => splitTableRow(row).map(parseInline))
      });
      continue;
    }

    const listMatch = line.match(/^(\s*)([-*]|\d+[.)])\s+(.+)$/);
    if (listMatch) {
      const ordered = /\d+[.)]/.test(listMatch[2]);
      const items: InlineToken[][] = [];
      while (index < lines.length) {
        const item = lines[index].match(/^(\s*)([-*]|\d+[.)])\s+(.+)$/);
        if (!item || /\d+[.)]/.test(item[2]) !== ordered) break;
        items.push(parseInline(item[3]));
        index += 1;
      }
      blocks.push({ type: "list", ordered, items });
      continue;
    }

    const quote = line.match(/^>\s?(.+)$/);
    if (quote) {
      const quoteLines: string[] = [];
      while (index < lines.length) {
        const quoted = lines[index].match(/^>\s?(.+)$/);
        if (!quoted) break;
        quoteLines.push(quoted[1]);
        index += 1;
      }
      blocks.push({ type: "quote", tokens: parseInline(quoteLines.join(" ")) });
      continue;
    }

    const paragraphLines: string[] = [];
    while (index < lines.length && shouldContinueParagraph(lines, index)) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }
    blocks.push({ type: "paragraph", tokens: parseInline(paragraphLines.join(" ")) });
  }

  return { title, blocks, hasCode };
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/`/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function shouldContinueParagraph(lines: string[], index: number) {
  const line = lines[index];
  const next = lines[index + 1];
  if (!line.trim()) return false;
  if (/^```/.test(line)) return false;
  if (/^#{1,4}\s+/.test(line)) return false;
  if (/^(\s*)([-*]|\d+[.)])\s+/.test(line)) return false;
  if (/^>\s?/.test(line)) return false;
  if (next && isTableStart(lines, index)) return false;
  return true;
}

function isTableStart(lines: string[], index: number) {
  const current = lines[index];
  const next = lines[index + 1];
  return Boolean(
    current &&
      next &&
      /^\s*\|.*\|\s*$/.test(current) &&
      /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(next)
  );
}

function splitTableRow(line: string) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function parseInline(value: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  const pattern = /(`[^`]+`)|\[([^\]]+)\]\(([^)]+)\)/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(value))) {
    if (match.index > cursor) {
      tokens.push({ type: "text", value: value.slice(cursor, match.index) });
    }

    if (match[1]) {
      tokens.push({ type: "code", value: match[1].slice(1, -1) });
    } else {
      tokens.push({ type: "link", value: match[2], href: match[3] });
    }

    cursor = pattern.lastIndex;
  }

  if (cursor < value.length) {
    tokens.push({ type: "text", value: value.slice(cursor) });
  }

  return tokens;
}

function stripMarkdownText(value: string) {
  return value
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .trim();
}
