import { sql } from '@vercel/postgres';

export default async function deleteMixed(req, res) {
    if (req.method === 'DELETE') {
        const { section, id } = req.body;

        // Validate inputs
        if (typeof section !== 'number' || typeof id !== 'number') {
            return res.status(400).json({ message: 'Invalid input' });
        }

        try {
            let result;

            // Determine the correct table based on the section
            if (section === 0) {
                result = await sql`
                    DELETE FROM notes WHERE id = ${id};
                `;
            } else if (section === 1) {
                result = await sql`
                    DELETE FROM homework WHERE id = ${id};
                `;
            } else if (section === 2) {
                result = await sql`
                    DELETE FROM planner WHERE id = ${id};
                `;
            } else {
                return res.status(400).json({ message: 'Invalid section' });
            }

            // Check if any row was deleted
            if (result.rowCount === 0) {
                return res.status(404).json({ message: 'Record not found' });
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
