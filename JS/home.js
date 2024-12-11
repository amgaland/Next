document.addEventListener("DOMContentLoaded", async () => {
  const eventsList = document.getElementById("events-list");

  try {
    const response = await fetch("/api/events");
    const events = await response.json();

    events.forEach((event) => {
      const eventElement = document.createElement("div");
      eventElement.classList.add("event");
      eventElement.innerHTML = `
          <h3>${event.name}</h3>
          <p>${event.description}</p>
          <button onclick="joinEvent(${event.id})">Join Event</button>
        `;
      eventsList.appendChild(eventElement);
    });
  } catch (error) {
    console.error("Error fetching events:", error);
  }
});

async function joinEvent(eventId) {
  // Logic to handle event joining (could include a POST request to the backend)
  alert(`Joined event with ID: ${eventId}`);
}
