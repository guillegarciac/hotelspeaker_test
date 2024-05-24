// pages/api/callback.ts
import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    console.log('Callback received:', req.body);
    const dataPath = path.join(process.cwd(), 'data', 'callbackData.json');
    // Store the data in a file
    fs.writeFileSync(dataPath, JSON.stringify(req.body, null, 2), 'utf8');
    res.status(200).json({ message: 'Callback received successfully' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).send('Method Not Allowed');
  }
}
