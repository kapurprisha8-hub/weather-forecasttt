import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import WeatherIcon from './WeatherIcon';
import { convertTemp } from '../services/weatherService';

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * WeatherChart Component (Team Member 3 Contribution)
 * Interactive Weather Analytics Graph rendering 24-hour hourly temperatures or 5-day trend curves.
 */
export default function WeatherChart({ weatherData, unit, selectedDayIndex }) {
  const [viewMode, setViewMode] = useState('hourly'); // 'hourly' | 'daily'

  // Prepare Chart Data
  const chartData = useMemo(() => {
    if (!weatherData) return null;

    if (viewMode === 'hourly') {
      const hourly = weatherData.hourly;
      if (!hourly || !hourly.time) return null;

      // Extract 24 data points based on selected day (0 = today, 1 = tomorrow, etc.)
      const startIndex = Math.max(0, selectedDayIndex * 24);
      const endIndex = Math.min(hourly.time.length, startIndex + 24);

      const timesSlice = hourly.time.slice(startIndex, endIndex);
      const tempsSlice = hourly.temperature_2m.slice(startIndex, endIndex).map((t) => convertTemp(t, unit));
      const humiditySlice = hourly.relative_humidity_2m ? hourly.relative_humidity_2m.slice(startIndex, endIndex) : [];

      const labels = timesSlice.map((isoStr) => {
        const d = new Date(isoStr);
        return d.toLocaleTimeString([], { hour: 'numeric' });
      });

      return {
        labels,
        datasets: [
          {
            label: `Temperature (°${unit})`,
            data: tempsSlice,
            borderColor: '#38bdf8',
            backgroundColor: (context) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, 300);
              gradient.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
              gradient.addColorStop(1, 'rgba(56, 189, 248, 0.0)');
              return gradient;
            },
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#0f172a',
            pointBorderColor: '#38bdf8',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            yAxisID: 'y',
          },
          {
            label: 'Humidity (%)',
            data: humiditySlice,
            borderColor: '#818cf8',
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [4, 4],
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4,
            yAxisID: 'y1',
          },
        ],
      };
    } else {
      // 5-Day Trend Mode
      const daily = weatherData.daily;
      if (!daily || !daily.time) return null;

      const count = Math.min(5, daily.time.length);
      const labels = daily.time.slice(0, count).map((dateStr, i) => {
        if (i === 0) return 'Today';
        const d = new Date(dateStr + 'T00:00:00');
        return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(d);
      });

      const maxTemps = daily.temperature_2m_max.slice(0, count).map((t) => convertTemp(t, unit));
      const minTemps = daily.temperature_2m_min.slice(0, count).map((t) => convertTemp(t, unit));

      return {
        labels,
        datasets: [
          {
            label: `Max Temp (°${unit})`,
            data: maxTemps,
            borderColor: '#f59e0b',
            backgroundColor: (context) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, 260);
              gradient.addColorStop(0, 'rgba(245, 158, 11, 0.35)');
              gradient.addColorStop(1, 'rgba(245, 158, 11, 0.0)');
              return gradient;
            },
            borderWidth: 3,
            fill: true,
            tension: 0.35,
            pointBackgroundColor: '#0f172a',
            pointBorderColor: '#f59e0b',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
          },
          {
            label: `Min Temp (°${unit})`,
            data: minTemps,
            borderColor: '#38bdf8',
            backgroundColor: (context) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, 260);
              gradient.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
              gradient.addColorStop(1, 'rgba(56, 189, 248, 0.0)');
              return gradient;
            },
            borderWidth: 3,
            fill: true,
            tension: 0.35,
            pointBackgroundColor: '#0f172a',
            pointBorderColor: '#38bdf8',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
          },
        ],
      };
    }
  }, [weatherData, viewMode, unit, selectedDayIndex]);

  // Chart Options
  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top',
          align: 'end',
          labels: {
            color: '#94a3b8',
            font: {
              family: 'Plus Jakarta Sans',
              size: 12,
              weight: '500',
            },
            usePointStyle: true,
            boxWidth: 8,
          },
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          titleColor: '#f8fafc',
          bodyColor: '#cbd5e1',
          borderColor: 'rgba(56, 189, 248, 0.3)',
          borderWidth: 1,
          padding: 12,
          boxPadding: 6,
          usePointStyle: true,
          titleFont: {
            family: 'Plus Jakarta Sans',
            weight: '600',
            size: 13,
          },
          bodyFont: {
            family: 'Plus Jakarta Sans',
            size: 12,
          },
          callbacks: {
            label: function (context) {
              const label = context.dataset.label || '';
              const value = context.parsed.y;
              if (label.includes('Temperature') || label.includes('Temp')) {
                return ` ${label}: ${value}°${unit}`;
              }
              if (label.includes('Humidity')) {
                return ` ${label}: ${value}%`;
              }
              return ` ${label}: ${value}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.05)',
            tickLength: 6,
          },
          ticks: {
            color: '#94a3b8',
            font: {
              family: 'Plus Jakarta Sans',
              size: 11,
            },
            maxRotation: 0,
          },
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          grid: {
            color: 'rgba(255, 255, 255, 0.05)',
          },
          ticks: {
            color: '#94a3b8',
            font: {
              family: 'Plus Jakarta Sans',
              size: 11,
            },
            callback: (val) => `${val}°`,
          },
        },
        ...(viewMode === 'hourly'
          ? {
              y1: {
                type: 'linear',
                display: false,
                position: 'right',
                min: 0,
                max: 100,
                grid: {
                  drawOnChartArea: false,
                },
              },
            }
          : {}),
      },
    }),
    [unit, viewMode]
  );

  return (
    <section className="chart-section animate-fade-in">
      <div className="section-header">
        <div className="section-title-wrap">
          <WeatherIcon name="Sparkles" size={20} className="text-cyan" />
          <h3 className="section-title">Weather Analytics & Trends</h3>
        </div>

        {/* View Mode Toggle: Hourly vs 5-Day */}
        <div className="chart-toggle-group">
          <button
            type="button"
            className={`chart-toggle-btn ${viewMode === 'hourly' ? 'active' : ''}`}
            onClick={() => setViewMode('hourly')}
          >
            24-Hour Forecast
          </button>
          <button
            type="button"
            className={`chart-toggle-btn ${viewMode === 'daily' ? 'active' : ''}`}
            onClick={() => setViewMode('daily')}
          >
            5-Day Trend
          </button>
        </div>
      </div>

      <div className="chart-container">
        {chartData ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <div className="chart-loading-placeholder">Loading chart analytics...</div>
        )}
      </div>
    </section>
  );
}
