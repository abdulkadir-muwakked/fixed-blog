import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { media } from "@/lib/db/schema";
import { createId } from "@/lib/utils";
import path from "path";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed file types
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

export async function POST(req: NextRequest) {
  try {
    // Check if the user is authenticated and an admin
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Authentication required" },
        { status: 403 }
      );
    }

    // Get form data (file)
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds the 5MB limit" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "File type not allowed" },
        { status: 400 }
      );
    }

    // Create directories if they don't exist
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const thumbnailsDir = path.join(process.cwd(), "public", "uploads", "thumbnails");
    await fs.mkdir(uploadsDir, { recursive: true });
    await fs.mkdir(thumbnailsDir, { recursive: true });

    // Generate unique filename
    const fileExtension = path.extname(file.name);
    const fileName = `${uuidv4()}${fileExtension}`;
    const thumbnailName = `thumb_${fileName}`;

    // File paths
    const filePath = path.join(uploadsDir, fileName);
    const thumbnailPath = path.join(thumbnailsDir, thumbnailName);

    // Read file content as ArrayBuffer
    const fileBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);

    // Write file to disk
    await fs.writeFile(filePath, buffer);

    // Get image dimensions
    const imageInfo = await sharp(buffer).metadata();
    const { width = 0, height = 0 } = imageInfo;

    // Create thumbnail
    await sharp(buffer)
      .resize({ width: 300, height: 300, fit: 'inside' })
      .toFile(thumbnailPath);

    // Construct URLs
    const fileUrl = `/uploads/${fileName}`;
    const thumbnailUrl = `/uploads/thumbnails/${thumbnailName}`;

    // Save to database
    const newMedia = {
      id: createId(),
      filename: file.name,
      url: fileUrl,
      thumbnailUrl: thumbnailUrl,
      size: file.size,
      width,
      height,
      type: file.type,
      userId: session.user.id,
      createdAt: new Date(),
    };

    await db.insert(media).values(newMedia);

    return NextResponse.json({
      success: true,
      media: {
        id: newMedia.id,
        filename: newMedia.filename,
        url: newMedia.url,
        thumbnailUrl: newMedia.thumbnailUrl,
        size: newMedia.size,
        width: newMedia.width,
        height: newMedia.height,
        type: newMedia.type,
      },
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
