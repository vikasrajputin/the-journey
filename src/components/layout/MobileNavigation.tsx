"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { chapters, primaryNav } from "@/data/navigation";
import { MotionToggle } from "./MotionToggle";
import { NavLink } from "./NavLink";

/**
 * Compact menu for small screens. Uses the native <dialog> element, which
 * gives focus containment, Escape-to-close and focus return for free.
 */
export function MobileNavigation() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  // Close on route change.
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  const close = () => dialogRef.current?.close();

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full px-3 text-sm text-text-light"
        aria-haspopup="dialog"
      >
        <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M4 8h16M4 16h16" />
        </svg>
        <span>Menu</span>
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Site menu"
        className="m-0 h-dvh max-h-none w-full max-w-none bg-night text-text-light backdrop:bg-night/80 open:flex open:flex-col"
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
      >
        <div className="flex h-[var(--header-height)] items-center justify-between border-b border-border-dark px-[var(--gutter)]">
          <span className="font-display text-lg tracking-[0.22em]">THE JOURNEY</span>
          <button
            type="button"
            onClick={close}
            className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full px-3 text-sm"
          >
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
            <span>Close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-[var(--gutter)] py-6">
          <nav aria-label="Primary">
            <ul className="grid gap-1">
              <li>
                <NavLink href="/" onNavigate={close} className="flex min-h-12 items-center text-lg">
                  Home
                </NavLink>
              </li>
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <NavLink href={item.href} onNavigate={close} className="flex min-h-12 items-center text-lg aria-[current=page]:text-accent">
                    {item.label}
                  </NavLink>
                </li>
              ))}
              <li>
                <NavLink href="/about" onNavigate={close} className="flex min-h-12 items-center text-lg aria-[current=page]:text-accent">
                  About
                </NavLink>
              </li>
            </ul>
          </nav>

          <h2 className="eyebrow mt-8 mb-3 text-muted">The ten chapters</h2>
          <ol className="grid gap-1">
            {chapters.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/journey/${c.slug}`}
                  onClick={close}
                  className="flex min-h-12 items-baseline gap-3 border-b border-border-dark py-2"
                >
                  <span className="w-6 shrink-0 text-sm tabular-nums text-accent">{String(c.number).padStart(2, "0")}</span>
                  <span className="font-display text-xl">{c.title}</span>
                </Link>
              </li>
            ))}
          </ol>

          <div className="mt-8">
            <MotionToggle className="-ml-3" />
          </div>
        </div>
      </dialog>
    </div>
  );
}
