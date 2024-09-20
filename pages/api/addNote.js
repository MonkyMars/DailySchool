// pages/api/addNote.js
import { sql } from '@vercel/postgres';

export default async function addNote(req, res) {
  if (req.method === 'POST') {
    try {
      const { title, description, date, time } = req.body;

      const user = req.headers['user'] ? JSON.parse(req.headers['user']) : null;
      if (!user || !user.id) {
        return res.status(400).json({ error: 'User information is missing' });
      }

      const result = await sql`
        INSERT INTO "Notes" (title, description, date, "user", time)
        VALUES (${title}, ${description}, ${date}, ${user.id}, ${time})
        RETURNING *;
      `;

      res.status(200).json({ message: 'Note added successfully', result: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
