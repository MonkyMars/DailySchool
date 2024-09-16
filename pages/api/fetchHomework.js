import { sql } from "@vercel/postgres";

export default async function fetchHomework(req, res) {
  if (req.method == "GET") {
    try {
      const user = JSON.parse(req.headers["user"]);
      const userStr = `${user.id}`;
      const result = await sql`
        SELECT * FROM homework
        WHERE "user" = ${userStr}
      `;
      res.status(200).json({ message: result });
    } catch (err) {
      console.err(err);
    }
  }
}
