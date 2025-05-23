const maxCities = 4;
let cityList = [];

function addCity() {
  const cityInput = document.getElementById('cityInput');
  const city = cityInput.value.trim();
  const cityListElem = document.getElementById('cityList');
  const weatherResult = document.getElementById('weatherResult');

  if (!city) {
    alert('Please enter a city name');
    return;
  }

  if (cityList.length >= maxCities) {
    alert(`You can only add up to ${maxCities} cities.`);
    return;
  }

  // Avoid duplicates (case insensitive)
  if (cityList.some(c => c.toLowerCase() === city.toLowerCase())) {
    alert('City already added!');
    return;
  }

  cityList.push(city);
  cityInput.value = '';

  // Update city list UI
  const li = document.createElement('li');
  li.textContent = city;
  cityListElem.appendChild(li);

  // Clear previous results when adding new city
  weatherResult.innerHTML = '';
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
    return { error: error.message };
  }
}

function getWeatherIcon(main) {
  // Simple icon mapping (can be expanded)
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

async function getWeatherForAll() {
  const weatherResult = document.getElementById('weatherResult');
  weatherResult.innerHTML = ''; // clear previous

  if (cityList.length === 0) {
    alert('Add at least one city.');
    return;
  }

  for (const city of cityList) {
    const data = await getWeather(city);
    const card = document.createElement('div');
    card.className = 'weather-card';

    if (data.error) {
      card.innerHTML = `<h2>${city}</h2><p class="error-message">${data.error}</p>`;
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
    weatherResult.appendChild(card);
  }
}
