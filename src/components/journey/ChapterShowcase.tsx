import { chapters } from "@/data/navigation";
import { heroMedia } from "@/lib/chapter-media";
import { media } from "@/lib/media";
import { ShowcaseGrid, type ShowcaseCard } from "./ShowcaseGrid";

/** Every chapter as a big photo or video card, side by side. */
export function ChapterShowcase() {
  const cards: ShowcaseCard[] = chapters.map((c) => {
    const m = media[heroMedia[c.slug]?.media ?? ""];
    return {
      slug: c.slug,
      number: c.number,
      title: c.title,
      time: c.timeLabel,
      question: c.centralQuestion,
      theme: c.theme,
      image: m?.srcSmall,
      imageLarge: m?.src,
      video: m?.kind === "video" ? m.sources : undefined,
      credit: m ? `${m.alt}. ${m.credit}` : undefined,
    };
  });
  return <ShowcaseGrid cards={cards} />;
}
