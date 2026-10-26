import React from 'react';
import WeatherIcon from './WeatherIcon';

/**
 * Navbar Component (Team Member 1 Contribution)
 * Manages App header, temperature unit switcher (°C / °F), geolocation trigger, and team modal toggle.
 */
export default function Navbar({
  unit,
  onToggleUnit,
  onUseCurrentLocation,
  isLocating,
  onOpenTeamModal,
}) {
  return (
    <header className="navbar-container">
      <div className="navbar-brand">
        <div className="brand-logo-icon">
          <WeatherIcon name="Sun" size={24} color="#f59e0b" />
        </div>
        <div>
          <div className="brand-title-wrap">
            <h1 className="brand-title">SkyCast</h1>
            <span className="brand-badge">Team Project</span>
          </div>
          <p className="brand-subtitle">5-Day Weather Forecast & Analytics</p>
        </div>
      </div>

      <div className="navbar-actions">
        {/* Geolocation Button */}
        <button
          type="button"
          className="btn-glass btn-location"
          onClick={onUseCurrentLocation}
          disabled={isLocating}
          title="Detect my current location"
        >
          <WeatherIcon
            name={isLocating ? 'RefreshCw' : 'Navigation'}
            size={16}
            className={isLocating ? 'animate-spin text-cyan' : 'text-cyan'}
          />
          <span className="btn-label">{isLocating ? 'Locating...' : 'My Location'}</span>
        </button>

        {/* Unit Switcher: Celsius (°C) / Fahrenheit (°F) */}
        <div className="unit-toggle" title="Switch temperature unit">
          <button
            type="button"
            className={`unit-btn ${unit === 'C' ? 'active' : ''}`}
            onClick={() => onToggleUnit('C')}
          >
            °C
          </button>
          <button
            type="button"
            className={`unit-btn ${unit === 'F' ? 'active' : ''}`}
            onClick={() => onToggleUnit('F')}
          >
            °F
          </button>
        </div>

        {/* Team Project Info Button */}
        <button
          type="button"
          className="btn-glass btn-team"
          onClick={onOpenTeamModal}
          title="View Project Team Members & Roles"
        >
          <WeatherIcon name="Users" size={16} color="#38bdf8" />
          <span className="btn-label">Team</span>
        </button>
      </div>
    </header>
  );
}
