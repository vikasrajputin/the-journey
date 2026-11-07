import { Fragment } from "react";

/**
 * Splits a line of text into words, each in a clipping mask, so CSS can slide
 * them up one after another (see .split in motion.css). Screen readers get the
 * plain text once.
 */
/** Numbers like "13.8 billion", "380,000" or "1610", so they can pop in the chapter colour. */
// Not names like "Voyager 1", "Apollo 8" or "Chandrayaan-3".
const NUMBER = /((?<!(?:Voyager|Apollo|Chandrayaan)[ -]|[\d,.])\d(?:[\d,.]*\d)?(?:\s(?:billion|million|thousand))?)/;

function withNumbers(text: string) {
  return text.split(NUMBER).map((part, i) => (i % 2 ? <b key={i} className="num">{part}</b> : part));
}

export function SplitWords({ text, className = "", whole = false, highlight = false }: { text: string; className?: string; whole?: boolean; highlight?: boolean }) {
  // `whole`: one mask for the whole text, for long captions (far cheaper than a mask per word).
  const words = whole ? [text] : text.split(" ");
  return (
    <span className={`split ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <Fragment key={i}>
            <span className="split-w" style={{ "--i": i } as React.CSSProperties}>
              <span>{highlight ? withNumbers(w) : w}</span>
            </span>
            {i < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
    </span>
  );
}
