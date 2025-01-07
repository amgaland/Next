import { activities } from "./dummyActivities.js";

document.addEventListener("DOMContentLoaded", () => {
  const activityContainer = document.getElementById("activity-container");

  // Render Activity Sections (Online and Offline)
  function renderActivities() {
    const categories = ["online", "offline"];
    activityContainer.innerHTML = "";

    categories.forEach((category) => {
      const categorySection = document.createElement("div");
      categorySection.className = "activity-category";

      categorySection.innerHTML = `
        <h2>${category === "online" ? "Online Activities" : "Offline Activities"}</h2>
        <div class="activity-carousel" id="${category}-carousel"></div>
      `;

      const carousel = categorySection.querySelector(".activity-carousel");
      const filteredActivities = activities.filter(
        (activity) => activity.category === category
      );

      filteredActivities.forEach((activity) => {
        const card = document.createElement("div");
        card.className = "activity-card";
        card.innerHTML = `
          <img src="${activity.image}" alt="${activity.name}" />
          <div class="activity-card-overlay">
            <h3>${activity.name}</h3>
            <p>${activity.description}</p>
            <button onclick="viewActivity(${activity.id})">View Details</button>
          </div>
        `;
        carousel.appendChild(card);
      });

      activityContainer.appendChild(categorySection);
    });
  }

  // View Activity Details (Placeholder)
  window.viewActivity = (id) => {
    alert(`Viewing details for Activity ID: ${id}`);
  };

  renderActivities();
});
