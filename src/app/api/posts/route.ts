import prisma from "@/lib/db";
import { NextResponse } from "next/server";

// Added missing imports for `getServerSession` and `authOptions`.
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        categories: true,
        author: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// Updated the `POST` method to ensure all required fields are provided and validated before creating a post.

// Added detailed error logging to identify the cause of the 500 Internal Server Error.

// Updated the `POST` method to fetch `authorId` from the session if it is not provided in the request body.

// Added detailed logging to debug the 500 Internal Server Error.
export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("Incoming request body:", body); // Log the request body for debugging

    // Fetch the authorId from the session if not provided
    const session = await getServerSession(authOptions);
    const authorId = body.authorId || session?.user?.id;

    if (!body.title || !body.content || !body.slug || !authorId) {
      console.error("Validation failed: Missing required fields", {
        title: body.title,
        content: body.content,
        slug: body.slug,
        authorId,
      });
      throw new Error(
        "Missing required fields: title, content, slug, or authorId"
      );
    }

    const categoryIds = Array.isArray(body.categoryIds) ? body.categoryIds : [];

    // Validate that the authorId exists in the database
    const authorExists = await prisma.user.findUnique({
      where: { id: authorId },
    });

    if (!authorExists) {
      console.error("Validation failed: Invalid authorId", { authorId });
      throw new Error("Invalid authorId: User does not exist");
    }

    const newPost = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        excerpt: body.excerpt || "",
        slug: body.slug,
        authorId,
        status: body.status || "DRAFT", // Ensure status is set correctly
        categories: {
          connect: categoryIds.map((id: string) => ({ id })),
        },
      },
    });

    console.log("Post created successfully:", newPost); // Log the created post

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error); // Log the error for debugging
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: errorMessage || "Failed to create post" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    if (!req.url) {
      throw new Error("Request URL is missing");
    }

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    const deletedPost = await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Post deleted successfully",
      deletedPost,
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
