import { AGE_OF_UNIVERSE } from "@/lib/timeline-scale";

/** 80 years of a lifetime stand for the age of the universe. */
export const LIFETIME = 80;
const SECONDS_PER_YEAR = 365.25 * 24 * 3600;

/** Real years ago → seconds before the 80th birthday on the lifetime scale. */
export const secondsBeforeBirthday = (yearsAgo: number) => (yearsAgo / AGE_OF_UNIVERSE) * LIFETIME * SECONDS_PER_YEAR;

type Ruler = { title: string; spanSeconds: number; unit: string; ticks: number; marks: { label: string; yearsAgo: number; at: string }[] };

function ageLabel(yearsAgo: number) {
  const age = LIFETIME * (1 - yearsAgo / AGE_OF_UNIVERSE);
  const years = Math.floor(age);
  const months = Math.floor((age - years) * 12);
  return `age ${years} years ${months} months`;
}

export const rulers: Ruler[] = [
  {
    title: "The whole lifetime",
    spanSeconds: LIFETIME * SECONDS_PER_YEAR,
    unit: "years",
    ticks: 8,
    marks: [
      { label: "Big Bang", yearsAgo: AGE_OF_UNIVERSE, at: "birth" },
      { label: "Earth forms", yearsAgo: 4.54e9, at: ageLabel(4.54e9) },
      { label: "Earliest evidence of life", yearsAgo: 3.5e9, at: ageLabel(3.5e9) },
    ],
  },
  {
    title: "The last year",
    spanSeconds: SECONDS_PER_YEAR,
    unit: "months",
    ticks: 12,
    marks: [{ label: "Non-avian dinosaurs die out", yearsAgo: 66e6, at: `${(secondsBeforeBirthday(66e6) / (SECONDS_PER_YEAR / 12)).toFixed(1)} months before` }],
  },
  {
    title: "The last day",
    spanSeconds: 24 * 3600,
    unit: "hours",
    ticks: 24,
    marks: [{ label: "Homo sapiens appears", yearsAgo: 300_000, at: `${Math.round(secondsBeforeBirthday(300_000) / 3600)} hours before` }],
  },
  {
    title: "The last hour",
    spanSeconds: 3600,
    unit: "minutes",
    ticks: 12,
    marks: [{ label: "Earliest known writing", yearsAgo: 5_100, at: `${Math.round(secondsBeforeBirthday(5_100) / 60)} minutes before` }],
  },
  {
    title: "The last minute",
    spanSeconds: 60,
    unit: "seconds",
    ticks: 12,
    marks: [{ label: "A real 80-year human life", yearsAgo: 80, at: `the last ${Math.round(secondsBeforeBirthday(80))} seconds` }],
  },
];

/** Five rulers, each zooming into the end of the one above it. */
export function LifetimeScale() {
  return (
    <ol className="grid gap-7" aria-label="Rulers, each zooming into the last part of the one above">
      {rulers.map((r, ri) => (
        <li key={r.title}>
          <p className="flex items-baseline justify-between gap-3 text-sm">
            <span className="font-medium text-text-light">{r.title}</span>
            <span className="text-xs text-muted">ticks every {r.unit === "years" ? "10 years" : r.unit === "hours" ? "hour" : r.unit === "months" ? "month" : `5 ${r.unit}`}</span>
          </p>
          <div className="relative mt-3 h-10" aria-hidden="true">
            <div className="absolute inset-x-0 top-5 h-px bg-border-dark" />
            {Array.from({ length: r.ticks + 1 }, (_, i) => (
              <span key={i} className="absolute top-3.5 h-3 w-px bg-border-dark" style={{ left: `${(i / r.ticks) * 100}%` }} />
            ))}
            {ri < rulers.length - 1 ? <span className="absolute top-2 right-0 h-6 w-1.5 rounded-sm bg-text-light/25" title="Zoomed into below" /> : null}
            {r.marks.map((m) => {
              const x = Math.max(0, 1 - secondsBeforeBirthday(m.yearsAgo) / r.spanSeconds);
              return (
                <span key={m.label} className="absolute top-3 size-4 -translate-x-1/2 rounded-full border-2 border-night bg-chapter" style={{ left: `${x * 100}%` }} />
              );
            })}
          </div>
          <ul className="mt-1 grid gap-0.5 text-sm">
            {r.marks.map((m) => (
              <li key={m.label}>
                <span className="text-text-light">{m.label}</span> <span className="text-muted">· {m.at}</span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
