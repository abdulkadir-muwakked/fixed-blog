/**
 * @File: src/lib/db/index.ts
 */

import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import path from "path";
import fs from "fs";
import { categories } from "./schema";

// تحديد المسار الصحيح - استخدم المسار المطلق
const dbPath = path.resolve(process.cwd(), "prisma", "dev.db");

// تصحيح الأخطاء
console.log("Database path:", dbPath);

// تهيئة قاعدة البيانات
const initDB = () => {
  try {
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, "");
    }

    const sqlite = new Database(dbPath);
    return drizzle(sqlite, { schema });
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  }
};

export const db = initDB();

export async function fetchCategories() {
  console.log("Fetching categories from database...");
  const result = await db.select().from(categories);
  console.log("Fetched categories:", result);
  return result;
}
