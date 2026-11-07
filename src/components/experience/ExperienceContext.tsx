"use client";

import { createContext, useContext } from "react";
import type { ResolvedMedia } from "@/lib/media";
import type { Sfx, SoundEngine } from "./sound-engine";

export type ExperienceApi = {
  engine: React.RefObject<SoundEngine | null>;
  sound: boolean;
  /** Media id of the real recording playing now, if any. */
  hearing: string | null;
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
