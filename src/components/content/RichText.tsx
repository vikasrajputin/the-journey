import { Fragment } from "react";
import { getGlossaryEntry } from "@/content/glossary";
import { parseInline } from "@/lib/rich-text";
import { GlossaryTerm } from "./GlossaryTerm";

/** Renders a content string with glossary terms and emphasis. Never interprets HTML. */
export function RichText({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((node, i) => {
        if (node.kind === "text") return <Fragment key={i}>{node.text}</Fragment>;
        if (node.kind === "em") return <em key={i}>{node.text}</em>;
        const entry = getGlossaryEntry(node.id);
        const label = node.text ?? entry?.term ?? node.id;
        return entry ? <GlossaryTerm key={i} id={entry.id} label={label} /> : <Fragment key={i}>{label}</Fragment>;
      })}
    </>
  );
}
