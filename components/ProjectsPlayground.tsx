"use client";

import { useRef, useEffect, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useTheme } from "next-themes";

const projects = [
  { id: 1, name: "Liquid Space", color: "#FF4D00", desc: "A creative WebGL experience defying digital boundaries.", stack: "Three.js, React, GSAP" },
  { id: 2, name: "Neon Commerce", color: "#E0FF22", desc: "A high-end e-commerce concept for the hyper-modern era.", stack: "Next.js, Tailwind, WebGL" },
  { id: 3, name: "Studio Zero", color: "#3B82F6", desc: "A brutalist agency portfolio focusing on typography and kinetic interactions.", stack: "Next.js, Framer Motion, Lenis" },
  { id: 4, name: "Vortex Engine", color: "#EC4899", desc: "An interactive physics engine driving fluid simulations in the browser.", stack: "Rapier, Drei, Fiber, Shaders" },
];

const scrollState = { current: 0 };
const PARTICLE_COUNT = 4000;

// Particle Geometry Generators
function generateSphere(count: number, radius: number): Float32Array {
   const pos = new Float32Array(count * 3);
   for(let i=0; i<count; i++) {
       const u = Math.random();
       const v = Math.random();
       const theta = u * 2.0 * Math.PI;
       const phi = Math.acos(2.0 * v - 1.0);
       const r = Math.cbrt(Math.random()) * radius; 
       pos[i*3] = r * Math.sin(phi) * Math.cos(theta);
       pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
       pos[i*3+2] = r * Math.cos(phi);
   }
   return pos;
}

function generateTorus(count: number, radius: number, tube: number): Float32Array {
    const pos = new Float32Array(count * 3);
    for(let i=0; i<count; i++) {
        const u = Math.random() * Math.PI * 2;
        const v = Math.random() * Math.PI * 2;
        // Adding slight scatter for a "dusty" effect
        const scatter = (Math.random() - 0.5) * 0.2;
        pos[i*3] = (radius + tube * Math.cos(v)) * Math.cos(u) + scatter;
        pos[i*3+1] = (radius + tube * Math.cos(v)) * Math.sin(u) + scatter;
        pos[i*3+2] = tube * Math.sin(v) + scatter;
    }
    return pos;
}

function generateHelix(count: number, radius: number, height: number): Float32Array {
    const pos = new Float32Array(count * 3);
    for(let i=0; i<count; i++) {
        const t = Math.random() * Math.PI * 8;
        const scatterX = (Math.random() - 0.5) * 0.5;
        const scatterY = (Math.random() - 0.5) * 0.5;
        const scatterZ = (Math.random() - 0.5) * 0.5;
        pos[i*3] = radius * Math.cos(t) + scatterX;
        pos[i*3+1] = (t / (Math.PI * 8)) * height - (height/2) + scatterY;
        pos[i*3+2] = radius * Math.sin(t) + scatterZ;
    }
    return pos;
}

function generateChaos(count: number, radius: number): Float32Array {
    const pos = new Float32Array(count * 3);
    for(let i=0; i<count; i++) {
        pos[i*3] = (Math.random() - 0.5) * radius * 1.5;
        pos[i*3+1] = (Math.random() - 0.5) * radius * 2.0;
        pos[i*3+2] = (Math.random() - 0.5) * radius * 1.5;
    }
    return pos;
}

function ParticleMorphingScene({ themedProjects }: { themedProjects: any[] }) {
    const pointsRef = useRef<THREE.Points>(null);
    const geometryRef = useRef<THREE.BufferGeometry>(null);
    const materialRef = useRef<THREE.PointsMaterial>(null);
    
    // We map 5 shapes to the 5 scroll zones (4 projects + 1 outro)
    const shapes = useMemo(() => [
        generateSphere(PARTICLE_COUNT, 3.5),
        generateTorus(PARTICLE_COUNT, 3.0, 1.2),
        generateHelix(PARTICLE_COUNT, 3.0, 7),
        generateChaos(PARTICLE_COUNT, 8),
        generateSphere(PARTICLE_COUNT, 2.5), 
    ], []);

    const projectColors = useMemo(() => {
        const colors = themedProjects.map(p => new THREE.Color(p.color));
        colors.push(new THREE.Color("#ffffff")); // Outro color
        return colors;
    }, [themedProjects]);

    useFrame((state, delta) => {
        if (!geometryRef.current || !pointsRef.current || !materialRef.current) return;
        const offset = scrollState.current;
        
        const maxIndex = shapes.length - 1;
        
        // Projects are centered at offsets 0.1, 0.3, 0.5, 0.7, 0.9.
        // We want exactIndex = 0 exactly at offset 0.1, exactIndex = 1 at 0.3, etc.
        const rawIndex = (offset * 5) - 0.5;
        const exactIndex = Math.max(0, Math.min(maxIndex, rawIndex));
        
        // Clamp indices safely
        const indexA = Math.floor(exactIndex);
        const indexB = Math.min(indexA + 1, maxIndex);
        
        const floatProgress = exactIndex - indexA;
        // Smooth exponential interpolation
        const t = THREE.MathUtils.smoothstep(floatProgress, 0.2, 0.8);
        
        const posA = shapes[indexA];
        const posB = shapes[indexB];
        const positions = geometryRef.current.attributes.position.array as Float32Array;
        
        const time = state.clock.elapsedTime;

        // Perform per-particle lerping on CPU. Array is highly optimized.
        for(let i=0; i<PARTICLE_COUNT; i++) {
            const i3 = i * 3;
            // Add a localized continuous drift per particle for "organic" feel
            const phaseX = Math.sin(time * 0.5 + i) * 0.05;
            const phaseY = Math.cos(time * 0.6 + i * 1.5) * 0.05;
            const phaseZ = Math.sin(time * 0.4 + i * 2.0) * 0.05;

            positions[i3] = THREE.MathUtils.lerp(posA[i3], posB[i3], t) + phaseX;
            positions[i3+1] = THREE.MathUtils.lerp(posA[i3+1], posB[i3+1], t) + phaseY;
            positions[i3+2] = THREE.MathUtils.lerp(posA[i3+2], posB[i3+2], t) + phaseZ;
        }
        geometryRef.current.attributes.position.needsUpdate = true;
        
        // Dynamically shift color
        materialRef.current.color.lerpColors(projectColors[indexA], projectColors[indexB], floatProgress);

        // Constant gentle rotation
        pointsRef.current.rotation.y += delta * 0.15;
        pointsRef.current.rotation.x += delta * 0.05;

        // Position on the right side of the screen
        const { viewport } = state;
        const targetX = viewport.width > 5 ? viewport.width / 3.5 : 0;
        pointsRef.current.position.x = THREE.MathUtils.lerp(pointsRef.current.position.x, targetX, delta * 3);
    });

    return (
        <points ref={pointsRef}>
           <bufferGeometry ref={geometryRef}>
              <bufferAttribute 
                 attach="attributes-position"
                 args={[shapes[0], 3]}
                 usage={THREE.DynamicDrawUsage}
              />
           </bufferGeometry>
           <pointsMaterial 
              ref={materialRef}
              size={0.04}
              color="#EC4899"
              transparent={true}
              opacity={0.9}
              depthWrite={false}
           />
        </points>
    );
}

function ProjectItem({ p, idx, smoothProgress }: { p: any, idx: number, smoothProgress: any }) {
  const start = idx * 0.2;
  const end = start + 0.2;
  
  // Custom extreme kinetic typography animations
  const scale = useTransform(smoothProgress, [start - 0.02, start + 0.05, end - 0.05, end + 0.02], [1.5, 1, 1, 0.8]);
  const blurVal = useTransform(smoothProgress, [start - 0.02, start + 0.05, end - 0.05, end + 0.02], [15, 0, 0, 10]);
  const filter = useTransform(blurVal, (v) => `blur(${v}px)`);
  const skewY = useTransform(smoothProgress, [start - 0.02, start + 0.05, end - 0.05, end + 0.02], [15, 0, 0, -10]);
  const opacity = useTransform(smoothProgress, [start - 0.05, start + 0.05, end - 0.05, end + 0.05], [0, 1, 1, 0]);
  
  return (
    <motion.div 
      className="absolute flex flex-col justify-center left-[5vw] md:left-[10vw] w-[85vw] md:w-[45vw] h-screen pointer-events-none origin-left" 
      style={{ opacity, scale, filter, skewY }}
    >
       <div className="overflow-hidden pointer-events-auto">
          <span className="font-mono text-sm tracking-[0.2em] mb-2 block opacity-50 uppercase">0{idx + 1} / Project</span>
       </div>
       
       <h3 
         className="text-6xl md:text-[8rem] leading-[0.85] font-display font-black uppercase text-foreground tracking-tighter mix-blend-difference pointer-events-auto" 
         style={{ color: p.color, WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}
       >
          {p.name}
       </h3>
       
       <div className="mt-8 relative backdrop-blur-md bg-background/20 border border-foreground/5 p-8 rounded-2xl shadow-2xl pointer-events-auto">
         <div className="absolute inset-0 bg-linear-to-br from-foreground/5 to-transparent rounded-2xl pointer-events-none"></div>
         <p className="text-xl md:text-3xl font-light text-foreground/90 max-w-lg leading-snug">
           {p.desc}
         </p>
         <div className="mt-8 flex flex-col pt-6 border-t border-foreground/10 max-w-sm">
            <span className="font-mono text-xs uppercase tracking-widest text-foreground/40 mb-2">Tech Stack</span>
            <span className="font-mono text-sm md:text-base text-foreground/80">{p.stack}</span>
         </div>
       </div>
    </motion.div>
  );
}

export function ProjectsPlayground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const currentTheme = theme === "system" ? systemTheme : theme;

  const themedProjects = useMemo(() => {
    if (!mounted) return projects;
    
    // In dark theme, swap first two colors
    if (currentTheme === "dark") {
       return projects.map((p, idx) => {
          if (idx === 0) return { ...p, color: "#E0FF22" }; // Green (was orange)
          if (idx === 1) return { ...p, color: "#FF4D00" }; // Orange (was green)
          return p;
       });
    }
    // In light theme, keep as is
    return projects;
  }, [currentTheme, mounted]);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 25,
    restDelta: 0.001
  });

  useEffect(() => {
    return smoothProgress.onChange((latest) => {
      scrollState.current = latest;
    });
  }, [smoothProgress]);

  return (
    <div ref={containerRef} id="projects" className="relative w-full" style={{ height: '500vh' }}>
      
      <div className="sticky top-0 w-full h-screen bg-background overflow-hidden selection:bg-accent/30">
        
        {/* Background text decoration */}
        <h2 className="absolute top-[10vh] left-[-5vw] text-[20vw] font-display font-black leading-none uppercase mix-blend-overlay text-foreground opacity-[0.03] pointer-events-none whitespace-nowrap overflow-hidden z-0">
          SELECTED WORKS
        </h2>

        {/* 3D Canvas */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }} gl={{ antialias: true, alpha: true }}>
            <ParticleMorphingScene themedProjects={themedProjects} />
          </Canvas>
        </div>

        {/* HTML Content Overlay */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {themedProjects.map((p, idx) => (
             <ProjectItem key={p.id} p={p} idx={idx} smoothProgress={smoothProgress} />
          ))}

          {/* Outro Text */}
          <motion.div 
            className="absolute flex flex-col justify-center items-center w-full h-screen text-center origin-bottom"
            style={{ 
              opacity: useTransform(smoothProgress, [0.75, 0.85], [0, 1]),
              scale: useTransform(smoothProgress, [0.75, 0.85], [0.8, 1]),
              filter: useTransform(useTransform(smoothProgress, [0.75, 0.85], [10, 0]), (v) => `blur(${v}px)`),
            }}
          >
            <h3 className="text-4xl md:text-7xl font-display font-black uppercase text-foreground mb-4 mix-blend-difference">
              Ready for <span className="text-accent">more?</span>
            </h3>
            <p className="font-mono text-sm md:text-base opacity-50 uppercase tracking-widest mt-4">
              Keep scrolling to reach out
            </p>
            <div className="mt-8 w-px h-24 bg-linear-to-b from-accent to-transparent mx-auto"></div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
