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

        // Restore sorting functionality
        this.shadowRoot.querySelector("#filter").addEventListener("change", (e) => {
            this.updateURLQuery(e.target.value);
        });

        // Listen for new events being added to the cart
        document.addEventListener("event-added", (e) => {
            const eventGoingCart = document.querySelector("event-goingcart");
            if (eventGoingCart) {
                eventGoingCart.addToCart(e.detail);
            }
        });

        // Listen for search updates
        document.addEventListener("search-updated", (e) => {
            this.filterEvents(e.detail);
        });

        // Check for existing query params and apply filtering/sorting
        const urlParams = new URLSearchParams(window.location.search);
        const sortBy = urlParams.get("sort") || "date";
        this.shadowRoot.querySelector("#filter").value = sortBy;
    }

    async fetchEvents() {
        try {
            const response = await fetch("http://localhost:3000/api/events");
            if (!response.ok) throw new Error("Failed to fetch events");
            this.events = await response.json();

            // Apply search filter if a query exists
            const urlParams = new URLSearchParams(window.location.search);
            const searchQuery = urlParams.get("search") || "";
            this.filterEvents(searchQuery);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    }

    updateURLQuery(criteria) {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set("sort", criteria);
        window.history.replaceState({}, "", `${window.location.pathname}?${urlParams.toString()}`);
        this.sortEvents(criteria);
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

    filterEvents(query) {
        const filteredEvents = this.events.filter(event =>
            event.title.toLowerCase().includes(query.toLowerCase()) ||
            event.description.toLowerCase().includes(query.toLowerCase()) ||
            event.location.toLowerCase().includes(query.toLowerCase())
        );
        this.renderEvents(filteredEvents);
    }

    renderEvents(filteredEvents = this.events) {
        const eventListContainer = this.shadowRoot.querySelector(".event-list");
        eventListContainer.innerHTML = "";

        filteredEvents.forEach(event => {
            const eventCard = document.createElement("event-card");
            eventCard.setAttribute("title", event.title);
            eventCard.setAttribute("description", event.description);
            eventCard.setAttribute("date", event.date);
            eventCard.setAttribute("location", event.location);
            eventCard.setAttribute("rsvp-count", event.rsvp_count);
            eventCard.setAttribute("event-id", event.id);
            eventCard.setAttribute("image_path", event.image_path);

            eventCard.addEventListener("rsvp", (e) => {
                const eventGoingCart = document.querySelector("event-goingcart");
                if (eventGoingCart) {
                    eventGoingCart.addToCart(e.detail);
                }
            });

            eventListContainer.appendChild(eventCard);
        });
    }
}

customElements.define("event-cardlist", EventCardList);
