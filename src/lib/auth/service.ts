import bcrypt from "bcryptjs";
import { db } from "../db";
import { users } from "../db/schema";
import { createId } from "../utils";
import { eq } from "drizzle-orm";
import type { InferInsertModel } from "drizzle-orm";

export type RegisterUserData = {
  name: string;
  email: string;
  password: string;
  role?: "USER" | "ADMIN"; // Add role as an optional parameter
};

export type UpdateUserData = {
  name?: string;
  email?: string;
  password?: string;
  image?: string;
};

export async function registerUser(userData: RegisterUserData) {
  // Check if user already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, userData.email))
    .then((res) => res[0]);

  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  // Create user
  await db.insert(users).values({
    id: createId(),
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
    role: userData.role || "USER", // Use the provided role or default to USER
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return { success: true };
}

export async function updateUser(userId: string, userData: UpdateUserData) {
  const updateData: Partial<InferInsertModel<typeof users>> = {
    updatedAt: new Date(),
  };

  if (userData.name) updateData.name = userData.name;
  if (userData.email) updateData.email = userData.email;
  if (userData.image) updateData.image = userData.image;

  if (userData.password) {
    updateData.password = await bcrypt.hash(userData.password, 10);
  }

  await db.update(users).set(updateData).where(eq(users.id, userId));
  return { success: true };
}

export async function getUser(userId: string) {
  const user = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      image: users.image,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .then((res) => res[0] || null);

  return user;
}

export async function getUserByEmail(email: string) {
  const user = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      image: users.image,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.email, email))
    .then((res) => res[0] || null);

  return user;
}

export async function makeUserAdmin(userId: string) {
  await db.update(users).set({ role: "ADMIN" }).where(eq(users.id, userId));
  return { success: true };
}

// Add function to create first admin user (for initial setup)
export async function createRootAdmin(userData: RegisterUserData) {
  // Check if any admin user already exists
  const existingAdmin = await db
    .select()
    .from(users)
    .where(eq(users.role, "ADMIN"))
    .then((res) => res[0]);

  if (existingAdmin) {
    throw new Error("Root admin already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  // Create admin user
  await db.insert(users).values({
    id: createId(),
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
    role: "ADMIN",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return { success: true };
}
