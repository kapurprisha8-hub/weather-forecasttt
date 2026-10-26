/**
 * SkyCast Weather Service
 * Handles data fetching from Open-Meteo Geocoding & Forecast APIs (100% Free, No API key needed)
 * Includes WMO weather condition code mapping and temperature conversion helpers.
 */

// WMO Weather Interpretation Codes (WW)
export const WEATHER_CODES = {
  0: { label: 'Clear Sky', icon: 'Sun', dayColor: '#f59e0b', nightColor: '#93c5fd' },
  1: { label: 'Mainly Clear', icon: 'SunMedium', dayColor: '#fbbf24', nightColor: '#93c5fd' },
  2: { label: 'Partly Cloudy', icon: 'CloudSun', dayColor: '#60a5fa', nightColor: '#64748b' },
  3: { label: 'Overcast', icon: 'Cloud', dayColor: '#94a3b8', nightColor: '#64748b' },
  45: { label: 'Foggy', icon: 'CloudFog', dayColor: '#cbd5e1', nightColor: '#64748b' },
  48: { label: 'Depositing Rime Fog', icon: 'CloudFog', dayColor: '#cbd5e1', nightColor: '#64748b' },
  51: { label: 'Light Drizzle', icon: 'CloudDrizzle', dayColor: '#38bdf8', nightColor: '#38bdf8' },
  53: { label: 'Moderate Drizzle', icon: 'CloudDrizzle', dayColor: '#0284c7', nightColor: '#0284c7' },
  55: { label: 'Dense Drizzle', icon: 'CloudDrizzle', dayColor: '#0369a1', nightColor: '#0369a1' },
  56: { label: 'Freezing Drizzle', icon: 'CloudSnow', dayColor: '#93c5fd', nightColor: '#93c5fd' },
  57: { label: 'Dense Freezing Drizzle', icon: 'CloudSnow', dayColor: '#93c5fd', nightColor: '#93c5fd' },
  61: { label: 'Slight Rain', icon: 'CloudRain', dayColor: '#38bdf8', nightColor: '#38bdf8' },
  63: { label: 'Moderate Rain', icon: 'CloudRain', dayColor: '#2563eb', nightColor: '#2563eb' },
  65: { label: 'Heavy Rain', icon: 'CloudRain', dayColor: '#1d4ed8', nightColor: '#1d4ed8' },
  66: { label: 'Freezing Rain', icon: 'CloudSnow', dayColor: '#93c5fd', nightColor: '#93c5fd' },
  67: { label: 'Heavy Freezing Rain', icon: 'CloudSnow', dayColor: '#60a5fa', nightColor: '#60a5fa' },
  71: { label: 'Slight Snowfall', icon: 'Snowflake', dayColor: '#e0e7ff', nightColor: '#e0e7ff' },
  73: { label: 'Moderate Snowfall', icon: 'Snowflake', dayColor: '#c7d2fe', nightColor: '#c7d2fe' },
  75: { label: 'Heavy Snowfall', icon: 'Snowflake', dayColor: '#a5b4fc', nightColor: '#a5b4fc' },
  77: { label: 'Snow Grains', icon: 'Snowflake', dayColor: '#c7d2fe', nightColor: '#c7d2fe' },
  80: { label: 'Slight Rain Showers', icon: 'CloudRain', dayColor: '#38bdf8', nightColor: '#38bdf8' },
  81: { label: 'Moderate Showers', icon: 'CloudRain', dayColor: '#0284c7', nightColor: '#0284c7' },
  82: { label: 'Violent Showers', icon: 'CloudRain', dayColor: '#1e40af', nightColor: '#1e40af' },
  85: { label: 'Slight Snow Showers', icon: 'CloudSnow', dayColor: '#e0e7ff', nightColor: '#e0e7ff' },
  86: { label: 'Heavy Snow Showers', icon: 'CloudSnow', dayColor: '#a5b4fc', nightColor: '#a5b4fc' },
  95: { label: 'Thunderstorm', icon: 'CloudLightning', dayColor: '#8b5cf6', nightColor: '#7c3aed' },
  96: { label: 'Thunderstorm with Slight Hail', icon: 'CloudLightning', dayColor: '#7c3aed', nightColor: '#6d28d9' },
  99: { label: 'Thunderstorm with Heavy Hail', icon: 'CloudLightning', dayColor: '#6d28d9', nightColor: '#5b21b6' },
};

export const getWeatherCondition = (code, isDay = 1) => {
  return WEATHER_CODES[code] || {
    label: 'Partly Cloudy',
    icon: 'CloudSun',
    dayColor: '#60a5fa',
    nightColor: '#64748b',
  };
};

/**
 * Temperature conversion utilities
 */
export const celsiusToFahrenheit = (celsius) => {
  if (celsius === null || celsius === undefined || isNaN(celsius)) return 0;
  return Math.round((celsius * 9) / 5 + 32);
};

export const convertTemp = (celsius, unit = 'C') => {
  if (celsius === null || celsius === undefined || isNaN(celsius)) return 0;
  return unit === 'F' ? celsiusToFahrenheit(celsius) : Math.round(celsius);
};

export const convertSpeed = (kmh, unit = 'C') => {
  if (kmh === null || kmh === undefined || isNaN(kmh)) return '0 km/h';
  if (unit === 'F') {
    return `${Math.round(kmh * 0.621371)} mph`;
  }
  return `${Math.round(kmh)} km/h`;
};

/**
 * Search for matching cities using Open-Meteo Geocoding API
 */
export const searchCities = async (query) => {
  if (!query || query.trim().length < 2) return [];
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      query.trim()
    )}&count=6&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch cities');
    const data = await res.json();
    return (data.results || []).map((city) => ({
      id: `${city.id}`,
      name: city.name,
      admin1: city.admin1 || '',
      country: city.country || '',
      countryCode: city.country_code || '',
      latitude: city.latitude,
      longitude: city.longitude,
      timezone: city.timezone || 'auto',
    }));
  } catch (error) {
    console.error('Error in searchCities:', error);
    return [];
  }
};

/**
 * Reverse geocode latitude & longitude to get a friendly city name
 */
export const reverseGeocode = async (latitude, longitude) => {
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      return {
        name: data.city || data.locality || data.principalSubdivision || 'Your Location',
        country: data.countryName || '',
        admin1: data.principalSubdivision || '',
      };
    }
  } catch (e) {
    console.warn('Reverse geocode fallback used:', e);
  }
  return { name: 'Current Location', country: '', admin1: '' };
};

/**
 * Fetch detailed weather data for given coordinates
 */
export const fetchWeatherData = async (latitude, longitude, timezone = 'auto') => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=${encodeURIComponent(
    timezone
  )}&forecast_days=7`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Unable to fetch forecast data for this location.');
  }

  const data = await res.json();
  return data;
};

/**
 * Default preset cities for quick chips selection
 */
export const POPULAR_CITIES = [
  { name: 'London', country: 'United Kingdom', latitude: 51.5085, longitude: -0.1257, timezone: 'Europe/London' },
  { name: 'New York', country: 'United States', latitude: 40.7143, longitude: -74.006, timezone: 'America/New_York' },
  { name: 'Tokyo', country: 'Japan', latitude: 35.6895, longitude: 139.6917, timezone: 'Asia/Tokyo' },
  { name: 'Paris', country: 'France', latitude: 48.8534, longitude: 2.3488, timezone: 'Europe/Paris' },
  { name: 'New Delhi', country: 'India', latitude: 28.6128, longitude: 77.2311, timezone: 'Asia/Kolkata' },
  { name: 'Sydney', country: 'Australia', latitude: -33.8678, longitude: 151.2073, timezone: 'Australia/Sydney' },
];
