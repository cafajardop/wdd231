const KEY = "dailyfit_favorites";

export function getFavorites() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isFavorite(id) {
  return getFavorites().includes(id);
}

export function toggleFavorite(id) {
  const favs = getFavorites();
  const next = favs.includes(id) ? favs.filter(x => x !== id) : [...favs, id];
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
