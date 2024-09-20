// pages/api/fetchNotes.ts
import { sql } from '@vercel/postgres';

export default async function fetchNotes(req, res) {
  if (req.method === 'GET') {
    try {
      const user = JSON.parse(req.headers['user']);
      if (!user || !user.id) {
        return res.status(400).json({ message: 'Invalid user data' });
      }

      const result = await sql`SELECT * FROM "Notes" WHERE "user" = ${user.id};`;
      console.log(result)
      res.status(200).json({ message: result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch notes', error });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
