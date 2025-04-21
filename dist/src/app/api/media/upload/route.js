"use strict";
/**
 * @File: src/app/api/media/upload/route.ts
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const next_auth_1 = require("next-auth");
const config_1 = require("@/lib/auth/config");
const db_1 = require("@/lib/db");
const schema_1 = require("@/lib/db/schema");
const utils_1 = require("@/lib/utils");
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const uuid_1 = require("uuid");
const sharp_1 = __importDefault(require("sharp"));
// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;
// Allowed file types
const ALLOWED_FILE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
];
function POST(req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Check if the user is authenticated and an admin
            const session = yield (0, next_auth_1.getServerSession)(config_1.authOptions);
            if (!session) {
                return server_1.NextResponse.json({ error: "Unauthorized: Authentication required" }, { status: 403 });
            }
            // Get form data (file)
            const formData = yield req.formData();
            const file = formData.get("file");
            if (!file) {
                return server_1.NextResponse.json({ error: "No file provided" }, { status: 400 });
            }
            // Validate file size
            if (file.size > MAX_FILE_SIZE) {
                return server_1.NextResponse.json({ error: "File size exceeds the 5MB limit" }, { status: 400 });
            }
            // Validate file type
            if (!ALLOWED_FILE_TYPES.includes(file.type)) {
                return server_1.NextResponse.json({ error: "File type not allowed" }, { status: 400 });
            }
            // Create directories if they don't exist
            const uploadsDir = path_1.default.join(process.cwd(), "public", "uploads");
            const thumbnailsDir = path_1.default.join(process.cwd(), "public", "uploads", "thumbnails");
            yield promises_1.default.mkdir(uploadsDir, { recursive: true });
            yield promises_1.default.mkdir(thumbnailsDir, { recursive: true });
            // Generate unique filename
            const fileExtension = path_1.default.extname(file.name);
            const fileName = `${(0, uuid_1.v4)()}${fileExtension}`;
            const thumbnailName = `thumb_${fileName}`;
            // File paths
            const filePath = path_1.default.join(uploadsDir, fileName);
            const thumbnailPath = path_1.default.join(thumbnailsDir, thumbnailName);
            // Read file content as ArrayBuffer
            const fileBuffer = yield file.arrayBuffer();
            const buffer = Buffer.from(fileBuffer);
            // Write file to disk
            yield promises_1.default.writeFile(filePath, buffer);
            // Get image dimensions
            const imageInfo = yield (0, sharp_1.default)(buffer).metadata();
            const { width = 0, height = 0 } = imageInfo;
            // Create thumbnail
            yield (0, sharp_1.default)(buffer)
                .resize({ width: 300, height: 300, fit: 'inside' })
                .toFile(thumbnailPath);
            // Construct URLs
            const fileUrl = `/uploads/${fileName}`;
            const thumbnailUrl = `/uploads/thumbnails/${thumbnailName}`;
            // Save to database
            const newMedia = {
                id: (0, utils_1.createId)(),
                filename: file.name,
                url: fileUrl,
                thumbnailUrl: thumbnailUrl,
                size: file.size,
                width,
                height,
                type: file.type,
                userId: session.user.id,
                createdAt: new Date(),
            };
            yield db_1.db.insert(schema_1.media).values(newMedia);
            return server_1.NextResponse.json({
                success: true,
                media: {
                    id: newMedia.id,
                    filename: newMedia.filename,
                    url: newMedia.url,
                    thumbnailUrl: newMedia.thumbnailUrl,
                    size: newMedia.size,
                    width: newMedia.width,
                    height: newMedia.height,
                    type: newMedia.type,
                },
            });
        }
        catch (error) {
            console.error("Error uploading file:", error);
            return server_1.NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
        }
    });
}
