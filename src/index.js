import "./styles/main.scss";

const API_KEY = "DEMO_KEY";
const API_URL = `https://api.nasa.gov/insight_weather/?api_key=${API_KEY}&feedtype=json&ver=1.0`;

// For CSS dev purpose
const previousWeatherToggle = document.querySelector(".show-previous-weather");
const previousWeather = document.querySelector(".previous-weather");

previousWeatherToggle.addEventListener("click", () => {
  previousWeather.classList.toggle("show-weather");
});

// ==========================

/**
 * get the index of most recent sol data and store it in a global variable
 */
let selectedSolIndex;
getWeather().then((sols) => {
  selectedSolIndex = sols.length - 1;
  displaySelectedSol(sols);
});

function displaySelectedSol(sols) {
  const selectedSol = sols[selectedSolIndex];
  console.log(selectedSol);
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
