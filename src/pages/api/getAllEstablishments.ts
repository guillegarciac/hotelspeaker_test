import type { NextApiRequest, NextApiResponse } from 'next';
import { Establishment } from '../../types';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Establishment[] | { message: string; details?: string }>) {
  if (req.method === 'GET') {
    try {
      const authHeader = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64');
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/establishments`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${authHeader}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        res.status(response.status).json({ message: 'Failed to fetch establishments', details: errorText });
        return;
      }

      const establishments: Establishment[] = await response.json();
      res.status(200).json(establishments);
    } catch (error) {
      res.status(500).json({ message: 'Server error', details: (error as Error).message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end('Method Not Allowed');
  }
}
