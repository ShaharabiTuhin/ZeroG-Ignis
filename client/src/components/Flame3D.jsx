import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Flame3D({ isMicrogravity }) {
  const meshRef = useRef();

  // Basic animation loop to simulate flickering/pulsing
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.scale.x =
        1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      meshRef.current.scale.y =
        1 + Math.cos(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef}>
      {/* If in microgravity, the flame is a perfect sphere. On Earth, it would be a teardrop (cone/cylinder mix) */}
      {isMicrogravity ? (
        <sphereGeometry args={[1, 32, 32]} />
      ) : (
        <coneGeometry args={[1, 2, 32]} />
      )}

      <meshStandardMaterial
        color={isMicrogravity ? "#44aaff" : "#ffaa00"} // Microgravity flames often burn blue/dimmer
        emissive={isMicrogravity ? "#2255aa" : "#ff5500"}
        emissiveIntensity={2}
        wireframe={false}
      />
    </mesh>
  );
}


