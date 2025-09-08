import React from 'react';
import './Dashboard.css';

// Example: use BMW as default, replace with dynamic brand/logo later
const brandLogo = '/logos/bmw.png';

function Dashboard() {
  // Example response (replace with fetched data later)
  const response = {
    mandatory_first: ["isolate_12v_battery"],
    selected_order: [
      { component: "battery", pred_time_min: 13.5, success_prob: 0.43, expected_profit_eur: 5.6 },
      { component: "seat_front", pred_time_min: 29.59, success_prob: 0.5, expected_profit_eur: 7.37 },
      { component: "headlight", pred_time_min: 26.43, success_prob: 0.53, expected_profit_eur: 2.11 },
      { component: "mirror_side", pred_time_min: 20.56, success_prob: 0.19, expected_profit_eur: 0.84 }
    ],
    skipped: {
      bumper: "negative expected profit",
      door_front: "negative expected profit",
      door_rear: "negative expected profit",
      radiator: "negative expected profit",
      starter: "negative expected profit",
      alternator: "would exceed 90-min budget after higher ROI picks"
    },
    totals: {
      time_min: 90.08,
      expected_profit_eur: 15.93
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <img src={brandLogo} alt="Brand Logo" className="dashboard-brand-logo" />
      </div>
      <div style={{ height: '2.5rem' }}></div>
      <section className="dashboard-section">
        <div className="dashboard-summary">
          <div>
            <span className="dashboard-label">Total Time:</span>
            <span className="dashboard-value">{response.totals.time_min.toFixed(2)} min</span>
          </div>
          <div>
            <span className="dashboard-label">Expected Profit:</span>
            <span className="dashboard-value">€{response.totals.expected_profit_eur.toFixed(2)}</span>
          </div>
        </div>
        <div className="dashboard-mandatory">
          <span className="dashboard-label">Mandatory First Step:</span>
          <span className="dashboard-value">{response.mandatory_first.join(', ')}</span>
        </div>
      </section>
      <section className="dashboard-section">
        <h2 className="dashboard-subtitle">Selected Components</h2>
        <div className="dashboard-grid">
          {response.selected_order.map((item, idx) => (
            <div className="dashboard-card" key={item.component}>
              <div className="dashboard-card-title">{item.component.replace('_', ' ')}</div>
              <div className="dashboard-card-detail">
                <span>Time: <b>{item.pred_time_min} min</b></span>
                <span>Success: <b>{(item.success_prob * 100).toFixed(0)}%</b></span>
                <span>Profit: <b>€{item.expected_profit_eur}</b></span>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="dashboard-section">
        <h2 className="dashboard-subtitle">Skipped Components</h2>
        <div className="dashboard-skipped-list">
          {Object.entries(response.skipped).map(([comp, reason]) => (
            <div className="dashboard-skipped-item" key={comp}>
              <span className="dashboard-skipped-name">{comp.replace('_', ' ')}</span>
              <span className="dashboard-skipped-reason">{reason}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
