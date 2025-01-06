document.addEventListener("DOMContentLoaded", () => {
    const clubName = document.getElementById("club-name");
    const clubImage = document.getElementById("club-image");
    const clubDescription = document.getElementById("club-description");

    function getQueryParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            id: params.get("id"),
        };
    }

    async function fetchClubDetails(id) {
        try {
            const response = await fetch(`http://localhost:3000/api/clubs/${id}`);
            if (!response.ok) throw new Error("Failed to fetch club details.");
            return response.json();
        } catch (error) {
            console.error(error);
            document.body.innerHTML = "<p>Failed to load club details. Please try again.</p>";
        }
    }

    async function renderClubDetails() {
        const { id } = getQueryParams();
        if (!id) {
            document.body.innerHTML = "<p>Invalid club ID. Please go back and try again.</p>";
            return;
        }

        const club = await fetchClubDetails(id);
        if (!club) return;

        clubName.textContent = club.name;
        clubImage.src = club.image;
        clubImage.alt = club.name;
        clubDescription.textContent = club.description;
    }

    renderClubDetails();

    window.goBack = () => {
        window.history.back();
    };
});
