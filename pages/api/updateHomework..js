// pages/api/updateHomework.ts
import { sql } from '@vercel/postgres';

export default async function updateHomework(req, res) {
  if (req.method === 'POST') {
    try {
      const { status, id: homeworkId } = req.body;

      // Check for required fields
      if (status === undefined || homeworkId === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Parse user information from headers
      const user = req.headers['user'] ? JSON.parse(req.headers['user']) : null;
      if (!user || !user.id) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Update the homework record in the "Homework" table
      const result = await sql`
        UPDATE "Homework"
        SET status = ${status}
        WHERE id = ${homeworkId} AND "user" = ${user.id}
        RETURNING *;
      `;

      // Check if any rows were updated
      if (result.count === 0 || result.rows.length === 0) {
        return res.status(404).json({
          error: 'Homework not found or not authorized to update',
        });
      }

      res.status(200).json({ message: 'Homework updated successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: 'An error occurred while updating homework',
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
