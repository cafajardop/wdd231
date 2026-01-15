const url =
  "https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json";
const cards = document.querySelector("#cards");

async function getProphetData() {
  const response = await fetch(url);
  const data = await response.json();

  displayProphets(data.prophets);
}

function displayProphets(prophets) {
  cards.innerHTML = "";

  prophets.forEach((prophet) => {    
    /** Const */
    const card = document.createElement("section");
    const h2 = document.createElement("h2");
    const img = document.createElement("img");
    const p = document.createElement("p");
    
    h2.textContent = `${prophet.name} ${prophet.lastname}`;

    /** Set */
    img.setAttribute("src", prophet.imageurl);
    img.setAttribute(
      "alt",
      `Portrait of ${prophet.name} ${prophet.lastname}`
    );
    img.setAttribute("loading", "lazy");

    p.textContent = `Born: ${prophet.birthdate} | Birthplace: ${prophet.birthplace}`;

    /** append */
    card.appendChild(h2);
    card.appendChild(img);
    card.appendChild(p);

    /** Dom */
    cards.appendChild(card);
  });
}

getProphetData();
