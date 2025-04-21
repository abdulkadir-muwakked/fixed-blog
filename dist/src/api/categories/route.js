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
const server_1 = require("next/server");
const db_1 = require("@/lib/db");
function GET() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const categories = yield (0, db_1.fetchCategories)();
            return server_1.NextResponse.json({ success: true, data: categories });
        }
        catch (error) {
            console.error("Error fetching categories:", error);
            return server_1.NextResponse.json({ success: false, error: "Failed to fetch categories" }, { status: 500 });
        }
    });
}
