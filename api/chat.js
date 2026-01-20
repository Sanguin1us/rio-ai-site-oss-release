export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.RIO_API_KEY;
    // Default URL from your proxy.mjs
    const apiUrl = process.env.RIO_API_URL || 'https://rio-api-test.onrender.com/v1/chat/completions';

    if (!apiKey) {
        console.error('RIO_API_KEY is missing');
        return res.status(500).json({ error: 'Server misconfiguration: RIO_API_KEY is missing' });
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify(req.body),
        });

        const data = await response.json();

        // Pass along the status code from the upstream API
        return res.status(response.status).json(data);
    } catch (error) {
        console.error('Error fetching from upstream API:', error);
        return res.status(500).json({ error: 'Failed to communicate with the Rio API' });
    }
}
