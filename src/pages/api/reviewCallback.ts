// pages/api/reviewCallback.ts
import type { NextApiRequest, NextApiResponse } from 'next';

let reviewResponses: { [key: string]: any } = {};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { review_id, responses } = req.body;

    // Store the response in memory (or a database in a real application)
    reviewResponses[review_id] = responses;

    console.log('Received callback for review_id:', review_id);
    console.log('Responses:', responses);

    // Send an acknowledgment response
    res.status(200).json({ message: 'Callback received', review_id, responses });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export function getReviewResponse(reviewId: string) {
  return reviewResponses[reviewId];
}
