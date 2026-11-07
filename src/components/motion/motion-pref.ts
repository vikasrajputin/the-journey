/** True when the visitor asked for less motion (system setting or the site's toggle). */
export function prefersStill() {
  if (typeof window === "undefined") return true;
  return document.documentElement.hasAttribute("data-motion") || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** True on touch-first devices, where native scrolling is already smooth. */
export function isTouch() {
  return typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
}
