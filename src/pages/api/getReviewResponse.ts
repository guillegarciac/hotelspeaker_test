// pages/api/getReviewResponse.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { reviewId } = req.query;
    // Simulate fetching data for the reviewId
    res.status(200).json({
        responses: [{
            text: "Response received for review " + reviewId
        }]
    });
}