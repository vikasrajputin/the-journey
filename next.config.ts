import type { NextConfig } from "next";

/**
 * `npm run build` produces the normal Next.js build (used by `next start` and the tests).
 * `npm run build:pages` sets STATIC_EXPORT=1 and produces a fully static site in `out/`
 * for GitHub Pages, served from the repository's sub-path.
 */
const staticExport = process.env.STATIC_EXPORT === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = staticExport
  ? { output: "export", basePath, trailingSlash: true, images: { unoptimized: true } }
  : {};

export default nextConfig;
