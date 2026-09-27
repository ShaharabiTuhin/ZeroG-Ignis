import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Flame3D from "./components/Flame3D";

function App() {
  const [isMicrogravity, setIsMicrogravity] = useState(true);

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{ padding: "20px", backgroundColor: "#111", color: "white" }}
      >
        <h1>ZeroG Ignis Dashboard</h1>
        <button onClick={() => setIsMicrogravity(!isMicrogravity)}>
          Toggle Environment:{" "}
          {isMicrogravity ? "Microgravity (Space)" : "Earth Gravity"}
        </button>
      </header>

      <main style={{ flex: 1, backgroundColor: "#000" }}>
        {/* 3D Canvas */}
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Flame3D isMicrogravity={isMicrogravity} />
          <OrbitControls />
        </Canvas>
      </main>
    </div>
  );
}

export default App;
