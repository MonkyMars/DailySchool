import { sql } from "@vercel/postgres";

export default async function fetchPlanner(req, res) {
  if(req.method === 'GET') {
  try{
    const user = JSON.parse(req.headers['user']);
    const result = await sql`SELECT * FROM planner WHERE "user" = ${user.id}`
    res.status(200).json({ message: result});
  } catch(error) {
    console.error(error);
    res.status(400).json({message: 'Failed to fetch planner'});
  }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}