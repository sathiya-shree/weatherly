const apiKey = "YOUR_API_KEY_HERE"; // Replace with your OpenWeatherMap API key

const form = document.getElementById("cityForm");
const cityInput = document.getElementById("cityInput");
const weatherInfo = document.getElementById("weatherInfo");
const errorMsg = document.getElementById("errorMsg");

form.addEventListener("submit", e => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city);
  }
});

async function fetchWeather(city) {
  errorMsg.textContent = "";
  weatherInfo.innerHTML = "Loading...";
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("City not found. Please check the city name.");
      } else {
        throw new Error("Failed to fetch weather data.");
      }
    }

    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    weatherInfo.innerHTML = "";
    errorMsg.textContent = error.message;
  }
}

function displayWeather(data) {
  const { name, sys, main, weather, wind } = data;

  const weatherHTML = `
    <h2>${name}, ${sys.country}</h2>
    <p><strong>${weather[0].main}</strong> - ${weather[0].description}</p>
    <p>Temperature: ${main.temp.toFixed(1)} °C</p>
    <p>Feels like: ${main.feels_like.toFixed(1)} °C</p>
    <p>Humidity: ${main.humidity}%</p>
    <p>Wind: ${wind.speed} m/s</p>
  `;
  weatherInfo.innerHTML = weatherHTML;
}
