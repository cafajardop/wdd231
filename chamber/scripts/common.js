document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector("#menuToggle");
  const nav = document.querySelector("#siteNav");

  if (button && nav) {
    button.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      button.setAttribute("aria-expanded", String(isOpen));
    });
  }

  const year = document.querySelector("#year");
  const lastModified = document.querySelector("#lastModified");

  if (year) year.textContent = new Date().getFullYear();
  if (lastModified) lastModified.textContent = document.lastModified;


  if (nav) {
    const currentPage =
      location.pathname.split("/").pop() || "index.html";

    nav.querySelectorAll("a").forEach(link => {
      const href = link.getAttribute("href");

      if (href === currentPage) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      } else {
        link.classList.remove("active");
        link.removeAttribute("aria-current");
      }
    });
  }
});

