const API_KEY = 'e846361ea59688d5d076388ff10a1de7';
const weatherForm = document.getElementById('weatherForm');
const cityInput = document.getElementById('cityInput');
const weatherContainer = document.getElementById('weatherContainer');
const cityName = document.getElementById('cityName');
const weatherIcon = document.getElementById('weatherIcon');
const temperature = document.getElementById('temperature');
const status = document.getElementById('status');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const errorMessage = document.getElementById('errorMessage');
const bgEffects = document.getElementById('weatherBgEffects');
const body = document.body;

function clearWeatherBackgrounds() {
    bgEffects.innerHTML = '';
    body.classList.remove('sun-bg', 'cloud-bg', 'rain-bg', 'snow-bg');
    body.style.background = '';
}

function setWeatherBackground(main) {
    clearWeatherBackgrounds();

    if (main === "Clear") {
        body.classList.add('sun-bg');
        const svg = `<svg class="sun-rays" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      <circle cx="60" cy="60" r="38" fill="#ffd94a"/>
      <g>
      ${Array.from({length: 12}).map((_, i) => 
        ` < rect x = "58"
        y = "0"
        width = "4"
        height = "28"
        fill = "#ffb200"
        transform = "rotate(${i * 30} 60 60)" / > `
      ).join('')}
      </g>
    </svg>`;
        bgEffects.innerHTML = svg;

    } else if (main === "Clouds" || main === "Mist" || main === "Fog" || main === "Haze") {
        body.classList.add('cloud-bg');
        for (let i = 0; i < 4; i++) {
            const size = 110 + Math.random() * 70;
            const top = 8 + Math.random() * 55;
            bgEffects.innerHTML += `<div class="cloud"
        style="
          top:${top}vh;
          left:${-20 + Math.random() * 90}vw;
          width:${size}px;
          height:${size * 0.55}px;
          animation-duration:${26 + Math.random() * 32}s;
          opacity:${0.2 + Math.random() * 0.18};
        "></div>`;
        }

    } else if (main === "Rain" || main === "Drizzle" || main === "Thunderstorm") {
        body.classList.add('rain-bg');
        for (let i = 0; i < 32; i++) {
            bgEffects.innerHTML += `<div class="rain-drop"
        style="
          left:${Math.random() * 100}vw;
          height:${15 + Math.random() * 28}px;
          animation-delay:${(Math.random() * 1.1).toFixed(2)}s;
          animation-duration:${(0.67 + Math.random() * 0.6).toFixed(2)}s;
          opacity:${0.21 + Math.random() * 0.79};
        "></div>`;
        }

    } else if (main === "Snow") {
        body.classList.add('snow-bg');
        for (let i = 0; i < 28; i++) {
            bgEffects.innerHTML += `<span class="snow-flake"
        style="
          left:${(2 + Math.random() * 96).toFixed(2)}vw;
          font-size:${(1 + Math.random() * 1.4).toFixed(2)}rem;
          animation-delay:${(Math.random() * 2.8).toFixed(2)}s;
          animation-duration:${(2.6 + Math.random() * 2.5).toFixed(2)}s;
          opacity:${0.2 + Math.random() * 0.8};
        ">❄</span>`;
        }
    } else {
        body.style.background = "linear-gradient(135deg, #e0e7ff 0%, #f7fafc 100%)";
    }
}
async function fetchWeather(city) {
    errorMessage.classList.add('hidden');
    weatherContainer.classList.add('hidden');
    clearWeatherBackgrounds();

    try {
        const resp = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
        );
        if (!resp.ok) {
            if (resp.status === 404) throw new Error("City not found.");
            throw new Error("Failed to fetch weather.");
        }
        const data = await resp.json();
        setWeatherBackground(data.weather[0].main);
        cityName.textContent = `${data.name}, ${data.sys.country}`;
        weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        weatherIcon.alt = data.weather[0].description || data.weather[0].main;
        temperature.textContent = `${Math.round(data.main.temp)}°C`;
        status.textContent = data.weather[0].description || data.weather[0].main;
        humidity.textContent = `Humidity: ${data.main.humidity}%`;
        wind.textContent = `Wind: ${data.wind.speed} m/s`;

        weatherContainer.classList.remove('hidden');

    } catch (err) {
        errorMessage.textContent = err.message;
        errorMessage.classList.remove('hidden');
        clearWeatherBackgrounds();
    }
}
weatherForm.addEventListener('submit', e => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (!city) {
        errorMessage.textContent = "Please enter a city name.";
        errorMessage.classList.remove('hidden');
        return;
    }
    fetchWeather(city);
});

window.addEventListener('DOMContentLoaded', () => {
    fetchWeather('Hyderabad');
});