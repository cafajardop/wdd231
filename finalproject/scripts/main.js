function setYear() {
  const yearEl = document.querySelector("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

function setupMobileNav() {
  const toggleBtn = document.querySelector(".nav-toggle");
  const navList = document.querySelector("#primary-nav");

  if (!toggleBtn || !navList) return;

  const openClass = "is-open";

  const setExpanded = (isOpen) => {
    toggleBtn.setAttribute("aria-expanded", String(isOpen));
    navList.classList.toggle(openClass, isOpen);
  };

  const isOpen = () => navList.classList.contains(openClass);

  toggleBtn.addEventListener("click", () => {
    setExpanded(!isOpen());
  });
  
  navList.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;
    
    const toggleVisible = getComputedStyle(toggleBtn).display !== "none";
    if (toggleVisible) setExpanded(false);
  });
  
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setExpanded(false);
  });
  
  window.addEventListener("resize", () => {
    const toggleVisible = getComputedStyle(toggleBtn).display !== "none";
    if (!toggleVisible) {
      setExpanded(false);
    }
  });
}

setYear();
setupMobileNav();
