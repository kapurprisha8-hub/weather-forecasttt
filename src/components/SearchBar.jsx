import React, { useState, useEffect, useRef } from 'react';
import WeatherIcon from './WeatherIcon';
import { searchCities, POPULAR_CITIES } from '../services/weatherService';

/**
 * SearchBar Component (Team Member 1 Contribution)
 * Implements city search, geocoding autocompletion, and popular cities quick select.
 */
export default function SearchBar({ onSelectCity, currentCityName }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);

  // Debounced search for city suggestions
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await searchCities(query);
        setSuggestions(results);
        setIsOpen(results.length > 0);
      } catch (err) {
        console.error('Search autocomplete error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener to dismiss suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city) => {
    onSelectCity(city);
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleSelect(suggestions[selectedIndex]);
      } else if (suggestions.length > 0) {
        handleSelect(suggestions[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="search-section" ref={searchRef}>
      <div className="search-input-wrapper">
        <WeatherIcon name="Search" size={18} className="search-icon-left text-cyan" />
        <input
          type="text"
          className="search-input"
          placeholder="Search any city or location (e.g. New York, Tokyo, Berlin)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
        />
        {isLoading && (
          <WeatherIcon name="RefreshCw" size={16} className="search-spinner animate-spin text-cyan" />
        )}
        {query && !isLoading && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={() => {
              setQuery('');
              setSuggestions([]);
              setIsOpen(false);
            }}
          >
            <WeatherIcon name="X" size={16} />
          </button>
        )}

        {/* Autocomplete Dropdown */}
        {isOpen && suggestions.length > 0 && (
          <ul className="search-dropdown animate-fade-in">
            {suggestions.map((item, index) => (
              <li
                key={`${item.id}-${index}`}
                className={`search-dropdown-item ${index === selectedIndex ? 'selected' : ''}`}
                onClick={() => handleSelect(item)}
              >
                <WeatherIcon name="MapPin" size={16} className="text-cyan" />
                <div className="city-info">
                  <span className="city-name">{item.name}</span>
                  <span className="city-meta">
                    {[item.admin1, item.country].filter(Boolean).join(', ')}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Popular Cities Quick Chips */}
      <div className="quick-chips">
        <span className="chips-label">Popular:</span>
        <div className="chips-list">
          {POPULAR_CITIES.map((city) => (
            <button
              key={city.name}
              type="button"
              className={`chip-btn ${currentCityName === city.name ? 'active' : ''}`}
              onClick={() => handleSelect(city)}
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
