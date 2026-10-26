import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import Forecast5Day from './components/Forecast5Day';
import WeatherChart from './components/WeatherChart';
import TeamModal from './components/TeamModal';
import WeatherIcon from './components/WeatherIcon';
import {
  fetchWeatherData,
  reverseGeocode,
  POPULAR_CITIES,
} from './services/weatherService';
import './App.css';

export default function App() {
  // Global Unit State: 'C' (Celsius) or 'F' (Fahrenheit)
  const [unit, setUnit] = useState(() => {
    return localStorage.getItem('skycast_unit') || 'C';
  });

  // Current active city/location (Default: London)
  const [currentLocation, setCurrentLocation] = useState(() => {
    return POPULAR_CITIES[0];
  });

  // Weather data from Open-Meteo
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Selected forecast day index (0 = Today, 1 = Day 2, etc.)
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  // Geolocation & Modal state
  const [isLocating, setIsLocating] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

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

  // Fetch when currentLocation changes
  useEffect(() => {
    loadWeatherData(currentLocation);
  }, [currentLocation, loadWeatherData]);

  // Geolocation detector
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

  return (
    <div className="app-wrapper">
      {/* Member 1: Navbar with Unit Switcher & Team Modal Trigger */}
      <Navbar
        unit={unit}
        onToggleUnit={handleToggleUnit}
        onUseCurrentLocation={handleUseCurrentLocation}
        isLocating={isLocating}
        onOpenTeamModal={() => setIsTeamModalOpen(true)}
      />

      {/* Member 1: City Search & Quick Preset Chips */}
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

      {/* Loading Box */}
      {isLoading ? (
        <div className="loading-box animate-fade-in">
          <WeatherIcon name="RefreshCw" size={36} className="animate-spin text-cyan" />
          <p className="loading-text">Fetching latest atmospheric data for {currentLocation.name}...</p>
        </div>
      ) : (
        weatherData && (
          <>
            {/* Member 2: Current Weather Hero & Atmospheric Metrics Grid */}
            <CurrentWeather
              weatherData={weatherData}
              location={currentLocation}
              unit={unit}
            />

            {/* Member 2: 5-Day Weather Forecast */}
            <Forecast5Day
              weatherData={weatherData}
              unit={unit}
              selectedDayIndex={selectedDayIndex}
              onSelectDay={(idx) => setSelectedDayIndex(idx)}
            />

            {/* Member 3: Weather Analytics & Trends Chart */}
            <WeatherChart
              weatherData={weatherData}
              unit={unit}
              selectedDayIndex={selectedDayIndex}
            />
          </>
        )
      )}

      {/* Member 3: College Team Overview Modal */}
      <TeamModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
      />

      {/* App Footer */}
      <footer className="app-footer">
        <div className="footer-left">
          <span>SkyCast • College Team Project (3 Members)</span>
        </div>
        <div className="footer-right">
          <span>Powered by Open-Meteo API</span>
          <span>•</span>
          <button
            type="button"
            className="text-cyan"
            onClick={() => setIsTeamModalOpen(true)}
            style={{ textDecoration: 'underline' }}
          >
            Team Contributions
          </button>
        </div>
      </footer>
    </div>
  );
}
