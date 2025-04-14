/**
 * @File: src/lib/db/schema.ts
 */

import {
  sqliteTable,
  text,
  integer,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { createId } from "../utils";

// Define timestamp helpers
const timestamp = () => sql`(strftime('%s', 'now') * 1000)`;

export const users = sqliteTable("User", {
  // Updated table name to match the database
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }), // Updated column name to match the database schema
  image: text("image"),
  password: text("password"),
  role: text("role", { enum: ["USER", "ADMIN"] })
    .notNull()
    .default("USER"),
  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .notNull()
    .default(timestamp()),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
    .notNull()
    .default(timestamp()), // Updated column name to match the database schema
});

export const accounts = sqliteTable(
  "accounts",
  {
    id: text("id")
      .notNull()
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => ({
    providerProviderAccountIdIndex: primaryKey(
      table.provider,
      table.providerAccountId
    ),
  })
);

export const sessions = sqliteTable("sessions", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId()),
  sessionToken: text("session_token").notNull().unique(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => ({
    compoundKey: primaryKey(table.identifier, table.token),
  })
);

// Correct the 'isFeatured' column definition
export const posts = sqliteTable("posts", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId()),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  featuredImage: text("featured_image"),
  status: text("status", { enum: ["DRAFT", "PUBLISHED", "ARCHIVED"] })
    .notNull()
    .default("DRAFT"),
  publishedAt: integer("published_at", { mode: "timestamp_ms" }),
  metaDescription: text("meta_description"),
  metaKeywords: text("meta_keywords"),
  locale: text("locale").notNull().default("en"),
  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .notNull()
    .default(timestamp()),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
    .notNull()
    .default(timestamp()), // Updated column name to match the database schema
  authorId: text("author_id")
    .notNull()
    .references(() => users.id),
  isFeatured: integer("is_featured", { mode: "boolean" })
    .notNull()
    .default(sql`false`), // Corrected to use integer with boolean mode
});

export const categories = sqliteTable("categories", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .notNull()
    .default(timestamp()),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
    .notNull()
    .default(timestamp()), // Updated column name to match the database schema
});

export const categoriesOnPosts = sqliteTable(
  "categories_posts",
  {
    postId: text("post_id")
      .notNull()
      .references(() => posts.id),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id),
    assignedAt: integer("assigned_at", { mode: "timestamp_ms" })
      .notNull()
      .default(timestamp()),
  },
  (table) => ({
    pk: primaryKey(table.postId, table.categoryId),
  })
);

// Define comments table with a nullable parentId for hierarchical comments
export const comments = sqliteTable("comments", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId()),
  content: text("content").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .notNull()
    .default(timestamp()),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
    .notNull()
    .default(timestamp()), // Updated column name to match the database schema
  postId: text("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  parentId: text("parent_id"),
});

export const siteSettings = sqliteTable("site_settings", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId()),
  title: text("title").notNull().default("My Blog"),
  description: text("description")
    .notNull()
    .default("A blog built with Next.js"),
  logo: text("logo"),
  favicon: text("favicon"),
  socialFacebook: text("social_facebook"),
  socialTwitter: text("social_twitter"),
  socialInstagram: text("social_instagram"),
  socialLinkedIn: text("social_linkedin"),
  socialGithub: text("social_github"),
  footerText: text("footer_text"),
  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .notNull()
    .default(timestamp()),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
    .notNull()
    .default(timestamp()), // Updated column name to match the database schema
});

// Add media table
export const media = sqliteTable("media", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId()),
  filename: text("filename").notNull(),
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  size: integer("size").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  type: text("type").notNull(),
  alt: text("alt"),
  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .notNull()
    .default(timestamp()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
  sessions: many(sessions),
  accounts: many(accounts),
  media: many(media),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  categories: many(categoriesOnPosts),
  comments: many(comments),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  posts: many(categoriesOnPosts),
}));

export const categoriesOnPostsRelations = relations(
  categoriesOnPosts,
  ({ one }) => ({
    post: one(posts, {
      fields: [categoriesOnPosts.postId],
      references: [posts.id],
    }),
    category: one(categories, {
      fields: [categoriesOnPosts.categoryId],
      references: [categories.id],
    }),
  })
);

export const commentsRelations = relations(comments, ({ one, many }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
  }),
  replies: many(comments, {
    relationName: "comment_replies",
  }),
}));

// Types
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Post = InferSelectModel<typeof posts>;
export type NewPost = InferInsertModel<typeof posts>;

export type Category = InferSelectModel<typeof categories>;
export type NewCategory = InferInsertModel<typeof categories>;

export type Comment = InferSelectModel<typeof comments>;
export type NewComment = InferInsertModel<typeof comments>;

export type SiteSetting = InferSelectModel<typeof siteSettings>;
export type NewSiteSetting = InferInsertModel<typeof siteSettings>;

export type Media = InferSelectModel<typeof media>;
export type NewMedia = InferInsertModel<typeof media>;
