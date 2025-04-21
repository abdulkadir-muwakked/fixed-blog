/**
 * @File: src/app/api/auth/setup/route.ts
 */

import { createRootAdmin } from "@/lib/auth/service";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { User } from "@prisma/client"; // Import the User model from Prisma client

// تعريف مخطط التحقق من صحة البيانات لإنشاء الجذر المسؤول
const setupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// التحقق مما إذا كان الإعداد مطلوبًا
// Check if setup is required
export async function GET() {
  try {
    console.log("Checking if admin exists...");
    const adminCount = await prisma.user.count({
      where: { role: "ADMIN" },
    });

    console.log("Admin exists:", adminCount > 0);

    return NextResponse.json({
      setupRequired: adminCount === 0,
    });
  } catch (error) {
    console.error("Setup check error:", error);
    return NextResponse.json(
      { error: "Failed to check setup status" },
      { status: 500 }
    );
  }
}

// إنشاء حساب الجذر المسؤول
export async function POST(req: NextRequest) {
  try {
    const adminCount = await prisma.user.count({
      where: { role: "ADMIN" },
    });

    if (adminCount > 0) {
      return NextResponse.json(
        { error: "Setup has already been completed" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const result = setupSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.flatten() },
        { status: 400 }
      );
    }

    await createRootAdmin(result.data);

    return NextResponse.json(
      { success: true, message: "Root admin created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Root admin creation error:", error);

    if (
      error instanceof Error &&
      error.message === "Root admin already exists"
    ) {
      return NextResponse.json(
        { error: "Root admin already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create root admin" },
      { status: 500 }
    );
  }
}
