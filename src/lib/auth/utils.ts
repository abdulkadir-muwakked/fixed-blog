/**
 * @File: src/lib/auth/utils.ts
 */

import prisma from "@/lib/db"; // Corrected import for default export
// import { users } from "../db/schema"; // Ensure schema is properly exported
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

// Add explicit types for the user and response
interface User {
  id: string;
  email: string;
  password: string | null; // Allow nullable password
  role?: string; // Add specific optional fields if needed
}

export async function verifyCredentials(
  email: string,
  password: string
): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.password) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return user;
}
