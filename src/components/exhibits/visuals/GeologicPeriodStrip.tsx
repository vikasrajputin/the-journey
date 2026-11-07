import { geologicPeriods } from "@/data/geologic-periods";

const TOTAL = geologicPeriods[0].start;
const eraShade = { Paleozoic: "bg-chapter/80", Mesozoic: "bg-chapter/55", Cenozoic: "bg-chapter/30" } as const;
const eras = (["Paleozoic", "Mesozoic", "Cenozoic"] as const).map((era) => {
  const ps = geologicPeriods.filter((p) => p.era === era);
  return { era, start: ps[0].start, end: ps.at(-1)!.end };
});
const fmt = (n: number) => (n === 0 ? "0" : n < 10 ? n.toFixed(1) : String(n));

/** Era strip plus one bar per period, widths proportional to duration. */
export function GeologicPeriodStrip() {
  return (
    <div>
      <div className="flex h-9 overflow-hidden rounded-md text-xs" role="img" aria-label="Eras to scale: Paleozoic 539 to 252, Mesozoic 252 to 66, Cenozoic 66 million years ago to today.">
        {eras.map((e) => (
          <div key={e.era} className={`${eraShade[e.era]} flex items-center border-r border-night px-2 text-night`} style={{ width: `${((e.start - e.end) / TOTAL) * 100}%` }}>
            <span className="truncate font-medium">{e.era}</span>
          </div>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-xs text-muted" aria-hidden="true">
        <span>539 million years ago</span>
        <span>Today</span>
      </div>

      <table className="mt-6 w-full text-sm">
        <caption className="sr-only">Geological periods, start and end in millions of years ago, and duration</caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">Period</th>
            <th scope="col">From and to</th>
            <th scope="col">Duration, drawn to scale</th>
          </tr>
        </thead>
        <tbody>
          {geologicPeriods.map((p, i) => {
            const newEra = i === 0 || geologicPeriods[i - 1].era !== p.era;
            return (
              <tr key={p.name} className={newEra && i ? "border-t border-border-dark" : undefined}>
                <th scope="row" className="w-28 py-1.5 pr-3 text-left font-medium text-text-light sm:w-36">
                  {p.name}
                  <span className="block text-xs font-normal tabular-nums text-muted sm:hidden">{fmt(p.start)}–{fmt(p.end)}</span>
                </th>
                <td className="hidden w-28 py-1.5 pr-3 text-xs tabular-nums text-muted sm:table-cell">{fmt(p.start)}–{fmt(p.end)}</td>
                <td className="py-1.5">
                  <div className="flex items-center gap-2">
                    <span aria-hidden="true" className={`block h-2.5 rounded-sm ${eraShade[p.era]}`} style={{ width: `${((p.start - p.end) / 80) * 100}%`, minWidth: 3, maxWidth: "calc(100% - 4.5rem)" }} />
                    <span className="whitespace-nowrap text-xs tabular-nums text-muted">{fmt(+(p.start - p.end).toFixed(1))} Myr</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
