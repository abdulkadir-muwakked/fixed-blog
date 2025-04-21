import { db } from "@/lib/db";
import { posts as postsTable } from "@/lib/db/schema";
import { InferModel } from "drizzle-orm";

export default async function TestPage() {
  // Fetch posts directly from the database
  const posts: InferModel<typeof postsTable>[] = await db
    .select({
      id: postsTable.id,
      slug: postsTable.slug,
      createdAt: postsTable.createdAt,
      updatedAt: postsTable.updatedAt,
      title: postsTable.title,
      content: postsTable.content,
      excerpt: postsTable.excerpt ?? "", // Ensure excerpt is a string
      featuredImage: postsTable.featuredImage,
      status: postsTable.status,
      publishedAt: postsTable.publishedAt,
      isFeatured: postsTable.isFeatured,
      metaDescription: postsTable.metaDescription,
      metaKeywords: postsTable.metaKeywords,
      locale: postsTable.locale,
      authorId: postsTable.authorId,
    })
    .from(postsTable);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Test Page - Raw Posts Data</h1>
      <pre
        style={{ background: "#f4f4f4", padding: "10px", borderRadius: "5px" }}
      >
        {JSON.stringify(posts, null, 2)}
      </pre>
    </div>
  );
}
