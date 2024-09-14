import { sql } from "@vercel/postgres";

export default async function AddNote(req, res) {
    if (req.method === 'POST') {
        try {
            const { title, description, date, time } = req.body;
            const user = JSON.parse(req.headers['user']);

            if (!user || !user.id) {
                return res.status(400).json({ error: "User information is missing" });
            }

            // Use `toISOString` to ensure the date is in `YYYY-MM-DD` format
            const formattedDate = new Date(date).toISOString().split('T')[0];

            const result = await sql`
                INSERT INTO notes (title, description, date, time, "user")
                VALUES (${title}, ${description}, ${formattedDate}, ${time}, ${user.id});
            `;

            res.status(200).json({ message: "Note added successfully", result });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}
