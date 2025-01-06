const http = require("http");
const { Client } = require("pg");
const url = require("url");

// Database client setup
const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "club",
    password: "admin",
    port: 5432,
});

client.connect();

// Route handlers
const routes = {
    GET: {
        "/api/clubs": async (req, res) => {
            // Fetch all clubs
            try {
                const result = await client.query("SELECT * FROM clubs");
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
                const result = await client.query("SELECT * FROM clubs WHERE id = $1", [
                    params.id,
                ]);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(result.rows));
            } catch (error) {
                console.error("Error fetching clubs:", error);
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Internal Server Error");
            }
        },
        "/api/clubs/:id/posts": async (req, res, params) => {
            // Fetch posts for a specific club
            try {
                const result = await client.query("SELECT * FROM posts WHERE club_id = $1 ORDER BY created_at DESC", [
                    params.id,
                ]);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(result.rows));
            } catch (error) {
                console.error("Error fetching posts:", error);
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Internal Server Error");
            }
        },
        "/api/clubs/:id/posts/:postId": async (req, res, params) => {
            // Fetch a specific post for a club
            try {
                const result = await client.query(
                    "SELECT * FROM posts WHERE id = $1 AND club_id = $2",
                    [params.postId, params.id]
                );
                if (result.rows.length === 0) {
                    res.writeHead(404, { "Content-Type": "text/plain" });
                    res.end("Post not found");
                } else {
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify(result.rows[0]));
                }
            } catch (error) {
                console.error("Error fetching post:", error);
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Internal Server Error");
            }
        },
    },
    POST: {
        "/api/clubs/:id/posts": async (req, res, params) => {
            // Add a new post to a specific club
            let body = "";
            req.on("data", (chunk) => (body += chunk));
            req.on("end", async () => {
                try {
                    const { userId, content } = JSON.parse(body);
                    const result = await client.query(
                        "INSERT INTO posts (club_id, user_id, content) VALUES ($1, $2, $3) RETURNING *",
                        [params.id, userId, content]
                    );
                    res.writeHead(201, { "Content-Type": "application/json" });
                    res.end(JSON.stringify(result.rows[0]));
                } catch (error) {
                    console.error("Error adding post:", error);
                    res.writeHead(500, { "Content-Type": "text/plain" });
                    res.end("Internal Server Error");
                }
            });
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
