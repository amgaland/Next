const http = require("http");
const { Client } = require("pg");
const url = require("url");
const fs = require("fs");
const path = require("path");

// Database client setup
const db = new Client({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "amgalan0822",
  port: 5432,
});
db.connect();

// Utility to parse request body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

// Route handlers
const routes = {
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
  POST: {
    "/api/events": async (req, res) => {
      try {
        const body = JSON.parse(await parseBody(req));
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
};

// Match route function
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

// Create the server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Add CORS headers
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
