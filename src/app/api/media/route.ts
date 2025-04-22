/**
 * @File: src/app/api/media/route.ts
 */

import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth/config";

export async function GET() {
  try {
    // Check if the user is authenticated for private media management
    const session = await getServerSession(authOptions);

    // Allow read access to media for both admins and regular users
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Authentication required" },
        { status: 403 }
      );
    }

    // Fetch all media items, sorted by creation date
    const mediaItems = await prisma.media.findMany({
      select: {
        id: true,
        filename: true,
        url: true,
        thumbnailUrl: true,
        size: true,
        width: true,
        height: true,
        type: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ media: mediaItems });
  } catch (error) {
    console.error("Error fetching media items:", error);
    return NextResponse.json(
      { error: "Failed to fetch media items" },
      { status: 500 }
    );
  }
}
