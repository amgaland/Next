import "./event-card.js";

class EventCardList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.events = [];
        this.shadowRoot.innerHTML = `
        <style>
            .event-list {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 20px;
            }
                    .filter-container {
                margin-bottom: 10px;
            }
            select {
                padding: 5px;
                border: 1px solid #ccc;
                border-radius: 5px;
                cursor: pointer;
            }
        </style>
        <div class="filter-container">
            <label for="filter">Sort by: </label>
            <select id="filter">
                <option value="date">Date</option>
                <option value="id">ID</option>
                <option value="name">Name</option>
            </select>
        </div>
        <div class="event-list"></div>`;
    }

    connectedCallback() {
        this.fetchEvents();
        this.shadowRoot.querySelector("#filter").addEventListener("change", (e) => this.sortEvents(e.target.value));
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
            this.events = await response.json();
            this.renderEvents();
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    }

    sortEvents(criteria) {
        if (criteria === "date") {
            this.events.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (criteria === "id") {
            this.events.sort((a, b) => a.id - b.id);
        } else if (criteria === "name") {
            this.events.sort((a, b) => a.title.localeCompare(b.title));
        }
        this.renderEvents();
    }

    renderEvents() {
        const eventListContainer = this.shadowRoot.querySelector(".event-list");
        eventListContainer.innerHTML = "";

        this.events.forEach(event => {
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
                 // Passing event details to cart
                if (eventGoingCart) {
                    eventGoingCart.addToCart(e.detail);
                }
            });

            eventListContainer.appendChild(eventCard);
        });
    }
}

customElements.define("event-cardlist", EventCardList);
