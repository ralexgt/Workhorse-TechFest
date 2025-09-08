import React, { useState } from 'react';
import './Home.css';

// Example brand data with logo URLs (replace with your own logo paths)
const brands = [
  { name: 'BMW', logo: '/logos/bmw.png' },
  { name: 'Audi', logo: '/logos/audi.png' },
  { name: 'VW', logo: '/logos/vw.png' },
  { name: 'Skoda', logo: '/logos/skoda.png' },
  { name: 'Mazda', logo: '/logos/mazda.png' },
  { name: 'Honda', logo: '/logos/honda.png' },
  { name: 'Toyota', logo: '/logos/toyota.png' },
  { name: 'Lexus', logo: '/logos/lexus.png' },
  // Add more brands as needed
];

function Home() {
  const [rust, setRust] = useState(0);
  const [severity, setSeverity] = useState(0);
  const [flooded, setFlooded] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Collect form data
    const data = {
      brand: selectedBrand ? selectedBrand.name : '',
      year: parseInt(e.target.year.value),
      odometer: parseInt(e.target.odometer.value),
      accidentzone: e.target.accidentzone.value,
      rust: rust,
      severity: severity,
      flooded: flooded,
      timebudget: parseInt(e.target.timebudget.value),
    };
    // Send POST request to backend
    try {
      const response = await fetch('http://localhost:5000/home/post-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Data sent:', data);
        console.log('Backend response:', result);
      } else {
        const text = await response.text();
        console.error('Backend error:', response.status, text);
      }
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  return (
    <div>
      <h1>Predictive Vehicle Component Dismantling</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-row-vin">
          <label htmlFor="brand">Brand  </label>
          <div className="brand-dropdown-container">
            <button
              type="button"
              className="brand-dropdown-toggle"
              onClick={() => setShowBrandDropdown(!showBrandDropdown)}
            >
              {selectedBrand ? (
                <span className="brand-selected">
                  <img src={selectedBrand.logo} alt={selectedBrand.name} className="brand-logo" />
                  {selectedBrand.name}
                </span>
              ) : (
                <span>Select a brand</span>
              )}
              <span className="dropdown-arrow">&#9662;</span>
            </button>
            {showBrandDropdown && (
              <div className="brand-dropdown-list">
                {brands.map((brand) => (
                  <div
                    key={brand.name}
                    className="brand-card"
                    onClick={() => {
                      setSelectedBrand(brand);
                      setShowBrandDropdown(false);
                    }}
                  >
                    <img src={brand.logo} alt={brand.name} className="brand-logo" />
                    <span>{brand.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="year">Manufacture Year</label>
            <input type="number" id="year" name="year" placeholder="Enter the production year" required min="1980" max={2025} defaultValue={2000}/>
          </div>
          <div className="form-group">
            <label htmlFor="odometer">Odometer</label>
            <input type="number" id="odometer" name="odometer" placeholder="Enter odometer reading" required min="5" />
          </div>
          <div className="form-group">
            <label htmlFor="accidentzone">Accident Zone</label>
            <select id="accidentzone" name="accidentzone" required defaultValue="">
              <option value="" disabled hidden>Select accident zone</option>
              <option value="none">None</option>
              <option value="front">Front</option>
              <option value="rear">Rear</option>
              <option value="side">Side</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="rust">Rust Level <span>{rust}</span></label>
            <input
              type="range"
              id="rust"
              name="rust"
              min="0"
              max="5"
              value={rust}
              onChange={e => setRust(Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label htmlFor="severity">Accident Severity <span>{severity}</span></label>
            <input
              type="range"
              id="severity"
              name="severity"
              min="0"
              max="5"
              value={severity}
              onChange={e => setSeverity(Number(e.target.value))}
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
                onChange={() => setFlooded(!flooded)}
              />
              <span className="slider"></span>
            </label>
            <span style={{marginLeft: '1rem', fontWeight: 600, color: flooded ? '#ef8354' : '#e0e0e0'}}>
              {flooded ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="form-group">
            <label htmlFor="timebudget">Time Budget</label>
            <input type="number" id="timebudget" name="timebudget" placeholder="Enter the required time:" required min="10" />
          </div>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Home;
