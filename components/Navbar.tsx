"use client";

import Link from "next/link";
import { useState } from "react";

const menuItems = [
  { label: "Artikel", href: "/artikel" },
  { label: "Glosarium", href: "/glosarium" },
  { label: "Cuaca", href: "/cuaca" },
  { label: "Alat", href: "/alat/pupuk" },
];

// Bilah navigasi atas. Di layar kecil, menu dibuka/ditutup dengan tombol.
// Input: tidak ada.
// Output: elemen <header> berisi logo dan menu.
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <nav
        aria-label="Navigasi utama"
        className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8"
      >
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="font-heading text-xl font-bold text-primary-dark"
          >
            AgriTech Hub
          </Link>

          {/* Menu desktop */}
          <ul className="hidden items-center gap-8 md:flex">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="font-medium text-text hover:text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Tombol menu mobile */}
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-primary-dark md:hidden"
            aria-label={isOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={isOpen}
            aria-controls="menu-mobile"
            onClick={() => setIsOpen((current) => !current)}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {isOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Menu mobile */}
        <ul
          id="menu-mobile"
          className={`${isOpen ? "block" : "hidden"} border-t border-border py-2 md:hidden`}
        >
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-md px-2 py-3 font-medium text-text hover:text-primary"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}