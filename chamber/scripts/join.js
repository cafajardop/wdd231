const timestampInput = document.querySelector("#timestamp");
if (timestampInput) {
    timestampInput.value = new Date().toISOString();
}

document.querySelectorAll("[data-modal]").forEach((link) => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const id = link.getAttribute("data-modal");
        const dialog = document.getElementById(id);

        if (dialog && typeof dialog.showModal === "function") {
            dialog.showModal();
        }
    });
});

document.querySelectorAll("dialog [data-close]").forEach((btn) => {
    btn.addEventListener("click", () => {
        const dialog = btn.closest("dialog");
        if (dialog) dialog.close();
    });
});
