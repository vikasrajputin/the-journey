/** Visible editorial marker for content that still needs verification. */
export function ReviewNote({ note }: { note: string }) {
  return (
    <p className="review-note">
      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v5M12 16.5v.5" strokeLinecap="round" />
      </svg>
      <span>
        <strong className="font-semibold">Awaiting editorial review.</strong> {note}
      </span>
    </p>
  );
}
