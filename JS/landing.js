document.addEventListener("DOMContentLoaded", () => {
  const menuItems = document.querySelectorAll(".menu-item");
  const mainContent = document.querySelector(".main-content");

  menuItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();

      // Remove the 'active' class from all menu items
      menuItems.forEach((menuItem) => menuItem.classList.remove("active"));

      // Add the 'active' class to the clicked menu item
      item.classList.add("active");

      // Update the content based on the clicked menu item
      const content = item.textContent.trim();
      mainContent.innerHTML = getContent(content);
    });
  });

  // Function to get content for the clicked menu item
  function getContent(page) {
    switch (page) {
      case "Dashboard":
        return `
            <header class="section-header">
              <h1>Dashboard</h1>
            </header>
            <ul class="cards">
              <li class="card">
                <span class="icon matchmaking"></span>
                <p>Match Making</p>
              </li>
              <li class="card">
                <span class="icon league"></span>
                <p>League</p>
              </li>
              <li class="card">
                <span class="icon tournaments"></span>
                <p>Tournaments</p>
              </li>
            </ul>`;
      case "Match Making":
        return `<header class="section-header"><h1>Match Making</h1></header><p>Match Making Content</p>`;
      case "Activities":
        return `<header class="section-header"><h1>Activities</h1></header><p>Activities Content</p>`;
      case "Event":
        return `<header class="section-header"><h1>Event</h1></header><p>Event Content</p>`;
      case "Notification":
        return `<header class="section-header"><h1>Notification</h1></header><p>Notification Content</p>`;
      case "Clubs":
        return `<header class="section-header"><h1>Clubs</h1></header><p>Clubs Content</p>`;
      case "Basketball":
        return `<header class="section-header"><h1>Basketball</h1></header><p>Basketball Content</p>`;
      case "Create a club":
        return `<header class="section-header"><h1>Create a Club</h1></header><p>Create a Club Content</p>`;
      case "Settings":
        return `<header class="section-header"><h1>Settings</h1></header><p>Settings Content</p>`;
      default:
        return `<header class="section-header"><h1>Welcome</h1></header><p>Select an option from the menu.</p>`;
    }
  }
});
