// pages/api/reviewResponseStream.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Function to send data to the client
    const sendEvent = (data: object) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    // Placeholder: Example of sending an initial data
    sendEvent({ message: 'Connection established with the SSE server.' });

    // Simulate receiving new data from somewhere in your application
    // In real use, this could be replaced by event listeners or subscriptions to changes
    const intervalId = setInterval(() => {
        // Example data that might be sent
        const exampleResponse = {
            responses: [
                { text: "Thank you for your review!" }
            ]
        };
        sendEvent(exampleResponse);
    }, 10000); // Send data every 10 seconds for demonstration

    // Handle client disconnection
    req.on('close', () => {
        console.log('Client disconnected');
        clearInterval(intervalId);
        res.end();
    });
}
