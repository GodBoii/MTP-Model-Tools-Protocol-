"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { installCommand, navItems } from "@/content/site";

export function Header() {
  const pathname = usePathname();
  return (
    <header className="nav">
      <Link className="link-line brand" href="/">mtpx</Link>
      <div className="nav__descriptor">multi tool protocol</div>
      <nav className="nav__routes" aria-label="Primary navigation">
        {navItems.map((item) => (
          <Link className={`link-line ${pathname === item.href || pathname.startsWith(`${item.href}/`) ? "is-active" : ""}`} href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="nav__social nav__install">{installCommand}</div>
      <div className="nav__location">docs / runtime / sdk</div>
    </header>
  );
}
