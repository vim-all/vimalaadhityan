"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionValue, AnimatePresence } from "framer-motion";
import { Coffee, Zap, Moon, Bug as BugIcon, Terminal, Sparkles, Monitor, Layers, MousePointer2 } from "lucide-react";

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  title?: string;
  onClick?: () => void;
  is3D?: boolean;
  mouseX?: any;
  mouseY?: any;
}

function BentoCard({ children, className = "", delay = 0, title, onClick, is3D, mouseX, mouseY }: BentoCardProps) {
  const fallback = useMotionValue(0);
  const rotateX = useTransform(mouseY || fallback, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseX || fallback, [-0.5, 0.5], [-10, 10]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: [0.215, 0.61, 0.355, 1] }}
      whileHover={{ y: -5, scale: 1.01 }}
      onClick={onClick}
      style={{
        boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
        rotateX: is3D ? rotateX : 0,
        rotateY: is3D ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      className={`relative group bg-foreground/3 backdrop-blur-3xl border border-white/5 rounded-4xl overflow-hidden p-6 lg:p-10 transition-all duration-500 hover:bg-foreground/5 cursor-default perspective-1000 ${className}`}
    >
      {title && (
        <div className="absolute top-4 lg:top-6 left-6 lg:left-8 flex items-center gap-2 opacity-30 group-hover:opacity-100 transition-opacity duration-500 z-50">
          <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-foreground">{title}</span>
        </div>
      )}
      <div className="h-full w-full flex flex-col justify-center items-center relative z-10" style={{ transform: is3D ? "translateZ(50px)" : "none" }}>
        {children}
      </div>
    </motion.div>
  );
}

function BugParticle({ i }: { i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1, 1, 0.5],
        x: (Math.random() - 0.5) * 400,
        y: (Math.random() - 0.5) * 400,
        rotate: Math.random() * 360
      }}
      transition={{ duration: 2, delay: i * 0.05, ease: "circOut" }}
      className="absolute text-accent/40 pointer-events-none"
    >
      <BugIcon className="w-8 h-8" />
    </motion.div>
  );
}

function TechBubble({ name, baseDelay, speedMult }: { name: string, baseDelay: number, speedMult: number }) {
  return (
    <motion.div
      drag
      dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
      dragElastic={0.1}
      whileHover={{ scale: 1.15, rotate: 5, boxShadow: "0 0 20px rgba(224,255,34,0.3)" }}
      whileDrag={{ scale: 1.3, zIndex: 50, cursor: "grabbing" }}
      animate={{
        x: [0, Math.sin(baseDelay) * 15, 0],
        y: [0, Math.cos(baseDelay) * 15, 0]
      }}
      transition={{
        duration: (4 + baseDelay) / speedMult,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="bg-accent/10 border border-accent/20 px-5 py-2.5 rounded-full cursor-grab active:cursor-grabbing font-mono text-[11px] uppercase tracking-widest text-accent whitespace-nowrap shadow-sm group hover:border-accent/40 transition-colors"
    >
      <div className="flex items-center gap-2">
        {name}
        <MousePointer2 className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
      </div>
    </motion.div>
  );
}

export function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [jitter, setJitter] = useState(false);
  const [bugs, setBugs] = useState(false);
  const [lightning, setLightning] = useState(false);
  const [sleep, setSleep] = useState(false);
  const [overclock, setOverclock] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    // Injected Global CSS for special effects
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes shake-extreme {
        0%, 100% { transform: translate(0, 0); filter: blur(0); }
        25% { transform: translate(-4px, 4px) skew(5deg); filter: blur(1px) contrast(1.5); color: #00f3ff; }
        50% { transform: translate(4px, -4px); color: #ff00ea; }
        75% { transform: translate(-4px, -4px); filter: blur(2px); }
      }
      .animate-shake-extreme { animation: shake-extreme 0.1s infinite; }
      .bg-overclock { --accent: #00f3ff; }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = containerRef.current!.getBoundingClientRect();
    mouseX.set((clientX - left) / width - 0.5);
    mouseY.set((clientY - top) / height - 0.5);
  };

  const triggerBugSwarm = () => { setBugs(true); setTimeout(() => setBugs(false), 3000); };
  const triggerLightning = () => { setLightning(true); setTimeout(() => setLightning(false), 300); };
  const triggerCaffeine = () => { setJitter(true); setTimeout(() => setJitter(false), 1200); };
  const toggleSleep = () => setSleep(!sleep);

  const bioParallaxX = useTransform(smoothMouseX, [-0.5, 0.5], [-30, 30]);
  const bioParallaxY = useTransform(smoothMouseY, [-0.5, 0.5], [-30, 30]);

  const techStack = [
    "Next.js", "Three.js", "GLSL", "React", "GSAP", "TailwindCSS", "FramerMotion", "TypeScript"
  ];

  return (
    <section
      id="about"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative w-full py-20 lg:py-40 bg-background overflow-hidden transition-all duration-700 
        ${jitter ? "animate-shake-extreme select-none" : ""} 
        ${sleep ? "filter blur-sm grayscale brightness-50" : ""} 
        ${overclock ? "bg-overclock" : ""}`}
    >
      <div className="container px-6 mx-auto max-w-[1400px] relative z-20">

        {/* Section Header with Understated "Overclock" trigger */}
        <div className="flex flex-col items-center mb-24 text-center">
          <motion.div
            onClick={() => setOverclock(!overclock)}
            className="group cursor-pointer flex flex-col items-center"
          >
            <motion.span
              className="text-accent font-mono text-[10px] font-black tracking-[1em] uppercase mb-4 opacity-50 group-hover:opacity-100 transition-opacity"
            >
                 // {overclock ? "OVERCLOCK_ACTIVE_v2.0" : "BIOGRAPHY_CORE_v1.0"}
            </motion.span>
            <motion.h2
              className="text-5xl lg:text-8xl font-display font-black uppercase tracking-tighter leading-none"
            >
              THE <span className="text-accent italic font-light">ARCHITECT</span> BEHIND THE PIXELS.
            </motion.h2>
          </motion.div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:auto-rows-[250px] perspective-2000">

          {/* Bio Card - Higher depth and fixed overflow */}
          <BentoCard
            className="lg:col-span-8 lg:row-span-2 flex flex-col items-start justify-center text-left py-16 px-10 lg:px-16"
            title="SYSTEM_MANIFESTO"
            is3D={true}
            mouseX={smoothMouseX}
            mouseY={smoothMouseY}
          >
            <motion.div style={{ x: bioParallaxX, y: bioParallaxY, translateZ: 80 }} className="relative">
              <p className="text-xl lg:text-4xl font-light leading-snug text-foreground/90 lowercase italic tracking-tight">
                i build digital symphonies where raw engineering meets radical design intuition.
                my process is a high-fidelity feedback loop focused on robust performance
                and deterministic scalability across the modern web stack.
              </p>
            </motion.div>
            <div className="mt-12 flex items-center gap-6 group cursor-pointer h-12">
              <div className="w-12 h-12 rounded-full border border-accent/20 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all duration-500 group-hover:scale-110">
                <Sparkles className="w-5 h-5 text-accent group-hover:text-background" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-2">Initializing Process Stream -{">"}</span>
            </div>
          </BentoCard>

          {/* Kinetic Stack Pit */}
          <BentoCard className="lg:col-span-4 lg:row-span-2 overflow-visible" title="KINETIC_STACK">
            <div className="flex flex-wrap gap-4 justify-center items-center h-full pt-10">
              {techStack.map((name, i) => (
                <TechBubble key={name} name={name} baseDelay={i} speedMult={overclock ? 2 : 1} />
              ))}
              <div className="absolute bottom-8 flex flex-col items-center gap-2 opacity-30 animate-pulse">
                <p className="font-mono text-[8px] uppercase tracking-[0.4em] select-none text-accent font-black">DRAG_TO_TEST_EQUILIBRIUM</p>
              </div>
            </div>
          </BentoCard>

          {/* Diagnostics - Advanced Easter Eggs */}
          <BentoCard className="lg:col-span-4 lg:row-span-2" title="BIO_DIAGNOSTICS">
            <div className="grid grid-cols-2 gap-8 w-full p-6 relative">
              {[
                { icon: Coffee, label: "Caffeine", val: "110%", col: "text-accent", fn: triggerCaffeine },
                { icon: Moon, label: "Sleep", val: "OFFLINE", col: "text-orange-400", fn: toggleSleep },
                { icon: BugIcon, label: "Bugs", val: "404", col: "text-blue-400", fn: triggerBugSwarm },
                { icon: Zap, label: "Energy", val: "PEAK", col: "text-accent", fn: triggerLightning }
              ].map(({ icon: Icon, label, val, col, fn }) => (
                <div key={label} onClick={fn} className="flex flex-col items-center gap-3 cursor-pointer group/stat active:scale-90 transition-transform">
                  <div className={`w-12 h-12 rounded-2xl bg-foreground/5 border border-foreground/10 flex items-center justify-center group-hover/stat:scale-110 group-hover/stat:border-accent group-hover/stat:bg-accent/5 transition-all duration-500`}>
                    <Icon className={`w-5 h-5 ${col}`} />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-40 mb-1">{label}</span>
                    <span className="text-xl font-display font-black uppercase text-foreground">{val}</span>
                  </div>
                </div>
              ))}

              {/* Bug Swarm Overlay */}
              <AnimatePresence>
                {bugs && Array.from({ length: 15 }).map((_, i) => <BugParticle key={i} i={i} />)}
              </AnimatePresence>
            </div>
          </BentoCard>

          {/* System Info Card */}
          <BentoCard className="lg:col-span-4 lg:row-span-2 flex flex-col items-start gap-6" title="ENVIRONMENT_LOG">
            <div className="space-y-6 w-full pt-4">
              {[
                { icon: Terminal, label: "Shell", val: "ZSH" },
                { icon: Monitor, label: "Screen", val: "RETINA_XDR" },
                { icon: Layers, label: "Layer", val: "THREE_JS" },
                { icon: Sparkles, label: "Vibe", val: "PREMIUM" }
              ].map(({ icon: Icon, label, val }) => (
                <div key={label} className="flex items-center justify-between w-full border-b border-white/5 pb-4 last:border-0 group/row cursor-pointer">
                  <div className="flex items-center gap-4 group-hover/row:translate-x-2 transition-all">
                    <Icon className="w-4 h-4 opacity-50 group-hover/row:text-accent group-hover/row:opacity-100 transition-all" />
                    <span className="text-[10px] font-mono uppercase tracking-widest opacity-40">{label}</span>
                  </div>
                  <span className="text-sm font-display font-black group-hover/row:text-accent transition-colors">{val}</span>
                </div>
              ))}
            </div>
          </BentoCard>

          {/* Magnetic Core Card */}
          <BentoCard className="lg:col-span-4 lg:row-span-2 overflow-hidden" title="MAGNETIC_CORE">
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <motion.div
                style={{
                  x: useTransform(smoothMouseX, [-0.5, 0.5], [-80, 80]),
                  y: useTransform(smoothMouseY, [-0.5, 0.5], [-80, 80]),
                }}
                animate={{
                  rotate: 360,
                  boxShadow: overclock ? "0 0 60px rgba(0, 243, 255, 0.5)" : "0 0 30px rgba(224,255,34,0.2)"
                }}
                transition={{ rotate: { duration: overclock ? 10 : 25, repeat: Infinity, ease: "linear" } }}
                className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-linear-to-br from-accent/30 to-transparent backdrop-blur-2xl border border-accent/30 flex flex-col items-center justify-center relative cursor-none"
              >
                <Sparkles className="w-8 h-8 text-accent animate-pulse" />
                <div className="absolute inset-0 rounded-full bg-accent/20 blur-2xl animate-pulse" />
              </motion.div>
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
                <circle cx="50%" cy="50%" r="40%" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5 5" />
              </svg>
              <p className="absolute bottom-6 font-mono text-[8px] opacity-30 uppercase tracking-[0.5em] animate-pulse">VECTOR_LOCKED</p>
            </div>
          </BentoCard>

        </div>

      </div>

      {/* Global Easter Egg Visuals */}
      <AnimatePresence>
        {lightning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0, 1, 0] }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-100 pointer-events-none mix-blend-difference"
          />
        )}
        {sleep && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 pointer-events-none flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-10">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 0, scale: 1 }}
                  animate={{ opacity: [0, 1, 0], y: - i * 50, scale: 1.5 + i * 0.2 }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                  className="font-display font-black text-6xl lg:text-9xl text-accent/50"
                >
                  Z
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop Atmos */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 pointer-events-none select-none opacity-[0.01]">
        <span className="font-mono text-[25vw] font-black uppercase tracking-tighter vertical-text">COGNITIVE_GRID</span>
      </div>
    </section>
  );
}
