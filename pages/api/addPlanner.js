// pages/api/addPlanner.ts
import { sql } from '@vercel/postgres';

export default async function addPlanner(req, res) {
  if (req.method === 'POST') {
    try {
      const { title, description, date, time } = req.body;
      const userHeader = req.headers['authorization'];
      const user = userHeader ? JSON.parse(userHeader) : null;

      if (!user || !user.id) {
        return res.status(400).json({ error: 'User information is missing' });
      }

      // Ensure the date is in a valid format
      const formattedDate = new Date(date);

      // Insert the planner item into the "Planner" table
      const result = await sql`
        INSERT INTO "Planner" (title, description, date, time, "user")
        VALUES (${title}, ${description}, ${formattedDate}, ${time}, ${user.id})
        RETURNING *;
      `;

      res.status(200).json({ message: 'Planner item added successfully', result: result.rows[0] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
