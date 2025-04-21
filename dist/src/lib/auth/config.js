"use strict";
/**
 * @File: src/lib/auth/config.ts
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
exports.authOptions = void 0;
const credentials_1 = __importDefault(require("next-auth/providers/credentials"));
const github_1 = __importDefault(require("next-auth/providers/github"));
const google_1 = __importDefault(require("next-auth/providers/google"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const drizzle_adapter_1 = require("./drizzle-adapter");
const db_1 = require("@/lib/db");
const schema_1 = require("@/lib/db/schema");
const drizzle_orm_1 = require("drizzle-orm");
exports.authOptions = {
    debug: process.env.NODE_ENV === "development",
    secret: process.env.NEXTAUTH_SECRET,
    adapter: (0, drizzle_adapter_1.DrizzleAdapter)(db_1.db),
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    providers: [
        (0, github_1.default)({
            clientId: process.env.GITHUB_CLIENT_ID || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
        }),
        (0, google_1.default)({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        (0, credentials_1.default)({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize(credentials) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        if (!(credentials === null || credentials === void 0 ? void 0 : credentials.email) || !(credentials === null || credentials === void 0 ? void 0 : credentials.password)) {
                            throw new Error("Email and password are required");
                        }
                        const user = yield db_1.db
                            .select()
                            .from(schema_1.users)
                            .where((0, drizzle_orm_1.eq)(schema_1.users.email, credentials.email))
                            .then((res) => res[0]);
                        if (!user) {
                            throw new Error("User not found");
                        }
                        if (!user.password) {
                            throw new Error("User registered with OAuth");
                        }
                        const isValid = yield bcryptjs_1.default.compare(credentials.password, user.password);
                        if (!isValid) {
                            throw new Error("Invalid password");
                        }
                        return {
                            id: user.id,
                            email: user.email,
                            name: user.name,
                            image: user.image,
                            role: user.role,
                        };
                    }
                    catch (error) {
                        console.error("Authorization error:", error);
                        return null;
                    }
                });
            },
        }),
    ],
    callbacks: {
        jwt(_a) {
            return __awaiter(this, arguments, void 0, function* ({ token, user }) {
                console.log(token, user, "authOptions");
                if (user) {
                    token.id = user.id;
                    token.role = user.role;
                }
                return token;
            });
        },
        session(_a) {
            return __awaiter(this, arguments, void 0, function* ({ session, token }) {
                if (token === null || token === void 0 ? void 0 : token.id)
                    session.user.id = token.id;
                if (token === null || token === void 0 ? void 0 : token.role)
                    session.user.role = token.role;
                return session;
            });
        },
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
};
