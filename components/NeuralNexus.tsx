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
    
    if (outerRef.current) {
      outerRef.current.rotation.y += delta * 0.2;
      outerRef.current.rotation.x += delta * 0.1;
      const pulse = 1 + Math.sin(time * 0.5) * 0.08;
      outerRef.current.scale.set(pulse, pulse, pulse);
    }

    if (innerRef.current) {
        innerRef.current.rotation.y -= delta * 0.4;
        innerRef.current.rotation.z += delta * 0.2;
    }

    if (lightRef.current) {
        // Spotlight follows mouse for "flashlight" effect on refractive edges
        lightRef.current.position.set(x * 10, y * 10, 5);
        lightRef.current.lookAt(0, 0, 0);
    }

    // Follow mouse with slight lag - Camera zoom logic
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, x * 3, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, y * 3, 0.05);
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
      <Float speed={3} rotationIntensity={0.5} floatIntensity={2}>
        <mesh ref={outerRef} geometry={torusKnotGeom}>
          <MeshTransmissionMaterial {...glassProps} />
        </mesh>
      </Float>

      {/* Inner Metallic Wireframe Core */}
      <group ref={innerRef}>
        <mesh scale={1.2}>
           <icosahedronGeometry args={[1, 2]} />
           <meshStandardMaterial 
             color={theme === "light" ? "#FF4D00" : "#E0FF22"} 
             wireframe 
             transparent 
             opacity={0.4} 
           />
        </mesh>
        <mesh scale={0.6}>
           <octahedronGeometry args={[1, 0]} />
           <MeshWobbleMaterial 
             color={theme === "light" ? "#FF4D00" : "#E0FF22"} 
             factor={1.5} 
             speed={3} 
             emissive={theme === "light" ? "#FF4D00" : "#E0FF22"}
             emissiveIntensity={10}
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
           size={0.03} 
           color={theme === "light" ? "#FF4D00" : "#E0FF22"} 
           transparent 
           opacity={0.6} 
           blending={THREE.AdditiveBlending}
         />
      </points>

      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
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
