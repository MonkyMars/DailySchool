import { sql } from '@vercel/postgres';

export default async function deleteMixed(req, res) {
    if(req.method === 'DELETE') {
        try {
            const { section, id } = req.body;
            if(section === 0) {
                const notes = await sql`
                DELETE FROM notes WHERE id = ${id};
                `;
            } else if(section === 1) {
                const homework = await sql`
                DELETE FROM homework WHERE id = ${id};
                `;
            } else {
                const planner = await sql`
                DELETE FROM planner WHERE id = ${id};
                `;
            }
            res.status(200).json({ message: 'Record deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error', error });
        }
    } else {
        res.setHeader('Allow', ['DELETE']);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}
