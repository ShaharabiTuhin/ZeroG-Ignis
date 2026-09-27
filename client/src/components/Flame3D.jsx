import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Flame3D({ isMicrogravity }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;

    const pulse = Math.sin(state.clock.elapsedTime * 2.4) * 0.06;
    meshRef.current.scale.x = 1 + pulse;
    meshRef.current.scale.y =
      1 + Math.cos(state.clock.elapsedTime * 2.4) * 0.05;
    meshRef.current.rotation.y += 0.003;
  });

  return (
    <mesh ref={meshRef}>
      {isMicrogravity ? (
        <sphereGeometry args={[1, 48, 48]} />
      ) : (
        <coneGeometry args={[1, 2, 48]} />
      )}
      <meshStandardMaterial
        color={isMicrogravity ? "#67d6ff" : "#ffb547"}
        emissive={isMicrogravity ? "#176184" : "#9b340f"}
        emissiveIntensity={2.2}
        roughness={0.35}
      />
    </mesh>
  );
}
