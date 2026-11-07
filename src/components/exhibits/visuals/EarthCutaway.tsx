"use client";

import { useState } from "react";

/**
 * Annotated diagram: pick a layer to highlight it and read about it.
 * Radii are proportional to depth except the crust and atmosphere, which are
 * drawn much thicker than true scale so they can be seen. All descriptions
 * stay in the list, so nothing depends on selecting.
 */
const layers = [
  { id: "atmosphere", name: "Atmosphere", r: 300, fill: "color-mix(in srgb, var(--chapter-accent) 12%, transparent)", text: "The envelope of gases around the planet. Drawn far thicker than true scale." },
  { id: "crust", name: "Crust", r: 284, fill: "#7a6a58", text: "A thin rocky skin, roughly 5 to 70 kilometres thick, thinnest under the oceans. Drawn thicker than true scale. No borehole has gone deeper than its upper part." },
  { id: "mantle", name: "Mantle", r: 272, fill: "#a4532f", text: "About 2,900 kilometres of hot rock that flows extremely slowly." },
  { id: "outer-core", name: "Outer core", r: 150, fill: "#d8873a", text: "Liquid, mostly iron and nickel. Its motion generates Earth's magnetic field." },
  { id: "inner-core", name: "Inner core", r: 53, fill: "#f2cf73", text: "Solid metal at the centre, about 6,370 kilometres below the surface." },
] as const;

export function EarthCutaway() {
  const [active, setActive] = useState<string>("crust");
  const current = layers.find((l) => l.id === active)!;
  return (
    <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <svg viewBox="-310 -310 620 356" className="mx-auto w-full max-w-md" role="img" aria-label={`Half-section of the Earth showing five layers. Highlighted: ${current.name}.`}>
        {layers.map((l, i) => (
          <g key={l.id} opacity={active === l.id ? 1 : 0.55} className="transition-opacity">
            <path d={`M ${-l.r} 0 A ${l.r} ${l.r} 0 0 1 ${l.r} 0 Z`} fill={l.fill} stroke={active === l.id ? "var(--color-text-light)" : "var(--color-night)"} strokeWidth={active === l.id ? 3 : 1.5} />
            {i < 2 ? (
              <g aria-hidden="true">
                <line x1={(i === 0 ? -1 : 1) * (l.r - 7)} x2={(i === 0 ? -1 : 1) * (l.r - 7)} y1={0} y2={12} stroke="var(--color-muted)" />
                <circle cx={(i === 0 ? -1 : 1) * (l.r - 7)} cy={28} r={16} fill={l.id === "atmosphere" ? "var(--color-panel-raised)" : l.fill} />
                <text x={(i === 0 ? -1 : 1) * (l.r - 7)} y={35} textAnchor="middle" fontSize="20" fontWeight={600} fill={l.id === "atmosphere" ? "var(--color-text-light)" : "var(--color-night)"}>
                  {i + 1}
                </text>
              </g>
            ) : (
              <text x={0} y={-(l.r - (i === layers.length - 1 ? 20 : (l.r - (layers[i + 1]?.r ?? 0)) / 2)) + 6} textAnchor="middle" fontSize="24" fill="var(--color-night)" fontWeight={600} aria-hidden="true">
                {i + 1}
              </text>
            )}
          </g>
        ))}
        <line x1={-310} x2={310} y1={0} y2={0} stroke="var(--color-border-dark)" />
      </svg>

      <div>
        <ol className="grid gap-2" aria-label="Layers, from outside in">
          {layers.map((l, i) => (
            <li key={l.id}>
              <button type="button" aria-pressed={active === l.id} onClick={() => setActive(l.id)} className="annot-button">
                <span aria-hidden="true" className="annot-num">{i + 1}</span>
                {l.name}
              </button>
            </li>
          ))}
        </ol>
        <p className="mt-4 min-h-24 text-sm text-text-light/85" aria-live="polite">
          <strong className="text-text-light">{current.name}.</strong> {current.text}
        </p>
      </div>
    </div>
  );
}
