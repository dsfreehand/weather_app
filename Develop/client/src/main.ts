import './styles/jass.css';

// * All necessary DOM elements selected
const searchForm: HTMLFormElement = document.getElementById(
  'search-form'
) as HTMLFormElement;
const searchInput: HTMLInputElement = document.getElementById(
  'search-input'
) as HTMLInputElement;
const todayContainer = document.querySelector('#today') as HTMLDivElement;
const forecastContainer = document.querySelector('#forecast') as HTMLDivElement;
const searchHistoryContainer = document.getElementById(
  'history'
) as HTMLDivElement;
const heading: HTMLHeadingElement = document.getElementById(
  'search-title'
) as HTMLHeadingElement;
const weatherIcon: HTMLImageElement = document.getElementById(
  'weather-img'
) as HTMLImageElement;
const tempEl: HTMLParagraphElement = document.getElementById(
  'temp'
) as HTMLParagraphElement;
const windEl: HTMLParagraphElement = document.getElementById(
  'wind'
) as HTMLParagraphElement;
const humidityEl: HTMLParagraphElement = document.getElementById(
  'humidity'
) as HTMLParagraphElement;

/*

API Calls

*/

interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
}

const fetchWeather = async (cityName: string) => {
  try {
    const response = await fetch('/api/weather/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ city: cityName }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const weatherData = await response.json();
    console.log('Weather data received:', weatherData);

    if (weatherData.forecast) {
      console.log('Forecast data received:', weatherData.forecast);
    } else {
      console.log('No forecast data received');
    }

    // Check if the weather data structure is valid
    if (!weatherData || typeof weatherData !== 'object' || !weatherData.temperature) {
      throw new Error('Invalid weather data structure');
    }

    // Construct the WeatherData object with fallback values
    const currentWeather: WeatherData = {
      city: cityName,
      temperature: weatherData.temperature,
      description: weatherData.description || 'No description available',  // Provide a fallback
      humidity: weatherData.humidity || 0,  // Default to 0 if missing
      windSpeed: weatherData.windSpeed || 0,  // Default to 0 if missing
      date: new Date().toISOString(),  // Default to current date
      icon: 'default-icon',  
      iconDescription: 'Weather icon description',  
      tempF: (weatherData.temperature - 273.15) * 9/5 + 32, // Convert from Kelvin to Fahrenheit
    };

    renderCurrentWeather(currentWeather);
    renderForecast(weatherData.forecast); // Call renderForecast with the forecast data
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
};





const fetchSearchHistory = async () => {
  const history = await fetch('/api/weather/history', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return history;
};

const deleteCityFromHistory = async (id: string) => {
  await fetch(`/api/weather/history/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/*

Render Functions

*/

const renderCurrentWeather = (currentWeather: WeatherData): void => {
  const { city, date, icon, iconDescription, tempF, windSpeed, humidity } = currentWeather;

  heading.textContent = `${city} (${date})`;

  // Dynamically set the weather icon source based on the icon from the API
  weatherIcon.setAttribute('src', `https://openweathermap.org/img/w/${icon}.png`);
  weatherIcon.setAttribute('alt', iconDescription);
  weatherIcon.setAttribute('class', 'weather-img');
  heading.append(weatherIcon);

  tempEl.textContent = `Temp: ${tempF}°F`;
  windEl.textContent = `Wind: ${windSpeed} MPH`;
  humidityEl.textContent = `Humidity: ${humidity} %`;

  if (todayContainer) {
    todayContainer.innerHTML = '';
    todayContainer.append(heading, tempEl, windEl, humidityEl);
  }
};

const renderForecast = (forecast: WeatherData[]): void => {
  if (!forecast || !Array.isArray(forecast)) {
    console.error('Invalid forecast data:', forecast);
    return;
  }

  const headingCol = document.createElement('div');
  const heading = document.createElement('h4');

  headingCol.setAttribute('class', 'col-12');
  heading.textContent = '5-Day Forecast:';
  headingCol.append(heading);

  if (forecastContainer) {
    forecastContainer.innerHTML = '';
    forecastContainer.append(headingCol);

    const forecastCards = forecast.map((day: any) => renderForecastCard(day));
    forecastCards.forEach((card: HTMLElement) => forecastContainer.append(card)); 
  }
};



const renderForecastCard = (forecast: any): HTMLElement => {
  const { cityName, icon, iconDescription, tempF, windSpeed, humidity } = forecast;

  
  let existingCard = document.querySelector(`#forecast-${cityName}`);
  let col: HTMLElement = document.createElement('div');

  
  if (existingCard) {
    const weatherIcon = existingCard.querySelector('img');
    const tempEl = existingCard.querySelector('.temp');
    const windEl = existingCard.querySelector('.wind');
    const humidityEl = existingCard.querySelector('.humidity');

    if (weatherIcon && tempEl && windEl && humidityEl) {
      weatherIcon.setAttribute('src', `https://openweathermap.org/img/w/${icon}.png`);
      weatherIcon.setAttribute('alt', iconDescription);
      tempEl.textContent = `Temp: ${tempF} °F`;
      windEl.textContent = `Wind: ${windSpeed} MPH`;
      humidityEl.textContent = `Humidity: ${humidity} %`;
    } else {
      console.error('One or more elements were not found in the card.');
    }
  } else {
    const forecastCard = createForecastCard();
    col = forecastCard.col;
    const { weatherIcon, tempEl, windEl, humidityEl } = forecastCard;

    weatherIcon.setAttribute('src', `https://openweathermap.org/img/w/${icon}.png`);
    weatherIcon.setAttribute('alt', iconDescription);
    tempEl.textContent = `Temp: ${tempF} °F`;
    windEl.textContent = `Wind: ${windSpeed} MPH`;
    humidityEl.textContent = `Humidity: ${humidity} %`;

    
    col.id = `forecast-${cityName}`;

    
    document.getElementById('forecastContainer')?.appendChild(col);
  }

  return col || existingCard;
};



/*

Helper Functions

*/

const createForecastCard = () => {
  const col = document.createElement('div');
  const card = document.createElement('div');
  const cardBody = document.createElement('div');
  const cardTitle = document.createElement('h5');
  const weatherIcon = document.createElement('img');
  const tempEl = document.createElement('p');
  const windEl = document.createElement('p');
  const humidityEl = document.createElement('p');

  col.append(card);
  card.append(cardBody);
  cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);

  col.classList.add('col-auto');
  card.classList.add(
    'forecast-card',
    'card',
    'text-white',
    'bg-primary',
    'h-100'
  );
  cardBody.classList.add('card-body', 'p-2');
  cardTitle.classList.add('card-title');
  tempEl.classList.add('card-text');
  windEl.classList.add('card-text');
  humidityEl.classList.add('card-text');

  return {
    col,
    cardTitle,
    weatherIcon,
    tempEl,
    windEl,
    humidityEl,
  };
};

const createHistoryButton = (city: string) => {
  const btn = document.createElement('button');
  btn.setAttribute('type', 'button');
  btn.setAttribute('aria-controls', 'today forecast');
  btn.classList.add('history-btn', 'btn', 'btn-secondary', 'col-10');
  btn.textContent = city;

  return btn;
};

const createDeleteButton = () => {
  const delBtnEl = document.createElement('button');
  delBtnEl.setAttribute('type', 'button');
  delBtnEl.classList.add(
    'fas',
    'fa-trash-alt',
    'delete-city',
    'btn',
    'btn-danger',
    'col-2'
  );

  delBtnEl.addEventListener('click', handleDeleteHistoryClick);
  return delBtnEl;
};

const createHistoryDiv = () => {
  const div = document.createElement('div');
  div.classList.add('display-flex', 'gap-2', 'col-12', 'm-1');
  return div;
};

const buildHistoryListItem = (city: any) => {
  const newBtn = createHistoryButton(city.name);
  const deleteBtn = createDeleteButton();
  deleteBtn.dataset.city = JSON.stringify(city);
  const historyDiv = createHistoryDiv();
  historyDiv.append(newBtn, deleteBtn);
  return historyDiv;
};

/*
Render Search History
*/

const renderSearchHistory = async () => {
  const historyResponse = await fetchSearchHistory();
  const history = await historyResponse.json();
  searchHistoryContainer.innerHTML = '';
  history.forEach((city: any) => {
    const historyItem = buildHistoryListItem(city);
    searchHistoryContainer.append(historyItem);
  });
};

/*
Event Handlers
*/

const handleSearchFormSubmit = (event: any): void => {
  event.preventDefault();

  if (!searchInput.value) {
    alert('City cannot be blank'); // Adding user feedback instead of throwing error
    return;
  }

  const search: string = searchInput.value.trim();
  fetchWeather(search).then(() => {
    getAndRenderHistory();
  });
  searchInput.value = '';
};

const handleSearchHistoryClick = (event: any) => {
  if (event.target.matches('.history-btn')) {
    const city = event.target.textContent;
    fetchWeather(city);
  }
};

const handleDeleteHistoryClick = (event: any) => {
  event.stopPropagation();
  const cityID = JSON.parse(event.target.getAttribute('data-city')).id;
  deleteCityFromHistory(cityID).then(getAndRenderHistory);
};

/*

Initial Render

*/

const getAndRenderHistory = () =>
  fetchSearchHistory().then(renderSearchHistory);

searchForm?.addEventListener('submit', handleSearchFormSubmit);
searchHistoryContainer?.addEventListener('click', handleSearchHistoryClick);

getAndRenderHistory();
