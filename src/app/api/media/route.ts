import { db } from "@/lib/db";
import { media } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
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
    const mediaItems = await db
      .select({
        id: media.id,
        filename: media.filename,
        url: media.url,
        thumbnailUrl: media.thumbnailUrl,
        size: media.size,
        width: media.width,
        height: media.height,
        type: media.type,
        createdAt: media.createdAt,
      })
      .from(media)
      .orderBy(desc(media.createdAt));

    return NextResponse.json({ media: mediaItems });
  } catch (error) {
    console.error("Error fetching media items:", error);
    return NextResponse.json(
      { error: "Failed to fetch media items" },
      { status: 500 }
    );
  }
}
