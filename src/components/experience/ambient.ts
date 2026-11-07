import type { ResolvedMedia } from "@/lib/media";

/**
 * Plays real recordings (and NASA sonifications) under each scene, straight
 * from Wikimedia Commons. Plain <audio> elements, so no CORS is needed. If a
 * recording cannot load or the browser blocks it, `onState(false)` fires and
 * the synthesised soundscape carries on alone.
 */
export class AmbientPlayer {
  private els = new Map<string, HTMLAudioElement>();
  private current?: string;
  private muted = false;
  private fades = new Map<HTMLAudioElement, number>();

  constructor(private onState: (playing: boolean) => void) {}

  private el(m: ResolvedMedia) {
    let a = this.els.get(m.id);
    if (a) return a;
    a = document.createElement("audio");
    a.loop = true;
    a.preload = "none";
    for (const s of m.sources ?? [{ src: m.src, type: "" }]) {
      const source = document.createElement("source");
      source.src = s.src;
      if (s.type) source.type = s.type;
      a.appendChild(source);
    }
    a.volume = 0;
    a.addEventListener("error", () => this.current === m.id && this.onState(false), true);
    this.els.set(m.id, a);
    return a;
  }

  private fade(a: HTMLAudioElement, to: number, ms: number, then?: () => void) {
    cancelAnimationFrame(this.fades.get(a) ?? 0);
    const from = a.volume;
    const start = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / ms);
      try {
        a.volume = from + (to - from) * k;
      } catch {
        /* iOS: volume is read-only, so the sound simply switches */
      }
      if (k < 1) this.fades.set(a, requestAnimationFrame(step));
      else then?.();
    };
    this.fades.set(a, requestAnimationFrame(step));
  }

  /** Switch to the recording for a scene, or to none. */
  play(m: ResolvedMedia | undefined, level = 0.75) {
    const id = m?.id;
    if (id === this.current) return;
    const old = this.current ? this.els.get(this.current) : undefined;
    this.current = id;
    if (old) this.fade(old, 0, 1800, () => old.pause());
    if (!m) {
      this.onState(false);
      return;
    }
    const a = this.el(m);
    if (this.muted) return;
    this.start(a, m.id, level);
  }

  private start(a: HTMLAudioElement, id: string, level: number) {
    a.preload = "auto";
    a.play().then(
      () => {
        if (this.current !== id) return;
        this.onState(true);
        this.fade(a, level, 2200);
      },
      () => this.current === id && this.onState(false),
    );
  }

  setMuted(m: boolean) {
    this.muted = m;
    const a = this.current ? this.els.get(this.current) : undefined;
    if (!a || !this.current) return;
    if (m) this.fade(a, 0, 300, () => a.pause());
    else this.start(a, this.current, 0.75);
  }

  dispose() {
    for (const a of this.els.values()) {
      a.pause();
      a.removeAttribute("src");
      a.replaceChildren();
    }
    this.els.clear();
  }
}
