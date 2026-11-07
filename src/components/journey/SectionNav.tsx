"use client";

import { useEffect, useState } from "react";

type Item = { id: string; title: string };

/**
 * "In this chapter" rail on wide screens. Highlights the section being read.
 * Sits beside the reading column so it never covers content. Hidden below lg;
 * small screens use the reading-progress bar and the chapter menu instead.
 */
export function SectionNav({ items }: { items: Item[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const targets = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => Boolean(el));
    if (!("IntersectionObserver" in window) || !targets.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="In this chapter" className="hidden lg:block">
      <div className="sticky top-[calc(var(--header-height)+4.5rem)] pt-20">
        <p className="eyebrow text-muted">In this chapter</p>
        <ol className="mt-4 grid gap-1 border-l border-border-dark text-sm">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active === item.id ? "location" : undefined}
                className={`-ml-px block border-l py-1.5 pl-4 transition-colors ${
                  active === item.id ? "border-chapter text-text-light" : "border-transparent text-muted hover:text-text-light"
                }`}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
