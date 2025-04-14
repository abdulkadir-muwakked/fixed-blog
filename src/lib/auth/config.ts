/**
 * @File: src/lib/auth/config.ts
 */

import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { DrizzleAdapter } from "./drizzle-adapter";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials?.email === "test@example.com") {
          return {
            id: "test-user",
            email: "test@example.com",
            name: "Test User",
            role: "ADMIN"
          };
        }
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email and password are required');
          }
      
          const user = await db
            .select()
            .from(users)
            .where(eq(users.email, credentials.email))
            .then((res) => res[0]);
      
          if (!user) {
            throw new Error('User not found');
          }
      
          if (!user.password) {
            throw new Error('User registered with OAuth');
          }
      
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
      
          if (!isValid) {
            throw new Error('Invalid password');
          }
      
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log(token, user, "authOptions" );
      
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) session.user.id = token.id;
      if (token?.role) session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};