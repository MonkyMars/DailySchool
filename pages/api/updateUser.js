// pages/api/updateUser.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default async function updateUser(req, res) {
  if (req.method === 'PUT') {
    try {
      const { email, password, school, grade, id } = req.body;
      // Check for required fields
      // if (!email || !school || !grade || !id) {
      //   return res.status(400).json({
      //     error: 'Email, school, grade, and user id are required',
      //   });
      // }

      // Hash the password if provided
      const hashedPassword = password
        ? await bcrypt.hash(password, 10)
        : undefined;

      // Update user record
      const result = await prisma.user.update({
        where: { id },
        data: {
          email,
          school,
          grade,
          password: hashedPassword ? hashedPassword : undefined,
        },
      });

      res.status(200).json({ message: 'User updated successfully', user: result });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
