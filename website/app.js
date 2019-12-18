// Personal API Key for OpenWeatherMap API
let baseUrl = "https://api.openweathermap.org/data/2.5/weather?";
const APIkey = "&appid=113134aff3ecf62594b59dce3068d92e";
const celciusUnit = "&units=metric";

let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

// Event listener to add function to existing HTML DOM element
document.getElementById('generate').addEventListener('click', performAction);

/* Function called by event listener */
function performAction(e) {
  const zipOrCity = document.getElementById('zip').value;
  if (typeof(zipOrCity) === "number") {
    baseUrl = "https://api.openweathermap.org/data/2.5/weather?zip=";
  } else {
    baseUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
  }
  const userResponse = document.getElementById('feelings').value;

  getWeather(baseUrl, zipOrCity, celciusUnit, APIkey)
  .then((data) => {
    postData('/addProjectData', {temp:data, date:newDate, userResponse: userResponse});
    updateUI();
  })
}

/* Function to GET Web API Data*/
const getWeather = async (baseUrl, zipOrCity, celciusUnit, APIkey) => {
  const res = await fetch(baseUrl+zipOrCity+celciusUnit+APIkey)
  try {
    const data = await res.json();
    return data.main.temp;
  } catch(error) {
    console.log("error",error);
    alert("Something went wrong!");
  }
}

/* Function to POST data */
const postData = async (url='', data={}) => {
  const res = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  try {
    const newData = await res.json();
    return newData;
  } catch(error) {
    console.log("error", error);
    alert("Something went wrong!");
  }
}

/* Function to GET Project Data */
const updateUI = async () => {
  const res = await fetch('/all');
  try {
    const projectData = await res.json();
    document.getElementById('date').innerHTML = projectData.date;
    document.getElementById('temp').innerHTML = `${projectData.temp}°C`;
    document.getElementById('content').innerHTML = projectData.userResponse;
  } catch(error) {
    console.log("error", error);
    alert("Something went wrong!");
  }
}