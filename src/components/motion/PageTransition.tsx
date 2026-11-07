"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { prefersStill } from "./motion-pref";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const COVER_MS = 520;

/**
 * Seamless page changes: a panel sweeps up over the page, the next page loads
 * underneath, and the panel sweeps away. Plain links still work without it.
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);
  const busy = useRef(false);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || a.target || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.search === location.search) return; // same page or a #hash
      if (BASE && !url.pathname.startsWith(BASE)) return;
      if (prefersStill() || busy.current) return;
      e.preventDefault();
      busy.current = true;
      const to = url.pathname.slice(BASE.length) + url.search + url.hash;
      const html = document.documentElement;
      html.setAttribute("data-leaving", "");
      window.setTimeout(() => router.push(to || "/"), COVER_MS);
      // Never leave the curtain down if the navigation fails.
      window.setTimeout(() => {
        if (!html.hasAttribute("data-leaving")) return;
        html.removeAttribute("data-leaving");
        busy.current = false;
      }, 5000);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router]);

  useEffect(() => {
    const html = document.documentElement;
    if (!html.hasAttribute("data-leaving")) return;
    if (!location.hash) window.scrollTo(0, 0);
    html.removeAttribute("data-leaving");
    html.setAttribute("data-arriving", "");
    const t = window.setTimeout(() => {
      html.removeAttribute("data-arriving");
      busy.current = false;
    }, 900);
    return () => window.clearTimeout(t);
  }, [pathname]);

  return (
    <div ref={panel} className="page-curtain" aria-hidden="true">
      <span>THE JOURNEY</span>
    </div>
  );
}
