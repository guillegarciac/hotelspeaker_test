// file: pages/api/checkCallback.ts
import { NextApiRequest, NextApiResponse } from 'next';

type CallbackStoreType = {
  [key: string]: any;
};

const callbackStore: CallbackStoreType = {};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Extract and validate that reviewId is a string
  const reviewId = typeof req.query.reviewId === 'string' ? req.query.reviewId : undefined;

  if (!reviewId) {
      res.status(400).json({ error: 'Review ID is required and must be a string.' });
      return;
  }

  // Safely check if reviewId exists in the callbackStore
  if (reviewId in callbackStore) {
      res.status(200).json({ found: true, data: callbackStore[reviewId] });
      // Consider if you need to delete this data or keep it for further use
      delete callbackStore[reviewId]; // Optionally clear after fetching
  } else {
      res.status(200).json({ found: false });
  }
}