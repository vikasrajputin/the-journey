/** Schematic rock column. Thicknesses are not to scale. */
const layers = [
  { name: "Paleogene rocks (above)", detail: "Many earlier groups are absent; new communities gradually appear.", h: "h-28", fill: "bg-[#6b5a47]" },
  { name: "Boundary clay", detail: "Often just centimetres thick. Enriched in iridium, with shocked quartz and tiny glassy spherules: signatures of a large impact. Dated to about 66 million years ago.", h: "h-6", fill: "bg-chapter", boundary: true },
  { name: "Cretaceous rocks (below)", detail: "Fossils of non-avian dinosaurs, ammonites and many plankton species.", h: "h-36", fill: "bg-[#8a7559]" },
];

export function KpgBoundary() {
  return (
    <div className="grid gap-6 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-8">
      <div className="mx-auto w-28 overflow-hidden rounded-md border border-border-dark sm:w-full" aria-hidden="true">
        {layers.map((l) => (
          <div key={l.name} className={`${l.h} ${l.fill} ${l.boundary ? "" : "bg-[repeating-linear-gradient(0deg,transparent_0_10px,rgba(0,0,0,0.18)_10px_11px)]"}`} />
        ))}
      </div>
      <ol className="grid content-center gap-5 text-sm" aria-label="Layers, from top (youngest) to bottom (oldest)">
        {layers.map((l) => (
          <li key={l.name} className={l.boundary ? "border-l-2 border-chapter pl-4" : "pl-[1.125rem]"}>
            <p className="font-medium text-text-light">{l.name}</p>
            <p className="mt-1 text-text-light/80">{l.detail}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
