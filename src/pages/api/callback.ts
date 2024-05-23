// pages/api/callback.ts
import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).end('Method Not Allowed');
        return;
    }

    // Ensure the secret is defined
    const secret = process.env.CLIENT_SECRET;
    if (!secret) {
        console.error('CLIENT_SECRET is not defined.');
        res.status(500).send('Internal server error due to configuration');
        return;
    }

    // Read the JSON payload and prepare for signature verification
    const json_data = JSON.stringify(req.body);
    const providedSig = req.query.sig as string;

    if (!providedSig) {
        res.status(400).send('Signature not provided');
        return;
    }

    // Create the HMAC and verify the signature
    const sig = crypto.createHmac('sha256', secret)
                      .update(json_data)
                      .digest('hex');

    if (providedSig !== sig) {
        res.status(403).send("Signature mismatch");
        return;
    }

    // Log the verified POST data cautiously considering security implications
    console.log("Verified POST data:", req.body); 

    // Respond with HTTP 200 OK if everything is correct
    res.status(200).json({ message: "Success", data: req.body });
}
