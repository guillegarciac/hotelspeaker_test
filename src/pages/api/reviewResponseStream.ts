// Adjusted to use reviewId for more targeted updates.
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const { reviewId } = req.query; // Capture reviewId from query parameters

    const sendEvent = (data: object) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    sendEvent({ message: 'SSE Connection established.' });

    const intervalId = setInterval(() => {
        // Adjust response based on reviewId if available
        const exampleResponse = reviewId ? {
            responses: [{ text: `Update for review ${reviewId}` }]
        } : {
            responses: [{ text: "General update, no specific review." }]
        };

        sendEvent(exampleResponse);
    }, 10000);

    req.on('close', () => {
        console.log('Client disconnected');
        clearInterval(intervalId);
        res.end();
    });
}
