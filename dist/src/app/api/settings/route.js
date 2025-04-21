"use strict";
/**
 * @File: src/app/api/settings/route.ts
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
const utils_1 = require("@/lib/utils");
const zod_1 = require("zod");
// Define validation schema for settings
const settingsSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    title: zod_1.z.string().min(1, "Title is required"),
    description: zod_1.z.string().optional().nullable(),
    logo: zod_1.z.string().optional().nullable(),
    favicon: zod_1.z.string().optional().nullable(),
    socialFacebook: zod_1.z.string().optional().nullable(),
    socialTwitter: zod_1.z.string().optional().nullable(),
    socialInstagram: zod_1.z.string().optional().nullable(),
    socialLinkedIn: zod_1.z.string().optional().nullable(),
    socialGithub: zod_1.z.string().optional().nullable(),
    footerText: zod_1.z.string().optional().nullable(),
});
// Get settings
function GET() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Check if the user is authenticated and an admin for write operations
            const session = yield (0, next_auth_1.getServerSession)(config_1.authOptions);
            if (session && session.user.role !== "ADMIN") {
                return server_1.NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 });
            }
            // Fetch current settings
            const currentSettings = yield db_1.db
                .select()
                .from(schema_1.siteSettings)
                .limit(1)
                .then((res) => res[0] || null);
            // If no settings exist and this is an admin, create default settings
            if (!currentSettings && (session === null || session === void 0 ? void 0 : session.user.role) === "ADMIN") {
                const newSettings = {
                    id: (0, utils_1.createId)(),
                    title: "My Blog",
                    description: "A blog built with Next.js",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                yield db_1.db.insert(schema_1.siteSettings).values(newSettings);
                return server_1.NextResponse.json({ settings: newSettings });
            }
            return server_1.NextResponse.json({ settings: currentSettings });
        }
        catch (error) {
            console.error("Error fetching settings:", error);
            return server_1.NextResponse.json({ error: "Failed to fetch site settings" }, { status: 500 });
        }
    });
}
// Update settings
function POST(req) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            // Check if the user is authenticated and an admin
            const session = yield (0, next_auth_1.getServerSession)(config_1.authOptions);
            if (!session || session.user.role !== "ADMIN") {
                return server_1.NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 });
            }
            // Parse request body
            const body = yield req.json();
            // Validate settings data
            const result = settingsSchema.safeParse(body);
            if (!result.success) {
                return server_1.NextResponse.json({ error: "Invalid input", details: result.error.flatten() }, { status: 400 });
            }
            const settingsData = result.data;
            // Check if settings exist
            const currentSettings = yield db_1.db
                .select()
                .from(schema_1.siteSettings)
                .limit(1)
                .then((res) => res[0] || null);
            if (currentSettings) {
                // Update existing settings
                yield db_1.db
                    .update(schema_1.siteSettings)
                    .set({
                    title: settingsData.title,
                    description: (_a = settingsData.description) !== null && _a !== void 0 ? _a : "",
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
                    .where((0, drizzle_orm_1.eq)(schema_1.siteSettings.id, currentSettings.id));
            }
            else {
                // Create new settings if they don't exist
                yield db_1.db.insert(schema_1.siteSettings).values({
                    id: (0, utils_1.createId)(),
                    title: settingsData.title,
                    description: (_b = settingsData.description) !== null && _b !== void 0 ? _b : "",
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
            return server_1.NextResponse.json({ success: true });
        }
        catch (error) {
            console.error("Error updating settings:", error);
            return server_1.NextResponse.json({ error: "Failed to update site settings" }, { status: 500 });
        }
    });
}
