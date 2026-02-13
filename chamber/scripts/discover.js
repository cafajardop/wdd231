import { interests } from "../data/interests.mjs";

const grid = document.querySelector(".discover-grid");
const msg = document.querySelector("#visitMessage");

function renderCards(list) {
  const areas = ["a","b","c","d","e","f","g","h"];

  grid.innerHTML = list.slice(0, 8).map((item, i) => `
    <article class="poi-card" style="grid-area:${areas[i]}">
      <h2>${item.name}</h2>

      <figure>
        <img
          src="${item.image}"
          alt="${item.name}"
          width="300"
          height="200"
          loading="lazy"
        />
      </figure>

      <address>${item.address}</address>
      <p>${item.description}</p>

      <button type="button">Learn more</button>
    </article>
  `).join("");
}

function setVisitMessage() {
  const key = "lastVisitDiscover";
  const now = Date.now();
  const last = Number(localStorage.getItem(key));

  if (!last) {
    msg.textContent = "Welcome! Let us know if you have any questions.";
    localStorage.setItem(key, String(now));
    return;
  }

  const diff = now - last;
  const dayMs = 24 * 60 * 60 * 1000;

  if (diff < dayMs) {
    msg.textContent = "Back so soon! Awesome!";
  } else {
    const days = Math.floor(diff / dayMs);
    msg.textContent = `You last visited ${days} ${days === 1 ? "day" : "days"} ago.`;
  }

  localStorage.setItem(key, String(now));
}

renderCards(interests);
setVisitMessage();
