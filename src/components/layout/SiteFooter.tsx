import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border-dark bg-ink">
      <div className="container-wide flex flex-wrap items-center justify-between gap-6 py-10">
        <p className="font-display text-xl tracking-[0.18em]">THE JOURNEY</p>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-5 text-sm">
            <li><Link href="/" className="link-quiet">Play Chapter 1</Link></li>
            <li><Link href="/sources" className="link-quiet">Sources</Link></li>
            <li><Link href="/about" className="link-quiet">About</Link></li>
          </ul>
        </nav>
      </div>
      <div className="container-wide border-t border-border-dark py-6 text-xs text-muted">
        <p>No accounts, no tracking. Every fact in the game links to the science behind it.</p>
      </div>
    </footer>
  );
}
