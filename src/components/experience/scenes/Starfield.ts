import { tilt } from "../tilt";

/** A field of gently twinkling background stars, in screen fractions. Bigger (nearer) stars shift more when the phone tilts. */
export class Starfield {
  private stars: { x: number; y: number; s: number; p: number }[];
  constructor(n: number) {
    this.stars = Array.from({ length: n }, () => ({ x: Math.random(), y: Math.random(), s: Math.random() * 1.3 + 0.3, p: Math.random() * 10 }));
  }
  draw(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, alpha = 1, drift = 0) {
    for (const st of this.stars) {
      const a = alpha * (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 1.3 + st.p)));
      ctx.fillStyle = `rgba(230,236,255,${a})`;
      const x = ((st.x + drift * t * 0.002 * st.s) % 1) * w - tilt.x * st.s * 14;
      ctx.fillRect(x, st.y * h - tilt.y * st.s * 14, st.s, st.s);
    }
  }
}
