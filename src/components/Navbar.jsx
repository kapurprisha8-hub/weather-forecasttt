import React from 'react';
import WeatherIcon from './WeatherIcon';

/**
 * Navbar Component
 * App header with temperature unit switcher (°C / °F), geolocation trigger,
 * and user authentication (Log In / Sign Up / Profile status).
 */
export default function Navbar({
  unit,
  onToggleUnit,
  onUseCurrentLocation,
  isLocating,
  currentUser,
  onOpenAuthModal,
  onLogout,
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
          </div>
          <p className="brand-subtitle">5-Day Weather Forecast & Smart Recommendations</p>
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

        {/* Authentication Button / User Profile Pill */}
        {currentUser ? (
          <div className="user-profile-pill">
            <div className="user-avatar">
              <WeatherIcon name="User" size={15} color="#38bdf8" />
            </div>
            <div className="user-info">
              <span className="user-name">{currentUser.name}</span>
              {currentUser.location?.name && (
                <span className="user-home-city">{currentUser.location.name}</span>
              )}
            </div>
            <button
              type="button"
              className="btn-logout"
              onClick={onLogout}
              title="Sign Out"
            >
              <WeatherIcon name="LogOut" size={14} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="btn-glass btn-auth"
            onClick={onOpenAuthModal}
            title="Log in or create an account"
          >
            <WeatherIcon name="User" size={16} className="text-cyan" />
            <span className="btn-label">Sign In / Sign Up</span>
          </button>
        )}
      </div>
    </header>
  );
}
