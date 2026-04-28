const apiKey = "760d2c557088ff7f4bd590c18f9c390d";

async function getWeather() {
    const city = document.getElementById("city").value.trim();

    if (city === "") {
        alert("Enter city name");
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.cod !== 200) {
            document.getElementById("weatherBox").innerHTML = "City not found...";
            return;
        }

        const temp = data.main.temp;
        const desc = data.weather[0].description;

        document.getElementById("weatherBox").innerHTML = `
            <div class="temp">${temp}°C</div>
            <div class="desc">${desc}</div>
    `;
    } catch (error) {
        document.getElementById("weatherBox").innerHTML = "Error fetching data";
    }
}