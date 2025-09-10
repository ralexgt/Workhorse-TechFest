import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const API_BASE = "https://vehicle-dismantling-api.azurewebsites.net";

// Helpers for safe, lowercase logo filenames and URLs from /public/logos
const toFileName = (name) =>
  String(name || '')
    .normalize('NFKD')                 // e.g., Škoda -> Skoda
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')              // spaces -> hyphens (Land Rover -> land-rover)
    .replace(/[^a-z0-9-]/g, '');       // keep only safe chars

const logoUrl = (brandName) =>
  `${process.env.PUBLIC_URL}/logos/${toFileName(brandName)}.png`;

// Brand data (names only; logos are computed so paths and casing are always correct)
const brands = [
  { name: 'BMW' },
  { name: 'Audi' },
  { name: 'VW' },
  { name: 'Skoda' },
  { name: 'Mazda' },
  { name: 'Honda' },
  { name: 'Toyota' },
  { name: 'Lexus' },
];

const VEHICLE_TYPES = ['combustion', 'ev', 'hybrid'];
const CURRENT_YEAR = new Date().getFullYear();

function Home({ setBackendResponse }) {
  const [rust, setRust] = useState(0);
  const [severity, setSeverity] = useState(0);
  const [flooded, setFlooded] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [accidentZone, setAccidentZone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  function hasErrors() {
    // native required will handle most inputs; brand is custom
    const brandMissing = !selectedBrand;
    return brandMissing;
  }

  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand);
    setShowBrandDropdown(false);
  };

  const handleZoneChange = (e) => {
    const val = e.target.value;
    setAccidentZone(val);
    if (val === 'none') setSeverity(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    const form = e.currentTarget;
    const formInvalid = !form.checkValidity() || hasErrors();
    if (formInvalid) {
      form.reportValidity();
      const firstInvalid = form.querySelector(':invalid');
      if (firstInvalid) {
        firstInvalid.focus({ preventScroll: true });
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (!selectedBrand) {
      alert('Please select a brand.');
      return;
    }

    const zone = accidentZone || e.target.accidentzone.value;
    const severityToSend = zone === 'none' ? 0 : severity;

    const data = {
      brand: selectedBrand.name,
      year: parseInt(e.target.year.value, 10),
      odometer: parseInt(e.target.odometer.value, 10),
      vehicle_type: e.target.vehicletype.value,
      accident_zone: zone,
      grade_of_rust: rust,
      severity_of_accident: severityToSend,
      is_flooded: flooded,
      timebudget: parseInt(e.target.timebudget.value, 10),
    };

    try {
      const response = await fetch(`${API_BASE}/api/post-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setBackendResponse(result);
        navigate('/dashboard');
      } else {
        const text = await response.text();
        console.error('Backend error:', response.status, text);
      }
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  const severityDisabled = accidentZone === 'none' || accidentZone === '';
  const isInvalidBrand = submitted && !selectedBrand;

  // keyboard support for list options
  const onOptionKeyDown = (brand, e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleBrandSelect(brand);
    }
  };

  return (
    <div className="home-root">
      <h1>Predictive Vehicle Component Dismantling</h1>

      <form onSubmit={handleSubmit} noValidate className={submitted ? 'show-errors' : ''}>
        {/* Brand */}
        <div className="form-row-brand">
          <label className="brand-label" id="brand-label">Brand</label>

          <div className="brand-dropdown-container">
            <button
              type="button"
              className={`brand-dropdown-toggle ${isInvalidBrand ? 'error' : ''}`}
              aria-haspopup="listbox"
              aria-expanded={showBrandDropdown}
              aria-controls="brand-listbox"                            // associate button with popup
              aria-describedby={isInvalidBrand ? 'brand-error' : undefined}
              onClick={() => setShowBrandDropdown((v) => !v)}
            >
              {selectedBrand ? (
                <span className="brand-selected">
                  <img
                    src={logoUrl(selectedBrand.name)}
                    alt={`${selectedBrand.name} logo`}
                    className="brand-logo"
                    onError={(e) => {
                      e.currentTarget.src = `${process.env.PUBLIC_URL}/logos/default.png`;
                    }}
                  />
                  {selectedBrand.name}
                </span>
              ) : (
                <span>Select a brand</span>
              )}
              <span className="dropdown-arrow" aria-hidden>▾</span>
            </button>

            {isInvalidBrand && (
              <p id="brand-error" role="alert" className="brand-error-text">
                Please select a brand.
              </p>
            )}

            {showBrandDropdown && (
              <ul
                id="brand-listbox"
                role="listbox"
                className="brand-dropdown-list"
                aria-labelledby="brand-label"
                aria-invalid={isInvalidBrand ? 'true' : undefined}          // valid on listbox, not on button
                aria-errormessage={isInvalidBrand ? 'brand-error' : undefined}
              >
                {brands.map((brand) => {
                  const selected = selectedBrand?.name === brand.name;
                  return (
                    <li
                      key={brand.name}
                      role="option"
                      aria-selected={selected ? 'true' : 'false'}
                      className={`brand-card ${selected ? 'is-selected' : ''}`}
                      tabIndex={0}
                      onClick={() => handleBrandSelect(brand)}
                      onKeyDown={(e) => onOptionKeyDown(brand, e)}
                    >
                      <img
                        src={logoUrl(brand.name)}
                        alt={`${brand.name} logo`}
                        className="brand-card-logo"
                        onError={(e) => {
                          e.currentTarget.src = `${process.env.PUBLIC_URL}/logos/default.png`;
                        }}
                      />
                      <span>{brand.name}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Grid fields */}
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="year">Manufacture Year</label>
            <input
              type="number"
              id="year"
              name="year"
              placeholder="Enter the production year"
              required
              min="1980"
              max={CURRENT_YEAR}
              defaultValue={CURRENT_YEAR - 7}
            />
          </div>

          <div className="form-group">
            <label htmlFor="odometer">Odometer (km)</label>
            <input
              type="number"
              id="odometer"
              name="odometer"
              placeholder="Enter odometer reading"
              required
              min="5"
              step="1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="vehicletype">Vehicle Type</label>
            <select id="vehicletype" name="vehicletype" required defaultValue="">
              <option value="" disabled hidden>Select vehicle type</option>
              {VEHICLE_TYPES.map((t) => (
                <option key={t} value={t}>{t[0].toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Inline: Accident Zone + Severity */}
          <div className="form-group inline-pair">
            <div className="inline-field form-group">
              <label htmlFor="accidentzone">Accident Zone</label>
              <select
                id="accidentzone"
                name="accidentzone"
                required
                value={accidentZone}
                onChange={handleZoneChange}
              >
                <option value="" disabled hidden>Select accident zone</option>
                <option value="none">None</option>
                <option value="front">Front</option>
                <option value="rear">Rear</option>
                <option value="side">Side</option>
              </select>
            </div>

            <div className={`inline-field form-group ${severityDisabled ? 'is-disabled' : ''}`}>
              <label htmlFor="severity">Accident Severity</label>
              <div className="range-inline">
                <input
                  type="range"
                  id="severity"
                  name="severity"
                  min="0"
                  max="5"
                  value={severity}
                  onChange={(e) => setSeverity(Number(e.target.value))}
                  disabled={severityDisabled}
                  aria-disabled={severityDisabled}
                />
                <span className="range-value">{severity}</span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="rust">Rust Level <span className="slider-value">{rust}</span></label>
            <input
              type="range"
              id="rust"
              name="rust"
              min="0"
              max="5"
              value={rust}
              onChange={(e) => setRust(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label htmlFor="flooded">Flooded</label>
            <label className="switch">
              <input
                type="checkbox"
                id="flooded"
                name="flooded"
                checked={flooded}
                onChange={() => setFlooded((v) => !v)}
              />
              <span className="slider" />
            </label>
            <span className={`switch-state ${flooded ? 'on' : 'off'}`}>
              {flooded ? 'Yes' : 'No'}
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="timebudget">Time Budget (min)</label>
            <input
              type="number"
              id="timebudget"
              name="timebudget"
              placeholder="Enter the time budget"
              required
              min="10"
            />
          </div>
        </div>

        <button type="submit" className="btn-submit">Submit</button>
      </form>
    </div>
  );
}

export default Home;
