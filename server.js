const express = require('express');
const next = require('next');
const http = require('http');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    // SSE Endpoint
    server.get('/api/sse', (req, res) => {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');

        const sendEvent = setInterval(() => {
            res.write(`data: ${JSON.stringify({ message: "Hello every 10 seconds!" })}\n\n`);
        }, 10000);

        req.on('close', () => {
            clearInterval(sendEvent);
            res.end();
        });
    });

    // Handling everything else with Next.js
    server.all('*', (req, res) => {
        return handle(req, res);
    });

    http.createServer(server).listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
});
