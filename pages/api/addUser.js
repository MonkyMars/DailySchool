import { sql } from "@vercel/postgres";
import bcrypt from "bcrypt";

const saltRounds = 10;

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { email, password, school, grade, role } = req.body;

      // Validate required fields
      if (!email || !password || !school || !grade || !role) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Check if user already exists
      const user = await sql`SELECT * FROM users WHERE email = ${email}`;
      if (user.rowCount) {
        return res
          .status(409)
          .json({ error: "User already exists with that email" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Insert new user
      const result = await sql`
        INSERT INTO users (email, password, school, grade, role)
        VALUES (${email}, ${hashedPassword}, ${school}, ${grade}, ${
        role || "student"
      })
        RETURNING *;
      `;

      res
        .status(200)
        .json({ message: "User added successfully", user: result.rows[0] });
    } catch (error) {
      console.error("Error adding user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
