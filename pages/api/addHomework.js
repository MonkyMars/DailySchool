import { sql } from "@vercel/postgres";

export default async function addHomework(req, res) {
  if (req.method === "POST") {
    try {
      const { title, description, deadline, status } = req.body;
      const user = req.headers["user"] ? JSON.parse(req.headers["user"]) : null;

      // Check if the user data exists and is valid
      if (!user || !user.id) {
        return res.status(400).json({ message: "Invalid user data" });
      }

      // Insert homework into the database associated with the user's ID
      const result = await sql`
        INSERT INTO homework (title, description, deadline, status, "user")
        VALUES (${title}, ${description}, ${deadline}, ${status}, ${user.id});
      `;

      res.status(200).json({ message: "Homework added successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "An error occurred while adding homework", error: err.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
