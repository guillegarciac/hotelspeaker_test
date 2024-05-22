// src/pages/api/getAllEstablishments.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const establishments = [
        { id: '1', name: 'Establishment 1' },
        { id: '2', name: 'Establishment 2' },
        { id: '3', name: 'Establishment 3' },
      ];
      res.status(200).json(establishments);
    } catch (error) {
      console.error("Error fetching establishments:", error);
      res.status(500).json({ message: "Error fetching establishments" });
    }
  }
}