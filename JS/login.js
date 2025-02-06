document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("Email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login successful!");
        updateSidebar(data.user.user_id);
      } else {
        alert(data.message || "Login failed.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again later.");
    }
  });
});

async function updateSidebar(userId) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/users/${userId}/username`
    );
    const data = await response.json();

    if (response.ok) {
      const userName = data.username;

      const sidebar = document.querySelector("sidebar-navigation");
      if (sidebar) {
        sidebar.updateUsername(userName);
      }
    }
  } catch (error) {
    console.error("Error fetching username:", error);
  }
}
