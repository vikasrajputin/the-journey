import { Fragment } from "react";

/**
 * Splits a line of text into words, each in a clipping mask, so CSS can slide
 * them up one after another (see .split in motion.css). Screen readers get the
 * plain text once.
 */
export function SplitWords({ text, className = "", whole = false }: { text: string; className?: string; whole?: boolean }) {
  // `whole`: one mask for the whole text, for long captions (far cheaper than a mask per word).
  const words = whole ? [text] : text.split(" ");
  return (
    <span className={`split ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <Fragment key={i}>
            <span className="split-w" style={{ "--i": i } as React.CSSProperties}>
              <span>{w}</span>
            </span>
            {i < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
    </span>
  );
}
