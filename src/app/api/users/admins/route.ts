/**
 * @File: src/app/api/users/admins/route.ts
 */

import prisma from "@/lib/db";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth/config";

export async function GET() {
  try {
    // Fetch all admin users directly from the database
    const adminUsers = await prisma.user.findMany({
      where: { role: "ADMIN" },
    });

    if (adminUsers.length === 0) {
      return NextResponse.json(
        { error: "Unauthorized: No admin users found" },
        { status: 403 }
      );
    }

    return NextResponse.json({ admins: adminUsers });
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin users" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if the user exists in the database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ exists: false });
    }

    return NextResponse.json({ exists: true });
  } catch (error) {
    console.error("Error checking user existence:", error);
    return NextResponse.json(
      { error: "Failed to check user existence" },
      { status: 500 }
    );
  }
}
