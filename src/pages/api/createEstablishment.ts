import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client_id = process.env.CLIENT_ID;
  const client_secret = process.env.CLIENT_SECRET;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const authHeader = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
  const url = `${baseUrl}/establishments`;

  try {
    console.log('Sending request to external API:', url);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authHeader}`,
      },
      body: JSON.stringify(req.body),
    });

    console.log('Received response from external API:', response.status);
    if (!response.ok) {
      console.error('Failed to create establishment:', await response.text());
      res.status(response.status).json({ message: 'Failed to create establishment', details: await response.json() });
      return;
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error in API handler:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
}