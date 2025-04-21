"use strict";
/**
 * @File: src/app/api/auth/setup/route.ts
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.POST = POST;
const service_1 = require("@/lib/auth/service");
const db_1 = require("@/lib/db");
const schema_1 = require("@/lib/db/schema");
const drizzle_orm_1 = require("drizzle-orm"); // إضافة الاستيراد المفقود لـ sql
const server_1 = require("next/server");
const zod_1 = require("zod");
// تعريف مخطط التحقق من صحة البيانات لإنشاء الجذر المسؤول
const setupSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name must be at least 2 characters"),
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters"),
});
// التحقق مما إذا كان الإعداد مطلوبًا
// Check if setup is required
function GET() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Checking if admin exists...");
            const adminExists = yield db_1.db
                .select({ count: (0, drizzle_orm_1.sql) `count(*)` })
                .from(schema_1.users) // Use the correct table reference
                .where((0, drizzle_orm_1.eq)(schema_1.users.role, "ADMIN"))
                .then((res) => {
                var _a;
                console.log("Raw query result:", res);
                return ((_a = res[0]) === null || _a === void 0 ? void 0 : _a.count) > 0; // تأكيد نوع count كـ number
            });
            console.log("Admin exists:", adminExists);
            return server_1.NextResponse.json({
                setupRequired: !adminExists,
            });
        }
        catch (error) {
            // Use unknown instead of any
            if (error instanceof Error) {
                // Type guard to narrow the type
                console.error("Setup check error:", error);
                console.error("Error details:", {
                    message: error.message,
                    stack: error.stack,
                    code: error.code, // Cast to any only for specific properties
                });
                return server_1.NextResponse.json({ error: "Failed to check setup status", details: error.message }, { status: 500 });
            }
            else {
                console.error("Unknown error:", error);
                return server_1.NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
            }
        }
    });
}
// إنشاء حساب الجذر المسؤول
function POST(req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // التحقق مما إذا كان هناك أي مستخدمين مسؤولين بالفعل
            const adminExists = yield db_1.db
                .select()
                .from(schema_1.users)
                .where((0, drizzle_orm_1.eq)(schema_1.users.role, "ADMIN")) // Ensure correct column name
                .then((res) => res.length > 0);
            if (adminExists) {
                return server_1.NextResponse.json({ error: "Setup has already been completed" }, { status: 400 });
            }
            // تحليل جسم الطلب
            const body = yield req.json();
            // التحقق من صحة البيانات المدخلة
            const result = setupSchema.safeParse(body);
            if (!result.success) {
                return server_1.NextResponse.json({ error: "Invalid input", details: result.error.flatten() }, { status: 400 });
            }
            // إنشاء الجذر المسؤول
            yield (0, service_1.createRootAdmin)(result.data);
            return server_1.NextResponse.json({ success: true, message: "Root admin created successfully" }, { status: 201 });
        }
        catch (error) {
            console.error("Root admin creation error:", error);
            if (error instanceof Error &&
                error.message === "Root admin already exists") {
                return server_1.NextResponse.json({ error: "Root admin already exists" }, { status: 409 });
            }
            return server_1.NextResponse.json({ error: "Failed to create root admin" }, { status: 500 });
        }
    });
}
