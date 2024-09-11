import { sql } from '@vercel/postgres';

export default async function fetchSchools(req, res) {
    if (req.method === 'GET') {
        try {
            const schools = await sql`SELECT * FROM schools`;
            res.status(200).json({ message: schools});
        } catch(err){
            console.error(err)
        }
    
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }}