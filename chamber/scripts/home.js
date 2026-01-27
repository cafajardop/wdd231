
const tempEl = document.querySelector("#temp");
const descEl = document.querySelector("#desc");
const forecastEl = document.querySelector("#forecast");
const spotlightContainer = document.querySelector("#spotlight-cards");

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText} -> ${text}`);
  }
  return res.json();
}

const WEATHER = {
  lat: 4.7110,
  lon: -74.0721,
  units: "metric",
  apiKey: "904d4859fbb8c4db65241c12a6d8072f"
};

async function loadWeather() {
  if (!tempEl || !descEl || !forecastEl) return;

  descEl.textContent = "Loading...";
  forecastEl.innerHTML = "";

  try {
    const currentUrl =
      `https://api.openweathermap.org/data/2.5/weather` +
      `?lat=${WEATHER.lat}&lon=${WEATHER.lon}&units=${WEATHER.units}&appid=${WEATHER.apiKey}`;

    const currentData = await fetchJson(currentUrl);

    tempEl.textContent = String(Math.round(currentData.main.temp));
    descEl.textContent = currentData.weather?.[0]?.description ?? "N/A";

    const forecastUrl =
      `https://api.openweathermap.org/data/2.5/forecast` +
      `?lat=${WEATHER.lat}&lon=${WEATHER.lon}&units=${WEATHER.units}&appid=${WEATHER.apiKey}`;

    const forecastData = await fetchJson(forecastUrl);

    const daily = forecastData.list
      .filter(item => item.dt_txt?.includes("12:00:00"))
      .slice(0, 3);

    forecastEl.innerHTML = daily.map(day => {
      const label = new Date(day.dt_txt).toLocaleDateString(undefined, { weekday: "short" });
      return `<li><strong>${label}:</strong> ${Math.round(day.main.temp)}°</li>`;
    }).join("");

  } catch (err) {
    console.error("Weather error:", err);
    descEl.textContent = `Weather unavailable (${err.message})`;
    forecastEl.innerHTML = "";
  }
}

const SPOTLIGHTS = {
  membersUrl: new URL("./data/members.json", window.location.href).toString(),
  min: 2,
  max: 3
};

function isGoldOrSilver(member) {
  const level = member.membership;
  return level === 3 || level === 2;
}

function membershipLabel(level) {
  if (level === 3) return "Gold";
  if (level === 2) return "Silver";
  if (level === 1) return "Member";
  return "Member";
}

function spotlightCard(member) {
  const name = member.name ?? "Company";
  const phone = member.phone ?? "";
  const address = member.address ?? "";
  const website = member.website ?? "#";
  const level = member.membership;
  const logo = member.image ?? member.logo ?? "";

  return `
    <article class="spotlight-card">
      <h3>${name}</h3>
      ${logo ? `<img src="${logo}" alt="Logo of ${name}" loading="lazy">` : ""}
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Address:</strong> ${address}</p>
      <p><strong>Level:</strong> ${membershipLabel(level)}</p>
      <p><a href="${website}" target="_blank" rel="noopener">Website</a></p>
    </article>
  `;
}


async function loadSpotlights() {
  if (!spotlightContainer) return;

  spotlightContainer.innerHTML = "<p>Loading spotlights...</p>";

  try {
    const data = await fetchJson(SPOTLIGHTS.membersUrl);
    const members = Array.isArray(data) ? data : (data.members ?? []);

    if (!members.length) {
      throw new Error("members.json loaded but has no members array");
    }

    const eligible = members.filter(isGoldOrSilver);
    if (!eligible.length) {
      spotlightContainer.innerHTML = "<p>No spotlight members available.</p>";
      return;
    }

    const count = Math.min(getRandomInt(SPOTLIGHTS.min, SPOTLIGHTS.max), eligible.length);
    const chosen = shuffle(eligible).slice(0, count);

    spotlightContainer.innerHTML = chosen.map(spotlightCard).join("");

  } catch (err) {
    console.error("Spotlights error:", err);
    spotlightContainer.innerHTML = `<p>Spotlights unavailable (${err.message})</p>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadWeather();
  loadSpotlights();
});
