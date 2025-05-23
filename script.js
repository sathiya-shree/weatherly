const defaultCities = ['Paris', 'London', 'Mumbai', 'Coimbatore'];
const maxUserCities = 4;
let userCities = [];

function getWeatherIcon(main) {
  const weatherMap = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Smoke: '🌫️',
    Haze: '🌫️',
    Dust: '🌫️',
    Fog: '🌫️',
    Sand: '🌫️',
    Ash: '🌋',
    Squall: '🌬️',
    Tornado: '🌪️',
  };
  return weatherMap[main] || '🌈';
}

async function getWeather(city) {
  const url = `/.netlify/functions/weather?city=${encodeURIComponent(city)}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error fetching weather');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return { error: error.message, city };
  }
}

function createWeatherCard(data) {
  const card = document.createElement('div');
  card.className = 'weather-card';

  if (data.error) {
    card.innerHTML = `<h2>${data.city || 'Unknown city'}</h2><p class="error-message">${data.error}</p>`;
  } else {
    const icon = getWeatherIcon(data.weather[0].main);
    card.innerHTML = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <div class="weather-icon">${icon}</div>
      <p>Temperature: ${data.main.temp} °C</p>
      <p>Weather: ${data.weather[0].main}</p>
      <p>Humidity: ${data.main.humidity}%</p>
    `;
  }
  return card;
}

async function loadDefaultCitiesWeather() {
  const container = document.getElementById('defaultWeather');
  container.innerHTML = '';

  for (const city of defaultCities) {
    const data = await getWeather(city);
    container.appendChild(createWeatherCard(data));
  }
}

async function addUserCity(city) {
  const userWeatherContainer = document.getElementById('userWeather');

  if (!city) {
    alert('Please enter a city name');
    return;
  }

  if (userCities.length >= maxUserCities) {
    alert(`You can add up to ${maxUserCities} cities.`);
    return;
  }

  // Avoid duplicates (case insensitive)
  if (
    userCities.some(c => c.toLowerCase() === city.toLowerCase()) ||
    defaultCities.some(c => c.toLowerCase() === city.toLowerCase())
  ) {
    alert('City already displayed!');
    return;
  }

  userCities.push(city);

  const data = await getWeather(city);
  userWeatherContainer.appendChild(createWeatherCard(data));
}

window.onload = () => {
  loadDefaultCitiesWeather();

  const cityInput = document.getElementById('cityInput');
  cityInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      const city = cityInput.value.trim();
      if (city) {
        addUserCity(city);
        cityInput.value = '';
      }
    }
  });
};
