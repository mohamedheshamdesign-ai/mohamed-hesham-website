"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

const links = [
  { href: "/work", label: "Work" },
  { href: "/#services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close the menu on navigation (derived state, no effect needed)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    const onResize = () => { if (window.innerWidth > 800) setOpen(false); };
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Primary">
        <Link href="/" className="site-logo">
          <span className="site-logo-mark" aria-hidden="true"><svg viewBox="0 0 40 40"><path d="M20 0 24 13 34 6 27 16 40 20 27 24 34 34 24 27 20 40 16 27 6 34 13 24 0 20 13 16 6 6 16 13Z" fill="currentColor" /></svg></span>
          <span className="logo-name">Mohamed Hesham<span>BRAND &amp; GRAPHIC DESIGNER</span></span>
        </Link>


        <ul className="desktop-nav-links">
          <li className="nav-availability"><span className="status-dot" /> Let’s create something.</li>
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
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
              Start a project
              <span>↗</span>
            </Link>
          </li>

        </ul>

        <button
          type="button"
          ref={toggleRef}
          className="mobile-menu-button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls={open ? menuId : undefined}
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
                  onClick={() => setOpen(false)}
                  aria-current={isActive(link.href) ? "page" : undefined}
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
                Start a project
                <span>↗</span>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}