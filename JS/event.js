// Toggle the Create Event form visibility
const toggleFormBtn = document.getElementById("toggle-form-btn");
const createEventContainer = document.getElementById("create-event-container");

toggleFormBtn.addEventListener("click", () => {
  if (createEventContainer.style.display === "none") {
    createEventContainer.style.display = "block";
    toggleFormBtn.textContent = "Hide Form";
  } else {
    createEventContainer.style.display = "none";
    toggleFormBtn.textContent = "Create Event";
  }
});

// Fetch Events
async function fetchEvents() {
  const response = await fetch("http://localhost:3000/api/events");
  const events = await response.json();
  const eventList = document.getElementById("event-list");
  eventList.innerHTML = "";

  events.forEach((event) => {
    const eventCard = document.createElement("div");
    eventCard.className = "club-card";
    eventCard.innerHTML = `
        <img src="${
          event.image_path || "https://via.placeholder.com/250x150"
        }" alt="Event Image">
        <div class="club-card-content">
            <h3>${event.title}</h3>
            <p>${event.description}</p>
            <p><strong>Date:</strong> ${new Date(
              event.date
            ).toLocaleString()}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            <p><strong>RSVPs:</strong> ${event.rsvp_count || 0}</p>
            <button onclick="rsvpEvent(${event.id})">GOING</button>
        </div>
    `;
    eventCard.setAttribute("data-title", event.title.toLowerCase());
    eventList.appendChild(eventCard);
  });
}

// Filter Events by Search Input
function filterEvents() {
  const searchInput = document
    .getElementById("search-input")
    .value.toLowerCase();
  const eventCards = document.querySelectorAll(".club-card");

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
document
  .getElementById("create-event-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const date = document.getElementById("date").value;
    const location = document.getElementById("location").value;

    const response = await fetch("http://localhost:3000/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, date, location }),
    });

    if (response.ok) {
      alert("Event created successfully!");
      fetchEvents();
    } else {
      alert("Error creating event.");
    }
  });

document
  .getElementById("create-event-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    // Upload the image
    const imageInput = document.getElementById("image").files[0];
    const formData = new FormData();
    formData.append("image", imageInput);

    const uploadResponse = await fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    });

    const { image_path } = await uploadResponse.json();

    // Create the event with the uploaded image's path
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const date = document.getElementById("date").value;
    const location = document.getElementById("location").value;

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
