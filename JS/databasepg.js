// HTTP server, PostgreSQL database-iig holbon backend-g hiisen kod.
// Node.js ashiglaj plain module-r bichigdsen.

const http = require("http");
const { Client } = require("pg");
const url = require("url");
const fs = require("fs");
const path = require("path");

// Database client setup
const db = new Client({
  user: "postgres",
  host: "localhost",
  database: "server",
  password: "admin",
  port: 5432,
});
db.connect();

// Request body parse hiih utility funkts.
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk)); // Body data-g unshina.
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

// Route handler-uudiig zarlana.
const routes = {
  // GET method-d uilchleh route-uud.
  GET: {
    "/api/clubs": async (req, res) => {
      try {
        const result = await db.query("SELECT * FROM clubs");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result.rows));
      } catch (error) {
        console.error("Error fetching clubs:", error);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      }
    },
    "/api/clubs/:id": async (req, res, params) => {
      try {
        const result = await db.query("SELECT * FROM clubs WHERE id = $1", [
          params.id,
        ]);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result.rows));
      } catch (error) {
        console.error("Error fetching club:", error);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      }
    },
    "/api/events": async (req, res) => {
      try {
        const result = await db.query(
          "SELECT id, title, description, date, location, image_path, rsvp_count FROM events"
        );
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result.rows));
      } catch (error) {
        console.error("Error fetching events:", error);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      }
    },
    "/api/events/:id": async (req, res, params) => {
      try {
        const result = await db.query("SELECT * FROM events WHERE id = $1", [
          params.id,
        ]);
        if (result.rows.length === 0) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Event not found" }));
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(result.rows[0]));
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      }
    },
  },
  // POST method-d uilchleh route-uud.
  POST: {
<<<<<<< HEAD
    // Event uusgeh route.
=======
    "/api/login": async (req, res) => {
      try {
        const body = JSON.parse(await parseBody(req));
        const { email, password } = body;

        if (!email || !password) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ error: "Email and password are required." })
          );
          return;
        }

        const result = await db.query(
          "SELECT * FROM login WHERE email = $1 AND password = $2",
          [email, password]
        );

        if (result.rows.length === 0) {
          res.writeHead(401, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid email or password." }));
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              success: true,
              message: "Login successful.",
              user: {
                id: result.rows[0].id,
                email: result.rows[0].email,
                last_login: result.rows[0].last_login,
              },
            })
          );
        }
      } catch (error) {
        console.error("Error during login:", error);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      }
    },
>>>>>>> 5c67406189b6521345b5d896a0efdeb64b3a74d6
    "/api/events": async (req, res) => {
      try {
        const body = JSON.parse(await parseBody(req)); // Body-g parse hiine.
        const { title, description, date, location, image_path } = body;

        const result = await db.query(
          "INSERT INTO events (title, description, date, location, image_path) VALUES ($1, $2, $3, $4, $5) RETURNING id",
          [title, description, date, location, image_path]
        );

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ id: result.rows[0].id }));
      } catch (error) {
        console.error("Error creating event:", error);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      }
    },
    // Event RSVP nemelt hiih(count toolohdoo ashiglana)
    "/api/events/:id/rsvp": async (req, res, params) => {
      try {
        const eventId = params.id;

        await db.query(
          "UPDATE events SET rsvp_count = rsvp_count + 1 WHERE id = $1",
          [eventId]
        );

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true }));
      } catch (error) {
        console.error("Error updating RSVP:", error);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      }
    },
  },
  // File serve hiih(zuragnii input ee zasah)
  GET_FILE: {
    "/uploads/:filename": async (req, res, params) => {
      try {
        const filePath = path.join(__dirname, "uploads", params.filename);

        if (fs.existsSync(filePath)) {
          const fileStream = fs.createReadStream(filePath);
          res.writeHead(200, { "Content-Type": "image/jpeg" });
          fileStream.pipe(res);
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "File not found" }));
        }
      } catch (error) {
        console.error("Error fetching file:", error);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      }
    },
  },
  "/api/users/:id/username": async (req, res, params) => {
    try {
      const userId = params.id;
      const body = JSON.parse(await parseBody(req));
      const { username } = body;

      if (!username) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Username is required." }));
        return;
      }

      const result = await db.query(
        "UPDATE users SET username = $1 WHERE id = $2 RETURNING id, username",
        [username, userId]
      );

      if (result.rowCount === 0) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "User not found." }));
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, user: result.rows[0] }));
      }
    } catch (error) {
      console.error("Error updating username:", error);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
    }
  },
};

// Route-g match hiih funkts.
function matchRoute(method, pathname) {
  const routeKeys = Object.keys(routes[method] || {});
  for (const route of routeKeys) {
    const routeParts = route.split("/");
    const pathParts = pathname.split("/");

    if (routeParts.length === pathParts.length) {
      const params = {};
      const isMatch = routeParts.every((part, i) => {
        if (part.startsWith(":")) {
          params[part.slice(1)] = pathParts[i];
          return true;
        }
        return part === pathParts[i];
      });

      if (isMatch) return { handler: routes[method][route], params };
    }
  }
  return null;
}

// Server uusgej ehluulne.
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // CORS header-nuud nemelt.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const method = req.method;
  const routeMatch = matchRoute(method, pathname);

  if (routeMatch) {
    const { handler, params } = routeMatch;
    await handler(req, res, params);
  } else {
    // Fallback 404
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

// Start the server
server.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});
