import { MAP_H, MAP_W, makeMap } from "./WorldMap";

// Centred on the Pacific side so the route into the Americas is not cut by the map edge.
const { project, Base: WorldBase } = makeMap(100);

type Pt = readonly [number, number];
const africa: Pt = [25, 2];
const routes: { label: string; from: Pt; to: Pt; when: string; dashed?: boolean }[] = [
  { label: "Early groups reach Southwest Asia", from: [33, 14], to: [37, 32], when: "more than 100,000 years ago", dashed: true },
  { label: "Major dispersal from Africa", from: [40, 12], to: [52, 26], when: "roughly 70,000–50,000 years ago" },
  { label: "Across southern Asia", from: [52, 26], to: [102, 14], when: "after the major dispersal" },
  { label: "Australia", from: [102, 14], to: [134, -24], when: "by at least about 50,000 years ago" },
  { label: "Europe, where people met Neanderthals", from: [52, 30], to: [14, 48], when: "after the major dispersal" },
  { label: "Northeast Asia", from: [80, 38], to: [130, 60], when: "after the major dispersal" },
  { label: "The Americas", from: [135, 62], to: [-100, 42], when: "by at least about 15,000 years ago, possibly earlier" },
];

function arc(a: Pt, b: Pt) {
  const [x1, y1] = project(a[0], a[1]);
  const [x2, y2] = project(b[0], b[1]);
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - Math.hypot(x2 - x1, y2 - y1) * 0.15;
  return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
}

export function DispersalMap() {
  const [ax, ay] = project(africa[0], africa[1]);
  return (
    <div>
      <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="w-full" role="img" aria-label="Schematic world map with arrows showing Homo sapiens spreading from Africa to Southwest Asia, Asia, Australia, Europe and the Americas. The routes are listed below.">
        <defs>
          <marker id="dispersal-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill="var(--chapter-accent)" />
          </marker>
        </defs>
        <WorldBase />
        <ellipse cx={ax} cy={ay} rx={70} ry={95} fill="var(--chapter-accent)" opacity={0.2} />
        <text x={ax} y={ay + 6} textAnchor="middle" fontSize={16} fill="var(--color-text-light)">Africa: origin</text>
        {routes.map((r) => (
          <path key={r.label} d={arc(r.from, r.to)} fill="none" stroke="var(--chapter-accent)" strokeWidth={2.5} strokeDasharray={r.dashed ? "6 6" : undefined} markerEnd="url(#dispersal-arrow)" />
        ))}
      </svg>
      <ol className="mt-5 grid gap-1.5 text-sm sm:grid-cols-2 sm:gap-x-8">
        {routes.map((r) => (
          <li key={r.label}>
            <span className="text-text-light">{r.label}</span> <span className="text-muted">· {r.when}{r.dashed ? " (dashed: early, smaller dispersals)" : ""}</span>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-xs text-muted">Arrows are schematic: they show general directions, not exact paths.</p>
    </div>
  );
}
