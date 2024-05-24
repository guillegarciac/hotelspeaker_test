// pages/api/callback.ts
import { NextApiRequest, NextApiResponse } from 'next';

const clients: Set<NextApiResponse> = new Set();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("Received request:", req.method);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);

  if (req.method === 'POST') {
    console.log('Callback received:', req.body);

    // Broadcast this data to all connected clients
    const dataString = `data: ${JSON.stringify(req.body)}\n\n`;
    clients.forEach(client => {
      client.write(dataString);
    });

    res.status(200).json({ message: 'Callback data broadcasted successfully' });
  } else if (req.method === 'GET' && req.headers.accept === 'text/event-stream') {
    // Set appropriate headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Register the client
    clients.add(res);

    // Keep the connection alive
    const keepAlive = setInterval(() => {
      res.write(': keep-alive\n\n');
    }, 20000); // Every 20 seconds

    // Remove client on disconnect
    req.on('close', () => {
      clearInterval(keepAlive);
      clients.delete(res);
      res.end();
    });
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end('Method Not Allowed');
  }
}
