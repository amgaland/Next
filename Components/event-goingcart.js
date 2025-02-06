class EventGoingCart extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.events = this.loadCart();

        this.shadowRoot.innerHTML = `
        <style>
            .cart-container {
                background: #1E1E2E;
                color: white;
                padding: 15px;
                border-radius: 10px;
                width: 100%;
                max-width: 300px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            }
            h3 {
                font-size: 1rem;
                text-align: center;
                margin-bottom: 10px;
                font-family: 'Bebas Neue', sans-serif;
            }
            .cart-list {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .cart-item {
                background: #292A3A;
                padding: 8px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 0.8rem;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }
            .cart-item img {
                width: 50px;
                height: 50px;
                border-radius: 5px;
                object-fit: cover;
                margin-right: 10px;
            }
            .cart-item-info {
                flex: 1;
                font-size: 0.75rem;
            }
            .cart-item-title {
                font-weight: bold;
                color: #EAEAEA;
            }
            .cart-item-date {
                color: #C0C0C0;
                font-size: 0.7rem;
            }
            .remove-btn {
                background: red;
                color: white;
                border: none;
                padding: 5px 8px;
                cursor: pointer;
                border-radius: 5px;
                font-size: 0.7rem;
            }
            .remove-btn:hover {
                background: darkred;
            }
        </style>
        <div class="cart-container">
            <h3>Going Cart</h3>
            <div class="cart-list"></div>
        </div>`;
    }

    connectedCallback() {
        this.render();
    }

    addToCart(event) {
        if (!this.events.some(e => e.id === event.id)) {
            this.events.push(event);
            this.saveCart();
            this.render();
        }
    }

    removeFromCart(eventId) {
        this.events = this.events.filter(event => event.id !== eventId);
        this.saveCart();
        this.render();
    }

    render() {
        const cartList = this.shadowRoot.querySelector(".cart-list");
        cartList.innerHTML = "";

        this.events.forEach(event => {
            const eventItem = document.createElement("div");
            eventItem.classList.add("cart-item");
            eventItem.innerHTML = `
                <img src="${event.image || 'https://placehold.co/50x50'}" alt="Event">
                <div class="cart-item-info">
                    <div class="cart-item-title">${event.title}</div>
                    <div class="cart-item-date">${new Date(event.date).toLocaleDateString()}</div>
                </div>
                <button class="remove-btn" data-id="${event.id}">X</button>
            `;

            eventItem.querySelector(".remove-btn").addEventListener("click", () => {
                this.removeFromCart(event.id);
            });

            cartList.appendChild(eventItem);
        });
    }

    saveCart() {
        localStorage.setItem("goingCart", JSON.stringify(this.events));
    }

    loadCart() {
        return JSON.parse(localStorage.getItem("goingCart")) || [];
    }
}

customElements.define("event-goingcart", EventGoingCart);
