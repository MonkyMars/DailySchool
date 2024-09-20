// types/next-auth.d.ts

import NextAuth from "next-auth";
import { DefaultUser } from "next-auth";

// Extend the default NextAuth session and token types
declare module "next-auth" {
  interface User {
    id: number;
    email: string;
    role: string;
  }

  interface Session {
    user: {
      id: number; 
      email: string;
      role: string;
    } & DefaultUser;
  }

  interface Token {
    id: number;
    role: string;
  }
}

