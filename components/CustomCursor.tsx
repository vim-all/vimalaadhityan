"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [hoverText, setHoverText] = useState("");

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Chained spring physics for the "Comet Tail / Symbiote"
  const springConf = { stiffness: 800, damping: 30, mass: 0.1 };
  
  const leadX = useSpring(mouseX, springConf);
  const leadY = useSpring(mouseY, springConf);
  
  const tail1X = useSpring(leadX, { stiffness: 400, damping: 25, mass: 0.2 });
  const tail1Y = useSpring(leadY, { stiffness: 400, damping: 25, mass: 0.2 });
  
  const tail2X = useSpring(tail1X, { stiffness: 200, damping: 25, mass: 0.3 });
  const tail2Y = useSpring(tail1Y, { stiffness: 200, damping: 25, mass: 0.3 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      let interactiveEl = target.closest("a, button, [contenteditable]") as HTMLElement;
      
      if (interactiveEl) {
        setIsHovering(true);
        let text = interactiveEl.innerText?.trim() || "LOCKED";
        setHoverText(text.substring(0, 10).toUpperCase());
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      <div className="hidden md:block pointer-events-none z-10000 fixed inset-0 overflow-hidden mix-blend-difference">
        
        {/* Tail 2 (Smallest, furthest back) */}
        <motion.div
            className="absolute w-1.5 h-1.5 bg-accent rounded-full"
            style={{ left: tail2X, top: tail2Y, x: "-50%", y: "-50%" }}
            animate={{ scale: isHovering ? 0 : 1, opacity: isHovering ? 0 : 0.3 }}
        />

        {/* Tail 1 (Medium) */}
        <motion.div
            className="absolute w-2 h-2 bg-accent rounded-full"
            style={{ left: tail1X, top: tail1Y, x: "-50%", y: "-50%" }}
            animate={{ scale: isHovering ? 0 : 1, opacity: isHovering ? 0 : 0.6 }}
        />

        {/* Lead Dot (Heavy) */}
        <motion.div
            className="absolute w-3 h-3 bg-accent rounded-full"
            style={{ left: leadX, top: leadY, x: "-50%", y: "-50%" }}
            animate={{ scale: isHovering ? 0 : 1, opacity: isHovering ? 0 : 1 }}
        />

        {/* Pure Instant Core - Tiny precision target */}
        <motion.div
            className="absolute w-1 h-1 bg-accent rounded-full"
            style={{ left: mouseX, top: mouseY, x: "-50%", y: "-50%" }}
            animate={{ scale: isHovering ? 0 : 1 }}
        />

        {/* Hover UI: Holographic Tactical Target */}
        <motion.div
            className="absolute flex items-center justify-center font-mono text-[8px] tracking-[0.2em] font-black uppercase text-accent"
            style={{ left: leadX, top: leadY, x: "-50%", y: "-50%" }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
                opacity: isHovering ? 1 : 0, 
                scale: isHovering ? 1 : 0.8,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
            <div className="absolute w-10 h-10 border border-accent rounded-[4px] animate-[spin_6s_linear_infinite]" />
            <div className="absolute w-12 h-12 border border-accent rounded-[4px] animate-[orbit-spin-reverse_8s_linear_infinite] opacity-50" />
            <motion.span 
              className="absolute -top-6 whitespace-nowrap bg-accent text-background px-1.5 py-0.5 rounded-[2px]"
              animate={{ y: isHovering ? 0 : 5, opacity: isHovering ? 1 : 0 }}
            >
              [ {hoverText || "LOCKED"} ]
            </motion.span>
        </motion.div>
      </div>

      {/* Global CSS to FORCE hide the system cursor on desktop */ }
      <style dangerouslySetInnerHTML={{__html: `
        @media (pointer: fine) {
          *, *::before, *::after {
            cursor: none !important;
          }
        }
      `}} />
    </>
  );
}
