export const siteConfig = {
  name: "THE JOURNEY",
  tagline: "The story of everything, and then there was you",
  taglineDisplay: "THE STORY OF EVERYTHING — AND THEN, THERE WAS YOU.",
  description:
    "Explore 13.8 billion years of cosmic, geological, evolutionary, and human history in an immersive educational journey.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;
