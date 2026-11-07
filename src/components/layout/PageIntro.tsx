import { SplitWords } from "@/components/motion/SplitWords";

type PageIntroProps = {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
  id?: string;
};

/** Standard opening for secondary pages (timeline, evidence, sources, about). */
export function PageIntro({ eyebrow, title, children, id = "page-title" }: PageIntroProps) {
  return (
    <header className="relative isolate overflow-hidden border-b border-border-dark">
      <div aria-hidden="true" className="starfield absolute inset-0 -z-10 opacity-40" />
      <div className="container-wide pt-20 pb-14 md:pt-28 md:pb-20">
        <p className="eyebrow text-accent">{eyebrow}</p>
        <h1 id={id} className="mt-4 max-w-4xl font-display text-[length:var(--text-h1)]">
          <SplitWords text={title} className="split-load" />
        </h1>
        {children ? (
          <div className="mt-6 max-w-2xl text-[length:var(--text-lead)] leading-relaxed text-text-light/85">
            {children}
          </div>
        ) : null}
      </div>
    </header>
  );
}
