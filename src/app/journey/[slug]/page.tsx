import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allChapters, getChapter } from "@/content/chapters";
import { assertContentValid } from "@/lib/content-validate";
import { ChapterView } from "@/components/journey/ChapterView";

// Fail the build if any content reference is broken.
assertContentValid();

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return allChapters.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const chapter = getChapter(slug);
  if (!chapter) return {};
  return {
    title: `${chapter.number}. ${chapter.title}`,
    description: `${chapter.centralQuestion} ${chapter.intro}`,
    alternates: { canonical: `/journey/${chapter.slug}` },
    openGraph: { title: `${chapter.title} · THE JOURNEY`, description: chapter.subtitle },
  };
}

export default async function ChapterPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const chapter = getChapter(slug);
  if (!chapter) notFound();
  return <ChapterView chapter={chapter} />;
}
