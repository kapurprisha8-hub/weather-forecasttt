import React, { useEffect } from 'react';
import WeatherIcon from './WeatherIcon';

/**
 * TeamModal Component (Team Member 3 Contribution)
 * Displays project overview, college team roles, and GitHub contribution summary for 3 members.
 */
export default function TeamModal({ isOpen, onClose }) {
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

  if (!isOpen) return null;

  const teamMembers = [
    {
      roleNumber: 'Member 1',
      title: 'UI Design & Core State Management',
      badgeColor: '#38bdf8',
      responsibilities: [
        'Designed overall glassmorphic UI layout and responsive structure',
        'Implemented Navbar, brand identity, and theme tokens',
        'Built dynamic SearchBar with debounced city autocomplete and popular quick chips',
        'Managed application-wide React state (active city, search history, geolocation)',
      ],
    },
    {
      roleNumber: 'Member 2',
      title: 'Weather API Integration & Forecast Processing',
      badgeColor: '#10b981',
      responsibilities: [
        'Integrated Open-Meteo REST API (zero-key public endpoint for seamless grading)',
        'Built WMO Weather Interpretation Code mapper for accurate weather conditions',
        'Constructed CurrentWeather hero card with live atmospheric metrics',
        'Implemented 5-Day Forecast grid with visual temperature range indicators',
      ],
    },
    {
      roleNumber: 'Member 3',
      title: 'Interactive Visualizations & Documentation',
      badgeColor: '#f59e0b',
      responsibilities: [
        'Developed interactive temperature analytics graph using Chart.js',
        'Implemented dual-view mode: 24-Hour Hourly Forecast vs 5-Day Trends',
        'Engineered Celsius (°C) to Fahrenheit (°F) conversion system',
        'Prepared production-grade README.md, GitHub repository setup, and QA testing',
      ],
    },
  ];

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <WeatherIcon name="Users" size={24} className="text-cyan" />
            <div>
              <h3 className="modal-title">College Project Team Overview</h3>
              <p className="modal-subtitle">SkyCast — 3-Student Collaborative Project</p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <WeatherIcon name="X" size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="team-grid">
            {teamMembers.map((member) => (
              <div key={member.roleNumber} className="team-member-card">
                <div className="member-header">
                  <span
                    className="member-badge"
                    style={{ backgroundColor: `${member.badgeColor}20`, color: member.badgeColor, borderColor: `${member.badgeColor}40` }}
                  >
                    {member.roleNumber}
                  </span>
                  <h4 className="member-title">{member.title}</h4>
                </div>
                <ul className="member-tasks-list">
                  {member.responsibilities.map((task, idx) => (
                    <li key={idx} className="member-task-item">
                      <WeatherIcon name="Check" size={14} className="text-cyan" />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="project-meta-box">
            <div className="meta-item">
              <span className="meta-label">Architecture:</span>
              <span className="meta-val">Vite + React (Hooks & Modern ES6+)</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">API:</span>
              <span className="meta-val">Open-Meteo & Geocoding (Zero API Key needed)</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Charts:</span>
              <span className="meta-val">Chart.js + react-chartjs-2</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Deployment:</span>
              <span className="meta-val">Ready for GitHub Pages / Vercel / Netlify</span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-primary" onClick={onClose}>
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
}
