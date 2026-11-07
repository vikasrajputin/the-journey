"use client";

import { useEffect } from "react";

/**
 * Finishes the card-to-chapter move: once the chapter's own opening picture is
 * ready underneath, the full-screen copy from the chapter list fades away.
 */
export function ExpandLanding() {
  useEffect(() => {
    const clone = document.querySelector<HTMLElement>(".expand-clone");
    const html = document.documentElement;
    if (!clone) return;
    window.scrollTo(0, 0);
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      html.removeAttribute("data-expanding");
      html.setAttribute("data-landed", "");
      const a = clone.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 650, easing: "ease-out", fill: "forwards" });
      a.onfinish = () => clone.remove();
      window.setTimeout(() => html.removeAttribute("data-landed"), 1600);
    };
    const hero = document.querySelector<HTMLElement>(".chapter-hero-img, .chapter-hero video");
    const url = hero instanceof HTMLVideoElement ? hero.poster : hero?.style.backgroundImage.match(/url\("(.+)"\)/)?.[1];
    if (url) {
      const img = new Image();
      img.onload = img.onerror = () => requestAnimationFrame(finish);
      img.src = url;
    }
    const t = window.setTimeout(finish, url ? 900 : 60);
    return () => window.clearTimeout(t);
  }, []);
  return null;
}
