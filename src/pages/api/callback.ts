import type { NextApiRequest, NextApiResponse } from 'next';

type PostData = {
    review_id: string;
    responses: Array<{
        opening: string;
        body: string;
        closing: string;
    }>;
};

let savedData: PostData | null = null; // For demonstration, storing data in memory

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    switch (req.method) {
        case 'POST':
            savedData = req.body;
            res.status(200).json({ message: 'Data received' });
            break;
        case 'GET':
            if (savedData) {
                res.status(200).json(savedData);
            } else {
                res.status(404).json({ message: 'No data found' });
            }
            break;
        case 'DELETE':
            savedData = null; // Clear saved data when DELETE request is received
            res.status(200).json({ message: 'Callback endpoint cleared' });
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
