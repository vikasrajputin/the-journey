/**
 * Procedural sound for the experience, built live with the Web Audio API.
 * Nothing here is a recording. Every soundscape is synthesised, and the
 * dinosaur call is a labelled reconstruction, not a real animal sound.
 */

export type Soundscape =
  | "cosmos"
  | "forge"
  | "deep"
  | "ocean"
  | "mesozoic"
  | "fire"
  | "settle"
  | "ideas"
  | "modern"
  | "heart";

export type Sfx = "bang" | "impact" | "roar" | "divide" | "spark" | "shimmer" | "step" | "plant" | "chime" | "whoosh" | "stencil";

type Layer = { out: GainNode; stop: () => void };

const rand = (a: number, b: number) => a + Math.random() * (b - a);

export class SoundEngine {
  readonly ctx: AudioContext;
  private master: GainNode;
  private bed: GainNode; // soundscapes, ducked under narration
  private fx: GainNode;
  private verb: ConvolverNode;
  private white: AudioBuffer;
  private pink: AudioBuffer;
  private brown: AudioBuffer;
  private current?: { id: Soundscape; layer: Layer };
  private muted = false;

  constructor() {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AC();
    const c = this.ctx;
    const comp = c.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.ratio.value = 4;
    this.master = c.createGain();
    this.master.gain.value = 0.9;
    this.master.connect(comp).connect(c.destination);
    this.bed = c.createGain();
    this.bed.connect(this.master);
    this.fx = c.createGain();
    this.fx.connect(this.master);
    this.verb = c.createConvolver();
    this.verb.buffer = this.impulse(3.2, 2.4);
    const wet = c.createGain();
    wet.gain.value = 0.45;
    this.verb.connect(wet).connect(this.master);
    this.white = this.noise("white");
    this.pink = this.noise("pink");
    this.brown = this.noise("brown");
  }

  resume() {
    return this.ctx.state === "suspended" ? this.ctx.resume() : Promise.resolve();
  }

  setMuted(m: boolean) {
    this.muted = m;
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setTargetAtTime(m ? 0 : 0.9, t, 0.15);
  }

  isMuted() {
    return this.muted;
  }

  /** Lower the soundscape while the narrator speaks. */
  duck(on: boolean) {
    this.bed.gain.setTargetAtTime(on ? 0.35 : 1, this.ctx.currentTime, 0.3);
  }

  play(id: Soundscape) {
    if (this.current?.id === id) return;
    const old = this.current;
    const layer = this.build(id);
    const t = this.ctx.currentTime;
    layer.out.gain.setValueAtTime(0, t);
    layer.out.gain.linearRampToValueAtTime(1, t + 2.5);
    layer.out.connect(this.bed);
    this.current = { id, layer };
    if (old) {
      old.layer.out.gain.cancelScheduledValues(t);
      old.layer.out.gain.setValueAtTime(old.layer.out.gain.value, t);
      old.layer.out.gain.linearRampToValueAtTime(0, t + 2.5);
      setTimeout(() => old.layer.stop(), 2800);
    }
  }

  stopAll() {
    const old = this.current;
    this.current = undefined;
    if (!old) return;
    old.layer.out.gain.setTargetAtTime(0, this.ctx.currentTime, 0.4);
    setTimeout(() => old.layer.stop(), 2000);
  }

  dispose() {
    this.current?.layer.stop();
    void this.ctx.close();
  }

  // ---------- building blocks ----------

  private noise(kind: "white" | "pink" | "brown") {
    const c = this.ctx;
    const len = c.sampleRate * 4;
    const buf = c.createBuffer(2, len, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0, last = 0;
      for (let i = 0; i < len; i++) {
        const w = Math.random() * 2 - 1;
        if (kind === "white") d[i] = w * 0.5;
        else if (kind === "pink") {
          b0 = 0.99886 * b0 + w * 0.0555179;
          b1 = 0.99332 * b1 + w * 0.0750759;
          b2 = 0.969 * b2 + w * 0.153852;
          b3 = 0.8665 * b3 + w * 0.3104856;
          b4 = 0.55 * b4 + w * 0.5329522;
          b5 = -0.7616 * b5 - w * 0.016898;
          d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
          b6 = w * 0.115926;
        } else {
          last = (last + 0.02 * w) / 1.02;
          d[i] = last * 3.5;
        }
      }
    }
    return buf;
  }

  private impulse(seconds: number, decay: number) {
    const c = this.ctx;
    const len = Math.floor(c.sampleRate * seconds);
    const buf = c.createBuffer(2, len, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return buf;
  }

  private src(buf: AudioBuffer) {
    const s = this.ctx.createBufferSource();
    s.buffer = buf;
    s.loop = true;
    s.loopStart = 0;
    s.loopEnd = buf.duration;
    s.start(0, Math.random() * buf.duration);
    return s;
  }

  private filter(type: BiquadFilterType, freq: number, q = 0.7) {
    const f = this.ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    return f;
  }

  private gain(v: number) {
    const g = this.ctx.createGain();
    g.gain.value = v;
    return g;
  }

  private lfo(target: AudioParam, rate: number, depth: number, type: OscillatorType = "sine") {
    const o = this.ctx.createOscillator();
    o.type = type;
    o.frequency.value = rate;
    const g = this.gain(depth);
    o.connect(g).connect(target);
    o.start();
    return o;
  }

  private osc(type: OscillatorType, freq: number) {
    const o = this.ctx.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    o.start();
    return o;
  }

  /** Fire `fn` at random intervals between min and max seconds. */
  private every(min: number, max: number, fn: () => void) {
    let alive = true;
    let id: ReturnType<typeof setTimeout>;
    const tick = () => {
      if (!alive) return;
      if (this.ctx.state === "running" && !document.hidden) fn();
      id = setTimeout(tick, rand(min, max) * 1000);
    };
    id = setTimeout(tick, rand(min, max) * 500);
    return () => {
      alive = false;
      clearTimeout(id);
    };
  }

  /** A one-shot enveloped tone. */
  private tone(dest: AudioNode, o: { type?: OscillatorType; f0: number; f1?: number; a?: number; d: number; v: number; at?: number; send?: number }) {
    const c = this.ctx;
    const t = (o.at ?? c.currentTime) + 0.01;
    const osc = c.createOscillator();
    osc.type = o.type ?? "sine";
    osc.frequency.setValueAtTime(o.f0, t);
    if (o.f1) osc.frequency.exponentialRampToValueAtTime(o.f1, t + o.d);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(o.v, t + (o.a ?? 0.01));
    g.gain.exponentialRampToValueAtTime(0.0001, t + (o.a ?? 0.01) + o.d);
    osc.connect(g).connect(dest);
    if (o.send) g.connect(this.gain(o.send)).connect(this.verb);
    osc.start(t);
    osc.stop(t + (o.a ?? 0.01) + o.d + 0.1);
  }

  /** A one-shot burst of filtered noise. */
  private burst(dest: AudioNode, o: { buf?: AudioBuffer; type?: BiquadFilterType; f0: number; f1?: number; q?: number; a?: number; d: number; v: number; at?: number; send?: number }) {
    const c = this.ctx;
    const t = (o.at ?? c.currentTime) + 0.01;
    const s = c.createBufferSource();
    s.buffer = o.buf ?? this.white;
    const f = this.filter(o.type ?? "lowpass", o.f0, o.q ?? 0.7);
    if (o.f1) f.frequency.exponentialRampToValueAtTime(o.f1, t + (o.a ?? 0.005) + o.d);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(o.v, t + (o.a ?? 0.005));
    g.gain.exponentialRampToValueAtTime(0.0001, t + (o.a ?? 0.005) + o.d);
    s.connect(f).connect(g).connect(dest);
    if (o.send) g.connect(this.gain(o.send)).connect(this.verb);
    s.start(t, Math.random() * 3);
    s.stop(t + (o.a ?? 0.005) + o.d + 0.1);
  }

  // ---------- soundscapes ----------

  private build(id: Soundscape): Layer {
    const c = this.ctx;
    const out = c.createGain();
    const nodes: (AudioScheduledSourceNode)[] = [];
    const timers: (() => void)[] = [];
    const keep = <T extends AudioScheduledSourceNode>(n: T) => (nodes.push(n), n);
    const toVerb = (n: AudioNode, v: number) => n.connect(this.gain(v)).connect(this.verb);

    const drone = (freqs: number[], type: OscillatorType, cutoff: number, v: number) => {
      const lp = this.filter("lowpass", cutoff, 1.2);
      const g = this.gain(v);
      for (const f of freqs) {
        const o = keep(this.osc(type, f));
        keep(this.lfo(o.detune, rand(0.05, 0.15), rand(4, 9)));
        o.connect(lp);
      }
      keep(this.lfo(lp.frequency, 0.04, cutoff * 0.4));
      lp.connect(g).connect(out);
      toVerb(g, 0.6);
      return g;
    };

    const bed = (buf: AudioBuffer, type: BiquadFilterType, f: number, v: number, lfoRate = 0, lfoDepth = 0) => {
      const s = keep(this.src(buf));
      const fl = this.filter(type, f);
      const g = this.gain(v);
      if (lfoRate) keep(this.lfo(g.gain, lfoRate, lfoDepth));
      s.connect(fl).connect(g).connect(out);
      return g;
    };

    switch (id) {
      case "cosmos": {
        drone([55, 82.5, 110.3, 164.8], "sine", 700, 0.16);
        bed(this.pink, "bandpass", 2400, 0.03, 0.05, 0.02);
        timers.push(this.every(1.2, 3.5, () => this.tone(out, { f0: [1318, 1568, 1760, 2093, 2637][Math.floor(rand(0, 5))], d: 2.5, v: 0.03, a: 0.02, send: 1.4 })));
        break;
      }
      case "forge": {
        bed(this.brown, "lowpass", 180, 0.55, 0.07, 0.25);
        drone([36.7, 55], "sawtooth", 140, 0.12);
        timers.push(this.every(0.8, 2.6, () => this.burst(out, { buf: this.brown, f0: rand(300, 900), f1: 80, d: rand(0.3, 0.9), v: rand(0.15, 0.4) })));
        timers.push(this.every(3, 7, () => this.burst(out, { f0: 2500, type: "bandpass", q: 2, d: 0.08, v: 0.08, send: 0.3 })));
        break;
      }
      case "deep": {
        bed(this.brown, "lowpass", 380, 0.5, 0.06, 0.2);
        drone([41.2, 61.7], "sine", 300, 0.1);
        timers.push(this.every(0.15, 1.1, () => this.tone(out, { f0: rand(250, 500), f1: rand(700, 1400), d: rand(0.05, 0.12), v: rand(0.02, 0.06), send: 0.5 })));
        break;
      }
      case "ocean": {
        bed(this.pink, "lowpass", 900, 0.32, 0.09, 0.22);
        bed(this.brown, "lowpass", 250, 0.3);
        timers.push(
          this.every(9, 16, () => {
            const t = c.currentTime;
            const base = rand(180, 320);
            this.tone(out, { f0: base, f1: base * rand(1.6, 2.4), a: 0.8, d: 2.6, v: 0.05, at: t, send: 2.2 });
            this.tone(out, { f0: base * 2.2, f1: base * 1.4, a: 0.6, d: 2.2, v: 0.03, at: t + 2.8, send: 2.2 });
          }),
        );
        break;
      }
      case "mesozoic": {
        bed(this.pink, "bandpass", 450, 0.22, 0.08, 0.12);
        // Insects: bandpassed noise chopped by a fast square LFO.
        const s = keep(this.src(this.white));
        const bp = this.filter("bandpass", 5200, 6);
        const chop = this.gain(0.5);
        keep(this.lfo(chop.gain, 28, 0.5, "square"));
        const ins = this.gain(0.05);
        keep(this.lfo(ins.gain, 0.07, 0.05));
        s.connect(bp).connect(chop).connect(ins).connect(out);
        timers.push(this.every(7, 14, () => this.roar(out, 0.35)));
        timers.push(this.every(2, 6, () => this.tone(out, { f0: rand(1800, 2600), f1: rand(2600, 3400), d: 0.12, v: 0.02, send: 0.8 })));
        break;
      }
      case "fire": {
        bed(this.brown, "lowpass", 320, 0.45, 0.3, 0.12);
        bed(this.pink, "bandpass", 600, 0.06, 0.05, 0.03);
        timers.push(this.every(0.03, 0.35, () => this.burst(out, { type: "highpass", f0: rand(1500, 4000), d: rand(0.004, 0.02), v: rand(0.04, 0.18) })));
        break;
      }
      case "settle": {
        drone([110, 164.8, 220], "sawtooth", 500, 0.06);
        bed(this.pink, "bandpass", 500, 0.08, 0.05, 0.05);
        let beat = 0;
        timers.push(
          this.every(0.55, 0.55, () => {
            const pattern = [1, 0, 0.6, 0, 1, 0.5, 0.6, 0];
            const v = pattern[beat++ % pattern.length];
            if (v) this.tone(out, { f0: 95, f1: 55, d: 0.35, v: 0.22 * v, send: 0.4 });
          }),
        );
        break;
      }
      case "ideas": {
        const pad = drone([196, 246.9, 293.7], "triangle", 1200, 0.05);
        void pad;
        timers.push(this.every(1, 1, () => this.burst(out, { type: "highpass", f0: 3500, d: 0.02, v: 0.06 })));
        timers.push(this.every(4, 8, () => this.tone(out, { f0: [392, 523.3, 587.3, 659.3][Math.floor(rand(0, 4))], type: "triangle", d: 3, v: 0.04, send: 1.2 })));
        break;
      }
      case "modern": {
        drone([60, 120], "sawtooth", 220, 0.05);
        bed(this.pink, "lowpass", 900, 0.12, 0.04, 0.04);
        timers.push(
          this.every(6, 12, () => {
            const t = c.currentTime;
            for (let i = 0; i < 4; i++) this.tone(out, { type: "square", f0: 1000, d: 0.12, v: 0.015, at: t + i * 0.6 });
          }),
        );
        break;
      }
      case "heart": {
        drone([130.8, 196, 261.6, 329.6], "sine", 900, 0.06);
        timers.push(
          this.every(1, 1, () => {
            const t = c.currentTime;
            this.tone(out, { f0: 62, f1: 40, d: 0.18, v: 0.35, at: t });
            this.tone(out, { f0: 55, f1: 38, d: 0.2, v: 0.25, at: t + 0.28 });
          }),
        );
        break;
      }
    }

    return {
      out,
      stop: () => {
        timers.forEach((t) => t());
        nodes.forEach((n) => {
          try {
            n.stop();
          } catch {
            /* already stopped */
          }
        });
        out.disconnect();
      },
    };
  }

  /**
   * A reconstructed dinosaur call. Nobody has heard a non-avian dinosaur.
   * Their closest living relatives, birds and crocodilians, include species
   * that make low, closed-mouth booming calls, so this is a low, resonant
   * boom rather than a film-style roar.
   */
  private roar(dest: AudioNode, v: number) {
    const c = this.ctx;
    const t = c.currentTime + 0.02;
    const dur = rand(2.2, 3.2);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(v, t + 0.5);
    g.gain.setTargetAtTime(0.0001, t + dur * 0.6, dur * 0.25);
    const lp = this.filter("lowpass", 260, 3);
    lp.frequency.setValueAtTime(320, t);
    lp.frequency.exponentialRampToValueAtTime(140, t + dur);
    const growl = c.createGain();
    growl.gain.value = 0.6;
    const am = c.createOscillator();
    am.frequency.value = rand(14, 22);
    const amg = this.gain(0.4);
    am.connect(amg).connect(growl.gain);
    const base = rand(38, 52);
    for (const [mult, lvl, type] of [[1, 1, "sawtooth"], [2, 0.5, "sine"], [3.02, 0.25, "sine"]] as const) {
      const o = c.createOscillator();
      o.type = type;
      o.frequency.setValueAtTime(base * mult, t);
      o.frequency.linearRampToValueAtTime(base * mult * 0.82, t + dur);
      const og = this.gain(lvl);
      o.connect(og).connect(growl);
      o.start(t);
      o.stop(t + dur + 1);
    }
    const breath = c.createBufferSource();
    breath.buffer = this.brown;
    const bg = this.gain(0.5);
    breath.connect(bg).connect(growl);
    breath.start(t);
    breath.stop(t + dur + 1);
    am.start(t);
    am.stop(t + dur + 1);
    growl.connect(lp).connect(g).connect(dest);
    g.connect(this.gain(0.8)).connect(this.verb);
  }

  sfx(name: Sfx) {
    if (this.muted) return;
    void this.resume();
    const d = this.fx;
    const c = this.ctx;
    switch (name) {
      case "bang":
        this.burst(d, { f0: 9000, f1: 60, a: 0.02, d: 3.5, v: 0.9, send: 1 });
        this.tone(d, { f0: 70, f1: 22, a: 0.02, d: 3.5, v: 0.9 });
        break;
      case "impact":
        this.burst(d, { f0: 6000, f1: 40, a: 0.01, d: 5, v: 1, send: 1 });
        this.burst(d, { buf: this.brown, f0: 400, f1: 30, a: 0.3, d: 7, v: 0.9 });
        this.tone(d, { f0: 55, f1: 18, a: 0.02, d: 5, v: 1 });
        break;
      case "roar":
        this.roar(d, 0.9);
        break;
      case "divide":
        this.tone(d, { f0: 520, f1: 1040, d: 0.12, v: 0.15, send: 0.6 });
        this.tone(d, { f0: 780, f1: 1560, d: 0.1, v: 0.08, at: c.currentTime + 0.08, send: 0.6 });
        break;
      case "spark":
        for (let i = 0; i < 6; i++) this.burst(d, { type: "highpass", f0: rand(2000, 5000), d: 0.015, v: 0.2, at: c.currentTime + i * rand(0.02, 0.07) });
        break;
      case "shimmer":
        for (const [i, f] of [1568, 2093, 2637, 3136].entries()) this.tone(d, { f0: f, d: 2, v: 0.05, at: c.currentTime + i * 0.06, send: 1.5 });
        break;
      case "step":
        this.tone(d, { f0: 60, f1: 30, d: 0.6, v: 0.9 });
        this.burst(d, { buf: this.brown, f0: 300, f1: 60, d: 0.5, v: 0.6 });
        break;
      case "plant":
        this.tone(d, { type: "triangle", f0: rand(400, 700), d: 0.5, v: 0.12, send: 0.6 });
        break;
      case "chime":
        this.tone(d, { type: "triangle", f0: 880, d: 1.5, v: 0.12, send: 1 });
        break;
      case "whoosh":
        this.burst(d, { type: "bandpass", f0: 300, f1: 3000, q: 1.5, a: 0.5, d: 0.6, v: 0.25, send: 0.6 });
        break;
      case "stencil":
        this.burst(d, { type: "bandpass", f0: 3000, q: 0.8, a: 0.05, d: 0.35, v: 0.12 });
        break;
    }
  }
}

/** Narration with the browser's own speech voices. */
export class Narrator {
  private voice?: SpeechSynthesisVoice;
  enabled = true;
  onSpeaking?: (speaking: boolean) => void;

  static supported() {
    return typeof window !== "undefined" && "speechSynthesis" in window;
  }

  constructor() {
    if (!Narrator.supported()) return;
    const pick = () => {
      const voices = speechSynthesis.getVoices();
      const en = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
      const pref = ["Google UK English Male", "Daniel", "Arthur", "Microsoft Ryan", "Google UK English Female", "Serena", "Karen", "Samantha"];
      this.voice = pref.map((n) => en.find((v) => v.name.includes(n))).find(Boolean) ?? en.find((v) => v.lang === "en-GB") ?? en[0];
    };
    pick();
    speechSynthesis.addEventListener?.("voiceschanged", pick);
  }

  say(text: string) {
    if (!this.enabled || !Narrator.supported()) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (this.voice) u.voice = this.voice;
    u.lang = this.voice?.lang ?? "en-GB";
    u.rate = 0.92;
    u.pitch = 0.95;
    u.onstart = () => this.onSpeaking?.(true);
    u.onend = u.onerror = () => this.onSpeaking?.(false);
    speechSynthesis.speak(u);
  }

  stop() {
    if (Narrator.supported()) speechSynthesis.cancel();
    this.onSpeaking?.(false);
  }
}
