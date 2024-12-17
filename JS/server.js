const express = require("express");
const pgp = require("pg-promise")();
const app = express();
const port = 3001;

// Database connection setup
const db = pgp("postgres://postgres:amgalan0822@localhost:5432/login");

// Middleware to parse JSON request bodies
app.use(express.json()); // This line is important to handle JSON data from requests

// Root route
app.get("/", (req, res) => {
  res.send("Server is working!");
});

// Example login route
app.post("/login", (req, res) => {
  const { email, password } = req.body; // assuming JSON body with email and password

  // Query to check if the email and password match
  db.one("SELECT * FROM login WHERE email = $1 AND password = $2", [
    email,
    password,
  ])
    .then((data) => {
      res.json({ message: "Login successful", user: data });
    })
    .catch((error) => {
      res.status(401).json({ message: "Invalid credentials", error });
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
