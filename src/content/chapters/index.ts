import type { Chapter } from "@/lib/content-schema";
import { chapter as c01 } from "./01-before-everything";
import { chapter as c02 } from "./02-planet-earth";
import { chapter as c03 } from "./03-first-life";
import { chapter as c04 } from "./04-diversification";
import { chapter as c05 } from "./05-age-of-giants";
import { chapter as c06 } from "./06-human-story";
import { chapter as c07 } from "./07-civilisation";
import { chapter as c08 } from "./08-age-of-ideas";
import { chapter as c09 } from "./09-world-we-built";
import { chapter as c10 } from "./10-you";

export const allChapters: readonly Chapter[] = [c01, c02, c03, c04, c05, c06, c07, c08, c09, c10];

export function getChapter(slug: string): Chapter | undefined {
  return allChapters.find((c) => c.slug === slug);
}
