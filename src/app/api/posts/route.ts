import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import formidable, { Fields, Files, File } from "formidable";
import fs from "fs/promises";
import path from "path";
import { IncomingMessage } from "http";
import { Readable } from "stream";

export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parsing to handle multipart/form-data
  },
};

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

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Updated the POST handler to store image paths as "/uploads/${filename}" and ensure the upload directory exists
    const uploadDir = path.join(process.cwd(), "public/uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB limit
      filter: (part: formidable.Part): boolean => {
        return part.mimetype?.startsWith("image/") || false;
      },
    });

    const reqStream = new Readable();
    reqStream._read = () => {};
    reqStream.push(Buffer.from(await req.arrayBuffer()));
    reqStream.push(null);

    (reqStream as unknown as IncomingMessage).headers = {
      "content-length": req.headers.get("content-length") || "0",
      "content-type": req.headers.get("content-type") || "",
    };

    const { fields, files }: { fields: Fields; files: Files } =
      await new Promise((resolve, reject) => {
        form.parse(
          reqStream as unknown as IncomingMessage,
          (err: Error | null, fields: Fields, files: Files) => {
            if (err) reject(err);
            else resolve({ fields, files });
          }
        );
      });

    const photo = Array.isArray(files.photo)
      ? files.photo[0]?.newFilename
        ? `/uploads/${files.photo[0]?.newFilename}`
        : undefined
      : files.photo && "newFilename" in files.photo
      ? `/uploads/${(files.photo as formidable.File).newFilename}`
      : undefined;

    // if (!photo) {
    //   throw new Error("File upload failed or no file provided.");
    // }

    // Create the post first without categories
    const post = await prisma.post.create({
      data: {
        title: Array.isArray(fields.title)
          ? fields.title[0]
          : fields.title || "Untitled",
        content: Array.isArray(fields.content)
          ? fields.content[0]
          : fields.content || "",
        excerpt: Array.isArray(fields.excerpt)
          ? fields.excerpt[0]
          : fields.excerpt || "",
        slug: Array.isArray(fields.slug) ? fields.slug[0] : fields.slug || "",
        status: Array.isArray(fields.status)
          ? fields.status[0]
          : fields.status || "DRAFT",
        authorId: session.user.id,
        featuredImage: photo, // Use the correct field name from your schema
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Then connect categories if any
    if (fields.categoryId) {
      const categoryIds = Array.isArray(fields.categoryId)
        ? fields.categoryId
        : [fields.categoryId];

      await prisma.categoryPost.createMany({
        data: categoryIds
          .filter(
            (categoryId: string) =>
              typeof categoryId === "string" && categoryId.trim() !== ""
          )
          .map((categoryId: string) => ({
            postId: post.id,
            categoryId,
          })),
      });
    }

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error("Error handling post request:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
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

    // Added error handling for foreign key constraint violations during post deletion
    try {
      const deletedPost = await prisma.post.delete({
        where: { id },
      });

      return NextResponse.json({
        message: "Post deleted successfully",
        deletedPost,
      });
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes("P2003")) {
        return NextResponse.json(
          {
            error:
              "Cannot delete post due to existing references (e.g., comments, categories).",
          },
          { status: 400 }
        );
      }
      throw error; // Re-throw other errors
    }
  } catch (error: unknown) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
