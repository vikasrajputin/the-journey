"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useState } from "react";
import type { SearchRecord } from "@/lib/search-index";
import { search } from "@/lib/search";

/** Client-side search over a build-time index. Nothing is sent anywhere. */
export function SiteSearch({ records }: { records: SearchRecord[] }) {
  const [query, setQuery] = useState("");
  const id = useId();

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    if (q) setQuery(q);
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (query) url.searchParams.set("q", query);
    else url.searchParams.delete("q");
    window.history.replaceState(null, "", url);
  }, [query]);

  const hits = useMemo(() => search(records, query), [records, query]);
  const trimmed = query.trim();

  return (
    <div className="search-js">
      <form role="search" action="/search" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor={id} className="eyebrow text-muted">
          Search the exhibition
        </label>
        <input
          id={id}
          name="q"
          type="search"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try “oxygen”, “Neanderthals” or “radiocarbon”"
          className="mt-2 block w-full rounded-xl border border-border-dark bg-panel px-5 py-4 text-lg text-text-light placeholder:text-muted"
        />
      </form>
      <p className="mt-3 text-sm text-muted" aria-live="polite">
        {trimmed.length > 1 ? (hits.length ? `${hits.length}${hits.length === 40 ? "+" : ""} results for “${trimmed}”.` : `No results for “${trimmed}”. Try a shorter or different word.`) : ""}
      </p>
      {hits.length ? (
        <ol className="mt-6 grid gap-3">
          {hits.map(({ record, snippet }) => (
            <li key={record.href + record.title}>
              <Link href={record.href} className="search-result">
                <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="eyebrow text-accent">{record.kind}</span>
                  <span className="text-xs text-muted">{record.context}</span>
                </span>
                <span className="mt-1 block font-display text-xl text-text-light">{record.title}</span>
                <span className="mt-1 block text-sm text-text-light/75">
                  {snippet.before}
                  {snippet.match ? <mark>{snippet.match}</mark> : null}
                  {snippet.after}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
