/**
 * Tiny inline markup parser for content strings.
 *   [[term-id]]           -> glossary reference
 *   [[term-id|display]]   -> glossary reference with custom text
 *   *text*                -> emphasis
 * Everything else is plain text. Kept deliberately small so content stays
 * readable in source and safe to render (no HTML is ever interpreted).
 */

export type InlineNode =
  | { kind: "text"; text: string }
  | { kind: "em"; text: string }
  | { kind: "term"; id: string; text?: string };

const TOKEN = /\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]|\*([^*]+)\*/g;

export function parseInline(input: string): InlineNode[] {
  const nodes: InlineNode[] = [];
  let last = 0;
  for (const match of input.matchAll(TOKEN)) {
    const index = match.index ?? 0;
    if (index > last) nodes.push({ kind: "text", text: input.slice(last, index) });
    if (match[1]) nodes.push({ kind: "term", id: match[1], text: match[2] });
    else if (match[3]) nodes.push({ kind: "em", text: match[3] });
    last = index + match[0].length;
  }
  if (last < input.length) nodes.push({ kind: "text", text: input.slice(last) });
  return nodes;
}

/** All glossary ids referenced in a string. */
export function termRefs(input: string): string[] {
  return parseInline(input).flatMap((n) => (n.kind === "term" ? [n.id] : []));
}

/** Plain-text version of a content string (for metadata, search and screen-reader summaries). */
export function toPlainText(input: string, termLookup?: (id: string) => string | undefined): string {
  return parseInline(input)
    .map((n) => (n.kind === "term" ? (n.text ?? termLookup?.(n.id) ?? n.id) : n.text))
    .join("");
}
