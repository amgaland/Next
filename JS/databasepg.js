const express = require("express");
const { Client } = require("pg");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// PostgreSQL client setup
const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "admin", // Replace with your actual password
  database: "login",
});

client.connect();

// Routes

// Signup Route
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Check if the email already exists
    const userCheck = await client.query(
      "SELECT * FROM login WHERE email = $1",
      [email]
    );
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Insert the new user
    const result = await client.query(
      "INSERT INTO login (email, password, created_at) VALUES ($1, $2, NOW()) RETURNING *",
      [email, password]
    );

    res
      .status(201)
      .json({ message: "User registered successfully", user: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Check if the user exists
    const result = await client.query("SELECT * FROM login WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = result.rows[0];

    // Check if the password matches
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
