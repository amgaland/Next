document.addEventListener("DOMContentLoaded", () => {
  const clubList = document.getElementById("club-list");
  const searchInput = document.getElementById("search");
  const categoryFilter = document.getElementById("category");

  function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      search: params.get("search") || "",
      category: params.get("category") || "all",
    };
  }

  function updateQueryParams(searchTerm, selectedCategory) {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params}`
    );
  }

  async function fetchClubs(searchTerm, selectedCategory) {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      if (selectedCategory !== "all") params.set("category", selectedCategory);

      const response = await fetch(`http://localhost:3000/api/clubs?${params}`);
      if (!response.ok) throw new Error("API error");
      return response.json();
    } catch (error) {
      console.error(error);
      clubList.innerHTML = "<p>Failed to load clubs. Please try again.</p>";
      return [];
    }
  }

  async function renderClubs() {
    clubList.innerHTML = "<p>Loading...</p>";
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    const clubs = await fetchClubs(searchTerm, selectedCategory);

    clubList.innerHTML = "";
    clubs.forEach((club) => {
      const card = document.createElement("div");
      card.className = "club-card";
      card.innerHTML = `
      <img src="${club.image}" alt="${club.name}">
      <div class="club-card-content">
        <h3>${club.name}</h3>
        <p>${club.description}</p>
        <button onclick="viewClub(${club.id})">View Details</button>
      </div>
    `;
      clubList.appendChild(card);
    });
  }

  const { search, category } = getQueryParams();
  searchInput.value = search;
  categoryFilter.value = category;

  renderClubs();

  searchInput.addEventListener("input", renderClubs);
  categoryFilter.addEventListener("change", renderClubs);

  window.viewClub = (id) => {
    window.location.href = "./club_details.html?id=" + id;
  };
});
