document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("form");
  const emailInput = document.getElementById("Email");
  const passwordInput = document.getElementById("password");

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (email === "" || password === "") {
      alert("Please enter both email and password");
      return;
    }

    // Create the payload for the POST request
    const loginData = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert("Login successful!");
          // Redirect to the dashboard or home page
          window.location.href = "/dashboard.html";
        } else {
          alert("Invalid email or password");
        }
      } else {
        alert("Error during login. Please try again later.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again later.");
    }
  });
});
