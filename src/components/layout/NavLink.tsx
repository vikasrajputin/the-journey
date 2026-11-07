"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  onNavigate?: () => void;
};

export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLink({ href, children, className, onNavigate }: NavLinkProps) {
  const pathname = usePathname() ?? "/";
  const active = isActivePath(pathname, href);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
      className={
        className ??
        `inline-flex min-h-11 items-center rounded-full px-4 text-sm transition-colors ${
          active ? "text-accent" : "text-muted hover:text-text-light"
        }`
      }
    >
      {children}
    </Link>
  );
}
