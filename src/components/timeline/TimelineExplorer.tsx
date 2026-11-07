"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { EvidenceStatus, TimelineCategory } from "@/lib/content-schema";
import { EvidenceStatusBadge } from "@/components/exhibits/EvidenceCard";
import { assignLanes, bands, categoryInfo, formatAgoShort, getZoom, position, zoomLevels, type ZoomLevel } from "@/lib/timeline-scale";

export type ExplorerEvent = {
  id: string;
  title: string;
  yearsAgo: number;
  dateLabel: string;
  category: TimelineCategory;
  summary: string;
  status: EvidenceStatus;
  chapter: { slug: string; number: number; title: string };
  sources: { id: string; title: string; url: string; organisation: string }[];
};


const MARKER = 24; // px, the minimum touch target
const LANE = 30; // px between lanes

/**
 * Interactive timeline. Events sit on a compressed, segmented scale (or a
 * true-scale zoom). Arrow keys move between events, Home and End jump to the
 * ends, and the selected event's details appear below the track. The full
 * text list on the page is the no-JavaScript fallback and holds the same content.
 */
export function TimelineExplorer({ events }: { events: ExplorerEvent[] }) {
  const [zoomId, setZoomId] = useState<ZoomLevel["id"]>("all");
  const [selectedId, setSelectedId] = useState(events[0]?.id);
  const [chapterSlug, setChapterSlug] = useState<string | null>(null);
  const [width, setWidth] = useState(1000);
  const [announcement, setAnnouncement] = useState("");
  const trackRef = useRef<HTMLDivElement>(null);
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const focusOnSelect = useRef(false);

  const zoom = getZoom(zoomId);
  const sorted = useMemo(() => [...events].sort((a, b) => b.yearsAgo - a.yearsAgo), [events]);

  const placed = useMemo(() => {
    const visible = sorted
      .map((e) => ({ e, x: position(e.yearsAgo, zoom) }))
      .filter((p): p is { e: ExplorerEvent; x: number } => p.x !== null);
    const lanes = assignLanes(visible.map((p) => p.x), (MARKER + 4) / Math.max(width, 1));
    return visible.map((p, i) => ({ ...p, lane: lanes[i] }));
  }, [sorted, zoom, width]);

  const laneCount = Math.max(1, ...placed.map((p) => p.lane + 1));
  const selectedIndex = placed.findIndex((p) => p.e.id === selectedId);
  const selected = sorted.find((e) => e.id === selectedId);
  const chapter = chapterSlug ? events.find((e) => e.chapter.slug === chapterSlug)?.chapter : undefined;

  // Read ?chapter= once, so chapter pages can link to their place in time.
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("chapter");
    const first = slug ? sorted.find((e) => e.chapter.slug === slug) : undefined;
    if (first) {
      setChapterSlug(slug);
      setSelectedId(first.id);
    }
  }, [sorted]);

  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Keep the selected marker visible in the scrollable track, and focus it after keyboard moves.
  useEffect(() => {
    if (!selectedId) return;
    const btn = buttons.current.get(selectedId);
    if (!btn) return;
    btn.scrollIntoView({ block: "nearest", inline: "nearest" });
    if (focusOnSelect.current) btn.focus({ preventScroll: true });
    focusOnSelect.current = false;
  }, [selectedId, zoomId]);

  const select = useCallback(
    (id: string, focus = false) => {
      focusOnSelect.current = focus;
      setSelectedId(id);
      const i = placed.findIndex((p) => p.e.id === id);
      const e = placed[i]?.e;
      if (e) setAnnouncement(`${e.dateLabel}: ${e.title}. Event ${i + 1} of ${placed.length}.`);
    },
    [placed],
  );

  const changeZoom = (z: ZoomLevel) => {
    setZoomId(z.id);
    const inView = sorted.filter((e) => position(e.yearsAgo, z) !== null);
    if (!inView.some((e) => e.id === selectedId) && inView[0]) setSelectedId(inView[0].id);
    setAnnouncement(`${z.label} view. ${inView.length} of ${sorted.length} events shown.`);
  };

  const step = (delta: number, focus = true) => {
    const i = selectedIndex === -1 ? 0 : Math.min(placed.length - 1, Math.max(0, selectedIndex + delta));
    if (placed[i]) select(placed[i].e.id, focus);
  };

  const onKeyDown = (ev: React.KeyboardEvent) => {
    const keys: Record<string, () => void> = {
      ArrowRight: () => step(1),
      ArrowDown: () => step(1),
      ArrowLeft: () => step(-1),
      ArrowUp: () => step(-1),
      Home: () => placed[0] && select(placed[0].e.id, true),
      End: () => placed.at(-1) && select(placed.at(-1)!.e.id, true),
    };
    const fn = keys[ev.key];
    if (fn) {
      ev.preventDefault();
      fn();
    }
  };

  const ticks = (zoom.range ? [0, 0.25, 0.5, 0.75, 1].map((f) => ({ x: f, years: zoom.range![0] - f * (zoom.range![0] - zoom.range![1]) })) : [...bands.map((b, i) => ({ x: i / bands.length, years: b.older })), { x: 1, years: 0 }]).map((t) => ({ x: t.x, label: formatAgoShort(t.years) }));

  return (
    <div className="timeline-explorer">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div role="group" aria-label="Zoom level" className="flex flex-wrap gap-2">
          {zoomLevels.map((z) => (
            <button key={z.id} type="button" aria-pressed={z.id === zoomId} onClick={() => changeZoom(z)} className="zoom-button">
              {z.label}
            </button>
          ))}
        </div>
        {chapter ? (
          <p className="text-sm text-muted">
            Highlighting Chapter {chapter.number}, {chapter.title}.{" "}
            <button type="button" className="link-quiet text-text-light underline" onClick={() => setChapterSlug(null)}>
              Clear highlight
            </button>
          </p>
        ) : null}
      </div>
      <p className="mt-4 max-w-3xl text-sm text-muted">{zoom.description}</p>

      <div className="timeline-scroller mt-6">
        <div ref={trackRef} className="timeline-track" style={{ height: laneCount * LANE + 64 }}>
          {!zoom.range
            ? bands.map((b, i) => (
                <div key={b.id} className="timeline-band" style={{ left: `${(i / bands.length) * 100}%`, width: `${100 / bands.length}%` }} aria-hidden="true">
                  <span className="timeline-band-label">{b.label}</span>
                </div>
              ))
            : null}
          <div className="timeline-axis" aria-hidden="true" />
          {ticks.map((t) => (
            <span key={t.x} aria-hidden="true" className="timeline-tick" data-edge={t.x === 0 ? "start" : t.x === 1 ? "end" : undefined} style={{ left: `${t.x * 100}%` }}>
              {t.label}
            </span>
          ))}
          <div role="group" aria-label={`Events, ${zoom.label} view. Use the arrow keys to move between events.`} onKeyDown={onKeyDown}>
            {placed.map(({ e, x, lane }, i) => {
              const isSelected = e.id === selectedId;
              const highlighted = chapterSlug ? e.chapter.slug === chapterSlug : false;
              return (
                <button
                  key={e.id}
                  ref={(el) => {
                    if (el) buttons.current.set(e.id, el);
                    else buttons.current.delete(e.id);
                  }}
                  type="button"
                  style={{ left: `calc(${x * 100}% - ${MARKER / 2}px)`, bottom: 40 + lane * LANE, ["--cat" as string]: categoryInfo[e.category].color }}
                  data-highlight={highlighted || undefined}
                  className="timeline-marker"
                  aria-pressed={isSelected}
                  aria-label={`${e.dateLabel}: ${e.title}`}
                  title={`${e.dateLabel}: ${e.title}`}
                  tabIndex={isSelected || (selectedIndex === -1 && i === 0) ? 0 : -1}
                  onClick={() => select(e.id)}
                >
                  <span aria-hidden="true" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted" aria-label="Categories">
        {Object.entries(categoryInfo).map(([key, c]) => (
          <li key={key} className="flex items-center gap-2">
            <span aria-hidden="true" className="block size-2.5 rounded-full" style={{ background: c.color }} />
            {c.label}
          </li>
        ))}
      </ul>

      <p className="sr-only" aria-live="polite">{announcement}</p>

      {selected ? (
        <section aria-labelledby="timeline-selected-title" className="timeline-detail mt-8" style={{ ["--cat" as string]: categoryInfo[selected.category].color }}>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="eyebrow text-[var(--cat)]">{categoryInfo[selected.category].label}</span>
            <EvidenceStatusBadge status={selected.status} />
          </div>
          <p className="mt-4 text-sm text-muted">{selected.dateLabel}</p>
          <h2 id="timeline-selected-title" className="mt-1 font-display text-[length:var(--text-h3)] text-text-light">
            {selected.title}
          </h2>
          <p className="mt-3 max-w-2xl text-text-light/85">{selected.summary}</p>
          <p className="mt-4 text-sm">
            <Link href={`/journey/${selected.chapter.slug}`} className="link-quiet text-accent">
              Read Chapter {selected.chapter.number}: {selected.chapter.title}
            </Link>
          </p>
          {selected.sources.length ? (
            <div className="mt-5 border-t border-border-dark pt-4 text-sm">
              <p className="eyebrow text-muted">Sources</p>
              <ul className="mt-2 grid gap-1.5">
                {selected.sources.map((s) => (
                  <li key={s.id}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="link-quiet text-text-light">
                      {s.title}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                    <span className="text-muted"> · {s.organisation}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" className="zoom-button" onClick={() => step(-1, false)} disabled={selectedIndex <= 0}>
              ← Earlier event
            </button>
            <button type="button" className="zoom-button" onClick={() => step(1, false)} disabled={selectedIndex === -1 || selectedIndex >= placed.length - 1}>
              Later event →
            </button>
          </div>
        </section>
      ) : null}

      {!zoom.range ? null : (
        <p className="mt-4 text-xs text-muted">
          {sorted.length - placed.length} events fall outside this view. Choose &ldquo;All of time&rdquo; to see every event.
        </p>
      )}
    </div>
  );
}
