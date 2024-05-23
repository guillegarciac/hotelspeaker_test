import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { establishment_id, language, date, type = 'auto', text } = req.body;

    if (!establishment_id || !language || !date || !text) {
      res.status(400).json({ message: "Missing required fields." });
      return;
    }

    // Include the callback URL dynamically
    const callbackUrl = `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/reviewResponse`;

    const reviewData = {
      establishment_id,
      language,
      date,
      type,
      text,
      callback_url: callbackUrl  // Adding callback URL here
    };

    try {
      const authHeader = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64');
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/reviews`;

      console.log('Sending POST request to:', url, 'with body:', reviewData);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${authHeader}`,
        },
        body: JSON.stringify(reviewData),
      });

      console.log('Received response with status:', response.status);

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
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
