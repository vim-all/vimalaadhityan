"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, useVelocity } from "framer-motion";

const experiences = [
  {
    id: 1,
    role: "Software Developer Intern",
    company: "Playto Pay",
    date: "July 2026 – Present",
    desc: "Engineered scalable backend solutions utilizing Django, Celery, Redis, R2 Storage, and PayPal APIs. Optimized CI workflows to achieve a 50% speedup and implemented robust guardrails to enhance Celery worker task safety and reliability.",
    tech: ["Django", "Python", "Celery", "Redis", "Cloudflare R2", "PayPal API", "CI/CD"],
    coord: "[ Lat. 28.61 / Long. 77.20 ]",
    style: "glass"
  },
  {
    id: 2,
    role: "Associate Programmer Intern – InfoSec",
    company: "Xceedance",
    date: "May 2026 – June 2026",
    desc: "Developed an internal CISO Dashboard synthesizing enterprise security sources into a unified interface. Architected scheduled cron data ingestion pipelines to process and persist security metrics across M365 Secure Score, Panorays, Cisco SSE, ZTA, and Azure Service Health.",
    tech: ["Security Architecture", "Cloud Security", "Cron Pipelines", "M365 Secure Score", "Panorays", "Cisco SSE", "Azure"],
    coord: "[ Lat. 28.45 / Long. 77.02 ]",
    style: "glass"
  },
  {
    id: 3,
    role: "Full Stack Developer Intern",
    company: "XTechOn",
    date: "Jan 2026 – June 2026",
    desc: "Architected and delivered a robust multi-tenant POS platform featuring an RBAC-driven enterprise admin dashboard. Designed database schema indexing and optimized complex SQL queries in PostgreSQL, successfully cutting core API response latency by 35%.",
    tech: ["React", "Node.js", "Express", "PostgreSQL", "Multi-tenant Architecture", "RBAC", "REST API"],
    coord: "[ Lat. 28.61 / Long. 77.20 ]",
    style: "glass"
  },
  {
    id: 4,
    role: "Web Developer Intern",
    company: "CloudTechner",
    date: "May 2025 – July 2025",
    desc: "Engineered an enterprise booking platform incorporating strict client side and server side dynamic validation schemas alongside atomic reservation transaction logic. Seamlessly integrated PayU payment gateway infrastructure, ensuring 99.8% transaction reliability.",
    tech: ["Next.js", "TypeScript", "MySQL", "PayU Gateway", "Atomic Transactions", "Tailwind CSS"],
    coord: "[ Lat. 28.45 / Long. 77.02 ]",
    style: "glass"
  },
];

function BlueprintModule({ exp, index, total, scrollYProgress }: { exp: any, index: number, total: number, scrollYProgress: any }) {
  const isRight = index % 2 === 0;
  const step = 1 / total;
  const start = index * step;
  const end = (index + 1) * step;

  // Kinetic reveals mapping - distinct non-overlapping windows per card
  const opacity = useTransform(scrollYProgress, [start, start + step * 0.2, end - step * 0.2, end], [0, 1, 1, 0]);
  const x = useTransform(scrollYProgress, [start, start + step * 0.2, end - step * 0.2, end], [isRight ? 100 : -100, 0, 0, isRight ? 100 : -100]);
  const scale = useTransform(scrollYProgress, [start, start + step * 0.2, end - step * 0.2, end], [0.8, 1, 1, 0.8]);
  const lineReveal = useTransform(scrollYProgress, [start, start + step * 0.2], [0, 1]);

  return (
    <motion.div
      style={{ opacity, x, scale }}
      className={`absolute top-[57%] -translate-y-1/2 
        ${isRight
          ? 'left-12 md:left-[55%]'
          : 'left-12 md:left-auto md:right-[55%]'} 
        w-[calc(100vw-3.5rem)] md:w-[36vw] max-w-[480px] z-20`}
    >
      {/* Connecting Technical Line - Hidden on absolute mobile to avoid clutter */}
      <svg className="absolute top-1/2 -translate-y-1/2 w-[20vw] h-px overflow-visible pointer-events-none hidden md:block"
        style={{ left: isRight ? '-20vw' : '100%' }}>
        <motion.line
          x1={isRight ? "100%" : "0%"}
          y1="0"
          x2={isRight ? "0%" : "100%"}
          y2="0"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeDasharray="4 4"
          style={{ pathLength: lineReveal }}
        />
        <motion.circle
          cx={isRight ? "0%" : "100%"}
          cy="0"
          r="4"
          fill="var(--accent)"
          style={{ opacity: lineReveal }}
        />
      </svg>

      {/* Style Variant: Brutalist vs Glass */}
      <div className={`relative p-6 md:p-8 transition-all duration-500 overflow-hidden group
        ${exp.style === 'glass'
          ? 'backdrop-blur-xl bg-foreground/3 border border-foreground/10 rounded-3xl shadow-2xl'
          : 'bg-background border-2 border-accent rounded-none shadow-[10px_10px_0px_rgba(224,255,34,0.1)]'
        }`}
      >
        {exp.style === 'glass' && (
          <div className="absolute inset-0 bg-linear-to-br from-accent/5 to-transparent opacity-50 pointer-events-none" />
        )}

        {/* Technical Header */}
        <div className="flex justify-between items-start mb-4 font-mono text-[10px] md:text-xs uppercase tracking-widest opacity-40 font-bold">
          <span>{exp.coord}</span>
          <span>0{index + 1}</span>
        </div>

        <span className="font-mono text-xs text-accent font-black tracking-[0.3em] mb-1 block animate-pulse">
           // {exp.date}
        </span>

        <h3 className="text-base sm:text-xl md:text-2xl font-display font-black uppercase leading-snug tracking-tight mb-2 text-foreground">
          {exp.role}
        </h3>

        <h4 className="text-base md:text-xl font-display font-light italic text-foreground/70 mb-5 flex items-center gap-3">
          {exp.company}
          <span className="h-px grow bg-foreground/10"></span>
        </h4>

        <p className="text-sm md:text-base font-light leading-relaxed text-foreground/60 mb-6">
          {exp.desc}
        </p>

        <div className="flex flex-wrap gap-2 pt-6 border-t border-foreground/5">
          {exp.tech.map((t: string) => (
            <span key={t} className="text-[10px] uppercase font-mono px-3 py-1 bg-foreground/5 text-foreground/50 rounded-full border border-foreground/5 hover:border-accent/40 transition-colors">
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function HUDCounter({ label, value }: { label: string, value: any }) {
  const ref = useRef<HTMLSpanElement>(null);

  useMotionValueEvent(value, "change", (latest: number) => {
    if (ref.current) ref.current.textContent = `${label}${latest.toFixed(2)}`;
  });

  return <span ref={ref}>{label}0.00</span>;
}

export function ExperienceSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.001
  });

  // Velocity Tracking
  const scrollVelocity = useVelocity(smoothProgress);
  const smoothVelocity = useSpring(scrollVelocity, { stiffness: 50, damping: 20 });

  // Central Axis Path Length
  const axisLength = useTransform(smoothProgress, [0, 1], [0, 1]);

  // Coordinate Display Change
  const coordX = useTransform(smoothProgress, [0, 1], [0, 100]);
  const coordY = useTransform(smoothProgress, [0, 1], [100, 0]);

  return (
    <section
      id="experience"
      ref={containerRef}
      className="relative w-full h-[400vh] bg-background selection:bg-accent/30"
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">

        {/* Subtle HUD Grid Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        {/* Section Label */}
        <div className="absolute top-[12vh] md:top-[10vh] left-1/2 -translate-x-1/2 z-30 font-mono text-center w-full px-4 pointer-events-none">
          <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="text-accent text-[8px] md:text-[10px] font-bold tracking-[0.5em] md:tracking-[0.8em] mb-1 uppercase select-none">// STAGES OF CRAFT</p>
            <h3 className="text-xl md:text-4xl lg:text-5xl font-display font-black uppercase tracking-tighter mix-blend-difference">
              Professional <span className="text-accent italic font-light">Genesis</span>
            </h3>
          </motion.div>
        </div>

        {/* Central Vertical Axis - Responsive Position */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 md:-translate-x-1/2 w-px z-10 transition-colors">
          <svg className="w-full h-full overflow-visible">
            <motion.line
              x1="0" y1="0" x2="0" y2="100%"
              stroke="var(--foreground)"
              strokeWidth="1"
              strokeOpacity="0.1"
            />
            <motion.line
              x1="0" y1="0" x2="0" y2="100%"
              stroke="var(--accent)"
              strokeWidth="2"
              style={{ pathLength: axisLength }}
            />
          </svg>
        </div>

        {/* HUD Data Overlay (Floating) */}
        <div className="absolute bottom-[4vh] md:bottom-[8vh] right-[5vw] font-mono text-[10px] md:text-xs text-foreground/30 z-30 space-y-4 text-right">
          <div className="flex flex-col gap-1 items-end border-b border-foreground/5 pb-4">
            <span className="text-accent text-[8px] tracking-widest font-black uppercase">VELOCITY_DENSITY</span>
            <HUDCounter label="SPD: " value={smoothVelocity} />
          </div>
          <div className="flex justify-end gap-4">
            <span>SCANNER ACTIVE</span>
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
          </div>
          <div className="flex flex-col items-end gap-1">
            <HUDCounter label="X: " value={coordX} />
            <HUDCounter label="Y: " value={coordY} />
          </div>
          <p className="tracking-widest opacity-20 uppercase font-black">Encrypted_Archive_v2.0</p>
        </div>

        {/* Experience Modules */}
        <div className="relative w-full h-full">
          {experiences.map((exp, i) => (
            <BlueprintModule key={exp.id} exp={exp} index={i} total={experiences.length} scrollYProgress={smoothProgress} />
          ))}
        </div>

      </div>
    </section>
  );
}
