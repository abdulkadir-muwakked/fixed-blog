"use strict";
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
exports.testPostCreation = testPostCreation;
const server_1 = require("next/server");
const db_1 = require("@/lib/db");
const schema_1 = require("@/lib/db/schema");
function POST(req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("POST /api/posts route triggered");
            const body = yield req.json();
            console.log("Received POST request with body:", body);
            // Validate required fields
            if (!body.title || !body.content || !body.slug) {
                return server_1.NextResponse.json({ success: false, error: "Title, content, and slug are required." }, { status: 400 });
            }
            // Insert post into the database
            const newPost = {
                id: body.id || crypto.randomUUID(),
                title: body.title,
                content: body.content,
                excerpt: body.excerpt || "",
                slug: body.slug,
                categoryId: body.categoryId || null,
                status: body.status === "DRAFT" ||
                    body.status === "PUBLISHED" ||
                    body.status === "ARCHIVED"
                    ? body.status
                    : "DRAFT",
                createdAt: new Date(),
                updatedAt: new Date(),
                authorId: body.authorId || null,
                is_featured: body.is_featured || false,
            };
            console.log("Prepared newPost object:", newPost);
            const result = yield db_1.db.insert(schema_1.posts).values(newPost);
            console.log("Database insertion result:", result);
            return server_1.NextResponse.json({ success: true, data: newPost });
        }
        catch (error) {
            console.error("Error creating post:", error);
            return server_1.NextResponse.json({ success: false, error: "Failed to create post." }, { status: 500 });
        }
    });
}
function testPostCreation() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const testPost = {
                title: "Test Post",
                content: "This is a test post content.",
                slug: "test-post",
                excerpt: "Test excerpt",
                categoryId: null,
                status: "DRAFT", // Explicitly set to a valid value without type assertion
                authorId: "test-author-id",
                is_featured: false,
            };
            const result = yield db_1.db.insert(schema_1.posts).values(testPost);
            console.log("Test post created successfully:", result);
        }
        catch (error) {
            console.error("Error creating test post:", error);
        }
    });
}
