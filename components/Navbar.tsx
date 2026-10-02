"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";

const links = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const menuId = useId();

  // Close the menu on navigation (derived state, no effect needed)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Primary">
        <Link href="/" className="site-logo">
          <span className="site-logo-mark" />
          <span>Mohamed Hesham</span>
        </Link>

        <ul className="desktop-nav-links">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`desktop-nav-link ${
                  isActive(link.href) ? "desktop-nav-link-active" : ""
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}

          <li>
            <Link href="/contact" className="nav-cta">
              Let&apos;s Talk
              <span>↗</span>
            </Link>
          </li>

        </ul>

        <button
          type="button"
          className="mobile-menu-button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">
            {open ? "Close menu" : "Open menu"}
          </span>

          <span
            className={`menu-line menu-line-top ${
              open ? "menu-line-top-open" : ""
            }`}
          />

          <span
            className={`menu-line menu-line-middle ${
              open ? "menu-line-middle-open" : ""
            }`}
          />

          <span
            className={`menu-line menu-line-bottom ${
              open ? "menu-line-bottom-open" : ""
            }`}
          />
        </button>
      </nav>

      {open && (
        <div id={menuId} className="mobile-menu">
          <ul className="mobile-menu-list">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`mobile-menu-link ${
                    isActive(link.href) ? "mobile-menu-link-active" : ""
                  }`}
                >
                  <span>{link.label}</span>
                  <span>↗</span>
                </Link>
              </li>
            ))}

            <li>
              <Link href="/contact" className="mobile-menu-cta">
                Let&apos;s Talk
                <span>↗</span>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}