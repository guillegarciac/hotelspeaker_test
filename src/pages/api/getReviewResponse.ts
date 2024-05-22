// pages/api/getReviewResponse.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      res.status(400).json({ message: 'Missing or invalid review ID' });
      return;
    }

    try {
      const authHeader = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64');
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/reviews/${id}`;

      console.log('Fetching review status from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${authHeader}`,
        },
      });

      const data = await response.json();
      console.log('Received review status:', data);

      if (!response.ok) {
        throw new Error(`Failed to fetch review status: ${data.message || response.statusText}`);
      }

      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching review status:', error);
      res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
