import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/config";
import DashboardNav from "@/components/dashboard/dashboard-nav";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import PostsList from "@/components/dashboard/posts-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { posts as postsTable } from "@/lib/db/schema";
import { eq, InferModel } from "drizzle-orm";

export default async function PostsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/dashboard/posts");
  }

  // Update the posts query to include all required fields
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
    .from(postsTable)
    .where(eq(postsTable.authorId, session.user.id));

  // Map posts to ensure `excerpt` is always a string
  const formattedPosts = posts.map((post) => ({
    ...post,
    excerpt: post.excerpt ?? "", // Default to an empty string if null
  }));

  // Filter out posts with the "ARCHIVED" status
  const filteredPosts = formattedPosts.filter(
    (post) => post.status !== "ARCHIVED"
  );

  // Explicitly cast filteredPosts to the expected type
  const typedPosts = filteredPosts as Array<
    Omit<(typeof filteredPosts)[number], "status"> & {
      status: "DRAFT" | "PUBLISHED";
    }
  >;

  return (
    <DashboardShell>
      <DashboardNav />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <DashboardHeader heading="Posts" text="Manage your blog posts">
          <Button asChild>
            <Link href="/dashboard/posts/create">
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Link>
          </Button>
        </DashboardHeader>

        <PostsList posts={typedPosts} />
      </div>
    </DashboardShell>
  );
}
