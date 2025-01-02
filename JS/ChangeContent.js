function changeContent(page) {
  const content = document.getElementById("main-content");
  const menuItems = document.querySelectorAll(".menu-item");

  // Remove active class from all menu items
  menuItems.forEach((item) => item.classList.remove("active"));

  // Add active class to the clicked menu item
  const clickedItem = document.querySelector(
    `.menu-item[onclick="changeContent('${page}')"]`
  );
  if (clickedItem) {
    clickedItem.classList.add("active");
  }

  // Fetch the content of the clicked page
  fetch(`${page}.html`)
    .then((response) => response.text())
    .then((data) => {
      content.innerHTML = data;
    })
    .catch((error) => {
      console.error("Error loading content:", error);
      content.innerHTML = "<p>Sorry, the content could not be loaded.</p>";
    });
}
