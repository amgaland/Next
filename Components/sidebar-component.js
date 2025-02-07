class SidebarNavigation extends HTMLElement {
  constructor() {
    super();

    // Attach a shadow DOM
    const shadow = this.attachShadow({ mode: "open" });

    // Create a container for the sidebar
    const sidebar = document.createElement("aside");
    sidebar.classList.add("sidebar");

    // Create the profile section
    const profileHeader = document.createElement("header");
    profileHeader.classList.add("profile");

    const avatar = document.createElement("figure");
    avatar.classList.add("avatar");

    const roleText = document.createElement("p");
    roleText.textContent = "PRODUCT DESIGNER";

    const name = document.createElement("h2");
    name.textContent = "Loading...";

    profileHeader.appendChild(avatar);
    profileHeader.appendChild(roleText);
    profileHeader.appendChild(name);

    // Define the menu items
    const menuItems = [
      { href: "./Dashboard.html", text: "Dashboard" },
      { href: "./MatchMaking.html", text: "Match Making" },
      { href: "./Activities.html", text: "Activities" },
      { href: "./Event.html", text: "Event" },
      { href: "./Notification.html", text: "Notification" },
      { href: "./clubs.html", text: "Clubs" },
      { href: "./CreateClub.html", text: "Create a club" },
      { href: "./Settings.html", text: "Settings" },
      { href: "./Upgrade.html", text: "Upgrade", class: "upgrade" },
    ];

    // Create the menu
    const menu = document.createElement("nav");
    menu.classList.add("menu");

    menuItems.forEach((item) => {
      const link = document.createElement("a");
      link.href = item.href;
      link.textContent = item.text;
      link.classList.add("menu-item");
      if (item.class) link.classList.add(item.class);
      menu.appendChild(link);

      // Add event listener to set 'active' class on click
      link.addEventListener("click", (e) => {
        // Remove 'active' class from all menu items
        const allLinks = menu.querySelectorAll(".menu-item");
        allLinks.forEach((link) => link.classList.remove("active"));

        // Add 'active' class to the clicked link
        e.currentTarget.classList.add("active");

        // Dynamically add the 'upgrade' class to the clicked link
        if (e.currentTarget.href === "./Upgrade.html") {
          e.currentTarget.classList.add("upgrade");
        }
      });
    });

    // Add styles to the shadow DOM
    const style = document.createElement("style");
    style.textContent = `
      .sidebar {
        width: 250px;
        background: rgba(28, 28, 31, 0.8);
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 10px;
      }

      .sidebar header.profile {
        text-align: center;
        margin-bottom: 20px;
      }

      header.profile figure.avatar {
        width: 60px;
        height: 60px;
        background: #333;
        border-radius: 50%;
        margin-bottom: 10px;
      }

      nav.menu {
        width: 100%;
      }

      .menu-item {
        display: block;
        padding: 10px 15px;
        color: #aaa;
        text-decoration: none;
        border-radius: 8px;
        margin-bottom: 5px;
        transition: background 0.3s ease;
      }

      .menu-item:hover,
      .menu-item.upgrade {
        background: #ff5f57;
        color: white;
      }

      .menu-item.active {
        background: #ff5f57;
        color: white;
      }
    `;

    // Append all elements to the sidebar container
    sidebar.appendChild(profileHeader);
    sidebar.appendChild(menu);

    // Attach the sidebar container to the shadow DOM
    shadow.appendChild(style);
    shadow.appendChild(sidebar);
  }

  updateUsername(userName) {
    const nameElement = this.shadowRoot.querySelector("header.profile h2");
    if (nameElement) {
      nameElement.textContent = userName;
    } else {
      console.warn("Name element not found in sidebar.");
    }
  }
}

// Define the custom element
customElements.define("sidebar-navigation", SidebarNavigation);
