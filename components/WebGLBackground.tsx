"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, Environment, Float } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "next-themes";


function LivingBlob({ theme }: { theme: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create geometry once, with high segment count for smooth displacement
  const geometry = useMemo(() => new THREE.SphereGeometry(1.8, 128, 128), []);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      const positionAttribute = geometry.attributes.position;
      const vertex = new THREE.Vector3();
      
      // We will morph the vertices based on a combination of sine waves to simulate noise/breathing.
      for (let i = 0; i < positionAttribute.count; i++) {
        vertex.fromBufferAttribute(positionAttribute, i);
        // Normalize vector to get distance from center (radius 1.8)
        vertex.normalize();
        
        // Calculate displacement sum based on x,y,z and time
        const noise = Math.sin(vertex.x * 2 + time * 0.8) * 
                      Math.cos(vertex.y * 2 + time * 1.2) * 
                      Math.sin(vertex.z * 2 + time * 1.5);
        
        // Base radius exactly 1.8 + noise offset
        const scale = 1.8 + (noise * 0.2);
        
        vertex.multiplyScalar(scale);
        positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }
      
      // Update normals after displacement for accurate lighting/refraction
      geometry.computeVertexNormals();
      positionAttribute.needsUpdate = true;

      // Make the blob follow the mouse slowly
      const { x, y } = state.pointer;
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, (y * Math.PI) / 8, 0.05);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, (x * Math.PI) / 8, 0.05);
    }
  });

  const materialProps = useMemo(() => ({
    thickness: 2.5,
    roughness: 0.1,
    transmission: 1, // Full glass effect
    ior: 1.4, // Refractive index
    chromaticAberration: 0.4, // Adds RGB splitting on the edges
    backside: true,
    color: theme === "light" ? "#FF4D00" : "#E0FF22", // Tint matching the theme accent
    clearcoat: 1,
    clearcoatRoughness: 0.1,
  }), [theme]);

  return (
    <Float floatIntensity={1} rotationIntensity={0.5} speed={1.5}>
      <mesh ref={meshRef} geometry={geometry}>
        <MeshTransmissionMaterial {...materialProps} />
      </mesh>
    </Float>
  );
}

export function WebGLBackground() {
  const { resolvedTheme } = useTheme();

  return (
    // pointer-events-none on the canvas container so mouse passes through to the kinetic text layer behind/in front of it
    // Wait, if it's pointer-events-none, useFrame state.pointer will still work if the canvas captures it globally? No, it reads DOM events. We should let canvas be absolute but pointer events auto, or capture mouse position at the app level.
    // Three fiber captures mouse over the canvas element.
    <div className="absolute inset-0 z-0 h-full w-full pointer-events-auto mix-blend-screen dark:mix-blend-lighten">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={resolvedTheme === 'light' ? 2 : 0.5} />
        <directionalLight position={[-10, 10, 10]} intensity={3} />
        <directionalLight position={[10, -10, -10]} intensity={1} color="#ffffff" />
        <Environment preset="city" />
        <LivingBlob theme={resolvedTheme || "dark"} />
      </Canvas>
    </div>
  );
}
