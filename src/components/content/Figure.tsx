import Image from "next/image";
import type { VisualKind } from "@/lib/content-schema";

const kindLabel: Record<VisualKind, string> = {
  photograph: "Photograph",
  illustration: "Illustration",
  diagram: "Diagram",
  reconstruction: "Scientific reconstruction",
  simulation: "Simulation",
  data: "Data visualisation",
};

type FigureProps = {
  src: string;
  /** Descriptive alt text; pass "" only for purely decorative images. */
  alt: string;
  width: number;
  height: number;
  kind: VisualKind;
  caption: string;
  credit: string;
  /** Licence or provenance, e.g. "Public domain (NASA)". */
  licence: string;
  priority?: boolean;
  sizes?: string;
};

/**
 * Image with caption, credit, licence and an explicit kind label, so a
 * reconstruction or illustration is never mistaken for a photograph.
 * Uses next/image for responsive sizes, modern formats and reserved space.
 */
export function Figure({ src, alt, width, height, kind, caption, credit, licence, priority, sizes = "(min-width: 1024px) 60rem, 100vw" }: FigureProps) {
  return (
    <figure className="my-10">
      <div className="overflow-hidden rounded-xl border border-border-dark bg-ink">
        <Image src={src} alt={alt} width={width} height={height} sizes={sizes} priority={priority} className="h-auto w-full" />
      </div>
      <figcaption className="mt-3 text-sm text-muted">
        <span className="eyebrow mr-2 text-chapter">{kindLabel[kind]}</span>
        {caption} <span className="text-text-light/70">Credit: {credit}. {licence}.</span>
      </figcaption>
    </figure>
  );
}
