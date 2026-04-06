"use client";

import * as React from "react";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 py-6 px-4 sm:px-10 pointer-events-none">
      <div className="mx-auto flex items-center justify-between pointer-events-auto">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-display font-extrabold tracking-tighter mix-blend-difference text-white uppercase flex items-center gap-2"
        >
          Vimalaadhityan
        </Link>

        {/* Floating Nav Pill */}
        <nav className="hidden md:flex items-center gap-8 px-8 py-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-all mix-blend-difference">
          {["About", "Experience", "Projects", "Contact"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium tracking-wide text-white/60 hover:text-white transition-colors uppercase"
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
