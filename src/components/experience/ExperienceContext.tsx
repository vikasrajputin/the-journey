"use client";

import { createContext, useContext } from "react";
import type { ResolvedMedia } from "@/lib/media";
import type { Narrator, Sfx, SoundEngine } from "./sound-engine";

export type ExperienceApi = {
  engine: React.RefObject<SoundEngine | null>;
  narrator: React.RefObject<Narrator | null>;
  sound: boolean;
  reduced: boolean;
  media: Record<string, ResolvedMedia>;
  sfx: (s: Sfx) => void;
  shake: (strength?: number, ms?: number) => void;
};

export const ExperienceContext = createContext<ExperienceApi | null>(null);

export function useExperience() {
  const v = useContext(ExperienceContext);
  if (!v) throw new Error("useExperience outside provider");
  return v;
}
