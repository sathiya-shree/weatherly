async function getWeather() {
  const city = document.getElementById("city").value.trim();

  if (!city) {
    document.getElementById("weatherResult").innerHTML = "<p>Please enter a city name</p>";
    return;
  }

  const url = `/.netlify/functions/weather?city=${city}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "City not found");
    }

    const result = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <p>Temperature: ${data.main.temp} °C</p>
      <p>Weather: ${data.weather[0].main}</p>
      <p>Humidity: ${data.main.humidity}%</p>
    `;

    document.getElementById("weatherResult").innerHTML = result;
  } catch (error) {
    document.getElementById("weatherResult").innerHTML = `<p>${error.message}</p>`;
  }
}
