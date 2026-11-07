import type { MetadataRoute } from "next";
import { chapters } from "@/data/navigation";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/journey", "/timeline", "/evidence", "/sources", "/glossary", "/about", "/search"];
  return [
    ...pages.map((p) => ({ url: `${siteConfig.url}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.7 })),
    ...chapters.map((c) => ({ url: `${siteConfig.url}/journey/${c.slug}`, changeFrequency: "monthly" as const, priority: 0.9 })),
  ];
}
