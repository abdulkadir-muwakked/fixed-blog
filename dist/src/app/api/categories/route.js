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
exports.GET = GET;
exports.POST = POST;
const server_1 = require("next/server");
const db_1 = require("@/lib/db");
const nanoid_1 = require("nanoid");
const schema_1 = require("@/lib/db/schema");
function GET() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const categoriesList = yield db_1.db.select().from(schema_1.categories);
            return server_1.NextResponse.json(categoriesList);
        }
        catch (error) {
            return server_1.NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
        }
    });
}
function POST(req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, slug } = yield req.json();
            if (!name) {
                return server_1.NextResponse.json({ error: "Name is required" }, { status: 400 });
            }
            const newCategory = {
                id: (0, nanoid_1.nanoid)(),
                name,
                slug: slug ||
                    name
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)+/g, ""),
            };
            yield db_1.db.insert(schema_1.categories).values(newCategory);
            return server_1.NextResponse.json(newCategory);
        }
        catch (error) {
            return server_1.NextResponse.json({ error: "Failed to create category" }, { status: 500 });
        }
    });
}
