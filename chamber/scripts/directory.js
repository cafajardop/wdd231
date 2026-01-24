(() => {
  const membersEl = document.querySelector("#members");
  const gridBtn = document.querySelector("#gridBtn");
  const listBtn = document.querySelector("#listBtn");
  
  if (!membersEl || !gridBtn || !listBtn) return;

  async function getMembers() {
    const response = await fetch("data/members.json");
    if (!response.ok) throw new Error("Failed to fetch members");
    const data = await response.json();
    return data.members;
  }

  function renderMembers(members) {
    membersEl.innerHTML = "";

    members.forEach(member => {
      const card = document.createElement("article");
      card.classList.add("card");

      card.innerHTML = `
        <img src="${member.image}" alt="Logo of ${member.name}" loading="lazy">
        <h3>${member.name}</h3>
        <p>${member.address}</p>
        <p>${member.phone}</p>
        <p>
          <a href="${member.website}" target="_blank" rel="noopener">
            Website
          </a>
        </p>
        <p>Membership level: ${member.membership}</p>
      `;

      membersEl.appendChild(card);
    });
  }

  function setGridView() {
    membersEl.classList.add("grid");
    membersEl.classList.remove("list");
    gridBtn.setAttribute("aria-pressed", "true");
    listBtn.setAttribute("aria-pressed", "false");
  }

  function setListView() {
    membersEl.classList.add("list");
    membersEl.classList.remove("grid");
    listBtn.setAttribute("aria-pressed", "true");
    gridBtn.setAttribute("aria-pressed", "false");
  }

  gridBtn.addEventListener("click", setGridView);
  listBtn.addEventListener("click", setListView);

  getMembers()
    .then(renderMembers)
    .catch(console.error);
})();
