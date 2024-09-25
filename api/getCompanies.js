import { authenticateUser } from './_apiUtils.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const user = await authenticateUser(req);
    const { criteria } = req.body;

    // Here you would normally access your database or external API
    // Since we're using createEvent, we can call it here if needed
    // But for this example, we'll just return an empty array

    res.status(200).json({ companies: [] });
  } catch (error) {
    console.error('Error fetching companies:', error);
    if (
      error.message.includes('Authorization') ||
      error.message.includes('token')
    ) {
      res.status(401).json({ error: 'Authentication failed' });
    } else {
      res.status(500).json({ error: 'Error fetching companies' });
    }
  }
}