// pages/api/addHomework.ts
import { sql } from '@vercel/postgres';

export default async function addHomework(req, res) {
  if (req.method === 'POST') {
    try {
      const { title, description, deadline, status } = req.body;
      const userHeader = req.headers.user;
      const user = userHeader ? JSON.parse(userHeader) : null;

      // Check if the user data exists and is valid
      if (!user || !user.id) {
        return res.status(400).json({ message: 'Invalid user data' });
      }

      // Insert the homework into the "Homework" table
      const result = await sql`
        INSERT INTO "Homework" (title, description, deadline, status, "user")
        VALUES (${title}, ${description}, ${deadline}, ${status}, ${user.id})
        RETURNING *;
      `;

      res.status(200).json({ message: 'Homework added successfully', result: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: 'An error occurred while adding homework',
        error: err.message,
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
