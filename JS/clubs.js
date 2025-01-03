import { groups } from "./dummy.js";

document.addEventListener("DOMContentLoaded", () => {
  const clubList = document.getElementById("club-list");
  const searchInput = document.getElementById("search");
  const categoryFilter = document.getElementById("category");

  // Function to get query parameters
  function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      search: params.get("search") || "",
      category: params.get("category") || "all",
    };
  }

  // Function to update query parameters
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

  // Render Club Cards
  function renderClubs(clubsToRender) {
    clubList.innerHTML = "";
    clubsToRender.forEach((club) => {
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

  // Filter Clubs
  function filterClubs() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filteredClubs = groups.filter((club) => {
      const matchesSearch =
        !searchTerm || club.name.toLowerCase().includes(searchTerm);
      const matchesCategory =
        selectedCategory === "all" || club.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    renderClubs(filteredClubs);

    // Update query parameters in the URL
    updateQueryParams(searchTerm, selectedCategory);
  }

  // Set initial filter values from query parameters
  const { search, category } = getQueryParams();
  searchInput.value = search;
  categoryFilter.value = category;

  // Apply initial filters and render clubs
  filterClubs();

  // Event Listeners for Filters
  searchInput.addEventListener("input", filterClubs);
  categoryFilter.addEventListener("change", filterClubs);

  // View Club Details (Placeholder)
  window.viewClub = (id) => {
    alert(`Viewing details for Club ID: ${id}`);
  };
});
