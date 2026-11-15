import type { Metadata } from "next";
import Link from "next/link";
import { Game } from "@/components/game/Game";
import { CHAPTER, moments } from "@/components/game/moments";

export const metadata: Metadata = {
  title: { absolute: "THE JOURNEY · Chapter 1: Before Everything" },
  description: CHAPTER.tagline,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Game />
      <section className="game-nojs" aria-label="Chapter 1 without JavaScript">
        <div className="container-reading py-10">
          <p>The journey needs JavaScript. Here is what happens in Chapter 1, moment by moment.</p>
          <ol className="mt-4 grid gap-3">
            {moments.map((l) => (
              <li key={l.id}>
                <strong>{l.name}</strong> ({l.when}). {l.fact}
              </li>
            ))}
          </ol>
          <p className="mt-4">
            <Link href="/sources/">See the sources</Link>
          </p>
        </div>
      </section>
    </>
  );
}
