/*
 API Call for Weather
api.openweathermap.org / data / 2.5 / weather ? q = { city name }
*/
(function() {
  const appId = "44782235947c9664caf8bdea1b5e694c";
  const cityInput = document.getElementById("city-input");
  const contents = document.querySelector("#contents");
  const toggleDisplay = document.querySelector(".toggle-display");
  let temp = "Display: Fahrenheit";
  let weather;

  toggleDisplay.innerHTML = temp;

  const getWeatherForCity = async city => {
    const data = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${appId}`
    );

    return await data.json();
  };

  const getWeatherForCity5Day = async city => {
    const data = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${appId}`
    );
    return await data.json();
  };

  const getIcon = icon => {
    return `<img id="weather-icon" src="http://openweathermap.org/img/w/${icon}.png" />`;
  };

  const getWeatherAndPopulatePage = async city => {
    contents.innerHTML = "";
    let forecastSelection = document.querySelector(
      'input[name="forecast-selection"]:checked'
    ).value;

    if (forecastSelection == "current-weather") {
      // Call current weather API
      weather = await getWeatherForCity(city);
      populateWeatherOnPage(weather);
    } else {
      weather = await getWeatherForCity5Day(city);
      const groupedData = groupListByDate(weather.list);
      populateForecastTable(groupedData);
      // weather.list.forEach(populateWeatherOnPage);
    }
  };

  const populateForecastTable = data => {
    const table = document.createElement("table");

    Object.entries(data).forEach(([key, value]) => {
      const row = document.createElement("tr");

      const dateColumn = document.createElement("td");
      dateColumn.innerHTML = key;

      const tempColumn = document.createElement("td");

      tempColumn.innerHTML = convertTemperature(
        value.reduce((prev, next) => {
          return (prev += next.main.temp);
        }, 0) /
          (value.length + 1)
      );

      // [] =>  .map()   .reduce()  .forEach()   .filter()       -->  .some()   .every()  ---> .slice()  .splice()  .shift()  .unshift()  .pop()  .push()

      row.appendChild(dateColumn);
      row.appendChild(tempColumn);

      table.appendChild(row);
    });

    contents.appendChild(table);
  };

  const populateWeatherOnPage = weather => {
    contents.appendChild(createWeatherDiv(weather));
    contents.appendChild(createParentDiv(weather));
  };

  const createParentDiv = weather => {
    const parentDiv = document.createElement("div");
    parentDiv.className = "weather-container";
    const date = new Date(weather.dt * 1000);
    // console.log(date);
    // <div class="location-container">
    // <div class="location">${weather.name}, ${weather.sys.country}</div>
    // </div>
    parentDiv.innerHTML = `
        <div class="temperature-container">
          <h2>${weather.dt_txt}</h2>
          <div class="min border center">Low: ${convertTemperature(
            weather.main.temp_min
          )}</div>
          <div class="temp border center">Current: ${convertTemperature(
            weather.main.temp
          )}</div>
          <div class="max border center">High: ${convertTemperature(
            weather.main.temp_max
          )}</div>
        </div>
    `;

    return parentDiv;
  };

  const createWeatherDiv = weather => {
    const weatherDiv = document.createElement("div");
    // weatherDiv.className = "icon-container";
    // console.log(weather.weather);
    weather.weather.forEach(item => {
      const innerDiv = document.createElement("div");
      innerDiv.className = "icon-container";
      innerDiv.innerHTML = `
            <div class="icon center">${getIcon(item.icon)} </div>
            <div class="icon-description">
            <span class="icon-description-span">${item.main}</span>
            </div>
        `;
      weatherDiv.appendChild(innerDiv);
    });

    return weatherDiv;
  };

  const convertFahrenheit = function(kelvin) {
    return parseFloat(((kelvin - 273.15) * 9) / 5 + 32).toFixed(2);
  };

  const convertCelsius = function(kelvin) {
    return parseFloat(kelvin - 273.15).toFixed(2);
  };

  cityInput.addEventListener("keyup", e => {
    if (e.keyCode == 13) {
      getWeatherAndPopulatePage(e.target.value);
    }
  });

  toggleDisplay.addEventListener("click", e => {
    switch (temp) {
      case "Display: Fahrenheit":
        temp = "Display: Celsius";
        break;
      case "Display: Celsius":
        temp = "Display: Kelvin";
        break;
      case "Display: Kelvin":
        temp = "Display: Fahrenheit";
        break;
      default:
        temp = "Display: Fahrenheit";
    }
    toggleDisplay.innerHTML = temp;

    populateWeatherOnPage(weather);
  });

  const convertTemperature = function(kelvin) {
    switch (temp) {
      case "Display: Kelvin":
        return kelvin;
      case "Display: Celsius":
        return convertCelsius(kelvin);
      case "Display: Fahrenheit":
        return convertFahrenheit(kelvin);
      default:
        return convertFahrenheit(kelvin);
    }
  };

  const getDate = seconds => {
    const date = new Date(seconds * 1000);

    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  const groupListByDate = list => {
    const groupedItems = {};

    list.forEach(item => {
      const date = getDate(item.dt);

      if (groupedItems[date]) {
        groupedItems[date].push(item);
      } else {
        groupedItems[date] = [item];
      }
    });

    return groupedItems;
  };

  // {
  //   "5-17": [

  //   ],
  //   "5-18": [

  //   ]
  // }
})();
