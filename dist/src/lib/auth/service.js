"use strict";
/**
 * @File: src/lib/auth/service.ts
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
exports.registerUser = registerUser;
exports.updateUser = updateUser;
exports.getUser = getUser;
exports.getUserByEmail = getUserByEmail;
exports.makeUserAdmin = makeUserAdmin;
exports.createRootAdmin = createRootAdmin;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const utils_1 = require("../utils");
const drizzle_orm_1 = require("drizzle-orm");
function registerUser(userData) {
    return __awaiter(this, void 0, void 0, function* () {
        // Check if user already exists
        const existingUser = yield db_1.db
            .select()
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.email, userData.email))
            .then((res) => res[0]);
        if (existingUser) {
            throw new Error("User already exists");
        }
        // Hash password
        const hashedPassword = yield bcryptjs_1.default.hash(userData.password, 10);
        // Create user
        yield db_1.db.insert(schema_1.users).values({
            id: (0, utils_1.createId)(),
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            role: userData.role || "USER", // Use the provided role or default to USER
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return { success: true };
    });
}
function updateUser(userId, userData) {
    return __awaiter(this, void 0, void 0, function* () {
        const updateData = {
            updatedAt: new Date(),
        };
        if (userData.name)
            updateData.name = userData.name;
        if (userData.email)
            updateData.email = userData.email;
        if (userData.image)
            updateData.image = userData.image;
        if (userData.password) {
            updateData.password = yield bcryptjs_1.default.hash(userData.password, 10);
        }
        yield db_1.db.update(schema_1.users).set(updateData).where((0, drizzle_orm_1.eq)(schema_1.users.id, userId));
        return { success: true };
    });
}
function getUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield db_1.db
            .select({
            id: schema_1.users.id,
            name: schema_1.users.name,
            email: schema_1.users.email,
            image: schema_1.users.image,
            role: schema_1.users.role,
            createdAt: schema_1.users.createdAt,
        })
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, userId))
            .then((res) => res[0] || null);
        return user;
    });
}
function getUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield db_1.db
            .select({
            id: schema_1.users.id,
            name: schema_1.users.name,
            email: schema_1.users.email,
            image: schema_1.users.image,
            role: schema_1.users.role,
            createdAt: schema_1.users.createdAt,
        })
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.email, email))
            .then((res) => res[0] || null);
        return user;
    });
}
function makeUserAdmin(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db_1.db.update(schema_1.users).set({ role: "ADMIN" }).where((0, drizzle_orm_1.eq)(schema_1.users.id, userId));
        return { success: true };
    });
}
// Add function to create first admin user (for initial setup)
function createRootAdmin(userData) {
    return __awaiter(this, void 0, void 0, function* () {
        // Check if any admin user already exists
        const existingAdmin = yield db_1.db
            .select()
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.role, "ADMIN"))
            .then((res) => res[0]);
        if (existingAdmin) {
            throw new Error("Root admin already exists");
        }
        // Hash password
        const hashedPassword = yield bcryptjs_1.default.hash(userData.password, 10);
        // Create admin user
        yield db_1.db.insert(schema_1.users).values({
            id: (0, utils_1.createId)(),
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            role: "ADMIN",
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return { success: true };
    });
}
