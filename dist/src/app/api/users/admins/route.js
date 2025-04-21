"use strict";
/**
 * @File: src/app/api/users/admins/route.ts
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
const db_1 = require("@/lib/db");
const schema_1 = require("@/lib/db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const next_auth_1 = require("next-auth");
const server_1 = require("next/server");
const config_1 = require("@/lib/auth/config");
function GET() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Check if the user is authenticated and an admin
            const session = yield (0, next_auth_1.getServerSession)(config_1.authOptions);
            if (!session || session.user.role !== "ADMIN") {
                return server_1.NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 });
            }
            // Fetch all admin users
            const adminUsers = yield db_1.db
                .select({
                id: schema_1.users.id,
                name: schema_1.users.name,
                email: schema_1.users.email,
                image: schema_1.users.image,
                createdAt: schema_1.users.createdAt,
            })
                .from(schema_1.users)
                .where((0, drizzle_orm_1.eq)(schema_1.users.role, "ADMIN"))
                .orderBy(schema_1.users.createdAt);
            return server_1.NextResponse.json({ admins: adminUsers });
        }
        catch (error) {
            console.error("Error fetching admin users:", error);
            return server_1.NextResponse.json({ error: "Failed to fetch admin users" }, { status: 500 });
        }
    });
}
function POST(req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email } = yield req.json();
            if (!email) {
                return server_1.NextResponse.json({ error: "Email is required" }, { status: 400 });
            }
            // Check if the user exists in the database
            const user = yield db_1.db
                .select({
                id: schema_1.users.id,
                email: schema_1.users.email,
                role: schema_1.users.role,
            })
                .from(schema_1.users)
                .where((0, drizzle_orm_1.eq)(schema_1.users.email, email))
                .limit(1);
            if (user.length === 0) {
                return server_1.NextResponse.json({ exists: false });
            }
            return server_1.NextResponse.json({ exists: true });
        }
        catch (error) {
            console.error("Error checking user existence:", error);
            return server_1.NextResponse.json({ error: "Failed to check user existence" }, { status: 500 });
        }
    });
}
