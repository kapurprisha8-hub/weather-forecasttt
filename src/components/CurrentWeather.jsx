import React from 'react';
import WeatherIcon from './WeatherIcon';
import { getWeatherCondition, convertTemp, convertSpeed } from '../services/weatherService';

/**
 * CurrentWeather Component (Team Member 2 Contribution)
 * Displays primary current weather card, real-time temperature, condition icon, and atmospheric highlights.
 */
export default function CurrentWeather({ weatherData, location, unit }) {
  if (!weatherData || !weatherData.current) return null;

  const current = weatherData.current;
  const daily = weatherData.daily;
  const isDay = current.is_day === 1;

  const condition = getWeatherCondition(current.weather_code, isDay);
  const temp = convertTemp(current.temperature_2m, unit);
  const feelsLike = convertTemp(current.apparent_temperature, unit);

  // Today's high and low from daily forecast
  const maxTemp = daily && daily.temperature_2m_max ? convertTemp(daily.temperature_2m_max[0], unit) : null;
  const minTemp = daily && daily.temperature_2m_min ? convertTemp(daily.temperature_2m_min[0], unit) : null;

  // Sunrise and Sunset formatting
  const formatTime = (isoString) => {
    if (!isoString) return '--:--';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '--:--';
    }
  };

  const sunrise = daily?.sunrise?.[0] ? formatTime(daily.sunrise[0]) : null;
  const sunset = daily?.sunset?.[0] ? formatTime(daily.sunset[0]) : null;

  // Format today's date
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  return (
    <div className="current-weather-card animate-fade-in">
      <div className="current-main-info">
        <div className="location-heading">
          <div className="city-title-row">
            <WeatherIcon name="MapPin" size={20} className="text-cyan" />
            <h2 className="current-city">{location.name}</h2>
          </div>
          <p className="current-meta">
            {[location.admin1, location.country].filter(Boolean).join(', ') || 'Global Station'} • {todayFormatted}
          </p>
        </div>

        <div className="temp-hero-section">
          <div className="temp-badge-wrap">
            <span className="current-temp-number">{temp}</span>
            <span className="current-temp-unit">°{unit}</span>
          </div>

          <div className="condition-pill">
            <WeatherIcon
              name={condition.icon}
              size={34}
              color={isDay ? condition.dayColor : condition.nightColor}
            />
            <div className="condition-text-wrap">
              <span className="condition-title">{condition.label}</span>
              <span className="condition-feels">Feels like {feelsLike}°{unit}</span>
            </div>
          </div>
        </div>

        {maxTemp !== null && minTemp !== null && (
          <div className="day-range-pill">
            <span>High: <strong>{maxTemp}°{unit}</strong></span>
            <span className="range-divider">|</span>
            <span>Low: <strong>{minTemp}°{unit}</strong></span>
          </div>
        )}
      </div>

      {/* Atmospheric Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <WeatherIcon name="Droplets" size={18} className="text-cyan" />
            <span className="metric-label">Humidity</span>
          </div>
          <div className="metric-value">{current.relative_humidity_2m}%</div>
          <div className="metric-desc">Dew point comfort zone</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <WeatherIcon name="Wind" size={18} className="text-cyan" />
            <span className="metric-label">Wind</span>
          </div>
          <div className="metric-value">{convertSpeed(current.wind_speed_10m, unit)}</div>
          <div className="metric-desc">Direction {Math.round(current.wind_direction_10m || 0)}°</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <WeatherIcon name="Gauge" size={18} className="text-cyan" />
            <span className="metric-label">Pressure</span>
          </div>
          <div className="metric-value">{Math.round(current.surface_pressure || 1013)} hPa</div>
          <div className="metric-desc">Atmospheric stability</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <WeatherIcon name="CloudRain" size={18} className="text-cyan" />
            <span className="metric-label">Precipitation</span>
          </div>
          <div className="metric-value">
            {daily?.precipitation_probability_max?.[0] !== undefined
              ? `${daily.precipitation_probability_max[0]}%`
              : `${current.precipitation || 0} mm`}
          </div>
          <div className="metric-desc">Chance of rain today</div>
        </div>

        {sunrise && (
          <div className="metric-card">
            <div className="metric-header">
              <WeatherIcon name="Sunrise" size={18} className="text-amber" />
              <span className="metric-label">Sunrise</span>
            </div>
            <div className="metric-value">{sunrise}</div>
            <div className="metric-desc">Dawn time</div>
          </div>
        )}

        {sunset && (
          <div className="metric-card">
            <div className="metric-header">
              <WeatherIcon name="Sunset" size={18} className="text-indigo" />
              <span className="metric-label">Sunset</span>
            </div>
            <div className="metric-value">{sunset}</div>
            <div className="metric-desc">Dusk time</div>
          </div>
        )}
      </div>
    </div>
  );
}
