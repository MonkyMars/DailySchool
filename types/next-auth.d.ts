// types/next-auth.d.ts

import NextAuth from "next-auth";
import { DefaultUser } from "next-auth";

// Extend the default NextAuth session and token types
declare module "next-auth" {
  interface Session {
    user: {
      id: string; // or number, depending on your setup
      email: string;
      role: string;
      // Add other custom fields as needed
    } & DefaultUser;
  }

  interface Token {
    id: string; // or number, depending on your setup
    role: string;
    // Add other custom fields as needed
  }
}
