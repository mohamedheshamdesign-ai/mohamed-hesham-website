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
  const menuId = useId();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:h-[4.5rem]"
        aria-label="Primary"
      >
        <Link
          href="/"
          className="text-[15px] font-medium tracking-tight text-neutral-950"
        >
          Mohamed Hisham
        </Link>

        <ul className="hidden items-center gap-10 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-[13px] tracking-[0.14em] uppercase transition-colors duration-150 ${
                  isActive(link.href)
                    ? "text-neutral-950"
                    : "text-neutral-500 hover:text-neutral-950"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span
            className={`absolute left-1/2 top-1/2 h-px w-5 bg-neutral-950 transition-transform duration-150 ${
              open ? "-translate-x-1/2 rotate-45" : "-translate-x-1/2 -translate-y-1.5"
            }`}
          />
          <span
            className={`absolute left-1/2 top-1/2 h-px w-5 -translate-x-1/2 bg-neutral-950 transition-opacity duration-150 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute left-1/2 top-1/2 h-px w-5 bg-neutral-950 transition-transform duration-150 ${
              open ? "-translate-x-1/2 -rotate-45" : "-translate-x-1/2 translate-y-1.5"
            }`}
          />
        </button>
      </nav>

      {open ? (
        <div
          id={menuId}
          className="border-t border-neutral-200 bg-white md:hidden"
        >
          <ul className="mx-auto flex max-w-6xl flex-col px-6 py-6">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block py-3 text-sm tracking-[0.14em] uppercase ${
                    isActive(link.href) ? "text-neutral-950" : "text-neutral-500"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </header>
  );
}
