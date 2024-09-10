import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';

const saltRounds = 10; 
export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const connectionString = process.env.POSTGRES_URL;

            if (!connectionString) {
                throw new Error("Missing POSTGRES_URL environment variable");
            }

            sql.connect({ connectionString });

            const { email, password, school } = req.body;

            if (!email || !password || !school) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const result = await sql`
                INSERT INTO users (email, password, school)
                VALUES (${email}, ${hashedPassword}, ${school})
                RETURNING *;
            `;

            res.status(200).json({ message: 'User added successfully', user: result.rows[0] });
        } catch (error) {
            console.error('Error adding user:', error);
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}
