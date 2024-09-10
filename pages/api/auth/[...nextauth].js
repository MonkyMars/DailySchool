// pages/api/auth/[...nextauth].js

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const result = await sql`
          SELECT * FROM users WHERE email = ${credentials.email};
        `;

        const user = result[0];

        if (!user) {
          throw new Error('No user found with the email');
        }
        const isMatch = await bcrypt.compare(credentials.password, user.password);

        if (!isMatch) {
          throw new Error('Invalid password');
        }
        return { id: user.id, email: user.email };
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',  
    error: '/auth/error'     
  },
  session: {
    jwt: true, 
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email
        };
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,  
});
