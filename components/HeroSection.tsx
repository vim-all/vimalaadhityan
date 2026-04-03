"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, useVelocity } from "framer-motion";
import { WebGLBackground } from "./WebGLBackground";

export function HeroSection() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Track mouse position over the hero section
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Extract velocity
  const velocityX = useVelocity(mouseX);
  
  // Smooth the velocity out to avoid jagged jumps
  const smoothVelocity = useSpring(velocityX, {
    damping: 50,
    stiffness: 400
  });

  // Transform velocity into skew and scale values
  const skewX = useTransform(smoothVelocity, [-2000, 2000], [-15, 15]);
  const scaleX = useTransform(smoothVelocity, [-2000, 0, 2000], [1.2, 1, 1.2]);

  return (
    <section className="relative h-[110vh] w-full overflow-hidden flex flex-col justify-center items-center bg-background text-foreground">
      
      {/* Background layer text (will be heavily refracted by the 3D Glass Blob) */}
      <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none opacity-50">
        <h1 className="font-display font-black text-[15vw] leading-none uppercase tracking-tighter text-foreground whitespace-nowrap blur-sm">
          CREATOR
        </h1>
      </div>

      {/* The 3D Glass Blob (Sits in the middle, refracting background layer) */}
      <div className="absolute inset-0 z-10">
        <WebGLBackground />
      </div>
      
      {/* Foreground Kinetic Text Layer */}
      <div className="z-20 w-full max-w-[1400px] mx-auto px-4 md:px-12 pointer-events-none mix-blend-difference text-white">
        
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-2xl font-mono uppercase tracking-[0.2em] mb-4 md:mb-8"
        >
          Creative Developer • Designer
        </motion.p>
        
        <motion.div style={{ skewX, scaleX }} className="origin-left">
          <motion.h1 
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="font-display font-black leading-[0.8] tracking-tighter text-[12vw] sm:text-[150px] 2xl:text-[200px]"
          >
            CRAFTING
          </motion.h1>
          
          <motion.h1 
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="font-display font-black leading-[0.8] tracking-tighter text-[12vw] sm:text-[150px] 2xl:text-[200px]"
          >
            <span className="italic font-light text-accent mix-blend-normal">DIGITAL</span> MAGIC.
          </motion.h1>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-32 right-12 text-sm text-foreground mix-blend-normal font-mono hidden md:flex items-center gap-4"
        >
          <span>SCROLL TO EXPLORE</span>
          <div className="w-12 h-[1px] bg-foreground" />
        </motion.div>

      </div>
    </section>
  );
}
