import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import Dashboard from "./components/Dashboard";
import Flame3D from "./components/Flame3D";

function App() {
  const [isMicrogravity, setIsMicrogravity] = useState(true);

  return (
    <div className="app-shell">
      <Dashboard
        isMicrogravity={isMicrogravity}
        onToggle={() => setIsMicrogravity((current) => !current)}
      />
      <main className="dashboard-main">
        <section className="hero-copy">
          <p className="section-kicker">Live combustion model</p>
          <h2>
            Observe fire
            <br />
            <em>without gravity.</em>
          </h2>
          <p className="description">
            Compare flame morphology in orbit against a terrestrial baseline.
            Rotate the model to inspect the current burn profile.
          </p>
          <div className="metric-row">
            <div>
              <span>Mode</span>
              <strong>{isMicrogravity ? "Orbital" : "Terrestrial"}</strong>
            </div>
            <div>
              <span>Profile</span>
              <strong>{isMicrogravity ? "Spherical" : "Teardrop"}</strong>
            </div>
          </div>
        </section>
        <section
          className="canvas-panel"
          aria-label="Interactive flame visualization"
        >
          <div className="canvas-label">03 / 3D VIEWPORT</div>
          <Canvas camera={{ position: [0, 0, 4.8], fov: 42 }}>
            <color attach="background" args={["#09131c"]} />
            <ambientLight intensity={0.7} />
            <pointLight position={[3, 3, 4]} intensity={18} color="#b8e9ff" />
            <pointLight position={[-3, -2, 2]} intensity={9} color="#ff6b35" />
            <Stars
              radius={30}
              depth={12}
              count={800}
              factor={1.5}
              saturation={0}
              fade
              speed={0.4}
            />
            <Flame3D isMicrogravity={isMicrogravity} />
            <OrbitControls
              enablePan={false}
              minDistance={2.5}
              maxDistance={7}
            />
          </Canvas>
          <div className="viewport-note">Drag to rotate / scroll to zoom</div>
        </section>
      </main>
      <footer className="dashboard-footer">
        <span>
          DATASET / {isMicrogravity ? "ACME · MICROGRAVITY" : "EARTH BASELINE"}
        </span>
        <span>NASA COMBUSTION RESEARCH INTERFACE</span>
      </footer>
    </div>
  );
}

export default App;
