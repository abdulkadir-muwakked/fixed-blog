"use strict";
/**
 * @File: src/lib/auth/drizzle-adapter.ts
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
exports.DrizzleAdapter = DrizzleAdapter;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("@/lib/db"); // تأكد من استخدام المسار الصحيح
const schema_1 = require("@/lib/db/schema");
const utils_1 = require("@/lib/utils");
function DrizzleAdapter(client) {
    return {
        createUser(userData) {
            return __awaiter(this, void 0, void 0, function* () {
                const id = (0, utils_1.createId)();
                yield client.insert(schema_1.users).values({
                    id,
                    email: userData.email,
                    emailVerified: userData.emailVerified,
                    name: userData.name,
                    image: userData.image,
                });
                const [user] = yield client
                    .select()
                    .from(schema_1.users)
                    .where((0, drizzle_orm_1.eq)(schema_1.users.id, id))
                    .limit(1);
                return user;
            });
        },
        getUser(id) {
            return __awaiter(this, void 0, void 0, function* () {
                const user = yield db_1.db
                    .select()
                    .from(schema_1.users)
                    .where((0, drizzle_orm_1.eq)(schema_1.users.id, id))
                    .then((res) => res[0] || null);
                return user;
            });
        },
        getUserByEmail(email) {
            return __awaiter(this, void 0, void 0, function* () {
                const user = yield db_1.db
                    .select()
                    .from(schema_1.users)
                    .where((0, drizzle_orm_1.eq)(schema_1.users.email, email))
                    .then((res) => res[0] || null);
                return user;
            });
        },
        getUserByAccount(_a) {
            return __awaiter(this, arguments, void 0, function* ({ providerAccountId, provider }) {
                const account = yield db_1.db
                    .select()
                    .from(schema_1.accounts)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.accounts.providerAccountId, providerAccountId), (0, drizzle_orm_1.eq)(schema_1.accounts.provider, provider)))
                    .then((res) => res[0]);
                if (!account) {
                    return null;
                }
                const user = yield db_1.db
                    .select()
                    .from(schema_1.users)
                    .where((0, drizzle_orm_1.eq)(schema_1.users.id, account.userId))
                    .then((res) => res[0]);
                return user || null;
            });
        },
        updateUser(user) {
            return __awaiter(this, void 0, void 0, function* () {
                yield db_1.db
                    .update(schema_1.users)
                    .set({
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    emailVerified: user.emailVerified,
                })
                    .where((0, drizzle_orm_1.eq)(schema_1.users.id, user.id));
                const updatedUser = yield db_1.db
                    .select()
                    .from(schema_1.users)
                    .where((0, drizzle_orm_1.eq)(schema_1.users.id, user.id))
                    .then((res) => res[0]);
                return updatedUser;
            });
        },
        deleteUser(userId) {
            return __awaiter(this, void 0, void 0, function* () {
                yield db_1.db.delete(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, userId));
            });
        },
        linkAccount(account) {
            return __awaiter(this, void 0, void 0, function* () {
                yield db_1.db.insert(schema_1.accounts).values({
                    id: (0, utils_1.createId)(),
                    userId: account.userId,
                    type: account.type,
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                    refresh_token: account.refresh_token,
                    access_token: account.access_token,
                    expires_at: account.expires_at,
                    token_type: account.token_type,
                    scope: account.scope,
                    id_token: account.id_token,
                    session_state: account.session_state,
                });
            });
        },
        unlinkAccount(_a) {
            return __awaiter(this, arguments, void 0, function* ({ providerAccountId, provider }) {
                yield db_1.db
                    .delete(schema_1.accounts)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.accounts.providerAccountId, providerAccountId), (0, drizzle_orm_1.eq)(schema_1.accounts.provider, provider)));
            });
        },
        createSession(session) {
            return __awaiter(this, void 0, void 0, function* () {
                yield db_1.db.insert(schema_1.sessions).values({
                    id: (0, utils_1.createId)(),
                    userId: session.userId,
                    sessionToken: session.sessionToken,
                    expires: session.expires,
                });
                const createdSession = yield db_1.db
                    .select()
                    .from(schema_1.sessions)
                    .where((0, drizzle_orm_1.eq)(schema_1.sessions.sessionToken, session.sessionToken))
                    .then((res) => res[0]);
                return createdSession;
            });
        },
        getSessionAndUser(sessionToken) {
            return __awaiter(this, void 0, void 0, function* () {
                const session = yield db_1.db
                    .select()
                    .from(schema_1.sessions)
                    .where((0, drizzle_orm_1.eq)(schema_1.sessions.sessionToken, sessionToken))
                    .then((res) => res[0]);
                if (!session) {
                    return null;
                }
                const user = yield db_1.db
                    .select()
                    .from(schema_1.users)
                    .where((0, drizzle_orm_1.eq)(schema_1.users.id, session.userId))
                    .then((res) => res[0]);
                if (!user) {
                    return null;
                }
                return {
                    session,
                    user,
                };
            });
        },
        updateSession(session) {
            return __awaiter(this, void 0, void 0, function* () {
                yield db_1.db
                    .update(schema_1.sessions)
                    .set({
                    expires: session.expires,
                })
                    .where((0, drizzle_orm_1.eq)(schema_1.sessions.sessionToken, session.sessionToken));
                const updatedSession = yield db_1.db
                    .select()
                    .from(schema_1.sessions)
                    .where((0, drizzle_orm_1.eq)(schema_1.sessions.sessionToken, session.sessionToken))
                    .then((res) => res[0] || null);
                return updatedSession;
            });
        },
        deleteSession(sessionToken) {
            return __awaiter(this, void 0, void 0, function* () {
                yield db_1.db.delete(schema_1.sessions).where((0, drizzle_orm_1.eq)(schema_1.sessions.sessionToken, sessionToken));
            });
        },
        createVerificationToken(verificationToken) {
            return __awaiter(this, void 0, void 0, function* () {
                yield db_1.db.insert(schema_1.verificationTokens).values({
                    identifier: verificationToken.identifier,
                    token: verificationToken.token,
                    expires: verificationToken.expires,
                });
                const token = yield db_1.db
                    .select()
                    .from(schema_1.verificationTokens)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.verificationTokens.identifier, verificationToken.identifier), (0, drizzle_orm_1.eq)(schema_1.verificationTokens.token, verificationToken.token)))
                    .then((res) => res[0]);
                return token;
            });
        },
        useVerificationToken(_a) {
            return __awaiter(this, arguments, void 0, function* ({ identifier, token }) {
                const verificationToken = yield db_1.db
                    .select()
                    .from(schema_1.verificationTokens)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.verificationTokens.identifier, identifier), (0, drizzle_orm_1.eq)(schema_1.verificationTokens.token, token)))
                    .then((res) => res[0] || null);
                if (!verificationToken) {
                    return null;
                }
                yield db_1.db
                    .delete(schema_1.verificationTokens)
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.verificationTokens.identifier, identifier), (0, drizzle_orm_1.eq)(schema_1.verificationTokens.token, token)));
                return verificationToken;
            });
        },
    };
}
