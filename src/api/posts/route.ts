export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { Prisma } from "@prisma/client";
import { nanoid } from "nanoid";
import formidable, { Fields, Files, File } from "formidable";
import fs from "fs/promises";
import path from "path";
import { IncomingMessage } from "http";
import { Readable } from "stream";

export const config = {
  api: {
    bodyParser: false,
  },
};
async function generateUniqueSlug(baseSlug: string, excludeId?: string) {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existingPost = await prisma.post.findFirst({
      where: {
        slug,
        ...(excludeId && { id: { not: excludeId } }),
      },
    });

    if (!existingPost) return slug;

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}
async function parseFormData(req: Request) {
  const uploadDir = path.join(process.cwd(), "public/uploads");
  await fs.mkdir(uploadDir, { recursive: true });

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    filter: (part) => part.mimetype?.startsWith("image/") || false,
  });

  const reqStream = new Readable();
  reqStream._read = () => {};
  reqStream.push(Buffer.from(await req.arrayBuffer()));
  reqStream.push(null);

  (reqStream as unknown as IncomingMessage).headers = {
    "content-length": req.headers.get("content-length") || "0",
    "content-type": req.headers.get("content-type") || "",
  };

  return new Promise<{ fields: Fields; files: Files }>((resolve, reject) => {
    form.parse(
      reqStream as unknown as IncomingMessage,
      (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      }
    );
  });
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fields, files } = await parseFormData(req);

    // Extract and validate required fields
    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
    const content = Array.isArray(fields.content)
      ? fields.content[0]
      : fields.content;
    const slugInput = Array.isArray(fields.slug) ? fields.slug[0] : fields.slug;
    const excerpt = Array.isArray(fields.excerpt)
      ? fields.excerpt[0]
      : fields.excerpt;
    const status = Array.isArray(fields.status)
      ? fields.status[0]
      : fields.status;
    const categoryIds = Array.isArray(fields.categoryId)
      ? fields.categoryId
      : fields.categoryId
      ? [fields.categoryId]
      : [];

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    // Generate unique slug
    let slug = slugInput || generateSlug(title);
    let slugExists = await prisma.post.findUnique({ where: { slug } });
    while (slugExists) {
      slug = `${slug}-${nanoid(4)}`;
      slugExists = await prisma.post.findUnique({ where: { slug } });
    }

    // Handle featured image
    let featuredImage: string | null = null;
    if (files.featuredImage) {
      const file = Array.isArray(files.featuredImage)
        ? files.featuredImage[0]
        : files.featuredImage;
      if (file && "newFilename" in file) {
        featuredImage = `/uploads/${file.newFilename}`;
      } else {
        return NextResponse.json(
          { error: "Invalid file upload or no file provided." },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "No file provided for the featured image." },
        { status: 400 }
      );
    }

    // Create post with categories
    const post = await prisma.post.create({
      data: {
        title,
        content,
        slug,
        excerpt: excerpt || "",
        status: status || "DRAFT",
        authorId: session.user.id,
        featuredImage,
        categories: {
          createMany: {
            data: categoryIds.map((categoryId) => ({ categoryId })),
          },
        },
      },
      include: {
        categories: true,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Slug already exists" },
          { status: 409 }
        );
      }
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // استخراج postId من query parameters
    const url = new URL(req.url);
    const postId = url.searchParams.get("id");
    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    const { fields, files } = await parseFormData(req);

    // تحقق من وجود البوست الأصلي
    const existingPost = await prisma.post.findUnique({
      where: { id: postId, authorId: session.user.id },
      include: { categories: true },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: "لم يتم العثور على البوست" },
        { status: 404 }
      );
    }

    // معالجة الحقول
    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
    const content = Array.isArray(fields.content)
      ? fields.content[0]
      : fields.content;
    const slugInput = Array.isArray(fields.slug) ? fields.slug[0] : fields.slug;
    const excerpt = Array.isArray(fields.excerpt)
      ? fields.excerpt[0]
      : fields.excerpt;
    const status = Array.isArray(fields.status)
      ? fields.status[0]
      : fields.status;
    const categoryIds = Array.isArray(fields.categoryId)
      ? fields.categoryId
      : fields.categoryId
      ? [fields.categoryId]
      : [];

    // توليد slug فريد إذا تغير
    let slug = existingPost.slug;
    if (slugInput && slugInput !== existingPost.slug) {
      slug = await generateUniqueSlug(slugInput, postId);
    }

    // معالجة الصورة (الاحتفاظ بالصورة القديمة إذا لم يتم توفير جديدة)
    let featuredImage = existingPost.featuredImage;
    if (files.featuredImage) {
      const file = Array.isArray(files.featuredImage)
        ? files.featuredImage[0]
        : files.featuredImage;
      if (file?.newFilename) {
        featuredImage = `/uploads/${file.newFilename}`;
      }
    }

    // تحديث البوست والفئات في عملية واحدة
    const [updatedPost] = await prisma.$transaction([
      prisma.post.update({
        where: { id: postId },
        data: {
          title: title || existingPost.title,
          content: content || existingPost.content,
          slug,
          excerpt: excerpt || existingPost.excerpt,
          status: status || existingPost.status,
          featuredImage,
          updatedAt: new Date(),
        },
      }),
      prisma.categoryPost.deleteMany({ where: { postId } }),
      prisma.categoryPost.createMany({
        data: categoryIds.map((categoryId) => ({ postId, categoryId })),
      }),
    ]);

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("خطأ في التعديل:", error);
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
