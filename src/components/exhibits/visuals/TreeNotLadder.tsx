/**
 * A simplified tree. Tips are aligned at the right edge, the present, because
 * every living group has been evolving for the same length of time.
 */
type Node = string | Node[];
const tree: Node = ["Bacteria", ["Archaea", ["Plants", ["Fungi", ["Sponges", ["Insects", ["Fish", ["Frogs", ["Mammals", ["Lizards", "Birds"]]]]]]]]]];

const ROW = 30;
const W = 560;
const TIP_X = 430;

type Laid = { lines: string[]; tips: { name: string; y: number }[]; nodes: { x: number; y: number }[] };

function layout(): Laid {
  const lines: string[] = [];
  const tips: Laid["tips"] = [];
  const nodes: Laid["nodes"] = [];
  let row = 0;
  const depthOf = (n: Node): number => (typeof n === "string" ? 0 : 1 + Math.max(...n.map(depthOf)));
  const maxDepth = depthOf(tree);
  const step = (TIP_X - 20) / maxDepth;
  const walk = (n: Node, depth: number): number => {
    if (typeof n === "string") {
      const y = 20 + row++ * ROW;
      tips.push({ name: n, y });
      return y;
    }
    const x = 20 + depth * step;
    const ys = n.map((c) => {
      const y = walk(c, depth + 1);
      const cx = typeof c === "string" ? TIP_X : 20 + (depth + 1) * step;
      lines.push(`M ${x} ${y} H ${cx}`);
      return y;
    });
    lines.push(`M ${x} ${Math.min(...ys)} V ${Math.max(...ys)}`);
    const y = (Math.min(...ys) + Math.max(...ys)) / 2;
    nodes.push({ x, y });
    return y;
  };
  const rootY = walk(tree, 0);
  lines.push(`M 4 ${rootY} H 20`);
  return { lines, tips, nodes };
}

const laid = layout();
const H = 34 + laid.tips.length * ROW;

export function TreeNotLadder() {
  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_11rem] md:items-center">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Branching tree. Living groups at the tips, all at the same distance from the root: ${laid.tips.map((t) => t.name).join(", ")}.`}>
        {laid.lines.map((d, i) => (
          <path key={i} d={d} stroke="var(--chapter-accent)" strokeWidth={2} fill="none" />
        ))}
        {laid.nodes.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={3.5} fill="var(--color-night)" stroke="var(--chapter-accent)" strokeWidth={2} />
        ))}
        {laid.tips.map((t) => (
          <text key={t.name} x={TIP_X + 10} y={t.y + 5} fontSize={15} fill="var(--color-text-light)">
            {t.name}
          </text>
        ))}
        <line x1={TIP_X} x2={TIP_X} y1={4} y2={H - 4} stroke="var(--color-border-dark)" strokeDasharray="3 4" />
        <text x={TIP_X} y={H - 0} fontSize={11} fill="var(--color-muted)" textAnchor="end">today</text>
      </svg>
      <div className="text-center text-sm">
        <svg viewBox="0 0 120 170" className="mx-auto w-28" role="img" aria-label="A ladder from 'simple' life to humans, crossed out.">
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={i} x1={30} x2={90} y1={20 + i * 32} y2={20 + i * 32} stroke="var(--color-muted)" strokeWidth={3} />
          ))}
          <line x1={30} x2={30} y1={6} y2={164} stroke="var(--color-muted)" strokeWidth={3} />
          <line x1={90} x2={90} y1={6} y2={164} stroke="var(--color-muted)" strokeWidth={3} />
          <line x1={8} x2={112} y1={8} y2={162} stroke="#e6a98c" strokeWidth={5} strokeLinecap="round" />
          <line x1={112} x2={8} y1={8} y2={162} stroke="#e6a98c" strokeWidth={5} strokeLinecap="round" />
        </svg>
        <p className="mt-2 text-muted">Not a ladder: no living group is &ldquo;more evolved&rdquo; than another.</p>
      </div>
    </div>
  );
}
