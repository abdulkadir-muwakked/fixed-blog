import { createRootAdmin } from "@/lib/auth/service";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm"; // إضافة الاستيراد المفقود لـ sql
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

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
    const adminExists = await db
    .select({ count: sql`count(*)` })
    .from(users)
    .where(eq(users.role, "ADMIN"))
    .then((res: { count: unknown }[]) => {
      return (res[0]?.count as number) > 0; // تأكيد نوع count كـ number
    });
  

    return NextResponse.json({
      setupRequired: !adminExists,
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
    // التحقق مما إذا كان هناك أي مستخدمين مسؤولين بالفعل
    const adminExists = await db
      .select()
      .from(users)
      .where(eq(users.role, "ADMIN"))
      .then((res) => res.length > 0);

    if (adminExists) {
      return NextResponse.json(
        { error: "Setup has already been completed" },
        { status: 400 }
      );
    }

    // تحليل جسم الطلب
    const body = await req.json();

    // التحقق من صحة البيانات المدخلة
    const result = setupSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.flatten() },
        { status: 400 }
      );
    }

    // إنشاء الجذر المسؤول
    await createRootAdmin(result.data);

    return NextResponse.json(
      { success: true, message: "Root admin created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Root admin creation error:", error);

    if (error instanceof Error && error.message === "Root admin already exists") {
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
