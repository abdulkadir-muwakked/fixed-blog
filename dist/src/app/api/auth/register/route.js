"use strict";
/**
 * @File: src/app/api/auth/register/route.ts
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
exports.POST = POST;
const service_1 = require("@/lib/auth/service");
const server_1 = require("next/server");
const zod_1 = require("zod");
const next_auth_1 = require("next-auth");
const config_1 = require("@/lib/auth/config");
// Define validation schema
const registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name must be at least 2 characters"),
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters"),
    role: zod_1.z.enum(["USER", "ADMIN"]).optional().default("USER"),
});
function POST(req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Get the current session to check if the user is an admin
            const session = yield (0, next_auth_1.getServerSession)(config_1.authOptions);
            // Only allow admin users to register new accounts
            if (!session || session.user.role !== "ADMIN") {
                return server_1.NextResponse.json({ error: "Unauthorized: Only admins can create new accounts" }, { status: 403 });
            }
            // Parse request body
            const body = yield req.json();
            // Validate request data
            const result = registerSchema.safeParse(body);
            if (!result.success) {
                return server_1.NextResponse.json({ error: "Invalid input", details: result.error.flatten() }, { status: 400 });
            }
            // Register the user
            yield (0, service_1.registerUser)(result.data);
            return server_1.NextResponse.json({ success: true, message: "User registered successfully" }, { status: 201 });
        }
        catch (error) {
            console.error("Registration error:", error);
            if (error instanceof Error && error.message === "User already exists") {
                return server_1.NextResponse.json({ error: "User already exists with this email" }, { status: 409 });
            }
            return server_1.NextResponse.json({ error: "Registration failed" }, { status: 500 });
        }
    });
}
