import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";

export async function POST(req: Request) {
  try {
    console.log("POST /api/posts route triggered");
    const body = await req.json();

    console.log("Received POST request with body:", body);

    // Validate required fields
    if (!body.title || !body.content || !body.slug) {
      return NextResponse.json(
        { success: false, error: "Title, content, and slug are required." },
        { status: 400 }
      );
    }

    // Insert post into the database
    const newPost = {
      id: body.id || crypto.randomUUID(),
      title: body.title,
      content: body.content,
      excerpt: body.excerpt || "",
      slug: body.slug,
      categoryId: body.categoryId || null,
      status:
        body.status === "DRAFT" ||
        body.status === "PUBLISHED" ||
        body.status === "ARCHIVED"
          ? body.status
          : "DRAFT",
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: body.authorId || null,
      is_featured: body.is_featured || false,
    };

    console.log("Prepared newPost object:", newPost);

    const result = await db.insert(posts).values(newPost);
    console.log("Database insertion result:", result);

    return NextResponse.json({ success: true, data: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create post." },
      { status: 500 }
    );
  }
}

export async function testPostCreation() {
  try {
    const testPost = {
      title: "Test Post",
      content: "This is a test post content.",
      slug: "test-post",
      excerpt: "Test excerpt",
      categoryId: null,
      status: "DRAFT" as "DRAFT" | "PUBLISHED" | "ARCHIVED", // Explicitly set to a valid value without type assertion
      authorId: "test-author-id",
      is_featured: false,
    };

    const result = await db.insert(posts).values(testPost);
    console.log("Test post created successfully:", result);
  } catch (error) {
    console.error("Error creating test post:", error);
  }
}
