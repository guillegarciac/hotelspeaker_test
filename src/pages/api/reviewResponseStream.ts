// pages/api/reviewResponseStream.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Content-Encoding', 'utf-8');

    const reviewId = req.query.reviewId as string;

    // Validate reviewId if necessary, depending on application requirements
    if (reviewId && !isValidReviewId(reviewId)) {
        res.status(400).send("Invalid review ID");
        return;
    }

    const sendEvent = (data: object) => {
        try {
            res.write(`data: ${JSON.stringify(data)}\n\n`);
        } catch (error) {
            console.error('Error sending event:', error);
            clearInterval(intervalId);
            res.end();
        }
    };

    sendEvent({ message: 'SSE Connection established.' });

    const intervalId = setInterval(() => {
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

function isValidReviewId(reviewId: string): boolean {
    // Example validation function for reviewId
    return /^[a-zA-Z0-9-]+$/.test(reviewId); // Adjust regex as needed
}
