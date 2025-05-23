const form = document.getElementById("cityForm");
const cityInput = document.getElementById("cityInput");
const weatherInfo = document.getElementById("weatherInfo");
const errorMsg = document.getElementById("errorMsg");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (!city) {
    errorMsg.textContent = "Please enter a city name.";
    weatherInfo.innerHTML = "";
    return;
  }

  errorMsg.textContent = "";
  weatherInfo.innerHTML = "Loading...";

  try {
    // Call the Netlify function
    const response = await fetch(`/.netlify/functions/getWeather?city=${encodeURIComponent(city)}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Unable to fetch weather data.");
    }

    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    weatherInfo.innerHTML = "";
    errorMsg.textContent = error.message;
  }
});

function displayWeather(data) {
  const { name, sys, weather, main, wind } = data;
  weatherInfo.innerHTML = `
    <h2>${name}, ${sys.country}</h2>
    <p><strong>${weather[0].main}</strong> - ${weather[0].description}</p>
    <p>Temperature: ${main.temp.toFixed(1)} °C</p>
    <p>Feels like: ${main.feels_like.toFixed(1)} °C</p>
    <p>Humidity: ${main.humidity}%</p>
    <p>Wind speed: ${wind.speed} m/s</p>
  `;
}
