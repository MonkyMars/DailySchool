import { sql } from "@vercel/postgres";

export default async function updateHomework(req, res) {
  if (req.method === "POST") {
    try {
      const { status, id: homeworkId } = req.body;

      if (status === undefined || homeworkId === undefined) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const user = JSON.parse(req.headers["user"]);
      if (!user || !user.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const result = await sql`
        UPDATE homework
        SET status = ${status}
        WHERE id = ${homeworkId} AND "user" = ${user.id}
      `;

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Homework not found or not authorized to update" });
      }

      res.status(200).json({ message: "Homework updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred while updating homework" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
