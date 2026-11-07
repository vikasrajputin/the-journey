"use client";

import { useEffect, useId, useState } from "react";

/**
 * Filters the server-rendered source list in place. Without JavaScript the
 * field is hidden and the full list is shown.
 */
export function SourceFilter({ total }: { total: number }) {
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState(total);
  const id = useId();

  useEffect(() => {
    const q = query.trim().toLowerCase();
    let count = 0;
    document.querySelectorAll<HTMLElement>("[data-source-item]").forEach((el) => {
      const match = !q || (el.dataset.search ?? "").includes(q);
      el.hidden = !match;
      if (match) count++;
    });
    document.querySelectorAll<HTMLElement>("[data-source-group]").forEach((g) => {
      g.hidden = !g.querySelector("[data-source-item]:not([hidden])");
    });
    setShown(count);
  }, [query]);

  return (
    <div className="source-filter">
      <label htmlFor={id} className="eyebrow text-muted">
        Filter sources
      </label>
      <input
        id={id}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Try “radiocarbon”, “museum” or “Moon”"
        className="mt-2 block w-full max-w-md rounded-lg border border-border-dark bg-panel px-4 py-3 text-text-light placeholder:text-muted"
      />
      <p className="mt-2 text-sm text-muted" aria-live="polite">
        {query ? `${shown} of ${total} entries match.` : `${total} entries. Some sources appear under more than one chapter.`}
      </p>
    </div>
  );
}
