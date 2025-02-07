const toggleFormBtn = document.getElementById("toggle-form-btn");
const createEventDialog = document.getElementById("create-event-dialog");

toggleFormBtn.addEventListener("click", () => {
    if (!createEventDialog.open) {
        createEventDialog.showModal(); // Show as a modal dialog
    }
});

document.getElementById("close-form-btn").addEventListener("click", () => {
    createEventDialog.close(); // Close the dialog
});


const toggleCartBtn = document.getElementById("toggle-cart-btn");

toggleCartBtn.addEventListener("click", () => {
    console.log("gg");
})

document.getElementById("go-icon").addEventListener("click", function () {
    let eventCart = document.getElementById("eventCart");

    // Toggle display
    if (eventCart.style.display === "none" || eventCart.style.display === "") {
        eventCart.style.display = "block";
    } else {
        eventCart.style.display = "none";
    }
});

// Fetch Events
async function fetchEvents() {
    const response = await fetch("http://localhost:3000/api/events");
    const events = await response.json();
    const eventList = document.getElementById("event-list");
    eventList.innerHTML = ""; // Clear existing events

    events.forEach((event) => {
        const clubCard = document.createElement("event-card");
        clubCard.setAttribute("title", event.title);
        clubCard.setAttribute("description", event.description);
        clubCard.setAttribute("date", event.date);
        clubCard.setAttribute("location", event.location);
        clubCard.setAttribute("image", event.image_path || "https://placehold.co/250x150");
        clubCard.setAttribute("rsvp-count", event.rsvp_count || 0);
        clubCard.setAttribute("event-id", event.id);

        eventList.appendChild(clubCard);
    });
}

//Eventiig hailtaar ni filterlene
function filterEvents() {
    const searchInput = document
        .getElementById("search-input")
        .value.toLowerCase();
    const eventCards = document.querySelectorAll(".event-card");

    eventCards.forEach((card) => {
        const title = card.dataset.title || "";
        if (title.includes(searchInput)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
}
// Create Event
document.getElementById("create-event-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const date = document.getElementById("date").value;
    const location = document.getElementById("location").value;
    const imageInput = document.getElementById("image").files[0];

    let image_path = null;

    if (imageInput) {
        const formData = new FormData();
        formData.append("image", imageInput);

        const uploadResponse = await fetch("http://localhost:3000/uploads", {
            method: "GET_FILE",
            body: formData,
        });

        if (uploadResponse.ok) {
            const uploadData = await uploadResponse.json();
            image_path = uploadData.image_path;
        } else {
            alert("Error uploading image.");
            return;
        }
    }

    const response = await fetch("http://localhost:3000/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, date, location, image_path }),
    });

    if (response.ok) {
        alert("Event created successfully!");
        fetchEvents();
    } else {
        alert("Error creating event.");
    }
});

// RSVP to an Event
async function rsvpEvent(eventId) {
    const response = await fetch(
        `http://localhost:3000/api/events/${eventId}/rsvp`,
        { method: "POST" }
    );
    if (response.ok) {
        alert("RSVP successful!");
        fetchEvents();
    } else {
        alert("Error RSVPing to the event.");
    }
}

// Initial Fetch
fetchEvents();
