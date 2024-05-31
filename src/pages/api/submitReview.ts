import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).send('Method Not Allowed');
    return;
  }

  const { establishment_id, language, date, type = 'instant', text } = req.body;

  if (!establishment_id || !language || !date || !text) {
    res.status(400).json({ message: "Missing required fields." });
    return;
  }

  if (!process.env.NEXT_PUBLIC_BASE_URL || !process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
    console.error('Environment variables are not set');
    res.status(500).send('Internal Server Error');
    return;
  }

  const reviewData = {
    establishment_id,
    language,
    date,
    type,
    text
  };

  const authHeader = `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}`;

  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/reviews`;
    console.log('Sending POST request to:', url, 'with body:', reviewData);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API request failed with response:', errorText);
      res.status(response.status).json({ message: 'Failed to submit review', details: errorText });
      return;
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error in API handler:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
}