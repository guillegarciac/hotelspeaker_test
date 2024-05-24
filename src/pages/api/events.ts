// pages/api/events.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.headers.accept !== 'text/event-stream') {
    return res.status(406).end(); // Not Acceptable
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Function to send data to the client
  const sendEvent = (data: object) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Simulate a delayed response as an example
  setTimeout(() => {
    sendEvent({ message: "Response from the server" });
  }, 10000); // 10 seconds delay

  // Keep the connection alive by sending comments
  const keepAlive = setInterval(() => {
    res.write(': keep alive\n\n');
  }, 15000);

  req.on('close', () => {
    clearInterval(keepAlive);
    res.end();
  });
}
