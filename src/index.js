import './styles/main.scss';

const API_KEY = 'DEMO_KEY';
const API_URL = `https://api.nasa.gov/insight_weather/?api_key=${API_KEY}&feedtype=json&ver=1.0`;

// DOM selectors
const previousWeatherToggle = document.querySelector('.show-previous-weather');
const previousWeather = document.querySelector('.previous-weather');
const currentSolElement = document.querySelector('[data-current-sol]');
const currentDateElement = document.querySelector('[data-current-date]');
const currentTempHighElement = document.querySelector(
  '[data-current-temp-high]'
);
const currentTempLowElement = document.querySelector('[data-current-temp-low]');
const windSpeedElement = document.querySelector('[data-wind-speed]');
const windDirectionText = document.querySelector('[data-wind-direction-text]');
const windDirectionArrow = document.querySelector(
  '[data-wind-direction-arrow]'
);

// Add listener to bottom-drawer toggler
previousWeatherToggle.addEventListener('click', () => {
  previousWeather.classList.toggle('show-weather');
});

/**
 * get the index of most recent sol data and store it in a global variable
 */
let selectedSolIndex;
getWeather().then((sols) => {
  selectedSolIndex = sols.length - 1;
  displaySelectedSol(sols);
});

/**
 * Display Sol data to the corresponding DOM node.
 * @param {Array} sols - an array containing sol objects
 */
function displaySelectedSol(sols) {
  const selectedSol = sols[selectedSolIndex];
  currentSolElement.innerText = selectedSol.sol;

  currentDateElement.innerText = displayDate(selectedSol.date);
  currentTempHighElement.innerText = displayTemperature(selectedSol.maxTemp);
  currentTempLowElement.innerText = displayTemperature(selectedSol.minTemp);
  windSpeedElement.innerText = displaySpeed(selectedSol.windSpeed);
  windDirectionText.innerText = selectedSol.windDirectionCardinal;
  windDirectionArrow.style.setProperty(
    '--direction',
    selectedSol.windDirectionDegrees + 'deg'
  );
}

function displayDate(date) {
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'long' });
}

function displayTemperature(temperature) {
  return Math.round(temperature);
}

function displaySpeed(speed) {
  return Math.round(speed);
}

/**
 * Fetch data and map it into objects of infos that we need.
 */
function getWeather() {
  return fetch(API_URL)
    .then((res) => res.json())
    .then((data) => {
      // destructure all other than sol_keys and validity_checks into solData
      const { sol_keys, validity_checks, ...solData } = data;

      return Object.entries(solData).map(([sol, data]) => {
        return {
          sol: sol,
          maxTemp: data.AT.mx,
          minTemp: data.AT.mn,
          windSpeed: data.HWS.av,
          windDirectionDegrees: data.WD.most_common.compass_degrees,
          windDirectionCardinal: data.WD.most_common.compass_point, // for screen readers
          date: new Date(data.First_UTC),
        };
      });
    });
}

getWeather();
