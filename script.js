// Set up API key for application use
const apiKey = "9b1b9db6340f568e7be7e6cca77bfe2c"

// Global variables
let submitButton = document.getElementById('submit-button');

// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
let getCoordinates = function() {
    let searchCity = document.querySelector('#search-bar').value;
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${searchCity}&appid=${apiKey}`)
        .then(function (response) {
            console.log(response.JSON);
        });
    };
        
    submitButton.addEventListener("click", getCoordinates);
        // localStorage.setItem('city', city);
        //locals storage setItem
        //container for information displayed --> dynamic
        //user input for city entry 
        
        
    // WHEN I view current weather conditions for that city
    // THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the wind speed
    //
    
    
    // WHEN I view future weather conditions for that city
    // THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
    //using dayjs for future forcast
    
    
    // WHEN I click on a city in the search history
    // THEN I am again presented with current and future conditions for that city
    //local storage getItem

