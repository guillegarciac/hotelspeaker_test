// pages/api/reviewResponse.ts

import type { NextApiRequest, NextApiResponse } from 'next';

function authenticate(req: NextApiRequest): boolean {
  const auth = { login: process.env.CLIENT_ID, password: process.env.CLIENT_SECRET };
  const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
  const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

  return login === auth.login && password === auth.password;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    if (!authenticate(req)) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { review_id, responses } = req.body;
    console.log(`Received responses for review ID: ${review_id}`, responses);
    res.status(200).json({ message: 'Response received successfully!' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
