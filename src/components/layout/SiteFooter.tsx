import Link from "next/link";
import { chapters } from "@/data/navigation";

export function SiteFooter() {
  return (
    <footer className="border-t border-border-dark bg-ink">
      <div className="container-wide grid gap-12 py-16 md:grid-cols-[1.2fr_2fr]">
        <div>
          <p className="font-display text-2xl tracking-[0.18em]">THE JOURNEY</p>
          <p className="mt-4 max-w-sm text-sm text-muted">
            A digital museum of the history of everything, told through the evidence. Dates are rounded
            estimates where the evidence calls for it. Where a claim is still awaiting editorial
            verification, the page says so.
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-2">
          <nav aria-label="Chapters">
            <h2 className="eyebrow mb-4 text-muted">Chapters</h2>
            <ol className="grid gap-2 text-sm">
              {chapters.map((c) => (
                <li key={c.id}>
                  <Link href={`/journey/${c.slug}`} className="link-quiet text-text-light/90">
                    {c.number}. {c.title}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
          <nav aria-label="Explore">
            <h2 className="eyebrow mb-4 text-muted">Explore</h2>
            <ul className="grid gap-2 text-sm">
              <li><Link href="/timeline" className="link-quiet">The full timeline</Link></li>
              <li><Link href="/evidence" className="link-quiet">How do we know?</Link></li>
              <li><Link href="/sources" className="link-quiet">Sources</Link></li>
              <li><Link href="/search" className="link-quiet">Search</Link></li>
              <li><Link href="/about" className="link-quiet">About this project</Link></li>
            </ul>
          </nav>
        </div>
      </div>
      <div className="container-wide border-t border-border-dark py-6 text-xs text-muted">
        <p>No accounts, no tracking. Images are credited where they appear.</p>
      </div>
    </footer>
  );
}
