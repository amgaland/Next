document.addEventListener("DOMContentLoaded", () => {
  // club-list gesen DOM elementiig olj avaad, club-uudiig haruulna.
  const clubList = document.getElementById("club-list");
  // search input-g oloh ba hailtiin utga uurchlugduh uyed avna.
  const searchInput = document.getElementById("search");
  // category filter iig songoson category filter iig handle hiine.
  const categoryFilter = document.getElementById("category");

  // Query parametruudiig unshih funkts.
  function getQueryParams() {
    // URL-s search query parametruudiig avna.
    const params = new URLSearchParams(window.location.search);
    return {
      search: params.get("search") || "", // hailt hooson baihad default.
      category: params.get("category") || "all", // category-n default ni "all".
    };
  }

  // URL deerh query parametruudiig update hiine.
  function updateQueryParams(searchTerm, selectedCategory) {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm); // hailtiin ug nemne.
    if (selectedCategory !== "all") params.set("category", selectedCategory); // filter category nemne.
    window.history.replaceState(
      {}, // bairlal hadgalah data object.
      "", // title-g hooson.
      `${window.location.pathname}?${params}` // shine URL iig zaana.
    );
  }

  // Clubs-iin data-g API-s avah funkts.
  async function fetchClubs(searchTerm, selectedCategory) {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      if (selectedCategory !== "all") params.set("category", selectedCategory);

      const response = await fetch(`http://localhost:3000/api/clubs?${params}`);
      if (!response.ok) throw new Error("API error");
      return response.json(); // JSON-d hurvuulj butsaana.
    } catch (error) {
      console.error(error); // Aldaa log-iig console deer haruulna.
      clubList.innerHTML = "<p>Failed to load clubs. Please try again.</p>";
      return [];
    }
  }

  // Club-uudiig haruulah funkts.
  async function renderClubs() {
    clubList.innerHTML = "<p>Loading...</p>";
    const searchTerm = searchInput.value.toLowerCase(); // Hailtiin ug-g avaad lowecase bolgono
    const selectedCategory = categoryFilter.value; // Filter category avna.

    const clubs = await fetchClubs(searchTerm, selectedCategory); // API-s data avna.

    clubList.innerHTML = ""; // List-iig hooson bolgoj shinechlene.
    clubs.forEach((club) => {
      const card = document.createElement("div"); // club card uusgene.
      card.className = "club-card";
      card.innerHTML = `
      <img src="${club.image}" alt="${club.name}">
      <div class="club-card-content">
        <h3>${club.name}</h3>
        <p>${club.description}</p>
        <button onclick="viewClub(${club.id})">View Details</button>
      </div>
    `;
      clubList.appendChild(card); // Club card iig list ruu nemne.
    });
  }

  // Query params-uudiig avaad search, category-g belen bolgoh.
  const { search, category } = getQueryParams();
  searchInput.value = search;
  categoryFilter.value = category;

  renderClubs();

  // Hailt uurchlugduh bolgond update hiine.
  searchInput.addEventListener("input", renderClubs);

  // Category uurchlugduh bolgond update hiine.
  categoryFilter.addEventListener("change", renderClubs);

  // Club details page ruu shiljih funkts.
  window.viewClub = (id) => {
    window.location.href = "./club_details.html?id=" + id; // Club ID-g zaaj damjuulna.
  };
});
