// Set up API key for application use
const apiKey = "9b1b9db6340f568e7be7e6cca77bfe2c";

// Global variables
let submitButton = document.getElementById('button');
let previousSearchButton = document.querySelector('#previous-search-button');
let currentCondition;
let currentIcon;
let currentIconUrl;
let cityName;
let currentDate;
let currentTemp;
let currentWindSpeed;
let currentHumidity;

// Initialize the search history array
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

// Grab the container for search history buttons
const searchHistoryContainer = document.querySelector('#search-history-container');

// Loop through the search history and create a button for each search item
searchHistory.forEach(function(search) {
    let searchHistoryButton = document.createElement('button');
    searchHistoryButton.classList.add('btn', 'btn-secondary', 'mt-3', 'col-12', 'mx-auto', 'text-capitalize')
    searchHistoryButton.setAttribute('id', 'previous-search-button');
    searchHistoryButton.textContent = search;
    
    let getCoordinates = function(search) {
        search = searchHistoryButton.textContent;
        console.log(search);
        fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${search}&appid=${apiKey}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            let cityLat = data[0].lat;
            let cityLon = data[0].lon;
            weatherCondition(cityLat, cityLon);
        });
    };

    // Event listener for previous search button
    searchHistoryButton.addEventListener('click', function() {
        getCoordinates();    
    });
    
    searchHistoryContainer.appendChild(searchHistoryButton);
});

// Function to pull lattitude and longitude from the weather API
let getCoordinates = function() {
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

            // Get search history from local storage, if nothing is stored set the array to []
            let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

            // Add the searched city to search history
            let searchCity = document.querySelector('#search-bar').value;
            searchHistory.push(searchCity);

            // Save the updated search history to local storage
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

            // Add the searched city to the search history container
            const searchHistoryButton = document.createElement('button');
            searchHistoryButton.setAttribute('class', 'btn btn-secondary mt-3 col-12 mx-auto text-capitalize');
            searchHistoryButton.textContent = searchCity;
            searchHistoryButton.addEventListener('click', function() {
                weatherCondition(cityLat, cityLon);
            });
            searchHistoryContainer.appendChild(searchHistoryButton);
            weatherCondition(cityLat, cityLon);
        });
};

// Function to pull weather conditions using the lat and lon parameters
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

        // Loop to pull data for current city every 24 hours
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
            forecastDiv.classList.add('col-sm-1', 'align-items-center', 'forecast-card', 'card', 'bg-primary', 'mb-3');

            let forecastDateEl = document.createElement('h5');
            forecastDateEl.classList.add('mt-3', 'mb-0');
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
        };
    });
    
    // Display the current weather conditions for the city
    const displayWeather = function(cityName, currentTemp, currentWindSpeed, currentHumidity) {
        document.querySelector('#current-icon').setAttribute('src', currentIconUrl);
        document.getElementById('current-icon').setAttribute('style', 'width: 10rem; height: 10rem');
        document.querySelector('#city-name').textContent = cityName + ' (' + currentDate + ')';
        
        // document.querySelector('#current-date').textContent = ;
        document.querySelector('#current-condition').textContent = currentCondition;
        document.querySelector('#current-temp').textContent = "Temp: " + currentTemp + " °F";
        document.querySelector('#current-wind').textContent = "Wind: " + currentWindSpeed + " MPH";
        document.querySelector('#current-humidity').textContent = "Humidity " + currentHumidity + " %";
    };
};
    
submitButton.addEventListener("click", function() {
    getCoordinates();
});

