export const siteConfig = {
  name: "THE JOURNEY",
  tagline: "The story of everything, and then there was you",
  taglineDisplay: "THE STORY OF EVERYTHING — AND THEN, THERE WAS YOU.",
  description:
    "An immersive digital museum of the history of the universe, Earth, life and humanity, told through the evidence and ending with you.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;
