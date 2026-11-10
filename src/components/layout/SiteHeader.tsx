import Link from "next/link";
import { primaryNav } from "@/data/navigation";
import { MobileNavigation } from "./MobileNavigation";
import { MotionToggle } from "./MotionToggle";
import { NavLink } from "./NavLink";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border-dark bg-night/80 backdrop-blur-md supports-[backdrop-filter]:bg-night/65">
      <div className="container-wide flex h-[var(--header-height)] items-center justify-between gap-6">
        <Link
          href="/"
          className="font-display text-lg tracking-[0.22em] text-text-light hover:text-accent transition-colors"
          aria-label="THE JOURNEY, home"
        >
          THE JOURNEY
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href}>{item.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <MotionToggle />
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-full border border-accent/60 px-5 text-sm font-medium text-accent hover:bg-accent hover:text-night transition-colors"
          >
            Play
          </Link>
        </div>

        <MobileNavigation />
      </div>
    </header>
  );
}
