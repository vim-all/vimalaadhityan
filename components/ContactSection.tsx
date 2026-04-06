"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useRef, useState, useEffect } from "react";

// The magnetic letter calculates its displacement based on mouse proximity
function MagneticLetter({ char, mouseX, mouseY }: { char: string, mouseX: any, mouseY: any }) {
  const ref = useRef<HTMLSpanElement>(null);
  const offset = {
    x: useSpring(0, { stiffness: 200, damping: 10, mass: 0.5 }),
    y: useSpring(0, { stiffness: 200, damping: 10, mass: 0.5 })
  };

  useEffect(() => {
    const handleMouseChange = () => {
      if (!ref.current) return;
      const x = mouseX.get();
      const y = mouseY.get();

      // If the mouse is out of bounds or not initialized
      if (x === -1000) {
        offset.x.set(0);
        offset.y.set(0);
        return;
      }

      const { left, top, width, height } = ref.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const distanceX = x - centerX;
      const distanceY = y - centerY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      const activeRadius = 250;
      if (distance < activeRadius) {
        const pushFactor = (activeRadius - distance) / activeRadius;
        offset.x.set(-distanceX * pushFactor * 0.6);
        offset.y.set(-distanceY * pushFactor * 0.6);
      } else {
        offset.x.set(0);
        offset.y.set(0);
      }
    };

    const unsubX = mouseX.on("change", handleMouseChange);
    const unsubY = mouseY.on("change", handleMouseChange);

    return () => {
      unsubX();
      unsubY();
    };
  }, [mouseX, mouseY, offset.x, offset.y]);

  return (
    <motion.span
      ref={ref}
      style={{ x: offset.x, y: offset.y }}
      className="inline-block hover:text-accent transition-colors duration-300"
    >
      {char === " " ? "\u00A0" : char}
    </motion.span>
  );
}

export function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // High performance tracking bypassing React renders
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  // Parallax / Curtain Reveal effect
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 20,
    restDelta: 0.001
  });

  // Reveal the footer from -80vh to 0 as we scroll
  const y = useTransform(smoothProgress, [0, 1], ["-60vh", "0vh"]);
  const opacity = useTransform(smoothProgress, [0, 0.5, 1], [0, 0.5, 1]);

  const phrase1 = "START A".split("");
  const phrase2 = "PROJECT.".split("");

  return (
    <div ref={sectionRef} className="relative w-full h-screen min-h-[800px] overflow-hidden bg-transparent">
      {/* We use a deeply nested sticky container to simulate a "Curtain Drop" */}
      <div
        className="absolute top-0 left-0 w-full h-screen min-h-[800px] overflow-hidden rounded-t-[4rem] bg-foreground text-background"
        onMouseMove={(e) => { mouseX.set(e.clientX); mouseY.set(e.clientY); }}
        onMouseLeave={() => { mouseX.set(-1000); mouseY.set(-1000); }}
      >
        {/* Kinetic Parallax Wrapper */}
        <motion.div
          className="w-full h-full flex flex-col justify-between py-12 px-6 md:px-20 relative"
          style={{ y, opacity }}
        >
          {/* Subtle grid texture overlay for brutalist feel */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-difference"
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
          />

          <div className="z-10 w-full max-w-[1400px] mx-auto mt-10 md:mt-20">
            <p className="font-mono uppercase tracking-widest text-background/50 mb-8 border-b border-background/20 pb-4 inline-block">
              // LET&apos;S CONNECT
            </p>

            {/* Extremely brutalist magnetic typography block */}
            <div className="flex flex-col cursor-crosshair w-full overflow-visible">
              <h2 className="text-[14vw] md:text-[11vw] flex flex-row flex-nowrap whitespace-nowrap font-display font-black leading-[0.8] tracking-tighter uppercase text-background">
                {phrase1.map((char, index) => (
                  <MagneticLetter key={index} char={char} mouseX={mouseX} mouseY={mouseY} />
                ))}
              </h2>
              <h2 className="text-[13vw] md:text-[10vw] flex flex-row flex-nowrap whitespace-nowrap font-display font-black leading-[0.8] tracking-tighter uppercase text-background md:ml-[8vw]">
                {phrase2.map((char, index) => (
                  <MagneticLetter key={index} char={char} mouseX={mouseX} mouseY={mouseY} />
                ))}
              </h2>
            </div>

            <div className="mt-16 md:mt-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-12 border-t border-background/20 pt-8 pb-12 w-full">
              <div className="flex flex-col gap-6 max-w-xl">
                <a
                  href="mailto:vimalaadhityan@gmail.com"
                  data-cursor="VIMALAADHITYAN"
                  className="text-3xl md:text-5xl font-display font-medium hover:italic hover:text-accent transition-all duration-300 w-fit relative group cursor-none"
                >
                  vimalaadhityan@gmail.com
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-accent transition-all duration-500 group-hover:w-full opacity-0 group-hover:opacity-100" />
                </a>
                <p className="text-background/60 font-mono text-sm leading-relaxed">
                  I&apos;m always looking for ambitious projects and people.
                  If you want to build something mathematically beautiful and inherently disruptive, reach out.
                </p>
              </div>

              <div className="flex flex-wrap gap-x-8 gap-y-4 font-mono uppercase text-sm font-bold tracking-widest">
                <a href="#" className="hover:text-accent transition-colors relative group">
                  Twitter
                  <span className="absolute -bottom-1 right-0 w-0 h-[2px] bg-pink transition-all duration-300 group-hover:w-full group-hover:left-0" />
                </a>
                <a href="https://www.linkedin.com/in/vimalaadhityan/" target="_blank" className="hover:text-accent transition-colors relative group">
                  LinkedIn
                  <span className="absolute -bottom-1 right-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full group-hover:left-0" />
                </a>
                <a href="https://github.com/vim-all" target="_blank" className="hover:text-accent transition-colors relative group">
                  Github
                  <span className="absolute -bottom-1 right-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full group-hover:left-0" />
                </a>
              </div>
            </div>
          </div>

          <div className="w-full text-center text-background/40 text-xs font-mono uppercase tracking-[0.3em] z-20 pb-4">
            © {new Date().getFullYear()} Vimalaadhityan
          </div>
        </motion.div>
      </div>
    </div>
  );
}
