import React from 'react';
import WeatherIcon from './WeatherIcon';
import { getWeatherCondition, convertTemp } from '../services/weatherService';

/**
 * Forecast5Day Component (Team Member 2 Contribution)
 * Displays 5-Day forecast cards with weather conditions, min/max temperatures, and precipitation.
 */
export default function Forecast5Day({ weatherData, unit, selectedDayIndex, onSelectDay }) {
  if (!weatherData || !weatherData.daily) return null;

  const daily = weatherData.daily;
  const daysCount = Math.min(5, daily.time.length);

  // Helper to format day name and date
  const formatDayInfo = (dateStr, index) => {
    const date = new Date(dateStr + 'T00:00:00');
    if (index === 0) return { dayName: 'Today', dateFormatted: 'Today' };
    
    const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
    const dateFormatted = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
    return { dayName, dateFormatted };
  };

  // Find global min and max across the 5 days to compute proportional temperature bar
  const tempsMax = daily.temperature_2m_max.slice(0, daysCount).map((t) => convertTemp(t, unit));
  const tempsMin = daily.temperature_2m_min.slice(0, daysCount).map((t) => convertTemp(t, unit));
  const absoluteMin = Math.min(...tempsMin);
  const absoluteMax = Math.max(...tempsMax);
  const totalRange = Math.max(1, absoluteMax - absoluteMin);

  return (
    <section className="forecast-section animate-fade-in">
      <div className="section-header">
        <div className="section-title-wrap">
          <WeatherIcon name="Calendar" size={20} className="text-cyan" />
          <h3 className="section-title">5-Day Weather Forecast</h3>
        </div>
        <span className="section-hint">Click a day to view hourly details</span>
      </div>

      <div className="forecast-grid">
        {Array.from({ length: daysCount }).map((_, index) => {
          const dateStr = daily.time[index];
          const { dayName, dateFormatted } = formatDayInfo(dateStr, index);
          const weatherCode = daily.weather_code[index];
          const condition = getWeatherCondition(weatherCode, 1);
          const maxTemp = convertTemp(daily.temperature_2m_max[index], unit);
          const minTemp = convertTemp(daily.temperature_2m_min[index], unit);
          const rainChance = daily.precipitation_probability_max ? daily.precipitation_probability_max[index] : 0;
          const isSelected = selectedDayIndex === index;

          // Compute temperature bar width and offset
          const leftPercent = Math.max(0, Math.min(100, ((minTemp - absoluteMin) / totalRange) * 100));
          const rightPercent = Math.max(0, Math.min(100, ((maxTemp - absoluteMin) / totalRange) * 100));
          const barWidth = Math.max(15, rightPercent - leftPercent);

          return (
            <div
              key={dateStr}
              className={`forecast-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectDay(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onSelectDay(index);
              }}
            >
              <div className="forecast-card-top">
                <span className="forecast-day-name">{dayName}</span>
                <span className="forecast-date">{dateFormatted}</span>
              </div>

              <div className="forecast-icon-wrap" title={condition.label}>
                <WeatherIcon name={condition.icon} size={32} color={condition.dayColor} />
                <span className="forecast-condition-label">{condition.label}</span>
              </div>

              {/* Rain Chance Indicator */}
              <div className="forecast-rain-pill" title="Precipitation probability">
                <WeatherIcon name="Droplets" size={13} className="text-cyan" />
                <span>{rainChance}%</span>
              </div>

              {/* Visual Temperature Bar */}
              <div className="temp-range-row">
                <span className="temp-min">{minTemp}°</span>
                <div className="temp-bar-track">
                  <div
                    className="temp-bar-fill"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${barWidth}%`,
                    }}
                  />
                </div>
                <span className="temp-max">{maxTemp}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
