import { fetchHabits } from "./modules/habits-api.js";
import { getFavorites, isFavorite, toggleFavorite } from "./modules/storage.js";

const els = {
  status: document.querySelector("#toolkit-status"),
  grid: document.querySelector("#habits-grid"),
  search: document.querySelector("#habit-search"),
  viewAll: document.querySelector("#view-all"),
  viewFavs: document.querySelector("#view-favorites"),
  dialog: document.querySelector("#habit-dialog"),
  dialogClose: document.querySelector("#dialog-close"),
  dialogFav: document.querySelector("#dialog-favorite"),
  dialogContent: document.querySelector("#dialog-content"),
  dialogTitle: document.querySelector("#dialog-title")
};

let allHabits = [];
let viewMode = "all";
let selectedHabitId = null;

function setStatus(text) {
  if (els.status) els.status.textContent = text;
}

function normalize(s) {
  return String(s ?? "").toLowerCase().trim();
}

function currentQuery() {
  return normalize(els.search?.value);
}

function applyFilters() {
  const q = currentQuery();
  const favs = new Set(getFavorites());

  let list = allHabits;
  
  if (viewMode === "favorites") {
    list = list.filter(h => favs.has(h.id));
  }
  
  if (q) {
    list = list.filter(h => {
      const hay = `${h.name} ${h.category} ${h.benefit} ${h.difficulty}`.toLowerCase();
      return hay.includes(q);
    });
  }

  return list;
}

function habitCardTemplate(h) {
  const fav = isFavorite(h.id);
  const favText = fav ? "★ Favorite" : "☆ Add Favorite";

  return `
    <article class="card" data-id="${h.id}">
      <h3>${h.name}</h3>
      <p>${h.benefit}</p>
      <ul class="meta">
        <li><strong>Category:</strong> ${h.category}</li>
        <li><strong>Duration:</strong> ${h.durationMin} min</li>
        <li><strong>Difficulty:</strong> ${h.difficulty}</li>
        <li><strong>Equipment:</strong> ${h.equipment}</li>
      </ul>
      <div class="tool-row">
        <button class="btn secondary details-btn" type="button" data-action="details">Details</button>
        <button class="btn secondary fav-btn ${fav ? "is-active" : ""}" type="button" data-action="favorite">
          ${favText}
        </button>
      </div>
    </article>
  `;
}

function render(list) {
  if (!els.grid) return;

  if (!Array.isArray(list) || list.length === 0) {
    els.grid.innerHTML = `
      <article class="card">
        <h3>No results</h3>
        <p>Try a different keyword or switch back to “All”.</p>
      </article>
    `;
    return;
  }

  els.grid.innerHTML = list.map(habitCardTemplate).join("");
  setStatus(`Showing ${list.length} habit(s).`);
}

function openDialog(habit) {
  if (!els.dialog || !els.dialogContent || !els.dialogTitle) return;

  selectedHabitId = habit.id;
  els.dialogTitle.textContent = habit.name;

  const steps = Array.isArray(habit.steps) ? habit.steps : [];
  const stepsHtml = steps.length
    ? `<ol>${steps.map(s => `<li>${s}</li>`).join("")}</ol>`
    : "<p>No steps provided.</p>";

  els.dialogContent.innerHTML = `
    <p><strong>Benefit:</strong> ${habit.benefit}</p>
    <p><strong>Category:</strong> ${habit.category}</p>
    <p><strong>Duration:</strong> ${habit.durationMin} minutes</p>
    <p><strong>Difficulty:</strong> ${habit.difficulty}</p>
    <p><strong>Equipment:</strong> ${habit.equipment}</p>
    <h3>Steps</h3>
    ${stepsHtml}
  `;

  els.dialogFav.textContent = isFavorite(habit.id) ? "Remove Favorite" : "Add Favorite";
  els.dialog.showModal();
}

function refresh() {
  render(applyFilters());  
  if (selectedHabitId && els.dialogFav) {
    els.dialogFav.textContent = isFavorite(selectedHabitId) ? "Remove Favorite" : "Add Favorite";
  }
}

function setActiveViewButtons() {
  if (!els.viewAll || !els.viewFavs) return;
  els.viewAll.classList.toggle("is-active", viewMode === "all");
  els.viewFavs.classList.toggle("is-active", viewMode === "favorites");
}

function setupEvents() {  
  els.search?.addEventListener("input", () => refresh());
  
  els.viewAll?.addEventListener("click", () => {
    viewMode = "all";
    setActiveViewButtons();
    refresh();
  });

  els.viewFavs?.addEventListener("click", () => {
    viewMode = "favorites";
    setActiveViewButtons();
    refresh();
  });
  
  els.grid?.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    const card = e.target.closest("article[data-id]");
    const id = card?.dataset?.id;
    if (!id) return;

    const habit = allHabits.find(h => h.id === id);
    if (!habit) return;

    const action = btn.dataset.action;

    if (action === "details") {
      openDialog(habit);
    }

    if (action === "favorite") {
    toggleFavorite(id); 
    refresh();          
    }
  });
  
  els.dialogClose?.addEventListener("click", () => els.dialog?.close());
  
  els.dialogFav?.addEventListener("click", () => {
    if (!selectedHabitId) return;
    toggleFavorite(selectedHabitId);
    refresh();
  });
}

async function init() {
  if (!els.grid || !els.status) return;

  setStatus("Loading habits…");

const data = await fetchHabits(); 

  if (data?.error) {
    setStatus(data.message || "Could not load habits.");
    render([]);
    return;
  }

  allHabits = Array.isArray(data) ? data : [];
  
  if (allHabits.length < 15) {
    setStatus("Data loaded, but fewer than 15 items were found.");
  } else {
    setStatus(`Loaded ${allHabits.length} habits. Ready.`);
  }

  setupEvents();
  setActiveViewButtons();
  refresh();
}

init();
