"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { WebGLBackground } from "@/components/WebGLBackground";

export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full overflow-hidden px-4">
      {/* Background Layer */}
      <div className="absolute inset-0 opacity-40">
        <WebGLBackground />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-[6rem] md:text-[20rem] font-display font-extrabold leading-none tracking-tighter text-accent select-none drop-shadow-[0_0_30px_rgba(var(--color-accent),0.5)]">
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <h2 className="text-3xl md:text-5xl font-display font-medium uppercase tracking-tight">
              Nexus Breach Detected
            </h2>
            <p className="text-lg md:text-xl font-body text-foreground/60 max-w-md mx-auto">
              You&apos;ve drifted outside the known coordinate system. This sector of the Neural Nexus doesn&apos;t exist—yet.
            </p>
          </div>

          <div className="pt-8">
            <Link
              href="/"
              className="group relative inline-flex items-center gap-3 px-10 py-4 bg-foreground text-background font-display font-bold text-lg uppercase tracking-widest transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <span className="relative z-10">Initiate Return Protocol</span>

              {/* Glitch Overlay on Hover */}
              <div className="absolute inset-0 bg-accent translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out z-0" />

              {/* Decorative elements for that agency feel */}
              <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-accent" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-accent" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Technical Data Decors */}
      <div className="absolute bottom-10 left-10 hidden lg:block opacity-30 font-mono text-[10px] space-y-1">
        <div>STATUS: DISCONNECTED</div>
        <div>LATENCY: ∞ MS</div>
        <div>COORDINATES: UNKNOWN</div>
      </div>

      <div className="absolute top-10 right-10 hidden lg:block opacity-30 font-mono text-[10px] space-y-1 text-right">
        <div>SECTOR: 0XDEADBEEF</div>
        <div>PROTOCOL: NULL_POINTER</div>
        <div>ERROR: PAGE_NOT_FOUND</div>
      </div>
    </div>
  );
}
