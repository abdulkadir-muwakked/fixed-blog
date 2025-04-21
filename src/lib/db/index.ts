/**
 * @File: src/lib/db/index.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function fetchCategories() {
  console.log("Fetching categories from database...");
  const result = await prisma.category.findMany();
  console.log("Fetched categories:", result);
  return result;
}

export async function testPostTable() {
  try {
    console.log("Testing posts table...");
    const result = await prisma.post.findMany();
    console.log("Posts table data:", result);
  } catch (error) {
    console.error("Error querying posts table:", error);
  }
}

export async function verifyPostTable() {
  try {
    console.log("Verifying posts table...");
    const result = await prisma.post.findMany();
    console.log("Posts table data:", result);
  } catch (error) {
    console.error("Error querying posts table:", error);
  }
}

export default prisma;
