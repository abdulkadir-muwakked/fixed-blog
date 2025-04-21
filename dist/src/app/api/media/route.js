"use strict";
/**
 * @File: src/app/api/media/route.ts
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
const db_1 = require("@/lib/db");
const schema_1 = require("@/lib/db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const next_auth_1 = require("next-auth");
const server_1 = require("next/server");
const config_1 = require("@/lib/auth/config");
function GET() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Check if the user is authenticated for private media management
            const session = yield (0, next_auth_1.getServerSession)(config_1.authOptions);
            // Allow read access to media for both admins and regular users
            if (!session) {
                return server_1.NextResponse.json({ error: "Unauthorized: Authentication required" }, { status: 403 });
            }
            // Fetch all media items, sorted by creation date
            const mediaItems = yield db_1.db
                .select({
                id: schema_1.media.id,
                filename: schema_1.media.filename,
                url: schema_1.media.url,
                thumbnailUrl: schema_1.media.thumbnailUrl,
                size: schema_1.media.size,
                width: schema_1.media.width,
                height: schema_1.media.height,
                type: schema_1.media.type,
                createdAt: schema_1.media.createdAt,
            })
                .from(schema_1.media)
                .orderBy((0, drizzle_orm_1.desc)(schema_1.media.createdAt));
            return server_1.NextResponse.json({ media: mediaItems });
        }
        catch (error) {
            console.error("Error fetching media items:", error);
            return server_1.NextResponse.json({ error: "Failed to fetch media items" }, { status: 500 });
        }
    });
}
