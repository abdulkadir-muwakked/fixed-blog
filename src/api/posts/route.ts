import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { Prisma } from "@prisma/client";
import { nanoid } from "nanoid";

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("id");
    const body = await req.json();

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // التحقق من وجود البوست
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // التحقق من عدم تكرار الـ slug إذا تم تغييره
    if (body.slug && body.slug !== existingPost.slug) {
      const slugExists = await prisma.post.findUnique({
        where: { slug: body.slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "Slug already in use" },
          { status: 400 }
        );
      }
    }

    // تحديث البوست
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        title: body.title || existingPost.title,
        content: body.content || existingPost.content,
        slug: body.slug || existingPost.slug,
        excerpt: body.excerpt ?? existingPost.excerpt,
        status: body.status || existingPost.status,
        featuredImage: body.featuredImage ?? existingPost.featuredImage,
        metaDescription: body.metaDescription ?? existingPost.metaDescription,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, title, content, excerpt, slug, categoryId, status } = body;

    if (!title || !content || !slug) {
      return NextResponse.json(
        { error: "Title, content, and slug are required." },
        { status: 400 }
      );
    }

    // Ensure slug uniqueness
    let uniqueSlug = slug;
    let slugExists = await prisma.post.findUnique({
      where: { slug: uniqueSlug },
    });
    while (slugExists && slugExists.id !== id) {
      uniqueSlug = `${slug}-${nanoid(6)}`;
      slugExists = await prisma.post.findUnique({
        where: { slug: uniqueSlug },
      });
    }

    // If updating, validate permissions
    if (id) {
      const post = await prisma.post.findUnique({ where: { id } });

      if (!post) {
        return NextResponse.json({ error: "Post not found." }, { status: 404 });
      }

      if (post.authorId !== session.user.id && session.user.role !== "ADMIN") {
        return NextResponse.json(
          { error: "You do not have permission to edit this post." },
          { status: 403 }
        );
      }
    }

    // Create or update the post
    const postData = {
      title,
      content,
      excerpt: excerpt || "",
      slug: uniqueSlug,
      categoryId: categoryId || null,
      status: status || "DRAFT",
      authorId: session.user.id,
      updatedAt: new Date(),
    };

    const result = id
      ? await prisma.post.update({
          where: { id },
          data: postData,
        })
      : await prisma.post.create({
          data: { ...postData, createdAt: new Date() },
        });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Unique constraint failed on slug." },
          { status: 400 }
        );
      }
    }

    console.error("Error handling post request:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
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

    const result = await prisma.post.create({
      data: testPost,
    });
    console.log("Test post created successfully:", result);
  } catch (error) {
    console.error("Error creating test post:", error);
  }
}
