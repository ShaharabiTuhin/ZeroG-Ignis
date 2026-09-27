export default function Dashboard({ isMicrogravity, onToggle }) {
  return (
    <header className="dashboard-header">
      <div className="brand-lockup">
        <span className="brand-mark" aria-hidden="true">
          ZG
        </span>
        <div>
          <p className="eyebrow">FLAME IN FREEFALL / 2026</p>
          <h1>ZeroG Ignis</h1>
        </div>
      </div>
      <div className="header-status">
        <span className="status-dot" />
        <span>Simulation online</span>
      </div>
      <button className="environment-toggle" type="button" onClick={onToggle}>
        <span>Environment</span>
        <strong>{isMicrogravity ? "Microgravity" : "Earth gravity"}</strong>
        <span aria-hidden="true">↔</span>
      </button>
    </header>
  );
}
