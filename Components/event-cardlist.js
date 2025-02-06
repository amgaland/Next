import "./event-card.js";

class EventCardList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
        <style>
            .event-list {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 20px;
            }
        </style>
        <div class="event-list"></div>`;
    }

    connectedCallback() {
        this.fetchEvents();

        // Listen for the event from event-card
        document.addEventListener("event-added", (e) => {
            const eventGoingCart = document.querySelector("event-goingcart");
            if (eventGoingCart) {
                eventGoingCart.addToCart(e.detail);
            }
        });
    }


    async fetchEvents() {
        try {
            const response = await fetch("http://localhost:3000/api/events");
            if (!response.ok) throw new Error("Failed to fetch events");
            const events = await response.json();
            this.renderEvents(events);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    }

    renderEvents(events) {
        const eventListContainer = this.shadowRoot.querySelector(".event-list");
        eventListContainer.innerHTML = "";

        events.forEach(event => {
            const eventCard = document.createElement("event-card");
            eventCard.setAttribute("title", event.title);
            eventCard.setAttribute("description", event.description);
            eventCard.setAttribute("date", event.date);
            eventCard.setAttribute("location", event.location);
            eventCard.setAttribute("rsvp-count", event.rsvp_count);
            eventCard.setAttribute("event-id", event.id);
            eventCard.setAttribute("image_path", event.image_path);

            // Listen for the "rsvp" event and add to the cart
            eventCard.addEventListener("rsvp", (e) => {
                const eventGoingCart = document.querySelector("event-goingcart");
                eventGoingCart.addToCart(e.detail); // Passing event details to cart
            });

            eventListContainer.appendChild(eventCard);
        });
    }
}

customElements.define("event-cardlist", EventCardList);
