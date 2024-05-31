// pages/api/simple-sse.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import initMiddleware from '../../../lib/init-middleware';

// Initialize CORS middleware with specific options
const cors = initMiddleware(
    Cors({
        origin: ['http://localhost:3000'], // Replace with your client URL in production
        methods: ['GET'],
        credentials: true,
        allowedHeaders: ['X-Custom-Header', 'Content-Type']
    })
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Run CORS middleware
    await cors(req, res);

    if (req.method === 'GET') {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no'); // Disable buffering

        const interval = setInterval(() => {
            const data = JSON.stringify({ message: "Hello every 10 seconds!" });
            res.write(`data: ${data}\n\n`);
        }, 10000);

        req.on('close', () => {
            clearInterval(interval);
            res.end();
        });
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
