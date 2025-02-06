class EventCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        console.log(this)
        const title = this.getAttribute("title") || "Unknown Event";
        const description = this.getAttribute("description") || "No description available.";
        const date = new Date(this.getAttribute("date")).toLocaleString();
        const location = this.getAttribute("location") || "Unknown location";
        const image = this.getAttribute("image_path") || "https://placehold.co/250x150";

        const rsvpCount = this.getAttribute("rsvp-count") || 0;
        const eventId = this.getAttribute("event-id");

        this.shadowRoot.innerHTML = `
        <style>
            .event-card {
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            transition: transform 0.2s, box-shadow 0.2s;
            border: 1px solid rgba(206, 204, 204, 0.1);
            }

            .event-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
            }

            .event-card img {
            width: 100%;
            height: 150px;
            object-fit: cover;
            }

            .event-card-content {
            padding: 15px;
            }

            .event-card-content h3 {
            color: #EAEAEA;
            font-family: 'Bebas Neue', sans-serif;
            font-size: 1.2rem;
            margin: 0 0 10px;
            }

            .event-card-content p {
            margin: 0;
            font-family: 'Open Sans', sans-serif;
            font-size: 0.9rem;
            color: #C0C0C0;
            }

            .event-card-content button {
            margin-top: 15px;
            padding: 10px;
            width: 100%;
            background: #4A1E69;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            }

            .event-card-content button:hover {
            background: #6A2A91;
            }
            .location-css {
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
            }
        </style>
        <div class="event-card">
            <img src="${image}" alt="Event Image">
            <div class="event-card-content">
                <h3>${title}</h3>
                <p>${description}</p>
                <p><strong>Date:</strong> ${date}</p>
                <p class="location-css"><strong>Location:</strong> ${location}</p>
                <p><strong>RSVPs:</strong> ${rsvpCount}</p>
                <button id="rsvp-btn">GOING</button>
            </div>
        </div>
        `;

        this.shadowRoot.getElementById("rsvp-btn").addEventListener("click", () => {
            this.rsvpEvent(eventId);
        });
    }

    async rsvpEvent(eventId) {
        if (!eventId) return;

        const response = await fetch(`http://localhost:3000/api/events/${eventId}/rsvp`, { method: "POST" });
        if (response.ok) {
            alert("RSVP successful!");
            this.setAttribute("rsvp-count", Number(this.getAttribute("rsvp-count")) + 1);
            this.render();

            // Dispatch CustomEvent when RSVP is successful
            const eventData = {
                id: eventId,
                title: this.getAttribute("title"),
                description: this.getAttribute("description"),
                date: this.getAttribute("date"),
                location: this.getAttribute("location"),
                rsvp_count: this.getAttribute("rsvp-count")
            };

            this.dispatchEvent(new CustomEvent("event-added", {
                detail: eventData,
                bubbles: true, // Allow event to bubble up the DOM
                composed: true // Cross shadow DOM boundaries
            }));
            console.log(rsvpCount)
        } else {
            alert("Error RSVPing to the event.");
        }
    }

}

customElements.define("event-card", EventCard);
