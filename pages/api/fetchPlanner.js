// pages/api/fetchPlanner.ts
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Extract the user header and parse it
      const userHeader = req.headers.user;
      const user = userHeader ? JSON.parse(userHeader) : null;

      if (!user || !user.id) {
        return res.status(400).json({ error: 'User ID is required' });
      }
      const result = await sql`
        SELECT * FROM "Planner" WHERE "user" = ${user.id};
      `;

      res.status(200).json({ plannerItems: result.rows });
    } catch (error) {
      console.error('Error fetching planner:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
