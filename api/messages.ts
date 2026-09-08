import { Redis } from '@upstash/redis';

// Initialize Redis client. It will automatically use UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN 
// or KV_REST_API_URL and KV_REST_API_TOKEN if provided in process.env
const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

const GUESTBOOK_KEY = 'portfolio_guestbook_messages';

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const messages = await redis.get(GUESTBOOK_KEY);
      res.setHeader('Cache-Control', 'no-store, max-age=0');
      return res.status(200).json(messages || []);
    }

    if (req.method === 'POST') {
      const { message } = req.body;
      if (!message || !message.id || !message.name || !message.message) {
        return res.status(400).json({ error: 'Invalid message payload' });
      }

      // Fetch existing messages
      let messages: any[] = (await redis.get(GUESTBOOK_KEY)) || [];
      
      // Add new message
      messages.push(message);

      // Keep only the latest 100 messages to prevent infinite growth
      if (messages.length > 100) {
        messages = messages.slice(messages.length - 100);
      }

      await redis.set(GUESTBOOK_KEY, messages);
      return res.status(201).json({ success: true });
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ error: 'Message ID is required' });
      }

      let messages: any[] = (await redis.get(GUESTBOOK_KEY)) || [];
      messages = messages.filter((m: any) => m.id !== id);

      await redis.set(GUESTBOOK_KEY, messages);
      return res.status(200).json({ success: true });
    }

    // Method not allowed
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Redis API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
