import type { LevelId } from "./levels";

/** Stars earned per level (0 to 3). Saved in this browser only; the game works without it. */
export type Progress = Partial<Record<LevelId, number>>;

const KEY = "journey:ch1:stars";

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Progress) : {};
  } catch {
    return {};
  }
}

export function saveProgress(p: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* private mode or storage blocked: progress lasts for this visit only */
  }
}

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
