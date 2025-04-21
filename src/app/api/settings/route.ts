/**
 * @File: src/app/api/settings/route.ts
 */

import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth/config";
import { createId } from "@/lib/utils";
import { z } from "zod";

// Define validation schema for settings
const settingsSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  logo: z.string().optional().nullable(),
  favicon: z.string().optional().nullable(),
  socialFacebook: z.string().optional().nullable(),
  socialTwitter: z.string().optional().nullable(),
  socialInstagram: z.string().optional().nullable(),
  socialLinkedIn: z.string().optional().nullable(),
  socialGithub: z.string().optional().nullable(),
  footerText: z.string().optional().nullable(),
});

// Get settings
export async function GET() {
  try {
    // Check if the user is authenticated and an admin for write operations
    const session = await getServerSession(authOptions);

    if (session && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    // Fetch current settings
    const currentSettings = await db
      .select()
      .from(siteSettings)
      .limit(1)
      .then((res) => res[0] || null);

    // If no settings exist and this is an admin, create default settings
    if (!currentSettings && session?.user.role === "ADMIN") {
      const newSettings = {
        id: createId(),
        title: "My Blog",
        description: "A blog built with Next.js",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.insert(siteSettings).values(newSettings);
      return NextResponse.json({ settings: newSettings });
    }

    return NextResponse.json({ settings: currentSettings });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch site settings" },
      { status: 500 }
    );
  }
}

// Update settings
export async function POST(req: NextRequest) {
  try {
    // Check if the user is authenticated and an admin
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await req.json();

    // Validate settings data
    const result = settingsSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const settingsData = result.data;

    // Check if settings exist
    const currentSettings = await db
      .select()
      .from(siteSettings)
      .limit(1)
      .then((res) => res[0] || null);

    if (currentSettings) {
      // Update existing settings
      await db
        .update(siteSettings)
        .set({
          title: settingsData.title,
          description: settingsData.description ?? "",
          logo: settingsData.logo,
          favicon: settingsData.favicon,
          socialFacebook: settingsData.socialFacebook,
          socialTwitter: settingsData.socialTwitter,
          socialInstagram: settingsData.socialInstagram,
          socialLinkedIn: settingsData.socialLinkedIn,
          socialGithub: settingsData.socialGithub,
          footerText: settingsData.footerText,
          updatedAt: new Date(),
        })
        .where(eq(siteSettings.id, currentSettings.id));
    } else {
      // Create new settings if they don't exist
      await db.insert(siteSettings).values({
        id: createId(),
        title: settingsData.title,
        description: settingsData.description ?? "",
        logo: settingsData.logo,
        favicon: settingsData.favicon,
        socialFacebook: settingsData.socialFacebook,
        socialTwitter: settingsData.socialTwitter,
        socialInstagram: settingsData.socialInstagram,
        socialLinkedIn: settingsData.socialLinkedIn,
        socialGithub: settingsData.socialGithub,
        footerText: settingsData.footerText,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update site settings" },
      { status: 500 }
    );
  }
}
