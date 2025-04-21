"use strict";
/**
 * @File: src/lib/db/schema.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsRelations = exports.categoriesOnPostsRelations = exports.categoriesRelations = exports.postsRelations = exports.usersRelations = exports.media = exports.siteSettings = exports.comments = exports.categoriesOnPosts = exports.categories = exports.posts = exports.verificationTokens = exports.sessions = exports.accounts = exports.users = void 0;
const sqlite_core_1 = require("drizzle-orm/sqlite-core");
const drizzle_orm_1 = require("drizzle-orm");
const utils_1 = require("../utils");
// Define timestamp helpers
const timestamp = () => (0, drizzle_orm_1.sql) `(strftime('%s', 'now') * 1000)`;
exports.users = (0, sqlite_core_1.sqliteTable)("User", {
    // Updated table name to match the database
    id: (0, sqlite_core_1.text)("id")
        .notNull()
        .primaryKey()
        .$defaultFn(() => (0, utils_1.createId)()),
    name: (0, sqlite_core_1.text)("name"),
    email: (0, sqlite_core_1.text)("email").notNull().unique(),
    emailVerified: (0, sqlite_core_1.integer)("emailVerified", { mode: "timestamp_ms" }), // Updated column name to match the database schema
    image: (0, sqlite_core_1.text)("image"),
    password: (0, sqlite_core_1.text)("password"),
    role: (0, sqlite_core_1.text)("role", { enum: ["USER", "ADMIN"] })
        .notNull()
        .default("USER"),
    createdAt: (0, sqlite_core_1.integer)("createdAt", { mode: "timestamp_ms" })
        .notNull()
        .default(timestamp()),
    updatedAt: (0, sqlite_core_1.integer)("updatedAt", { mode: "timestamp_ms" })
        .notNull()
        .default(timestamp()), // Updated column name to match the database schema
});
exports.accounts = (0, sqlite_core_1.sqliteTable)("accounts", {
    id: (0, sqlite_core_1.text)("id")
        .notNull()
        .primaryKey()
        .$defaultFn(() => (0, utils_1.createId)()),
    userId: (0, sqlite_core_1.text)("user_id")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
    type: (0, sqlite_core_1.text)("type").notNull(),
    provider: (0, sqlite_core_1.text)("provider").notNull(),
    providerAccountId: (0, sqlite_core_1.text)("provider_account_id").notNull(),
    refresh_token: (0, sqlite_core_1.text)("refresh_token"),
    access_token: (0, sqlite_core_1.text)("access_token"),
    expires_at: (0, sqlite_core_1.integer)("expires_at"),
    token_type: (0, sqlite_core_1.text)("token_type"),
    scope: (0, sqlite_core_1.text)("scope"),
    id_token: (0, sqlite_core_1.text)("id_token"),
    session_state: (0, sqlite_core_1.text)("session_state"),
}, (table) => ({
    providerProviderAccountIdIndex: (0, sqlite_core_1.primaryKey)(table.provider, table.providerAccountId),
}));
exports.sessions = (0, sqlite_core_1.sqliteTable)("sessions", {
    id: (0, sqlite_core_1.text)("id")
        .notNull()
        .primaryKey()
        .$defaultFn(() => (0, utils_1.createId)()),
    sessionToken: (0, sqlite_core_1.text)("session_token").notNull().unique(),
    userId: (0, sqlite_core_1.text)("user_id")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
    expires: (0, sqlite_core_1.integer)("expires", { mode: "timestamp_ms" }).notNull(),
});
exports.verificationTokens = (0, sqlite_core_1.sqliteTable)("verification_tokens", {
    identifier: (0, sqlite_core_1.text)("identifier").notNull(),
    token: (0, sqlite_core_1.text)("token").notNull(),
    expires: (0, sqlite_core_1.integer)("expires", { mode: "timestamp_ms" }).notNull(),
}, (table) => ({
    compoundKey: (0, sqlite_core_1.primaryKey)(table.identifier, table.token),
}));
// Correct the 'isFeatured' column definition
exports.posts = (0, sqlite_core_1.sqliteTable)("posts", {
    id: (0, sqlite_core_1.text)("id")
        .notNull()
        .primaryKey()
        .$defaultFn(() => (0, utils_1.createId)()),
    title: (0, sqlite_core_1.text)("title").notNull(),
    slug: (0, sqlite_core_1.text)("slug").notNull().unique(),
    content: (0, sqlite_core_1.text)("content").notNull(),
    excerpt: (0, sqlite_core_1.text)("excerpt"),
    featuredImage: (0, sqlite_core_1.text)("featured_image"),
    status: (0, sqlite_core_1.text)("status", { enum: ["DRAFT", "PUBLISHED", "ARCHIVED"] })
        .notNull()
        .default("DRAFT"),
    publishedAt: (0, sqlite_core_1.integer)("published_at", { mode: "timestamp_ms" }),
    metaDescription: (0, sqlite_core_1.text)("meta_description"),
    metaKeywords: (0, sqlite_core_1.text)("meta_keywords"),
    locale: (0, sqlite_core_1.text)("locale").notNull().default("en"),
    createdAt: (0, sqlite_core_1.integer)("createdAt", { mode: "timestamp_ms" })
        .notNull()
        .default(timestamp()),
    updatedAt: (0, sqlite_core_1.integer)("updatedAt", { mode: "timestamp_ms" })
        .notNull()
        .default(timestamp()), // Updated column name to match the database schema
    authorId: (0, sqlite_core_1.text)("author_id")
        .notNull()
        .references(() => exports.users.id),
    isFeatured: (0, sqlite_core_1.integer)("is_featured", { mode: "boolean" })
        .notNull()
        .default((0, drizzle_orm_1.sql) `false`), // Corrected to use integer with boolean mode
});
exports.categories = (0, sqlite_core_1.sqliteTable)("categories", {
    id: (0, sqlite_core_1.text)("id")
        .notNull()
        .primaryKey()
        .$defaultFn(() => (0, utils_1.createId)()),
    name: (0, sqlite_core_1.text)("name").notNull(),
    slug: (0, sqlite_core_1.text)("slug").notNull().unique(),
    description: (0, sqlite_core_1.text)("description"),
    createdAt: (0, sqlite_core_1.integer)("createdAt", { mode: "timestamp_ms" })
        .notNull()
        .default(timestamp()),
    updatedAt: (0, sqlite_core_1.integer)("updatedAt", { mode: "timestamp_ms" })
        .notNull()
        .default(timestamp()), // Updated column name to match the database schema
});
exports.categoriesOnPosts = (0, sqlite_core_1.sqliteTable)("categories_posts", {
    postId: (0, sqlite_core_1.text)("post_id")
        .notNull()
        .references(() => exports.posts.id),
    categoryId: (0, sqlite_core_1.text)("category_id")
        .notNull()
        .references(() => exports.categories.id),
    assignedAt: (0, sqlite_core_1.integer)("assigned_at", { mode: "timestamp_ms" })
        .notNull()
        .default(timestamp()),
}, (table) => ({
    pk: (0, sqlite_core_1.primaryKey)(table.postId, table.categoryId),
}));
// Define comments table with a nullable parentId for hierarchical comments
exports.comments = (0, sqlite_core_1.sqliteTable)("comments", {
    id: (0, sqlite_core_1.text)("id")
        .notNull()
        .primaryKey()
        .$defaultFn(() => (0, utils_1.createId)()),
    content: (0, sqlite_core_1.text)("content").notNull(),
    createdAt: (0, sqlite_core_1.integer)("createdAt", { mode: "timestamp_ms" })
        .notNull()
        .default(timestamp()),
    updatedAt: (0, sqlite_core_1.integer)("updatedAt", { mode: "timestamp_ms" })
        .notNull()
        .default(timestamp()), // Updated column name to match the database schema
    postId: (0, sqlite_core_1.text)("post_id")
        .notNull()
        .references(() => exports.posts.id, { onDelete: "cascade" }),
    userId: (0, sqlite_core_1.text)("user_id")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
    parentId: (0, sqlite_core_1.text)("parent_id"),
});
exports.siteSettings = (0, sqlite_core_1.sqliteTable)("site_settings", {
    id: (0, sqlite_core_1.text)("id")
        .notNull()
        .primaryKey()
        .$defaultFn(() => (0, utils_1.createId)()),
    title: (0, sqlite_core_1.text)("title").notNull().default("My Blog"),
    description: (0, sqlite_core_1.text)("description")
        .notNull()
        .default("A blog built with Next.js"),
    logo: (0, sqlite_core_1.text)("logo"),
    favicon: (0, sqlite_core_1.text)("favicon"),
    socialFacebook: (0, sqlite_core_1.text)("social_facebook"),
    socialTwitter: (0, sqlite_core_1.text)("social_twitter"),
    socialInstagram: (0, sqlite_core_1.text)("social_instagram"),
    socialLinkedIn: (0, sqlite_core_1.text)("social_linkedin"),
    socialGithub: (0, sqlite_core_1.text)("social_github"),
    footerText: (0, sqlite_core_1.text)("footer_text"),
    createdAt: (0, sqlite_core_1.integer)("createdAt", { mode: "timestamp_ms" })
        .notNull()
        .default(timestamp()),
    updatedAt: (0, sqlite_core_1.integer)("updatedAt", { mode: "timestamp_ms" })
        .notNull()
        .default(timestamp()), // Updated column name to match the database schema
});
// Add media table
exports.media = (0, sqlite_core_1.sqliteTable)("media", {
    id: (0, sqlite_core_1.text)("id")
        .notNull()
        .primaryKey()
        .$defaultFn(() => (0, utils_1.createId)()),
    filename: (0, sqlite_core_1.text)("filename").notNull(),
    url: (0, sqlite_core_1.text)("url").notNull(),
    thumbnailUrl: (0, sqlite_core_1.text)("thumbnail_url"),
    size: (0, sqlite_core_1.integer)("size").notNull(),
    width: (0, sqlite_core_1.integer)("width").notNull(),
    height: (0, sqlite_core_1.integer)("height").notNull(),
    type: (0, sqlite_core_1.text)("type").notNull(),
    alt: (0, sqlite_core_1.text)("alt"),
    createdAt: (0, sqlite_core_1.integer)("createdAt", { mode: "timestamp_ms" })
        .notNull()
        .default(timestamp()),
    userId: (0, sqlite_core_1.text)("user_id")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade" }),
});
// Define relations
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, ({ many }) => ({
    posts: many(exports.posts),
    comments: many(exports.comments),
    sessions: many(exports.sessions),
    accounts: many(exports.accounts),
    media: many(exports.media),
}));
exports.postsRelations = (0, drizzle_orm_1.relations)(exports.posts, ({ one, many }) => ({
    author: one(exports.users, {
        fields: [exports.posts.authorId],
        references: [exports.users.id],
    }),
    categories: many(exports.categoriesOnPosts),
    comments: many(exports.comments),
}));
exports.categoriesRelations = (0, drizzle_orm_1.relations)(exports.categories, ({ many }) => ({
    posts: many(exports.categoriesOnPosts),
}));
exports.categoriesOnPostsRelations = (0, drizzle_orm_1.relations)(exports.categoriesOnPosts, ({ one }) => ({
    post: one(exports.posts, {
        fields: [exports.categoriesOnPosts.postId],
        references: [exports.posts.id],
    }),
    category: one(exports.categories, {
        fields: [exports.categoriesOnPosts.categoryId],
        references: [exports.categories.id],
    }),
}));
exports.commentsRelations = (0, drizzle_orm_1.relations)(exports.comments, ({ one, many }) => ({
    post: one(exports.posts, {
        fields: [exports.comments.postId],
        references: [exports.posts.id],
    }),
    user: one(exports.users, {
        fields: [exports.comments.userId],
        references: [exports.users.id],
    }),
    parent: one(exports.comments, {
        fields: [exports.comments.parentId],
        references: [exports.comments.id],
    }),
    replies: many(exports.comments, {
        relationName: "comment_replies",
    }),
}));
