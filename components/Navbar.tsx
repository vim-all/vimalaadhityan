"use client";

import * as React from "react";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 py-6 px-4 sm:px-10 pointer-events-none">
      <div className="mx-auto flex items-center justify-between pointer-events-auto relative">
        {/* Logo */}
        <Link
          href="/"
          className="text-sm md:text-xl font-display font-extrabold tracking-tighter text-foreground uppercase flex items-center gap-2 hover:opacity-70 transition-all"
        >
          Vimalaadhityan
        </Link>

        {/* Floating Nav Pill - Centered absolutely */}
        <nav className="hidden md:flex items-center gap-8 px-8 py-3 rounded-full bg-black/5 dark:bg-white/5 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-all absolute left-1/2 -translate-x-1/2">
          {["About", "Experience", "Projects", "Contact"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium tracking-wide text-foreground hover:opacity-70 transition-all uppercase"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4 mix-blend-difference">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
