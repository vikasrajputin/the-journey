/** Small settings saved in this browser only (graphics, sound). Everything works without them. */

export function loadPref(key: string): string | null {
  try {
    return localStorage.getItem(`journey:${key}`);
  } catch {
    return null;
  }
}

export function savePref(key: string, value: string) {
  try {
    localStorage.setItem(`journey:${key}`, value);
  } catch {
    /* ignore */
  }
}
