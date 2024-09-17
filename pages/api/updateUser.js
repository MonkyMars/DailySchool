import bcrypt from "bcrypt";
import { sql } from "@vercel/postgres";

export default async function updateUser(req, res) {
  if (req.method === "POST") {
    try {
      const { email, password, school, grade, id } = req.body;

      if (!email || !school || !grade || !id) {
        return res.status(400).json({ error: "Email, school, grade, and user id are required" });
      }

      const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
      const query = `
        UPDATE users
        SET email = $1, school = $2, grade = $3, password = COALESCE($4, password)
        WHERE id = $5
        RETURNING *
      `;
      const result = await sql.query(query, [email, school, grade, hashedPassword, id]);

      if (result.rows.length > 0) {
        res.status(200).json({ message: "User updated successfully" });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
