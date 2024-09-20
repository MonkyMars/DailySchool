// pages/api/deleteMixed.ts
import { sql } from '@vercel/postgres';

export default async function deleteMixed(req, res) {
  if (req.method === 'DELETE') {
    const { section, id } = req.body;

    if (typeof section !== 'number' || typeof id !== 'number') {
      return res.status(400).json({ message: 'Invalid input' });
    }
    try {
      let result;

      // Depending on the section, execute different delete queries
      if (section === 0) {
        result = await sql`DELETE FROM "Notes" WHERE id = ${id} RETURNING *;`;
      } else if (section === 1) {
        result = await sql`DELETE FROM "Homework" WHERE id = ${id} RETURNING *;`;
      } else if (section === 2) {
        result = await sql`DELETE FROM "Planner" WHERE id = ${id} RETURNING *;`;
      } else {
        return res.status(400).json({ message: 'Invalid section' });
      }

      // Check if a record was deleted
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Record not found' });
      }

      res.status(200).json({ message: 'Record deleted successfully', data: result.rows[0] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error', error });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
