import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { PointMaterial, Points } from "@react-three/drei";

export default function Flame3D({ isMicrogravity }) {
  const meshRef = useRef();
  const coreRef = useRef();
  const haloRef = useRef();
  const sootPositions = useMemo(() => {
    const positions = new Float32Array(140 * 3);

    for (let index = 0; index < positions.length; index += 3) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.05 + Math.random() * 1.05;
      positions[index] = Math.cos(angle) * radius;
      positions[index + 1] = (Math.random() - 0.5) * 1.7;
      positions[index + 2] = Math.sin(angle) * radius;
    }

    return positions;
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.scale.x = isMicrogravity
        ? 1.35 + Math.sin(time * 2.4) * 0.06
        : 1 + Math.sin(time * 2.4) * 0.05;
      meshRef.current.scale.y = isMicrogravity
        ? 0.8 + Math.cos(time * 2.4) * 0.035
        : 1 + Math.cos(time * 2.4) * 0.05;
      meshRef.current.scale.z = isMicrogravity ? 0.95 : 1;
    }
    if (coreRef.current) {
      coreRef.current.scale.x = 0.82 + Math.sin(time * 2.4) * 0.035;
      coreRef.current.scale.y = 0.72 + Math.cos(time * 2.4) * 0.025;
      coreRef.current.scale.z = 0.78;
    }
    if (haloRef.current) {
      const haloPulse = 1 + Math.sin(time * 1.8) * 0.06;
      haloRef.current.scale.set(
        1.48 * haloPulse,
        0.93 * haloPulse,
        1.1 * haloPulse,
      );
    }
  });

  return (
    <group>
      {isMicrogravity && (
        <mesh ref={haloRef}>
          <sphereGeometry args={[1.2, 32, 32]} />
          <meshBasicMaterial color="#288bc5" transparent opacity={0.1} />
        </mesh>
      )}

      <mesh ref={meshRef}>
        {isMicrogravity ? (
          <sphereGeometry args={[1, 40, 40]} />
        ) : (
          <coneGeometry args={[1, 2, 40]} />
        )}
        <meshStandardMaterial
          color={isMicrogravity ? "#6ddcff" : "#ff9f2f"}
          emissive={isMicrogravity ? "#1686b5" : "#b6370b"}
          emissiveIntensity={isMicrogravity ? 2.5 : 2.2}
          transparent={isMicrogravity}
          opacity={isMicrogravity ? 0.82 : 1}
          roughness={0.3}
        />
      </mesh>

      {isMicrogravity && (
        <mesh ref={coreRef}>
          <sphereGeometry args={[1, 36, 36]} />
          <meshBasicMaterial
            color="#ffb347"
            transparent
            opacity={0.72}
            blending={2}
          />
        </mesh>
      )}

      {isMicrogravity && (
        <Points positions={sootPositions} stride={3} frustumCulled={false}>
          <PointMaterial
            transparent
            color="#8eaab0"
            size={0.028}
            sizeAttenuation
            depthWrite={false}
          />
        </Points>
      )}
    </group>
  );
}
