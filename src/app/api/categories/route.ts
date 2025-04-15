import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { nanoid } from "nanoid";
import { categories } from "@/lib/db/schema";

export async function GET() {
  try {
    const categoriesList = await db.select().from(categories);
    return NextResponse.json(categoriesList);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { name, slug } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const newCategory = {
      id: nanoid(),
      name,
      slug:
        slug ||
        name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, ""),
    };

    await db.insert(categories).values(newCategory);

    return NextResponse.json(newCategory);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
