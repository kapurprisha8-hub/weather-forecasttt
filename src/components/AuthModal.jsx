import React, { useState, useEffect } from 'react';
import WeatherIcon from './WeatherIcon';
import { searchCities, reverseGeocode } from '../services/weatherService';

/**
 * AuthModal Component
 * Implements User Log In & Sign Up with automated/custom location preference capture.
 */
export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('signup'); // 'login' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cityInput, setCityInput] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [isLocating, setIsLocating] = useState(false);
  const [authError, setAuthError] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search for city autocomplete in Sign Up form
  useEffect(() => {
    if (!cityInput || cityInput.trim().length < 2) {
      setCitySuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const results = await searchCities(cityInput);
        setCitySuggestions(results);
      } catch (err) {
        console.error('City lookup error:', err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [cityInput]);

  if (!isOpen) return null;

  // Auto-detect user location during signup
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setAuthError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setAuthError('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const geoInfo = await reverseGeocode(lat, lon);
          const loc = {
            name: geoInfo.name || 'Detected City',
            country: geoInfo.country || '',
            admin1: geoInfo.admin1 || '',
            latitude: lat,
            longitude: lon,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto',
          };
          setSelectedLocation(loc);
          setCityInput(`${loc.name}${loc.country ? ', ' + loc.country : ''}`);
          setCitySuggestions([]);
        } catch (err) {
          console.error('Location detection failed:', err);
          setAuthError('Could not detect city name from your coordinates.');
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        console.warn('Geolocation permission denied:', err);
        setAuthError('Location permission denied. You can search your city manually below.');
        setIsLocating(false);
      },
      { timeout: 9000 }
    );
  };

  const handleSelectCitySuggestion = (city) => {
    setSelectedLocation(city);
    setCityInput(`${city.name}, ${city.country}`);
    setCitySuggestions([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAuthError('');

    if (!email || !password) {
      setAuthError('Please fill in both email and password.');
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setAuthError('Please provide your full name.');
        return;
      }

      // Default fallback location if user didn't pick one
      const userLoc = selectedLocation || {
        name: 'London',
        country: 'United Kingdom',
        latitude: 51.5085,
        longitude: -0.1257,
        timezone: 'Europe/London',
      };

      const newUser = {
        name: name.trim(),
        email: email.trim(),
        location: userLoc,
      };

      // Save user to localStorage
      localStorage.setItem('skycast_user', JSON.stringify(newUser));
      onAuthSuccess(newUser);
      onClose();
    } else {
      // Login mode
      const savedUserStr = localStorage.getItem('skycast_user');
      if (savedUserStr) {
        try {
          const savedUser = JSON.parse(savedUserStr);
          onAuthSuccess(savedUser);
          onClose();
          return;
        } catch {
          // ignore
        }
      }

      // If no account exists yet, create session with default
      const defaultUser = {
        name: email.split('@')[0] || 'User',
        email: email.trim(),
        location: {
          name: 'New York',
          country: 'United States',
          latitude: 40.7143,
          longitude: -74.006,
          timezone: 'America/New_York',
        },
      };
      localStorage.setItem('skycast_user', JSON.stringify(defaultUser));
      onAuthSuccess(defaultUser);
      onClose();
    }
  };

  // Quick Demo Login helper for easy testing
  const handleQuickDemoLogin = () => {
    const demoUser = {
      name: 'Alex Johnson',
      email: 'alex@example.com',
      location: {
        name: 'Paris',
        country: 'France',
        latitude: 48.8534,
        longitude: 2.3488,
        timezone: 'Europe/Paris',
      },
    };
    localStorage.setItem('skycast_user', JSON.stringify(demoUser));
    onAuthSuccess(demoUser);
    onClose();
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-card auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <WeatherIcon name={mode === 'signup' ? 'User' : 'LogIn'} size={22} className="text-cyan" />
            <div>
              <h3 className="modal-title">{mode === 'signup' ? 'Create Your Account' : 'Welcome Back'}</h3>
              <p className="modal-subtitle">
                {mode === 'signup'
                  ? 'Sign up to personalize weather forecasts & location alerts'
                  : 'Log in to access your saved location and preferences'}
              </p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <WeatherIcon name="X" size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab-btn ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => {
              setMode('signup');
              setAuthError('');
            }}
          >
            Sign Up
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => {
              setMode('login');
              setAuthError('');
            }}
          >
            Log In
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {authError && (
            <div className="auth-error-banner">
              <WeatherIcon name="AlertTriangle" size={16} />
              <span>{authError}</span>
            </div>
          )}

          {mode === 'signup' && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="form-input-wrap">
                <WeatherIcon name="User" size={16} className="input-icon" />
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Sarah Jenkins"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="form-input-wrap">
              <WeatherIcon name="Mail" size={16} className="input-icon" />
              <input
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="form-input-wrap">
              <WeatherIcon name="Lock" size={16} className="input-icon" />
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Location setup during sign up */}
          {mode === 'signup' && (
            <div className="form-group">
              <div className="form-label-row">
                <label className="form-label">Your Home / Default Location</label>
                <button
                  type="button"
                  className="btn-text-action"
                  onClick={handleDetectLocation}
                  disabled={isLocating}
                >
                  <WeatherIcon
                    name={isLocating ? 'RefreshCw' : 'Navigation'}
                    size={13}
                    className={isLocating ? 'animate-spin' : ''}
                  />
                  <span>{isLocating ? 'Detecting...' : 'Detect My Location'}</span>
                </button>
              </div>

              <div className="form-input-wrap">
                <WeatherIcon name="MapPin" size={16} className="input-icon text-cyan" />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search your city (e.g. Chicago, Tokyo, London)..."
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                />
              </div>

              {/* City Suggestions dropdown */}
              {citySuggestions.length > 0 && (
                <ul className="auth-city-dropdown">
                  {citySuggestions.map((city, idx) => (
                    <li
                      key={`${city.id}-${idx}`}
                      className="auth-city-item"
                      onClick={() => handleSelectCitySuggestion(city)}
                    >
                      <WeatherIcon name="MapPin" size={14} className="text-cyan" />
                      <span>
                        {city.name}, {city.country}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <button type="submit" className="btn-primary auth-submit-btn">
            {mode === 'signup' ? 'Create Account & Set Location' : 'Log In & Load Forecast'}
          </button>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <button
            type="button"
            className="btn-demo-login"
            onClick={handleQuickDemoLogin}
          >
            <WeatherIcon name="Sparkles" size={16} className="text-amber" />
            <span>1-Click Demo Login (Paris Station)</span>
          </button>
        </form>
      </div>
    </div>
  );
}
