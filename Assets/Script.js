const apiKey = 'e78a4245646639951350d20d6d2559b3';

document.getElementById('search-btn').addEventListener('click', () => {
    const city = document.getElementById('city-input').value;
    if (city) {
        getWeatherData(city);
        updateSearchHistory(city);
    }
});

function getWeatherData(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
            return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${apiKey}&units=imperial`);
        })
        .then(response => response.json())
        .then(data => {
            displayForecast(data);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function displayCurrentWeather(data) {
    const date = new Date();
    document.getElementById('city-name').textContent = `${data.name} (${date.toLocaleDateString()})`;
    document.getElementById('temp').textContent = `Temp: ${data.main.temp}°F`;
    document.getElementById('wind').textContent = `Wind: ${data.wind.speed} MPH`;
    document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
    const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    document.getElementById('weather-icon').src = iconUrl;
    document.getElementById('weather-icon').alt = data.weather[0].description;
}

function displayForecast(data) {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = '';
    data.list.forEach((forecast, index) => {
        if (index % 8 === 0) {
            const forecastElement = document.createElement('div');
            forecastElement.classList.add('forecast-day');
            const iconUrl = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;
            forecastElement.innerHTML = `
                <h3>${new Date(forecast.dt_txt).toLocaleDateString()}</h3>
                <img src="${iconUrl}" alt="${forecast.weather[0].description}">
                <p>Temp: ${forecast.main.temp}°F</p>
                <p>Wind: ${forecast.wind.speed} MPH</p>
                <p>Humidity: ${forecast.main.humidity}%</p>
            `;
            forecastContainer.appendChild(forecastElement);
        }
    });
}

function updateSearchHistory(city) {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
    displaySearchHistory();
}

function displaySearchHistory() {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    const searchHistoryContainer = document.getElementById('search-history');
    searchHistoryContainer.innerHTML = '';
    searchHistory.forEach(city => {
        const cityElement = document.createElement('div');
        cityElement.classList.add('search-history-item');
        cityElement.textContent = city;
        cityElement.addEventListener('click', () => {
            getWeatherData(city);
        });
        searchHistoryContainer.appendChild(cityElement);
    });
}


displaySearchHistory();