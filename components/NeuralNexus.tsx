"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, Float, Stars, MeshWobbleMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "next-themes";

function Core({ theme }: { theme: string }) {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const lightRef = useRef<THREE.SpotLight>(null);

  // Geometry for the high-end refractive shell - Scaling up
  const torusKnotGeom = useMemo(() => new THREE.TorusKnotGeometry(2.2, 0.6, 300, 48), []);
  
  // Particle system for the "dust" inside the nexus
  const particleBuffer = useMemo(() => {
    const count = 2000; // Increased density
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 15;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const { x, y } = state.pointer;
    
    // Detect GOD MODE status
    const isGodMode = typeof document !== 'undefined' && document.documentElement.dataset.code === 'GOD';
    const speedMultiplier = isGodMode ? 20 : 1;
    const pulseFactor = isGodMode ? 0.2 : 0.08;

    if (outerRef.current) {
      outerRef.current.rotation.y += delta * 0.2 * speedMultiplier;
      outerRef.current.rotation.x += delta * 0.1 * speedMultiplier;
      const pulse = 1 + Math.sin(time * (isGodMode ? 10 : 0.5)) * pulseFactor;
      outerRef.current.scale.set(pulse, pulse, pulse);
    }

    if (innerRef.current) {
        innerRef.current.rotation.y -= delta * 0.4 * speedMultiplier;
        innerRef.current.rotation.z += delta * 0.2 * speedMultiplier;
    }

    if (lightRef.current) {
        lightRef.current.position.set(x * 10, y * 10, 5);
        lightRef.current.lookAt(0, 0, 0);
        lightRef.current.intensity = isGodMode ? 50 : 10;
    }

    // Camera jitter in GOD MODE
    const jitter = isGodMode ? (Math.random() - 0.5) * 0.5 : 0;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, x * 3 + jitter, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, y * 3 + jitter, 0.05);
    state.camera.lookAt(0, 0, 0);
  });

  const glassProps = {
    thickness: 2,
    roughness: 0,
    transmission: 1,
    ior: 1.6,
    chromaticAberration: 0.8,
    backside: true,
    color: theme === "light" ? "#FF4D00" : "#E0FF22",
  };

  const isGodMode = typeof document !== 'undefined' && document.documentElement.dataset.code === 'GOD';

  return (
    <>
      <spotLight 
        ref={lightRef} 
        intensity={10} 
        distance={20} 
        angle={0.5} 
        penumbra={1} 
        color={theme === "light" ? "#FF4D00" : "#E0FF22"}
      />

      {/* Outer Refractive Shell */}
      <Float speed={isGodMode ? 20 : 3} rotationIntensity={isGodMode ? 2 : 0.5} floatIntensity={isGodMode ? 5 : 2}>
        <mesh ref={outerRef} geometry={torusKnotGeom}>
          <MeshTransmissionMaterial {...glassProps} />
        </mesh>
      </Float>

      {/* Inner Metallic Wireframe Core */}
      <group ref={innerRef}>
        <mesh scale={isGodMode ? 1.5 : 1.2}>
           <icosahedronGeometry args={[1, 2]} />
           <meshStandardMaterial 
             color={theme === "light" ? "#FF4D00" : "#E0FF22"} 
             wireframe 
             transparent 
             opacity={isGodMode ? 0.8 : 0.4} 
           />
        </mesh>
        <mesh scale={isGodMode ? 1.0 : 0.6}>
           <octahedronGeometry args={[1, 0]} />
           <MeshWobbleMaterial 
             color={theme === "light" ? "#FF4D00" : "#E0FF22"} 
             factor={isGodMode ? 5 : 1.5} 
             speed={isGodMode ? 10 : 3} 
             emissive={theme === "light" ? "#FF4D00" : "#E0FF22"}
             emissiveIntensity={isGodMode ? 50 : 10}
           />
        </mesh>
      </group>

      {/* Particle Environment */}
      <points ref={particlesRef}>
         <bufferGeometry>
            <bufferAttribute 
              attach="attributes-position" 
              args={[particleBuffer, 3]} 
            />
         </bufferGeometry>
         <pointsMaterial 
           size={isGodMode ? 0.1 : 0.03} 
           color={theme === "light" ? "#FF4D00" : "#E0FF22"} 
           transparent 
           opacity={0.6} 
           blending={THREE.AdditiveBlending}
         />
      </points>

      <Stars radius={100} depth={50} count={isGodMode ? 15000 : 5000} factor={isGodMode ? 20 : 4} saturation={0} fade speed={isGodMode ? 50 : 1} />
    </>
  );
}

export function Starfield() {
  const { resolvedTheme } = useTheme();

  return (
    <div className="absolute inset-0 z-0 h-full w-full pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 45 }}
        gl={{ antialias: true, alpha: true, stencil: false, depth: true }}
      >
        <ambientLight intensity={resolvedTheme === 'light' ? 1.5 : 0.5} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
    </div>
  );
}

export function NeuralNexus() {
  const { resolvedTheme } = useTheme();

  return (
    <div className="absolute inset-0 z-0 h-full w-full pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ antialias: true, alpha: true, stencil: false, depth: true }}
      >
        <ambientLight intensity={resolvedTheme === 'light' ? 2 : 0.6} />
        <pointLight position={[0, 0, 0]} intensity={80} color={resolvedTheme === 'light' ? '#FF4D00' : '#E0FF22'} />
        <Core theme={resolvedTheme || "dark"} />
      </Canvas>
    </div>
  );
}
