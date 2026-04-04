"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useVelocity, AnimatePresence } from "framer-motion";
import { Starfield } from "./NeuralNexus";
import { Activity, Satellite, Cpu, Globe, Maximize2, Zap } from "lucide-react";

interface OrbitalNodeProps {
  label: string;
  value: string;
  icon: any;
  radius: number;
  duration: number;
  initAngle?: number;
  reverse?: boolean;
}

function OrbitalNode({ label, value, icon: Icon, radius, duration, initAngle = 0, reverse = false }: OrbitalNodeProps) {
  return (
    <motion.div
      initial={{ rotate: initAngle }}
      animate={{ rotate: reverse ? initAngle - 360 : initAngle + 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
      className="absolute flex items-center justify-center pointer-events-none"
      style={{ width: radius * 2, height: radius * 2 }}
    >
      <motion.div
        initial={{ rotate: -initAngle }}
        animate={{ rotate: reverse ? 360 - initAngle : -360 - initAngle }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
        style={{ x: radius }}
        className="flex items-center gap-4 px-4 py-2 border border-accent/20 backdrop-blur-md bg-accent/5 rounded-full shadow-[0_0_20px_rgba(var(--color-accent),0.1)] transition-colors hover:bg-accent/10 pointer-events-auto"
      >
        <div className="w-8 h-8 rounded-full border border-accent/30 flex items-center justify-center bg-accent/10">
          <Icon className="w-4 h-4 text-accent" />
        </div>
        <div className="flex flex-col whitespace-nowrap">
          <span className="text-[7px] font-mono uppercase tracking-widest text-accent font-black">{label}</span>
          <span className="text-[10px] font-mono font-bold text-foreground/90">{value}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CommandConsole() {
  const messages = [
    "NEURAL_LINK: ACTIVE",
    "UPLINK_STABLE_412",
    "SECURE_V3.0_ESTABLISHED",
    "CMD: TYPE 'GOD'",
    "CMD: TYPE 'ZEN'",
    "STATUS: OPERATIONAL"
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-1 font-mono text-[10px] text-accent font-black tracking-widest uppercase">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-accent rounded-full animate-pulse shadow-[0_0_10px_rgba(var(--color-accent),1)]" />
        <span className="opacity-40 tracking-[0.4em]">[ SYS_LOG ]</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          exit={{ opacity: 0, scaleY: 0 }}
          className="text-foreground/80"
        >
          {`> ${messages[index]}`}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

export function HeroSection() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [glitch, setGlitch] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const velocityX = useVelocity(mouseX);
  const smoothVelocity = useSpring(velocityX, { damping: 50, stiffness: 400 });

  const triggerGlitch = () => {
    setGlitch(true);
    setTimeout(() => setGlitch(false), 200);
  };

  const handleLetterClick = () => {
    setClickCount(prev => prev + 1);
    triggerGlitch();
    if (clickCount + 1 >= 10) {
      document.documentElement.classList.add("animate-breach-overload");
      setTimeout(() => {
        document.documentElement.classList.remove("animate-breach-overload");
        setClickCount(0);
      }, 5000);
    }
  };

  if (!mounted) return null;

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden flex flex-col justify-center items-center bg-background text-foreground selection:bg-accent/40 perspective-2000">

      {/* 3D Starfield Background */}
      <Starfield />

      {/* GOD MODE Overlay Layers */}
      <div className="absolute inset-0 z-50 pointer-events-none opacity-0 group-data-[code=GOD]:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 animate-pulse-vignette" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(transparent,transparent_2px,rgba(var(--color-accent),0.1)_2px,rgba(var(--color-accent),0.1)_4px)] pointer-events-none" />
      </div>

      {/* Orbital Tags System */}
      <div className="absolute inset-0 z-10 pointer-events-none hidden lg:flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Staggered Orbital Distribution */}
          <OrbitalNode label="Satellite" value="PEAK_UPLINK" icon={Satellite} radius={500} duration={40} reverse initAngle={15} />
          <OrbitalNode label="Security" value="SECURE_HUB" icon={Zap} radius={550} duration={45} initAngle={190} />

          <OrbitalNode label="Processing" value="PEAK_LOAD" icon={Cpu} radius={350} duration={30} initAngle={45} />
          <OrbitalNode label="Network" value="GLOBAL_SYNC" icon={Globe} radius={380} duration={35} reverse initAngle={240} />
          <OrbitalNode label="Terminal" value="STABLE_v3.0" icon={Activity} radius={410} duration={38} initAngle={315} />
        </div>
      </div>

      {/* Enhanced Scanline Texture Overlay */}
      <div className="absolute inset-0 z-20 pointer-events-none opacity-10 bg-size-[100%_4px,3px_100%] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))]" />

      {/* Main Kinetic Content */}
      <div className="z-30 w-full max-w-[1400px] mx-auto px-6 md:px-20 pointer-events-none text-center">

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className={`flex flex-col items-center gap-0 ${glitch ? 'animate-breach-overload' : ''}`}
        >
          <div className="flex flex-wrap justify-center overflow-visible">
            {"CRAFTING".split("").map((c, i) => (
              <motion.h1
                key={i}
                onClick={handleLetterClick}
                onMouseEnter={triggerGlitch}
                className="font-display font-black leading-[0.85] tracking-tighter text-[9vw] sm:text-[110px] text-foreground pointer-events-auto cursor-default transition-all hover:text-accent"
              >
                {c}
              </motion.h1>
            ))}
          </div>

          <div className="flex flex-wrap justify-center overflow-visible">
            {"DIGITAL".split("").map((c, i) => (
              <motion.h1
                key={i}
                onClick={handleLetterClick}
                onMouseEnter={triggerGlitch}
                className="font-display font-light italic leading-[0.85] tracking-tighter text-[9vw] sm:text-[110px] text-accent mix-blend-normal pointer-events-auto cursor-default"
              >
                {c}
              </motion.h1>
            ))}
          </div>

          <div className="flex flex-wrap justify-center overflow-visible">
            {"MAGIC.".split("").map((c, i) => (
              <motion.h1
                key={i}
                onClick={handleLetterClick}
                onMouseEnter={triggerGlitch}
                className="font-display font-black leading-[0.85] tracking-tighter text-[9vw] sm:text-[110px] text-foreground pointer-events-auto cursor-default transition-all hover:text-accent"
              >
                {c}
              </motion.h1>
            ))}
          </div>
        </motion.div>

        {/* Console Prompt - Refined Blending */}
        <div className="mt-16 flex justify-center opacity-90  p-4  rounded-2xl">
          <CommandConsole />
        </div>
      </div>

      {/* HUD: Interaction Guides */}
      <div className="absolute bottom-10 left-10 right-10 z-40 flex justify-between items-end pointer-events-none">
        <div className="flex items-center gap-6 group pointer-events-auto cursor-help backdrop-blur-xl p-3 border border-white/5 rounded-xl bg-foreground/[0.03]">
          <div className="w-10 h-10 rounded-full border border-accent/20 flex items-center justify-center group-hover:bg-accent/10 transition-all shadow-[0_0_15px_rgba(var(--color-accent),0)] group-hover:shadow-[0_0_15px_rgba(var(--color-accent),0.3)]">
            <Maximize2 className="w-4 h-4 text-accent transition-all animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-[7px] font-mono uppercase tracking-[0.6em] text-accent font-black">Control</span>
            <span className="text-[10px] font-mono font-bold tracking-widest text-foreground transition-colors group-hover:text-accent">SCROLL_FOR_DATA</span>
          </div>
        </div>

        <div className="flex items-center gap-6 group pointer-events-auto backdrop-blur-xl p-3 border border-white/5 rounded-xl bg-foreground/[0.03]">
          <div className="flex flex-col items-end">
            <span className="text-[7px] font-mono uppercase tracking-[0.6em] text-accent font-black">Satellite</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-foreground transition-colors group-hover:text-accent">UPLINK_LIVE</span>
          </div>
          <Satellite className="w-5 h-5 text-accent animate-spin-slow group-hover:scale-125 transition-transform" />
        </div>
      </div>

    </section>
  );
}
