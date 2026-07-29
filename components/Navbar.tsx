"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  const [isOverContact, setIsOverContact] = React.useState(false);
  const { resolvedTheme } = useTheme();

  React.useEffect(() => {
    const contactEl = document.getElementById("contact");
    if (!contactEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsOverContact(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    observer.observe(contactEl);
    return () => observer.disconnect();
  }, []);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // When over contact section:
  // In Dark theme, Contact card is Light (bg-foreground) -> Navbar needs to be dark text (text-zinc-950)
  // In Light theme, Contact card is Dark (bg-foreground) -> Navbar needs to be light text (text-zinc-50)
  const isDark = resolvedTheme === "dark";
  const contactTextColor = isOverContact
    ? (isDark ? "text-zinc-950" : "text-zinc-50")
    : "text-foreground";

  const contactNavPillStyle = isOverContact
    ? (isDark 
        ? "bg-black/10 border-black/20 text-zinc-950 shadow-lg" 
        : "bg-white/10 border-white/20 text-zinc-50 shadow-lg")
    : "bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-foreground shadow-[0_4px_30px_rgba(0,0,0,0.1)]";

  return (
    <header className="fixed top-0 w-full z-50 py-6 px-4 sm:px-10 pointer-events-none">
      <div className="mx-auto flex items-center justify-between pointer-events-auto relative">
        {/* Logo */}
        <Link
          href="/"
          onClick={(e) => {
            if (window.location.pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className={`text-sm md:text-xl font-display font-extrabold tracking-tighter uppercase flex items-center gap-2 hover:opacity-70 transition-colors duration-500 ${contactTextColor}`}
        >
          Vimalaadhityan
        </Link>

        {/* Floating Nav Pill - Centered absolutely */}
        <nav className={`hidden md:flex items-center gap-8 px-8 py-3 rounded-full backdrop-blur-xl border transition-all duration-500 absolute left-1/2 -translate-x-1/2 ${contactNavPillStyle}`}>
          {["About", "Experience", "Projects", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={(e) => handleScroll(e, item.toLowerCase())}
              className="text-sm font-medium tracking-wide hover:opacity-70 transition-colors duration-500 uppercase cursor-pointer"
            >
              {item}
            </a>
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
