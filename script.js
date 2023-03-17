// Set up API key for application use
const apiKey = "9b1b9db6340f568e7be7e6cca77bfe2c";

// Global variables
let submitButton = document.getElementById('button');
let currentCondition;
let currentIcon;
let currentIconUrl;
let cityName;
let currentDate;
let currentTemp;
let currentWindSpeed;
let currentHumidity;

// Grab the container for search history buttons
const searchHistoryContainer = document.querySelector('#search-history-container');

const getCoordinates = function() {
    let searchCity = document.querySelector('#search-bar').value;
    console.log(searchCity);
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${searchCity}&appid=${apiKey}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            let cityLat = data[0].lat;
            let cityLon = data[0].lon;
            
            // Add searched city to search history container
            const searchHistoryButton = document.createElement('button');
            searchHistoryButton.setAttribute('class', 'btn btn-secondary mt-3 col-12 mx-auto')
            searchHistoryButton.textContent = searchCity;
            searchHistoryButton.addEventListener('click', function() {
                weatherCondition(cityLat, cityLon);
            });

            searchHistoryContainer.appendChild(searchHistoryButton);
            weatherCondition(cityLat, cityLon);
        })
};

const weatherCondition = function(cityLat, cityLon) {
    // Clear any previous search data displayed
    let forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = '';

    fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&appid=${apiKey}&units=imperial`)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        currentIcon = data.list[0].weather[0].icon;
        currentIconUrl = `http://openweathermap.org/img/wn/${currentIcon}.png`;
        cityName = data.city.name;
        currentDate = dayjs().format("MM/DD/YYYY");
        currentTemp = data.list[0].main.temp;
        currentCondition = data.list[0].weather[0].description;

        // When the user enters a city and submits the form, fetch the current and future weather data for that city.
        currentWindSpeed = data.list[0].wind.speed;
        currentHumidity = data.list[0].main.humidity;
        console.log(data.list[0].main.humidity);
        displayWeather(cityName, currentTemp, currentWindSpeed, currentHumidity);

        // Display 5-day forecast
        for (let i = 1; i <=40 ; i+=8) {
            let forecastDate = dayjs(data.list[i].dt_txt).format("MM/DD/YYYY");
            let forecastCondition = data.list[i].weather[0].description;
            let forecastTemp = data.list[i].main.temp;
            let forecastHumidity = data.list[i].main.humidity;
            let forecastWind = data.list[i].wind.speed;

            // Use an icon library to display the weather condition icon
            let forecastIcon = data.list[i].weather[0].icon;
            let forecastIconUrl = `http://openweathermap.org/img/wn/${forecastIcon}.png`;

            // Create HTML elements to display forecast
            let forecastDiv = document.createElement('div');
            forecastDiv.classList.add('col-sm-1', 'align-items-center', 'forecast-card', 'card', 'bg-primary');

            let forecastDateEl = document.createElement('h5');
            forecastDateEl.classList.add('mt-3', 'mb-0')
            forecastDateEl.textContent = forecastDate;

            let forecastIconEl = document.createElement('img');
            forecastIconEl.classList.add('w-25');
            forecastIconEl.setAttribute('src', forecastIconUrl);
            
            let forecastConditionEl = document.createElement('p');
            forecastConditionEl.classList.add('text-capitalize');
            forecastConditionEl.textContent = forecastCondition;

            let forecastTempEl = document.createElement('p');
            forecastTempEl.textContent = `Temp: ${forecastTemp} °F`;
            
            let forecastHumidityEl = document.createElement('p');
            forecastHumidityEl.textContent = `Humidity: ${forecastHumidity} %`;

            let forecastWindEl = document.createElement('p');
            forecastWindEl.textContent = `Wind: ${forecastWind} MPH`;


            // Append elements to forecast card
            forecastDiv.appendChild(forecastDateEl);
            forecastDiv.appendChild(forecastIconEl);
            forecastDiv.appendChild(forecastConditionEl);
            forecastDiv.appendChild(forecastTempEl);
            forecastDiv.appendChild(forecastHumidityEl);
            forecastDiv.appendChild(forecastWindEl);

            document.querySelector('#forecast-container').appendChild(forecastDiv);
        }
    });
};


// Display the current weather conditions for the city, including the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the wind speed.
const displayWeather = function(cityName, currentTemp, currentWindSpeed, currentHumidity) {
    document.querySelector('#current-icon').setAttribute('src', currentIconUrl);
    document.getElementById('current-icon').setAttribute('style', 'width: 10rem; height: 10rem')
    document.querySelector('#city-name').textContent = cityName + ' (' + currentDate + ')';
    // document.querySelector('#current-date').textContent = ;
    document.querySelector('#current-condition').textContent = currentCondition;
    document.querySelector('#current-temp').textContent = "Temp: " + currentTemp + " °F";
    document.querySelector('#current-wind').textContent = "Wind: " + currentWindSpeed + " MPH";
    document.querySelector('#current-humidity').textContent = "Humidity " + currentHumidity + " %";
}

submitButton.addEventListener("click", function(e){
    getCoordinates();
});



// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// Display the future weather conditions for the city in a 5-day forecast, including the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity.
//using dayjs for date info


// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
// Add the searched city to the search history, so that users can easily click on it to view its weather conditions again.
// When a city in the search history is clicked, fetch its current and future weather data using the API, and display it on the dashboard as described in steps 3 and 4.

// Create an empty array for search history
// let searchHistory = [];

    // Create a function to  