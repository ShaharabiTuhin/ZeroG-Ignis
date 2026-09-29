import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import Flame3D from "./Flame3D";

const datasetDetails = {
  ACME: {
    label: "Gaseous non-premixed flame",
    detail: "s-Flame and BRE experiments",
    samples: "128 experiments",
    signal: "Soot accumulation",
  },
  FLEX: {
    label: "Liquid fuel combustion",
    detail: "Flame extinguishment boundaries",
    samples: "76 experiments",
    signal: "Flammability margin",
  },
  BOTH: {
    label: "ACME + FLEX evidence",
    detail: "Combined combustion research",
    samples: "204 experiments",
    signal: "Cross-dataset comparison",
  },
};

function formatInlineMarkdown(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function AnalysisText({ text }) {
  const blocks = text.split(/\n\s*\n/).filter(Boolean);

  return (
    <div className="analysis-content">
      {blocks.map((block, blockIndex) => {
        const lines = block.split("\n").filter(Boolean);
        const isList = lines.every((line) => line.trim().startsWith("- "));

        if (isList) {
          return (
            <ul key={blockIndex}>
              {lines.map((line, lineIndex) => (
                <li key={lineIndex}>
                  {formatInlineMarkdown(line.trim().slice(2))}
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={blockIndex}>
            {lines.map((line, lineIndex) => (
              <span key={lineIndex}>
                {lineIndex > 0 && <br />}
                {formatInlineMarkdown(line)}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

export default function OperationsDashboard() {
  const [isMicrogravity, setIsMicrogravity] = useState(true);
  const [activeDataset, setActiveDataset] = useState("ACME");
  const [query, setQuery] = useState("");
  const [analysis, setAnalysis] = useState(
    "Select a dataset and ask a safety question to generate a mission-ready interpretation.",
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  const dataset = datasetDetails[activeDataset];

  const navigateToSection = (sectionId) => {
    setActiveSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleAnalyze = async (event) => {
    event.preventDefault();
    if (!query.trim()) return;

    setIsAnalyzing(true);
    const fallback = isMicrogravity
      ? "Microgravity conditions reduce buoyant flow and allow a wider, cooler flame envelope. Prioritize soot monitoring and keep the extinguishment response ready."
      : "Terrestrial buoyancy is concentrating the flame into a taller profile. Monitor temperature rise near the upper edge and compare against the orbital baseline.";

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || ""}/api/analyze-flame`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query,
            dataset: activeDataset,
            isMicrogravity,
          }),
        },
      );

      if (!response.ok) throw new Error("Analyst service unavailable");
      const result = await response.json();
      setAnalysis(result.text || fallback);
    } catch {
      setAnalysis(fallback);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="operations-shell">
      <aside className="operations-sidebar">
        <div className="operations-brand">
          <div className="brand-mark">ZG</div>
          <div>
            <p className="eyebrow">NASA SPACE APPS / 2026</p>
            <h1>ZeroG Ignis</h1>
          </div>
        </div>

        <div className="mission-chip">
          <span className="status-dot" />
          <span>Mission console online</span>
        </div>

        <nav className="side-nav" aria-label="Dashboard sections">
          <button
            className={
              activeSection === "overview"
                ? "side-nav-item is-current"
                : "side-nav-item"
            }
            type="button"
            aria-current={activeSection === "overview" ? "page" : undefined}
            onClick={() => navigateToSection("overview")}
          >
            <span className="nav-index">01</span> Safety overview
          </button>
          <button
            className={
              activeSection === "flame-model"
                ? "side-nav-item is-current"
                : "side-nav-item"
            }
            type="button"
            aria-current={activeSection === "flame-model" ? "page" : undefined}
            onClick={() => navigateToSection("flame-model")}
          >
            <span className="nav-index">02</span> Flame model
          </button>
          <button
            className={
              activeSection === "evidence-library"
                ? "side-nav-item is-current"
                : "side-nav-item"
            }
            type="button"
            aria-current={
              activeSection === "evidence-library" ? "page" : undefined
            }
            onClick={() => navigateToSection("evidence-library")}
          >
            <span className="nav-index">03</span> Evidence library
          </button>
        </nav>

        <div className="sidebar-mission-card">
          <span className="card-label">Current objective</span>
          <strong>
            Turn combustion research into decisions crews can use.
          </strong>
          <span className="card-meta">FLAME IN FREEFALL</span>
        </div>

        <div className="sidebar-profile">
          <span className="profile-avatar-small">TD</span>
          <div>
            <strong>Team Duo</strong>
            <span>Cumilla, Bangladesh</span>
          </div>
          <button type="button" aria-label="Open team profile">
            ...
          </button>
        </div>
      </aside>

      <main className="operations-main">
        <header className="operations-topbar">
          <div>
            <span className="breadcrumb">
              MISSION CONTROL / SAFETY OVERVIEW
            </span>
            <p className="last-sync">
              Data index synced 28 Sep 2026 <span>8 min ago</span>
            </p>
          </div>
          <div className="topbar-actions">
            <span className="environment-badge">
              <span className="status-dot" />{" "}
              {isMicrogravity ? "Microgravity" : "Earth baseline"}
            </span>
            <button
              className="mode-button"
              type="button"
              onClick={() => setIsMicrogravity((current) => !current)}
            >
              Compare mode
            </button>
          </div>
        </header>

        <section className="dashboard-intro" id="overview">
          <div>
            <p className="section-kicker">Fire safety intelligence</p>
            <h2>
              Understand the flame
              <br />
              <em>before it becomes a hazard.</em>
            </h2>
            <p className="intro-copy">
              Explore NASA microgravity combustion evidence, compare flame
              behavior, and translate complex findings into a crew-ready
              response.
            </p>
          </div>
          <div className="risk-summary">
            <span className="risk-summary-label">Current assessment</span>
            <strong>MODERATE</strong>
            <span>Review soot and spread indicators</span>
          </div>
        </section>

        <section className="metric-grid" aria-label="Key safety indicators">
          <article className="metric-card metric-card-risk">
            <span className="metric-label">Risk level</span>
            <strong>Moderate</strong>
            <span className="metric-trend">+12% soot signal</span>
            <div className="risk-bar">
              <span />
            </div>
          </article>
          <article className="metric-card">
            <span className="metric-label">Flame temperature</span>
            <strong>
              1,184 <small>K</small>
            </strong>
            <span className="metric-trend is-muted">Within observed range</span>
            <div className="mini-chart">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
          </article>
          <article className="metric-card">
            <span className="metric-label">Active evidence</span>
            <strong>
              204 <small>records</small>
            </strong>
            <span className="metric-trend is-positive">
              ACME + FLEX indexed
            </span>
            <div className="evidence-dots">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
          </article>
          <article className="metric-card">
            <span className="metric-label">Sensors online</span>
            <strong>04 / 04</strong>
            <span className="metric-trend is-positive">All nominal</span>
            <div className="sensor-line">
              <span />
              <span />
              <span />
              <span />
            </div>
          </article>
        </section>

        <section className="primary-grid" id="flame-model">
          <article className="panel simulation-panel">
            <div className="panel-topline">
              <div>
                <span className="panel-number">01 / LIVE MODEL</span>
                <h3>Flame morphology</h3>
              </div>
              <span className="panel-state">
                {isMicrogravity ? "ORBITAL" : "TERRESTRIAL"}
              </span>
            </div>
            <div className="dashboard-canvas">
              <Canvas camera={{ position: [0, 0, 5], fov: 42 }}>
                <color attach="background" args={["#071017"]} />
                <ambientLight intensity={0.55} />
                <pointLight
                  position={[4, 4, 4]}
                  intensity={16}
                  color="#d4f3ff"
                />
                <pointLight
                  position={[-4, -2, 2]}
                  intensity={10}
                  color="#ff682f"
                />
                <Stars
                  radius={30}
                  depth={12}
                  count={750}
                  factor={1.4}
                  saturation={0}
                  fade
                  speed={0.35}
                />
                <Flame3D isMicrogravity={isMicrogravity} />
                <OrbitControls
                  enablePan={false}
                  minDistance={2.5}
                  maxDistance={8}
                />
              </Canvas>
              <span className="canvas-readout canvas-readout-left">
                BLUE / COOLER / DIFFUSE
              </span>
              <span className="canvas-readout canvas-readout-right">
                DRAG TO INSPECT
              </span>
            </div>
            <div className="simulation-footer">
              <span>Fuel: Heptane</span>
              <span>
                Profile:{" "}
                {isMicrogravity ? "Spherical diffusion" : "Buoyant teardrop"}
              </span>
              <span className="simulation-live">
                <i /> Live simulation
              </span>
            </div>
          </article>

          <article className="panel signal-panel">
            <div className="panel-topline">
              <div>
                <span className="panel-number">02 / SAFETY SIGNALS</span>
                <h3>What needs attention</h3>
              </div>
              <span className="signal-count">3 signals</span>
            </div>
            <div className="signal-list">
              <div className="signal-item signal-warning">
                <span className="signal-icon">!</span>
                <div>
                  <strong>Soot accumulation</strong>
                  <p>Elevated in microgravity profile</p>
                </div>
                <span className="signal-level">WATCH</span>
              </div>
              <div className="signal-item signal-info">
                <span className="signal-icon">+</span>
                <div>
                  <strong>Flame spread</strong>
                  <p>Wider than terrestrial baseline</p>
                </div>
                <span className="signal-level">INFO</span>
              </div>
              <div className="signal-item signal-good">
                <span className="signal-icon">OK</span>
                <div>
                  <strong>Temperature sensors</strong>
                  <p>All readings within range</p>
                </div>
                <span className="signal-level">NOMINAL</span>
              </div>
            </div>
            <div className="response-note">
              <span>Recommended response</span>
              <strong>Keep extinguishment protocol ready.</strong>
            </div>
          </article>
        </section>

        <section className="secondary-grid" id="evidence-library">
          <article className="panel evidence-panel">
            <div className="panel-topline">
              <div>
                <span className="panel-number">03 / SOURCE EVIDENCE</span>
                <h3>Research library</h3>
              </div>
              <button className="text-button" type="button">
                View all
              </button>
            </div>
            <div className="dataset-tabs">
              {Object.keys(datasetDetails).map((key) => (
                <button
                  className={
                    activeDataset === key
                      ? "dataset-tab is-active"
                      : "dataset-tab"
                  }
                  key={key}
                  type="button"
                  onClick={() => setActiveDataset(key)}
                >
                  {key}
                </button>
              ))}
            </div>
            <div className="dataset-summary">
              <div className="dataset-icon">
                {activeDataset === "ACME"
                  ? "AC"
                  : activeDataset === "FLEX"
                    ? "FX"
                    : "A+F"}
              </div>
              <div>
                <strong>{dataset.label}</strong>
                <p>{dataset.detail}</p>
              </div>
              <div className="dataset-stat">
                <span>Indexed</span>
                <strong>{dataset.samples}</strong>
              </div>
            </div>
            <div className="dataset-signal">
              <span>Primary signal</span>
              <strong>{dataset.signal}</strong>
              <span className="arrow-mark">-&gt;</span>
            </div>
          </article>

          <article className="panel analyst-panel">
            <div className="panel-topline">
              <div>
                <span className="panel-number">04 / AI Assistant</span>
                <h3>Ask the evidence</h3>
              </div>
              <span className="ai-badge">AI</span>
            </div>
            <p className="analyst-copy">
              Ask a plain-language question about the active combustion
              evidence.
            </p>
            <form className="analyst-form" onSubmit={handleAnalyze}>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="What changes in microgravity?"
                aria-label="Ask the evidence"
              />
              <button type="submit" disabled={isAnalyzing}>
                {isAnalyzing ? "..." : "Ask"}
              </button>
            </form>
            <div className="analysis-result">
              <span>Safety interpretation</span>
              <AnalysisText text={analysis} />
            </div>
          </article>
        </section>

        <footer className="operations-footer">
          <span>TEAM DUO / NASA SPACE APPS CHALLENGE 2026</span>
          <span>
            Gazi Shaharabi Anwar Tuhin & Sonia Akter Bithi / Cumilla, Bangladesh
          </span>
        </footer>
      </main>
    </div>
  );
}
