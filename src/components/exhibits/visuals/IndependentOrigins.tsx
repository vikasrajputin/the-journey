import { MAP_H, MAP_W, makeMap } from "./WorldMap";

const { project, Base: WorldBase } = makeMap(10);

/** Approximate centres of each region. Markers stand for regions, not exact sites. */
const centres = [
  { name: "Southwest Asia (the Fertile Crescent)", crops: "wheat, barley, lentils, sheep and goats; from roughly 11,000 to 10,000 years ago", at: [40, 35] },
  { name: "China", crops: "rice in the Yangtze region, millets in the north; from roughly 9,000 years ago", at: [113, 32] },
  { name: "Mesoamerica", crops: "squash from about 10,000 years ago, maize from about 9,000, and beans", at: [-98, 18] },
  { name: "South America", crops: "potatoes, quinoa and llamas", at: [-71, -14] },
  { name: "Africa", crops: "sorghum, pearl millet and yams", at: [8, 12] },
  { name: "New Guinea", crops: "taro and bananas", at: [144, -6] },
  { name: "Eastern North America", crops: "sunflowers and other seed crops", at: [-86, 37] },
] as const;

export function IndependentOrigins() {
  return (
    <div>
      <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="w-full" role="img" aria-label="World map with seven numbered regions where farming began independently. The regions are listed below.">
        <WorldBase />
        {centres.map((c, i) => {
          const [x, y] = project(c.at[0], c.at[1]);
          return (
            <g key={c.name} transform={`translate(${x} ${y})`}>
              <circle r={34} fill="var(--chapter-accent)" opacity={0.18} />
              <circle r={15} fill="var(--chapter-accent)" stroke="var(--color-night)" strokeWidth={2} />
              <text y={6} textAnchor="middle" fontSize={17} fontWeight={700} fill="var(--color-night)">
                {i + 1}
              </text>
            </g>
          );
        })}
      </svg>
      <ol className="mt-5 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
        {centres.map((c, i) => (
          <li key={c.name} className="flex gap-3">
            <span aria-hidden="true" className="annot-num shrink-0 bg-chapter text-night">{i + 1}</span>
            <span>
              <span className="text-text-light">{c.name}</span> <span className="text-muted">· {c.crops}</span>
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-xs text-muted">Shaded circles mark broad regions, not exact sites.</p>
    </div>
  );
}
