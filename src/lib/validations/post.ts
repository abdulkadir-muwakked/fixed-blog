// @/lib/validations/post.ts
import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  excerpt: z.string().optional(),
  content: z.string().min(10, "Content must be at least 10 characters"),
  categoryId: z.string().min(1, "Category is required"),
  status: z.enum(["PUBLISHED", "DRAFT"]),
  photo: z.any().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
});
