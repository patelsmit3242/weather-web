const backgroundMap = {
  Clear: "https://i.imgur.com/J5LVHEL.jpg",
  Clouds: "https://i.imgur.com/QdE0qN4.jpg",
  Rain: "https://i.imgur.com/QhXvCqP.jpg",
  Snow: "https://i.imgur.com/4TzXoDL.jpg",
  Thunderstorm: "https://i.imgur.com/8b8V2Ug.jpg",
  Drizzle: "https://i.imgur.com/hpV4N99.jpg",
  Mist: "https://i.imgur.com/z2Pqs3D.jpg",
  Smoke: "https://i.imgur.com/z2Pqs3D.jpg",
  Haze: "https://i.imgur.com/z2Pqs3D.jpg",
  Dust: "https://i.imgur.com/z2Pqs3D.jpg",
  Fog: "https://i.imgur.com/z2Pqs3D.jpg",
};

async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const apiKey = "b47994e4b88203d3010164db82b9c8cb"; // Replace with your OpenWeatherMap API key
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  const resultDiv = document.getElementById("result");
  const forecastDiv = document.getElementById("forecast");
  const errorDiv = document.getElementById("error");
  resultDiv.innerHTML = "";
  forecastDiv.innerHTML = "";
  errorDiv.innerHTML = "";

  try {
    // Get current weather
    const weatherRes = await fetch(currentWeatherUrl);
    const weatherData = await weatherRes.json();

    if (weatherData.cod !== 200) {
      errorDiv.textContent = weatherData.message;
      return;
    }

    const iconUrl = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;

    resultDiv.innerHTML = `
      <h2>${weatherData.name}, ${weatherData.sys.country}</h2>
      <img src="${iconUrl}" alt="icon" />
      <p><strong>${weatherData.weather[0].main}</strong>: ${weatherData.weather[0].description}</p>
      <p>🌡 Temp: ${weatherData.main.temp}°C</p>
      <p>💧 Humidity: ${weatherData.main.humidity}%</p>
      <p>🌬 Wind: ${weatherData.wind.speed} m/s</p>
    `;

    // Change background
    const condition = weatherData.weather[0].main;
    document.body.style.backgroundImage = `url('${backgroundMap[condition] || backgroundMap['Clear']}')`;

    // Get 5-day forecast
    const forecastRes = await fetch(forecastUrl);
    const forecastData = await forecastRes.json();

    // Collect first forecast of each day
    const dailyForecast = {};
    forecastData.list.forEach(entry => {
      const date = entry.dt_txt.split(" ")[0];
      if (!dailyForecast[date]) {
        dailyForecast[date] = entry;
      }
    });

    forecastDiv.innerHTML = "<h3>📅 5-Day Forecast</h3>";
    Object.keys(dailyForecast).slice(0, 5).forEach(date => {
      const f = dailyForecast[date];
      const icon = `https://openweathermap.org/img/wn/${f.weather[0].icon}.png`;
      forecastDiv.innerHTML += `
        <div class="forecast-day">
          <p>${new Date(date).toDateString().slice(0, 10)}</p>
          <img src="${icon}" alt="icon">
          <p>${f.main.temp.toFixed(0)}°C</p>
          <p>${f.weather[0].main}</p>
        </div>
      `;
    });

  } catch (error) {
    errorDiv.textContent = "Error fetching weather data.";
    console.error(error);
  }
}

// Attach event listener after DOM loads
document.getElementById("getWeatherBtn").addEventListener("click", getWeather);
