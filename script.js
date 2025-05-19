//!SELECTORS

const form = document.querySelector("form");
const input = document.querySelector("form input");
const cardContainer = document.querySelector(".card-content");
const alertMessage = document.querySelector(".alert");

const locate = document.querySelector(".location"); 
const userLocationDiv = document.getElementById("userLocation"); 
const langButton = document.querySelector(".lang"); 

let userLocation = false; 



const apiKey = "324bd8cb23fa27a47e4f2fb7d16e23de";
let url;
let cities = [];
let units = "metric";
let lang = "en";



form.addEventListener("submit", (e) => {
	e.preventDefault();

	if (input.value) {
		const city = input.value;
		

		url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=${lang}&units=${units}&appid=${apiKey}`;
		

		getWeatherData();
	}

	form.reset();
});

locate.addEventListener("click", () => {
	navigator.geolocation?.getCurrentPosition(({ coords }) => {
		

		const { latitude, longitude } = coords;

		url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${units}&lang=${lang}&appid=${apiKey}`;

		userLocation = true;

		getWeatherData();
	});
});

langButton.addEventListener("click", (e) => {
	if (e.target.textContent == "DE") {
		input.setAttribute("placeholder", "Suche nach einer Stadt");
		lang = "de";
	} else if (e.target.textContent == "EN") {
		input.setAttribute("placeholder", "Search for a city");
		lang = "en";
	}
});



const getWeatherData = async () => {
	try {
		const response = await fetch(url).then((response) => response.json()); 
		

		const { main, name, weather, sys } = response; 

		
		
		const iconUrl = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0].icon}.svg`;
		

		if (cities.indexOf(name) == -1) {
			cities.unshift(name);

			let card = `
	<li class="cards" id="${name}">
						<div class="card-button">
							<a class="cancel-button" href="#"
								><span>&times</span></a>
						</div>
						<div class="card-info" id="userLocation">
							<p class="city"><span><sup><img src="https://flagsapi.com/${
								sys.country
							}/flat/64.png"/></span></sup><strong>${name} </strong></p>
							<p>Min: ${Math.round(main.temp_min)}<sup>°C</sup> - Max: ${Math.round(
				main.temp_max
			)}<sup>°C</sup></p>
							<p><img class="svg-color" src="./assets/wi-barometer.svg" height="30px"/> ${
								main.pressure
							} <img class="svg-color" src="./assets/wi-humidity.svg" height="30px"/>${
				main.humidity
			}</p>
							<p><img class="auto svg-color" src="${iconUrl}"/></p>
							<p class="text-center">${weather[0].description.toUpperCase()}</p>
						</div>
					</li>
	`;

			if (userLocation) {
				userLocationDiv.innerHTML = card;
				userLocation = false;
			} else {
				cardContainer.innerHTML = card + cardContainer.innerHTML;
			}

			

			const singleClearButton =
				document.querySelectorAll(".cancel-button");

			singleClearButton.forEach((button) => {
				button.addEventListener("click", (e) => {
					delete cities[
						cities.indexOf(e.target.closest(".cards").id)
					]; 
					e.target.closest(".cards").remove(); 
				});
			});
		} else {
			if (lang == "de") {
				alertMessage.textContent = `Sie kennen das Wetter für die ${name} bereits, Bitte suchen Sie nach einer anderen Stadt!`;
			} else {
				alertMessage.textContent = `You already know the weather for ${name}, Please search for another city!`;
			}

			alertMessage.style.display = "block"; 
			setTimeout(() => {
				alertMessage.style.display = "none"; 
			}, 3000);
		}
	} catch (error) {
		if (lang == "de") {
			alertMessage.textContent = `Stadt nicht gefunden!`;
		} else {
			alertMessage.textContent = `City not found!`;
		}

		alertMessage.style.display = "block"; 
		setTimeout(() => {
			alertMessage.style.display = "none";
		}, 3000);
	}
};