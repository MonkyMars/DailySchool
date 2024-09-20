// pages/api/fetchHomework.ts
import { sql } from '@vercel/postgres';

export default async function fetchHomework(req, res) {
  if (req.method === 'GET') {
    try {
      // Parse user information from headers
      const user = JSON.parse(req.headers['user']);
      if (!user || !user.id) {
        return res.status(400).json({ message: 'Invalid user data' });
      }

      // Fetch the homework using SQL
      const result = await sql`
        SELECT * FROM "Homework" WHERE "user" = ${user.id};
      `;
      res.status(200).json({ message: result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch homework', error });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
