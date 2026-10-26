import React from 'react';
import WeatherIcon from './WeatherIcon';
import { convertTemp } from '../services/weatherService';

/**
 * ClothingAdvisor Component
 * Intelligent lifestyle & weather recommendations:
 * Analyzes real-time temperature, precipitation, snow, and wind to advise what to wear and what gear to carry.
 */
export default function ClothingAdvisor({ weatherData, unit }) {
  if (!weatherData || !weatherData.current) return null;

  const current = weatherData.current;
  const daily = weatherData.daily;
  const tempC = current.temperature_2m;
  const weatherCode = current.weather_code;
  const windKmh = current.wind_speed_10m || 0;
  const rainChance = daily?.precipitation_probability_max?.[0] ?? (current.precipitation > 0 ? 80 : 0);
  const feelsLike = convertTemp(current.apparent_temperature, unit);

  // Weather categories
  const isRain =
    (weatherCode >= 51 && weatherCode <= 67) ||
    (weatherCode >= 80 && weatherCode <= 82) ||
    current.precipitation > 0.5 ||
    rainChance >= 45;

  const isThunderstorm = weatherCode >= 95 && weatherCode <= 99;
  const isSnow = (weatherCode >= 71 && weatherCode <= 77) || (weatherCode >= 85 && weatherCode <= 86) || weatherCode === 56 || weatherCode === 57;
  const isVeryCold = tempC <= 5;
  const isChilly = tempC > 5 && tempC <= 15;
  const isMild = tempC > 15 && tempC <= 23;
  const isHot = tempC > 23;
  const isWindy = windKmh >= 24;

  // Determine Primary Alert and Status
  let alertTitle = 'Pleasant & Mild Weather';
  let alertBadge = 'Comfortable';
  let badgeColor = 'var(--accent-emerald)';
  let alertIcon = 'Sun';

  if (isThunderstorm) {
    alertTitle = 'Thunderstorm Alert: Heavy Rain & Lightning';
    alertBadge = 'Severe Weather';
    badgeColor = 'var(--accent-rose)';
    alertIcon = 'AlertTriangle';
  } else if (isSnow) {
    alertTitle = 'Snowfall & Freezing Conditions';
    alertBadge = 'Winter Advisory';
    badgeColor = '#93c5fd';
    alertIcon = 'Snowflake';
  } else if (isRain) {
    alertTitle = 'Rainy Conditions: Precipitation Likely';
    alertBadge = 'Rain Gear Needed';
    badgeColor = 'var(--accent-cyan)';
    alertIcon = 'Umbrella';
  } else if (isVeryCold) {
    alertTitle = 'Freezing Temperatures: Frost Risk';
    alertBadge = 'Cold Advisory';
    badgeColor = '#a5b4fc';
    alertIcon = 'CloudSnow';
  } else if (isHot) {
    alertTitle = 'Warm & Sunny Weather';
    alertBadge = 'Summer Conditions';
    badgeColor = 'var(--accent-amber)';
    alertIcon = 'Sun';
  } else if (isWindy) {
    alertTitle = 'High Wind Gusts';
    alertBadge = 'Windy Conditions';
    badgeColor = '#38bdf8';
    alertIcon = 'Wind';
  }

  // Determine Clothing Recommendations
  const clothingItems = [];
  if (isSnow || isVeryCold) {
    clothingItems.push('Heavy down parka, puffer coat, or thermal winter jacket');
    clothingItems.push('Thermal innerwear / base layer with fleece pullover');
    clothingItems.push('Thick woolen or fleece-lined trousers');
  } else if (isRain) {
    clothingItems.push('Waterproof raincoat, rain poncho, or water-resistant trench');
    clothingItems.push('Quick-dry pants or durable denim (avoid absorbent cotton bottoms)');
    clothingItems.push('Comfortable breathable sweater or hoodie for layering');
  } else if (isChilly) {
    clothingItems.push('Medium-weight jacket, bomber jacket, or knit cardigan');
    clothingItems.push('Long-sleeve cotton shirt or thermal top');
    clothingItems.push('Jeans or chinos');
  } else if (isMild) {
    clothingItems.push('Casual light shirt, t-shirt, or stylish overshirt');
    clothingItems.push('Comfortable jeans, chinos, or relaxed trousers');
  } else {
    // Hot
    clothingItems.push('Lightweight, loose-fitting cotton or linen t-shirt');
    clothingItems.push('Breathable shorts, linen trousers, or light skirts');
  }

  if (isWindy && !isSnow && !isRain) {
    clothingItems.push('Windbreaker jacket to deflect chilly gusts');
  }

  // Determine Gear & Accessories to Carry
  const gearItems = [];
  if (isRain || isThunderstorm) {
    gearItems.push({
      name: 'Umbrella',
      icon: 'Umbrella',
      status: 'MUST CARRY',
      color: 'var(--accent-cyan)',
      detail: 'Sturdy windproof umbrella strongly recommended before leaving home.',
    });
    gearItems.push({
      name: 'Raincoat / Poncho',
      icon: 'ShieldAlert',
      status: 'RECOMMENDED',
      color: 'var(--accent-cyan)',
      detail: 'Wear a water-repellent jacket or carry a compact folded poncho.',
    });
    gearItems.push({
      name: 'Waterproof Footwear',
      icon: 'CheckCircle2',
      status: 'ADVISED',
      color: '#94a3b8',
      detail: 'Water-resistant boots or waterproof shoes to navigate puddles.',
    });
  } else if (isSnow) {
    gearItems.push({
      name: 'Insulated Winter Boots',
      icon: 'CheckCircle2',
      status: 'MUST WEAR',
      color: '#93c5fd',
      detail: 'Non-slip boots with deep tread to prevent slipping on snow and ice.',
    });
    gearItems.push({
      name: 'Warm Beanie & Gloves',
      icon: 'ShieldAlert',
      status: 'ESSENTIAL',
      color: '#93c5fd',
      detail: 'Insulated waterproof gloves and a woolen beanie to protect extremities.',
    });
    gearItems.push({
      name: 'Thermal Scarf',
      icon: 'CheckCircle2',
      status: 'RECOMMENDED',
      color: '#cbd5e1',
      detail: 'Cover neck and face against biting freezing winds.',
    });
  } else if (isHot) {
    gearItems.push({
      name: 'UV Sunglasses',
      icon: 'Glasses',
      status: 'RECOMMENDED',
      color: 'var(--accent-amber)',
      detail: 'UV400 protective sunglasses for eye protection in bright sunlight.',
    });
    gearItems.push({
      name: 'Sunscreen & Hydration',
      icon: 'Sun',
      status: 'HEALTH TIP',
      color: 'var(--accent-amber)',
      detail: 'Apply SPF 30+ sunscreen and carry a reusable water bottle.',
    });
  } else {
    // Mild / Chilly
    gearItems.push({
      name: 'Light Umbrella',
      icon: 'Umbrella',
      status: rainChance > 25 ? 'KEEP IN BAG' : 'NOT NEEDED',
      color: rainChance > 25 ? 'var(--accent-cyan)' : '#64748b',
      detail: rainChance > 25 ? `${rainChance}% chance of rain. Keep a compact umbrella handy.` : 'Skies look clear for rain.',
    });
  }

  return (
    <section className="clothing-section animate-fade-in">
      <div className="section-header">
        <div className="section-title-wrap">
          <WeatherIcon name="Shirt" size={20} className="text-cyan" />
          <h3 className="section-title">What to Wear & Carry Today</h3>
        </div>
        <span
          className="advisor-badge"
          style={{
            backgroundColor: `${badgeColor}20`,
            color: badgeColor,
            borderColor: `${badgeColor}40`,
          }}
        >
          {alertBadge}
        </span>
      </div>

      <div className="advisor-main-card">
        {/* Banner */}
        <div className="advisor-banner">
          <div className="advisor-banner-icon">
            <WeatherIcon name={alertIcon} size={28} color={badgeColor} />
          </div>
          <div className="advisor-banner-content">
            <h4 className="advisor-banner-title">{alertTitle}</h4>
            <p className="advisor-banner-desc">
              Currently feels like <strong>{feelsLike}°{unit}</strong> with {current.relative_humidity_2m}% humidity
              {isWindy ? ` and brisk winds of ${Math.round(windKmh)} km/h` : ''}.
              {rainChance > 0 ? ` Precipitation probability is ${rainChance}%.` : ''}
            </p>
          </div>
        </div>

        <div className="advisor-columns">
          {/* Column 1: Clothing Recommendations */}
          <div className="advisor-col">
            <div className="advisor-col-header">
              <WeatherIcon name="Shirt" size={17} className="text-cyan" />
              <h5 className="advisor-col-title">Recommended Outfits</h5>
            </div>
            <ul className="advisor-list">
              {clothingItems.map((item, idx) => (
                <li key={idx} className="advisor-list-item">
                  <WeatherIcon name="CheckCircle2" size={15} className="text-cyan" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Essential Gear & Carry Items */}
          <div className="advisor-col">
            <div className="advisor-col-header">
              <WeatherIcon name="Umbrella" size={17} className="text-amber" />
              <h5 className="advisor-col-title">Gear & Items to Carry</h5>
            </div>
            <div className="gear-cards-list">
              {gearItems.map((gear, idx) => (
                <div key={idx} className="gear-card">
                  <div className="gear-card-top">
                    <div className="gear-card-title-wrap">
                      <WeatherIcon name={gear.icon} size={16} color={gear.color} />
                      <span className="gear-name">{gear.name}</span>
                    </div>
                    <span
                      className="gear-status-tag"
                      style={{ color: gear.color, borderColor: `${gear.color}40`, background: `${gear.color}15` }}
                    >
                      {gear.status}
                    </span>
                  </div>
                  <p className="gear-detail">{gear.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
