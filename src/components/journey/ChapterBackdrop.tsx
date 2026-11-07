import type { ChapterTheme } from "@/data/navigation";

/**
 * Decorative, abstract backdrop for each chapter header. Pure SVG/CSS, no
 * downloads. These are mood pieces, not depictions of real objects, so they
 * are hidden from assistive technology and never presented as evidence.
 */
export function ChapterBackdrop({ theme }: { theme: ChapterTheme }) {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-[radial-gradient(70%_70%_at_75%_25%,var(--chapter-glow),transparent_70%)]" />
      <svg className="absolute right-[-10%] top-[-10%] h-[120%] w-[80%] opacity-60 md:w-[60%]" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
        <Motif theme={theme} />
      </svg>
      <div className="starfield absolute inset-0 opacity-25" />
      <div className="absolute inset-0 bg-gradient-to-r from-night via-night/80 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-night" />
    </div>
  );
}

function Motif({ theme }: { theme: ChapterTheme }) {
  const stroke = "var(--chapter-accent)";
  switch (theme) {
    case "cosmos":
      return (
        <g fill="none" stroke={stroke} strokeOpacity="0.35">
          {[40, 80, 120, 160, 200].map((r) => (
            <circle key={r} cx="260" cy="140" r={r} strokeWidth="0.6" />
          ))}
          {Array.from({ length: 24 }, (_, i) => {
            const a = (i / 24) * Math.PI * 2;
            return <line key={i} x1={260 + Math.cos(a) * 30} y1={140 + Math.sin(a) * 30} x2={260 + Math.cos(a) * 220} y2={140 + Math.sin(a) * 220} strokeWidth="0.3" />;
          })}
        </g>
      );
    case "earth":
      return (
        <g fill="none" stroke={stroke} strokeOpacity="0.4">
          <circle cx="250" cy="170" r="150" strokeWidth="0.8" />
          <circle cx="250" cy="170" r="110" strokeWidth="0.6" />
          <circle cx="250" cy="170" r="60" strokeWidth="0.6" />
          <circle cx="250" cy="170" r="28" strokeWidth="0.6" />
          <ellipse cx="250" cy="170" rx="200" ry="40" strokeWidth="0.4" transform="rotate(-18 250 170)" />
        </g>
      );
    case "life":
      return (
        <g fill="none" stroke={stroke} strokeOpacity="0.4" strokeWidth="0.7">
          {Array.from({ length: 9 }, (_, i) => (
            <path key={i} d={`M ${60 + i * 8} ${380 - i * 2} q 60 -${30 + i * 6} 120 0 t 120 0 t 120 0`} />
          ))}
          <circle cx="280" cy="120" r="46" />
          <circle cx="280" cy="120" r="18" />
          <circle cx="250" cy="140" r="9" />
        </g>
      );
    case "diversity":
      return (
        <g fill="none" stroke={stroke} strokeOpacity="0.45" strokeWidth="0.8" strokeLinecap="round">
          <path d="M260 390 V250 M260 250 L180 160 M260 250 L330 140 M180 160 L130 90 M180 160 L210 70 M330 140 L300 60 M330 140 L380 80 M130 90 L110 30 M130 90 L150 20 M300 60 L290 10 M380 80 L395 20" />
        </g>
      );
    case "giants":
      return (
        <g fill="none" stroke={stroke} strokeOpacity="0.4" strokeWidth="0.6">
          {Array.from({ length: 12 }, (_, i) => (
            <line key={i} x1="0" y1={60 + i * 26} x2="400" y2={50 + i * 26 + (i % 3) * 4} />
          ))}
          <circle cx="300" cy="90" r="30" strokeWidth="0.8" />
        </g>
      );
    case "human":
      return (
        <g fill="none" stroke={stroke} strokeOpacity="0.4" strokeWidth="0.8" strokeLinecap="round">
          <path d="M200 390 C 200 300 180 260 150 200 M200 330 C 230 280 260 240 270 170 M150 200 C 140 150 120 120 100 80 M150 200 C 170 160 175 120 170 70 M270 170 C 260 120 280 80 300 40 M270 170 C 300 140 330 120 360 110" />
          <circle cx="300" cy="40" r="4" fill={stroke} fillOpacity="0.6" />
        </g>
      );
    case "civilisation":
      return (
        <g fill="none" stroke={stroke} strokeOpacity="0.4" strokeWidth="0.7">
          {Array.from({ length: 8 }, (_, r) =>
            Array.from({ length: 8 }, (_, c) => <rect key={`${r}-${c}`} x={140 + c * 30} y={40 + r * 30} width="22" height="22" />),
          )}
        </g>
      );
    case "ideas":
      return (
        <g fill="none" stroke={stroke} strokeOpacity="0.4" strokeWidth="0.6">
          {[
            [120, 80], [220, 60], [320, 110], [260, 180], [160, 200], [340, 260], [220, 300], [120, 320],
          ].map(([x, y], i, arr) => (
            <g key={i}>
              <circle cx={x} cy={y} r="5" fill={stroke} fillOpacity="0.4" />
              {arr.slice(i + 1, i + 3).map(([x2, y2], j) => (
                <line key={j} x1={x} y1={y} x2={x2} y2={y2} />
              ))}
            </g>
          ))}
        </g>
      );
    case "built":
      return (
        <g fill="none" stroke={stroke} strokeOpacity="0.4" strokeWidth="0.6">
          {Array.from({ length: 10 }, (_, i) => (
            <path key={i} d={`M ${100 + i * 30} 390 V ${300 - i * 20} H ${130 + i * 30}`} />
          ))}
          {Array.from({ length: 6 }, (_, i) => (
            <circle key={i} cx={130 + i * 50} cy={100 + (i % 2) * 40} r="3" fill={stroke} fillOpacity="0.5" />
          ))}
        </g>
      );
    case "you":
      return (
        <g fill="none" stroke={stroke} strokeOpacity="0.45">
          <circle cx="260" cy="170" r="3" fill={stroke} />
          {[16, 40, 80, 140, 220].map((r, i) => (
            <circle key={r} cx="260" cy="170" r={r} strokeWidth={0.9 - i * 0.12} />
          ))}
        </g>
      );
  }
}
