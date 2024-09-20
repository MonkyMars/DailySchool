// pages/api/fetchSchools.js
import { sql } from "@vercel/postgres";

export default async function fetchSchools(req, res) {
  if (req.method === "GET") {
    try {
      const { rows: schools } = await sql`SELECT * FROM "School"`;
      res.status(200).json({ message: schools });
    } catch (err) {
      console.error("Error fetching schools:", err);
      res.status(500).json({ error: "Failed to fetch schools" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
