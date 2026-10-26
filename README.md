# 🌤️ SkyCast — 5-Day Weather Forecast & Analytics

> **A college team project built using HTML5, CSS3, Modern JavaScript, React (Vite), and Chart.js.**  
> Designed for clean collaboration, zero-configuration grading, and instant GitHub deployment.

[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.x-ff6384?logo=chartdotjs&logoColor=white)](https://www.chartjs.org/)
[![API](https://img.shields.io/badge/API-Open--Meteo-38bdf8)](https://open-meteo.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📌 Project Overview

**SkyCast** is an atmospheric weather forecasting web application engineered for college project submission. It provides real-time weather observation, an interactive **5-day forecast**, dynamic **weather analytics curves** powered by Chart.js, seamless **Celsius (°C) to Fahrenheit (°F)** conversion, and intelligent city search with geolocation support.

### 🌟 Why This Architecture?
- **Zero API Key Friction:** Uses the public **Open-Meteo REST API** and Geocoding service. It requires **no private API keys** or `.env` secrets, ensuring the repository works immediately out of the box when cloned by professors or team members.
- **Team-Oriented Architecture:** Designed modularly so each of the 3 team members has clear ownership of specific modules for git commit history and oral viva defense.

---

## 🚀 Key Features

1. **Real-Time Weather Metrics:**
   - Live temperature, condition icon, and "feels like" index.
   - Atmospheric indicators: Relative Humidity (%), Wind Speed & Direction, Barometric Surface Pressure (hPa), Rain Probability (%), and Sunrise / Sunset timestamps.

2. **5-Day Weather Forecast:**
   - Day-by-day forecast cards featuring WMO weather condition icons.
   - Proportional visual temperature range bars showing daily Highs and Lows.
   - Interactive day selection to drill down into hourly curves.

3. **Interactive Weather Analytics Graph:**
   - Powered by `Chart.js` & `react-chartjs-2`.
   - Dual-view toggle:
     - **24-Hour Forecast:** Hourly temperature curve with glowing gradients and humidity trendlines.
     - **5-Day Trend:** High vs. Low temperature comparative curve.
   - Custom tooltips displaying converted temperatures in real time.

4. **Temperature Unit Switcher:**
   - Instant toggle between **Celsius (°C)** and **Fahrenheit (°F)** with state synchronized across cards, metrics, and chart axes.
   - Automatically persisted in `localStorage`.

5. **Smart City Search & Geolocation:**
   - Debounced search bar with autocomplete suggestions across global cities.
   - Quick-select chips for popular metropolitan cities (London, New York, Tokyo, Paris, New Delhi, Sydney).
   - "My Location" button with browser geolocation fallback.

6. **Glassmorphic UI Design:**
   - Deep atmospheric dark theme (`#0a0f1d`) with vibrant cyan and amber accents.
   - Smooth micro-interactions, responsive grid layout for mobile, tablet, and desktop screens.

---

## 👥 College Team Work Breakdown (3 Students)

This project was built collaboratively by a team of 3 members. Each member took ownership of distinct architectural components:

| Team Member | Role & Focus Area | Key Contributions & Files |
| :--- | :--- | :--- |
| **Member 1** | **UI Architecture & State Management** | • Glassmorphic design tokens & responsive CSS in [`src/App.css`](./src/App.css)<br>• Header navigation & unit switcher in [`src/components/Navbar.jsx`](./src/components/Navbar.jsx)<br>• City search & autocomplete dropdown in [`src/components/SearchBar.jsx`](./src/components/SearchBar.jsx)<br>• Geolocation handler & active city state |
| **Member 2** | **Weather API Integration & Forecast Processing** | • Open-Meteo REST API integration in [`src/services/weatherService.js`](./src/services/weatherService.js)<br>• WMO condition mapper & weather code dictionary<br>• Hero weather card & atmospheric grid in [`src/components/CurrentWeather.jsx`](./src/components/CurrentWeather.jsx)<br>• 5-Day forecast cards with temp bars in [`src/components/Forecast5Day.jsx`](./src/components/Forecast5Day.jsx) |
| **Member 3** | **Data Visualizations & Documentation** | • Interactive temperature trend graphs with Chart.js in [`src/components/WeatherChart.jsx`](./src/components/WeatherChart.jsx)<br>• Dual-mode view (24-Hour hourly curve vs 5-Day min/max)<br>• Unit conversion math helper (°C / °F)<br>• Team credits modal in [`src/components/TeamModal.jsx`](./src/components/TeamModal.jsx), README, & GitHub QA testing |

---

## 📁 Project Directory Structure

```text
Demo2/
├── public/                 # Static assets
├── src/
│   ├── components/         # Modular React components
│   │   ├── CurrentWeather.jsx  # Hero weather card & atmospheric metrics
│   │   ├── Forecast5Day.jsx    # 5-day forecast cards & visual temp bars
│   │   ├── Navbar.jsx          # Header, unit switcher (°C/°F), geolocation
│   │   ├── SearchBar.jsx       # City search, autocomplete & popular chips
│   │   ├── TeamModal.jsx       # Project team roles & presentation modal
│   │   ├── WeatherChart.jsx    # Chart.js temperature curve visualization
│   │   └── WeatherIcon.jsx     # Dynamic weather iconography
│   ├── services/
│   │   └── weatherService.js   # Open-Meteo API, Geocoding & unit math
│   ├── App.css             # Component-level styling & glassmorphic system
│   ├── App.jsx             # Main application container & state coordination
│   ├── index.css           # Global resets, color tokens & typography
│   └── main.jsx            # React root mount
├── index.html              # HTML entry point with Google Fonts
├── package.json            # Project dependencies & scripts
├── vite.config.js          # Vite build configuration
└── README.md               # Complete project documentation
```

---

## 🛠️ Getting Started (Local Development)

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (comes bundled with Node.js)

### 2. Installation
Clone the repository and install the dependencies:

```bash
# Clone the repository
git clone https://github.com/your-username/skycast-weather-app.git

# Navigate into the project directory
cd skycast-weather-app

# Install dependencies
npm install
```

### 3. Run Locally
Start the local Vite development server:

```bash
npm run dev
```

Open your browser and navigate to **`http://localhost:5173`** (or the port shown in your terminal).

### 4. Build for Production
To create an optimized production build for deployment:

```bash
npm run build
```

The output will be generated inside the `dist/` directory, ready to be hosted on **GitHub Pages**, **Vercel**, or **Netlify**.

---

## 🌐 Deploying to GitHub Pages or Vercel

### Deploying to Vercel (Recommended):
1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Keep default settings (`Build Command: npm run build`, `Output Directory: dist`).
5. Click **Deploy** — your project will be live in 30 seconds!

---

## 📝 Technologies Used
- **HTML5 & CSS3:** Semantic markup, CSS Custom Properties, Flexbox, CSS Grid, Glassmorphism.
- **JavaScript (ES6+):** Async/Await, Fetch API, Array transformations, LocalStorage.
- **React (v19):** Functional components, Hooks (`useState`, `useEffect`, `useCallback`, `useMemo`, `useRef`).
- **Chart.js & React-Chartjs-2:** High-performance canvas-based curves and responsive tooltips.
- **Lucide React:** Clean modern icons for weather conditions and UI elements.
- **Open-Meteo API:** High-resolution meteorological and geocoding data without requiring API keys.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
