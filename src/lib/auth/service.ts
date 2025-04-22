/**
 * @File: src/lib/auth/service.ts
 */

import prisma from "../db";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Enhanced error handling for unique constraint violations
export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    return newUser;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes(
        "Unique constraint failed on the fields: (`email`)"
      )
    ) {
      throw new Error("User already exists");
    }

    throw error; // Re-throw other errors
  }
}

export async function getUserByEmail(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  return user;
}

export async function updateUser(
  userId: string,
  data: { name?: string; email?: string; password?: string }
) {
  const updateData: Partial<{ name: string; email: string; password: string }> =
    {};

  if (data.name) updateData.name = data.name;
  if (data.email) updateData.email = data.email;
  if (data.password) updateData.password = await bcrypt.hash(data.password, 10);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });
  return updatedUser;
}

export async function createRootAdmin(data: {
  name: string;
  email: string;
  password: string;
}) {
  const adminExists = await prisma.user.findFirst({ where: { role: "ADMIN" } });

  if (adminExists) {
    throw new Error("Root admin already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const admin = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  return admin;
}
