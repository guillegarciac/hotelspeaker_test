// pages/api/callback.ts
import { NextApiRequest, NextApiResponse } from 'next';

// Store all active clients in a Set for broadcasting
const clients: Set<NextApiResponse> = new Set();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Log the incoming data
    console.log('Callback received:', req.body);

    // Convert the request body to a string that is SSE compatible
    const dataString = `data: ${JSON.stringify(req.body)}\n\n`;

    // Broadcast the data to all connected clients
    clients.forEach(client => client.write(dataString));

    // Respond to the POST request indicating success
    res.status(200).json({ message: 'Callback data broadcasted successfully' });
  } else if (req.method === 'GET' && req.headers.accept === 'text/event-stream') {
    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Add this response object to the list of clients
    clients.add(res);

    // Handle client disconnect
    req.on('close', () => {
      clients.delete(res);
      res.end();
    });
  } else {
    // Not a POST or proper GET request, send 405 Method Not Allowed
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).send('Method Not Allowed');
  }
}
