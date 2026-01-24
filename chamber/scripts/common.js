document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector("#menuToggle");
  const nav = document.querySelector("#siteNav");

  if (!button || !nav) return;

  button.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    button.setAttribute("aria-expanded", String(isOpen));
  });

  const year = document.querySelector("#year");
  const lastModified = document.querySelector("#lastModified");

  if (year) year.textContent = new Date().getFullYear();
  if (lastModified) lastModified.textContent = document.lastModified;
});
