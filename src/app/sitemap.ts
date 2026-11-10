import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/sources", "/about"];
  return pages.map((p) => ({ url: `${siteConfig.url}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.6 }));
}
