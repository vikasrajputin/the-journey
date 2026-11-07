import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-reading flex min-h-[60vh] flex-col justify-center py-24">
      <p className="eyebrow text-accent">Page not found</p>
      <h1 className="mt-4 font-display text-[length:var(--text-h2)]">This part of the map is empty</h1>
      <p className="mt-6 text-muted">
        The page you were looking for doesn&rsquo;t exist, or it has moved. The rest of the journey is still
        here.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/journey" className="inline-flex min-h-12 items-center rounded-full bg-accent px-6 font-medium text-night">
          See all chapters
        </Link>
        <Link href="/" className="inline-flex min-h-12 items-center rounded-full border border-border-dark px-6">
          Back to the start
        </Link>
      </div>
    </section>
  );
}
