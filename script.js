const defaultCities = ['Paris', 'London', 'Mumbai', 'Coimbatore'];
const defaultCitiesContainer = document.getElementById('defaultCities');
const searchedCityWeather = document.getElementById('searchedCityWeather');

function weatherToEmoji(main) {
  const map = {
    Clear: '🌞',
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
  return map[main] || '🌈';
}

async function fetchCityWeather(city) {
  const apiKey = 'YOUR_OPENWEATHER_API_KEY'; // replace this
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('City not found');
  const data = await res.json();
  return {
    name: data.name,
    country: data.sys.country,
    temp: data.main.temp,
    weather: data.weather[0].main,
    humidity: data.main.humidity,
    emoji: weatherToEmoji(data.weather[0].main),
  };
}

function createCityCard(city) {
  return `
    <div class="city-card">
      <div class="city-name">${city.name}, ${city.country}</div>
      <div class="weather-emoji">${city.emoji}</div>
      <div class="weather-info">
        🌡 Temperature: ${city.temp.toFixed(1)} °C<br />
        🌥 Weather: ${city.weather}<br />
        💧 Humidity: ${city.humidity}%
      </div>
    </div>
  `;
}

async function displayDefaultCities() {
  defaultCitiesContainer.innerHTML = 'Loading...';
  try {
    const promises = defaultCities.map(city => fetchCityWeather(city));
    const results = await Promise.all(promises);
    defaultCitiesContainer.innerHTML = results.map(createCityCard).join('');
  } catch {
    defaultCitiesContainer.innerHTML = 'Failed to load default cities weather.';
  }
}

async function showSearchedCityWeather() {
  const city = document.getElementById('cityInput').value.trim();
  if (!city) {
    searchedCityWeather.innerHTML = `<p>Please enter a city name.</p>`;
    return;
  }
  searchedCityWeather.innerHTML = `<p>Loading...</p>`;
  try {
    const data = await fetchCityWeather(city);
    searchedCityWeather.innerHTML = `
      <h2>${data.name}, ${data.country}</h2>
      <div class="weather-emoji">${data.emoji}</div>
      <div class="weather-info">
        🌡 Temperature: ${data.temp.toFixed(1)} °C<br />
        🌥 Weather: ${data.weather}<br />
        💧 Humidity: ${data.humidity}%
      </div>
    `;
  } catch (e) {
    searchedCityWeather.innerHTML = `<p style="color:#c00;">${e.message}</p>`;
  }
}

document.getElementById('getWeatherBtn').addEventListener('click', showSearchedCityWeather);
document.getElementById('cityInput').addEventListener('keypress', e => {
  if (e.key === 'Enter') showSearchedCityWeather();
});

displayDefaultCities();
