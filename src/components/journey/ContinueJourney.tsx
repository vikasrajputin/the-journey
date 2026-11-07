"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getChapterSummary, type ChapterSummary } from "@/data/navigation";
import { LAST_CHAPTER_KEY } from "@/components/layout/ChapterProgress";

/**
 * Offers a way back to the last chapter the visitor opened on this device.
 * Nothing is sent anywhere; it reads one local value and renders nothing if absent.
 */
export function ContinueJourney() {
  const [chapter, setChapter] = useState<ChapterSummary | undefined>();

  useEffect(() => {
    try {
      const slug = localStorage.getItem(LAST_CHAPTER_KEY);
      if (slug && slug !== "before-everything") setChapter(getChapterSummary(slug));
    } catch {
      /* storage unavailable */
    }
  }, []);

  if (!chapter) return null;
  return (
    <Link
      href={`/journey/${chapter.slug}`}
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-sm text-muted underline-offset-4 hover:text-text-light hover:underline"
    >
      Continue: Chapter {chapter.number}, {chapter.title} →
    </Link>
  );
}
