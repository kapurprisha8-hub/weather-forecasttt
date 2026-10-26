import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import ClothingAdvisor from './components/ClothingAdvisor';
import Forecast5Day from './components/Forecast5Day';
import WeatherChart from './components/WeatherChart';
import AuthModal from './components/AuthModal';
import WeatherIcon from './components/WeatherIcon';
import {
  fetchWeatherData,
  reverseGeocode,
  POPULAR_CITIES,
  getWeatherTheme,
} from './services/weatherService';
import './App.css';

export default function App() {
  // Global Unit State: 'C' (Celsius) or 'F' (Fahrenheit)
  const [unit, setUnit] = useState(() => {
    return localStorage.getItem('skycast_unit') || 'C';
  });

  // Current logged in user (loaded from localStorage)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('skycast_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Active weather location (Default to user's saved home location if logged in, else London)
  const [currentLocation, setCurrentLocation] = useState(() => {
    try {
      const saved = localStorage.getItem('skycast_user');
      if (saved) {
        const u = JSON.parse(saved);
        if (u.location && u.location.latitude && u.location.longitude) {
          return u.location;
        }
      }
    } catch {
      // fallback
    }
    return POPULAR_CITIES[0];
  });

  // Weather data state
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Selected forecast day index (0 = Today, 1 = Day 2, etc.)
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  // Geolocation & Auth modal state
  const [isLocating, setIsLocating] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Sync unit choice to localStorage
  const handleToggleUnit = (newUnit) => {
    setUnit(newUnit);
    localStorage.setItem('skycast_unit', newUnit);
  };

  // Fetch weather data for the current active location
  const loadWeatherData = useCallback(async (location) => {
    if (!location || !location.latitude || !location.longitude) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData(
        location.latitude,
        location.longitude,
        location.timezone || 'auto'
      );
      setWeatherData(data);
      setSelectedDayIndex(0); // Reset to today
    } catch (err) {
      console.error('Failed to load weather data:', err);
      setError(err.message || 'Unable to fetch weather data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch weather whenever currentLocation changes
  useEffect(() => {
    loadWeatherData(currentLocation);
  }, [currentLocation, loadWeatherData]);

  // Geolocation detector from Navbar
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const geoInfo = await reverseGeocode(lat, lon);
          const detectedCity = {
            name: geoInfo.name || 'My Location',
            country: geoInfo.country || '',
            admin1: geoInfo.admin1 || '',
            latitude: lat,
            longitude: lon,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto',
          };
          setCurrentLocation(detectedCity);
        } catch (err) {
          console.error('Error handling current location:', err);
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        console.warn('Geolocation denied or failed:', err);
        alert('Could not detect location. Please check your browser location permissions.');
        setIsLocating(false);
      },
      { timeout: 10000 }
    );
  };

  // Auth success handler (called from AuthModal on login/signup)
  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    if (user.location && user.location.latitude && user.location.longitude) {
      setCurrentLocation(user.location);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('skycast_user');
    setCurrentUser(null);
  };

  // Derive weather theme from current weather code for dynamic UI theming
  const weatherTheme = weatherData?.current
    ? getWeatherTheme(weatherData.current.weather_code, weatherData.current.is_day)
    : 'default';

  return (
    <div className="app-wrapper" data-theme={weatherTheme}>
      {/* Navbar with Unit Switcher, Geolocation, and Log In / Sign Up */}
      <Navbar
        unit={unit}
        onToggleUnit={handleToggleUnit}
        onUseCurrentLocation={handleUseCurrentLocation}
        isLocating={isLocating}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* City Search Bar & Popular Chips */}
      <SearchBar
        onSelectCity={(city) => setCurrentLocation(city)}
        currentCityName={currentLocation.name}
      />

      {/* Error Banner */}
      {error && (
        <div className="error-banner animate-fade-in">
          <div className="error-content">
            <WeatherIcon name="X" size={20} />
            <span>{error}</span>
          </div>
          <button
            type="button"
            className="btn-retry"
            onClick={() => loadWeatherData(currentLocation)}
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State or Weather Content */}
      {isLoading ? (
        <div className="loading-box animate-fade-in">
          <WeatherIcon name="RefreshCw" size={36} className="animate-spin text-cyan" />
          <p className="loading-text">Fetching atmospheric & clothing advisory data for {currentLocation.name}...</p>
        </div>
      ) : (
        weatherData && (
          <>
            {/* Current Weather Hero & Atmospheric Metrics Grid */}
            <CurrentWeather
              weatherData={weatherData}
              location={currentLocation}
              unit={unit}
            />

            {/* Smart Clothing & Gear Recommendations (Rain, Snow, Wind, Heat) */}
            <ClothingAdvisor
              weatherData={weatherData}
              unit={unit}
            />

            {/* 5-Day Weather Forecast Grid */}
            <Forecast5Day
              weatherData={weatherData}
              unit={unit}
              selectedDayIndex={selectedDayIndex}
              onSelectDay={(idx) => setSelectedDayIndex(idx)}
            />

            {/* Weather Analytics & Temperature Trends Graph */}
            <WeatherChart
              weatherData={weatherData}
              unit={unit}
              selectedDayIndex={selectedDayIndex}
            />
          </>
        )
      )}

      {/* Authentication Modal (Log In / Sign Up with Location capture) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* App Footer */}
      <footer className="app-footer">
        <div className="footer-left">
          <span>SkyCast • Accurate 5-Day Forecast & Clothing Lifestyle Advisory</span>
        </div>
        <div className="footer-right">
          <span>Real-time data powered by Open-Meteo REST API</span>
          <span>•</span>
          {!currentUser ? (
            <button
              type="button"
              className="text-cyan"
              onClick={() => setIsAuthModalOpen(true)}
              style={{ textDecoration: 'underline' }}
            >
              Sign In to Save City
            </button>
          ) : (
            <span>Logged in as <strong>{currentUser.name}</strong></span>
          )}
        </div>
      </footer>
    </div>
  );
}
