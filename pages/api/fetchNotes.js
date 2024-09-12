import { sql } from "@vercel/postgres";

export default async function fetchNotes(req, res) {
    if(req.method === 'GET') {
        try{
            const user = JSON.parse(req.headers['user']);
            const userStr = `${user.id}`;
            const result = await sql`SELECT * FROM notes WHERE "user" = ${userStr}`;
            res.status(200).json({ message: result});
        } catch(error) {
            console.error(error);
        };
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    };
};
