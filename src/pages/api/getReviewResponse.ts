// pages/api/getReviewResponse.ts
import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { reviewId } = req.query;
  const dataPath = path.join(process.cwd(), 'data', 'callbackData.json');

  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    const responses = JSON.parse(data);
    // Assuming the response structure has the review_id as part of it
    const response = responses.find((r: { review_id: string }) => r.review_id === reviewId);
    if (response) {
      res.status(200).json(response);
    } else {
      res.status(404).json({ message: "Review response not found" });
    }
  } catch (error) {
    console.error('Failed to read callback data:', error);
    res.status(500).json({ message: 'Failed to read callback data', details: error });
  }
}

