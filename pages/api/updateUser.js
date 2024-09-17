import bcrypt from "bcrypt";
import { sql } from "@vercel/postgres";

export default async function updateUser(req, res) {
  if (req.method === "POST") {
    try {
      // Extract data from request
      const { email, password, school, grade, id } = req.body;

      if (!email || !school || !grade || !id) {
        return res.status(400).json({ error: "Email, school, grade, and user id are required" });
      }

      // Initialize query parts
      const setQueryParts = [
        sql`email = ${email}`,
        sql`school = ${school}`,
        sql`grade = ${grade}`
      ];

      // Update password only if provided
      if (password) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        setQueryParts.push(sql`password = ${hashedPassword}`);
      }

      // Construct the SQL query
      const query = sql`
        UPDATE users
        SET ${sql.join(setQueryParts, ", ")}
        WHERE id = ${id}
      `;

      const result = sql.query(query);

      if (result.rowCount > 0) {
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
