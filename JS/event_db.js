const http = require('http');
const { Client } = require('pg');
const url = require('url');

// Database connection
const db = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'event',
    password: 'admin',
    port: 5432,
});
db.connect();

// Utility to parse request body
function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => resolve(body));
        req.on('error', reject);
    });
}

// Server
const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;

    // Handle CORS (Optional)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (method === 'OPTIONS') {
        res.writeHead(204);
        return res.end();
    }

    try {
        if (method === 'GET' && req.url.startsWith('/uploads/')) {
            const filepath = path.join(__dirname, req.url);
            if (fs.existsSync(filepath)) {
                const fileStream = fs.createReadStream(filepath);
                res.writeHead(200, { 'Content-Type': 'image/jpeg' });
                fileStream.pipe(res);
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'File not found' }));
            }
        }
        if (method === 'POST' && req.url === '/upload') {
            const boundary = req.headers['content-type'].split('boundary=')[1];
            const chunks = [];
            req.on('data', chunk => chunks.push(chunk));
            req.on('end', async () => {
                const rawBody = Buffer.concat(chunks);
                const boundaryString = `--${boundary}`;
                const startIndex = rawBody.indexOf(boundaryString) + boundaryString.length + 2;
                const endIndex = rawBody.lastIndexOf(boundaryString) - 4;
                const fileBuffer = rawBody.slice(startIndex, endIndex);

                // Extract the filename from Content-Disposition
                const contentDisposition = rawBody.slice(0, startIndex).toString();
                const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
                const filename = filenameMatch ? filenameMatch[1] : `upload_${Date.now()}.jpg`;

                const filepath = `uploads/${filename}`;

                // Save file
                require('fs').writeFileSync(filepath, fileBuffer);

                // Respond with the file path
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ image_path: filepath }));
            });
        }

        if (method === 'POST' && req.url === '/events') {
            const body = JSON.parse(await parseBody(req));
            const { title, description, date, location, image_path } = body;
            const result = await db.query(
                'INSERT INTO events (title, description, date, location, image_path) VALUES ($1, $2, $3, $4, $5) RETURNING id',
                [title, description, date, location, image_path]
            );
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ id: result.rows[0].id }));
        } else if (method === 'GET' && req.url === '/events') {
            const result = await db.query('SELECT id, title, description, date, location, image_path, rsvp_count FROM events');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result.rows));
        } else if (method === 'POST' && parsedUrl.pathname.startsWith('/events/') && parsedUrl.pathname.endsWith('/rsvp')) {
            const eventId = parsedUrl.pathname.split('/')[2];
            await db.query('UPDATE events SET rsvp_count = rsvp_count + 1 WHERE id = $1', [eventId]);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
        } else if (method === 'GET' && parsedUrl.pathname.startsWith('/events/')) {
            const eventId = parsedUrl.pathname.split('/')[2];
            if (eventId) {
                const result = await db.query('SELECT * FROM events WHERE id = $1', [eventId]);
                if (result.rows.length > 0) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(result.rows[0]));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Event not found' }));
                }
            } else {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid event ID' }));
            }
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Not Found' }));
        }
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
    }
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
