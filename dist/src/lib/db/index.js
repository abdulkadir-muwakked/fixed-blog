"use strict";
/**
 * @File: src/lib/db/index.ts
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.db = void 0;
exports.fetchCategories = fetchCategories;
exports.testPostsTable = testPostsTable;
exports.verifyPostsTable = verifyPostsTable;
const better_sqlite3_1 = require("drizzle-orm/better-sqlite3");
const better_sqlite3_2 = __importDefault(require("better-sqlite3"));
const schema = __importStar(require("./schema"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const schema_1 = require("./schema");
// تحديد المسار الصحيح - استخدم المسار المطلق
const dbPath = path_1.default.resolve(process.cwd(), "prisma", "dev.db");
// تصحيح الأخطاء
console.log("Database path:", dbPath);
// تهيئة قاعدة البيانات
const initDB = () => {
    try {
        const dbDir = path_1.default.dirname(dbPath);
        if (!fs_1.default.existsSync(dbDir)) {
            fs_1.default.mkdirSync(dbDir, { recursive: true });
        }
        if (!fs_1.default.existsSync(dbPath)) {
            fs_1.default.writeFileSync(dbPath, "");
        }
        const sqlite = new better_sqlite3_2.default(dbPath);
        return (0, better_sqlite3_1.drizzle)(sqlite, { schema });
    }
    catch (error) {
        console.error("Database initialization error:", error);
        throw error;
    }
};
exports.db = initDB();
function fetchCategories() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Fetching categories from database...");
        const result = yield exports.db.select().from(schema_1.categories);
        console.log("Fetched categories:", result);
        return result;
    });
}
function testPostsTable() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Testing posts table...");
            const result = yield exports.db.select().from(schema.posts);
            console.log("Posts table data:", result);
        }
        catch (error) {
            console.error("Error querying posts table:", error);
        }
    });
}
function verifyPostsTable() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Verifying posts table...");
            const result = yield exports.db.select().from(schema.posts);
            console.log("Posts table data:", result);
        }
        catch (error) {
            console.error("Error querying posts table:", error);
        }
    });
}
