import './styles/main.scss';

const API_KEY = 'DEMO_KEY';
const API_URL = `https://api.nasa.gov/insight_weather/?api_key=${API_KEY}&feedtype=json&ver=1.0`;

// DOM selectors: main
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

// DOM selectors: next 7 days
const previousWeatherToggle = document.querySelector('.show-previous-weather');
const previousWeather = document.querySelector('.previous-weather');

const previousSolTemplate = document.querySelector(
  '[data-previous-sol-template]'
);
const previousSolContainer = document.querySelector('[data-previous-sols]');

const unitToggle = document.querySelector('[data-unit-toggle');
const metricRadioElement = document.getElementById('cel');
const imperialRadioElement = document.getElementById('fah');

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
  // render
  displaySelectedSol(sols);
  displayPreviousSols(sols);
  updateUnits();
  // Add click  handler to unit toggle button
  unitToggle.addEventListener('click', () => {
    let metricUnits = !isMetric(); // true if metric radio is checked + negate result
    metricRadioElement.checked = metricUnits;
    imperialRadioElement.checked = !metricUnits;
    // rerender
    displaySelectedSol(sols);
    displayPreviousSols(sols);
    updateUnits();
  });

  metricRadioElement.addEventListener('change', () => {
    // rerender
    displaySelectedSol(sols);
    displayPreviousSols(sols);
    updateUnits();
  });
  imperialRadioElement.addEventListener('change', () => {
    // rerender
    displaySelectedSol(sols);
    displayPreviousSols(sols);
    updateUnits();
  });
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

function displayPreviousSols(sols) {
  previousSolContainer.innerHTML = ''; // cleanup before populating
  sols.forEach((solData, index) => {
    // clones template content and assign it to solContainer
    const solContainer = previousSolTemplate.content.cloneNode(true); // true: deep clone
    // populate data into cloned element
    solContainer.querySelector('[data-sol]').innerText = solData.sol;
    solContainer.querySelector('[data-date]').innerText = displayDate(
      solData.date
    );
    solContainer.querySelector(
      '[data-temp-high]'
    ).innerText = displayTemperature(solData.maxTemp);
    solContainer.querySelector(
      '[data-temp-low]'
    ).innerText = displayTemperature(solData.minTemp);
    // click handler on 'More Info'
    solContainer
      .querySelector('[data-select-button]')
      .addEventListener('click', () => {
        // update selectedSolIndex with solData index
        selectedSolIndex = index;
        // re-render main
        displaySelectedSol(sols); // selects displaying sol entry with global: selectedSolIndex
      });

    // push populated element into container
    previousSolContainer.appendChild(solContainer);
  });
}

function displayDate(date) {
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'long' });
}

function displayTemperature(temperature) {
  let returnTemp = temperature;
  if (!isMetric()) {
    returnTemp = (temperature - 32) * (5 / 9);
  }
  return Math.round(returnTemp);
}

function displaySpeed(speed) {
  let returnSpeed = speed;
  if (!isMetric()) {
    returnSpeed = speed / 1.609;
  }
  return Math.round(returnSpeed);
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

function updateUnits() {
  const speedUnits = document.querySelectorAll('[data-speed-unit]');
  const tempUnits = document.querySelectorAll('[data-temp-unit]');
  speedUnits.forEach((unit) => {
    unit.innerText = isMetric() ? 'kph' : 'mph';
  });
  tempUnits.forEach((unit) => {
    unit.innerText = isMetric() ? 'C' : 'F';
  });
}

function isMetric() {
  // true if metric radio input is checked
  return metricRadioElement.checked;
}
