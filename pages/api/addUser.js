import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const saltRounds = 10;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { email, password, school, grade, role } = req.body;

      // Validate required fields
      if (!email || !password || !school || !grade || !role) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(409).json({ error: 'User already exists with that email' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Insert new user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          school,
          grade,
          role: role || 'student',
        },
      });

      res.status(200).json({ message: 'User added successfully', user });
    } catch (error) {
      console.error('Error adding user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
