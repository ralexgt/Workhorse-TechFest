import './Dashboard.css';


function Dashboard({ response }) {
  if (!response) {
    return <div>No data received yet.</div>;
  }

  console.log('Rendering dashboard with response:', response);

  const usedPct = Math.min(100, Math.round((response.totals.time_min / (response.ui.time_budget_min || response.totals.time_min)) * 100));
  const partsCount = response.selected_order.length;

  return (
    <div className="dashboard-container">

      {/* Vehicle strip with inline logo + name */}
      <section className="vehicle-strip">
        <div className="vehicle-main">
          <img
            src={`${process.env.PUBLIC_URL}/logos/${response.vehicle.brand}.png`}
            alt={response?.vehicle?.brand || 'Brand'}
            className="brand-inline"
          />

          <div className="vehicle-heading">
            <div className="vehicle-line">
              <span className="veh-title">{response.vehicle.brand}</span>
              <span className="veh-meta">• {response.vehicle.year}</span>
            </div>
            <div className="veh-badges">
              <span className={`chip chip-${response.vehicle.vehicletype}`}>{response.vehicle.vehicletype}</span>
              <span className="chip chip-neutral">
                {new Intl.NumberFormat().format(response.vehicle.odometer_km)} km
              </span>
            </div>
          </div>
        </div>

        {/* KPI row — equal heights */}
        <div className="vehicle-kpis">
          <div className="kpi kpi-box">
            <div className="kpi-label">Time used</div>
            <div className="kpi-gauge" aria-label={`Time used ${usedPct}%`} style={{ '--kpi': `${usedPct}%` }}>
              <div className="kpi-gauge-fill"  />
              <div className="kpi-gauge-text">{usedPct}%</div>
            </div>
          </div>
          <div className="kpi kpi-box">
            <div className="kpi-label">Expected Profit</div>
            <div className="kpi-big">€{response.totals.expected_profit_eur.toFixed(2)}</div>
          </div>
          <div className="kpi kpi-box">
            <div className="kpi-label">Selected Parts</div>
            <div className="kpi-big">{partsCount}</div>
          </div>
          <div className="kpi kpi-box">
            <div className="kpi-label">Total Time</div>
            <div className="kpi-big">{response.totals.time_min.toFixed(2)} min</div>
          </div>
        </div>
      </section>

      {/* Emphasized mandatory step */}
      <section className="dashboard-section">
        <div className="mandatory-banner" role="alert">
          <span className="mandatory-icon">⚠️</span>
          <div>
            <div className="mandatory-title">Mandatory First Step</div>
            <div className="mandatory-text">{response.mandatory_first.join(', ')}</div>
          </div>
        </div>
      </section>

      {/* Selected components: list, each with three mini-cards */}
      <section className="dashboard-section">
        <h2 className="dashboard-subtitle">Selected Components</h2>
        <ul className="sel-list">
          {response.selected_order.map((item) => (
            <li className="sel-item" key={item.component}>
              <div className="sel-head">
                <span className="sel-name">{item.component.replace('_', ' ')}</span>
                <span className={`status-chip ${item.decision === 'reuse' ? 'ok' : item.decision === 'recycle' ? 'warn' : 'muted'}`}>
                  {item.decision || '—'}
                </span>
              </div>
              <div className="stat-grid">
                <div className="stat-card">
                  <div className="stat-label">Time</div>
                  <div className="stat-value">{item.pred_time_min.toFixed(2)} min</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Success</div>
                  <div className="stat-value">{(item.success_prob * 100).toFixed(0)}%</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Profit</div>
                  <div className="stat-value">€{response.totals.expected_profit_eur.toFixed(2)}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Skipped as a simple list */}
      <section className="dashboard-section">
        <h2 className="dashboard-subtitle">Skipped Components</h2>
        <ul className="skipped-ul">
          {Object.entries(response.skipped).map(([comp, reason]) => (
            <li key={comp}>
              <span className="skipped-name">{comp.replace('_', ' ')}</span>
              <span className="skipped-reason"> — {reason}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default Dashboard;
