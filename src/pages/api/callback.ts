// pages/api/callback.ts
import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).end('Method Not Allowed');
        return;
    }

    const secret = process.env.CLIENT_SECRET;
    if (!secret) {
        console.error('CLIENT_SECRET is not defined.');
        res.status(500).send('Internal server error due to configuration');
        return;
    }

    const json_data = JSON.stringify(req.body);
    const providedSig = req.query.sig as string;

    if (!providedSig) {
        res.status(400).send('Signature not provided');
        return;
    }

    const sig = crypto.createHmac('sha256', secret).update(json_data).digest('hex');

    if (providedSig !== sig) {
        res.status(403).send("Signature mismatch");
        return;
    }

    console.log("Verified POST data:", req.body);

    // Pass data directly back to the client
    res.status(200).json({ success: true, data: req.body });
}
