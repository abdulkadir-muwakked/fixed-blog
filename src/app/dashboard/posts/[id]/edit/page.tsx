import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/config";
import DashboardNav from "@/components/dashboard/dashboard-nav";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import PostForm from "@/components/dashboard/post-form";
import { Toaster } from "@/components/ui/toaster";
import { db } from "@/lib/db";
import { categories, posts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { InferModel } from "drizzle-orm";
import { categories as categoriesTable } from "@/lib/db/schema";

interface EditPostPageProps {
  params: {
    id: string;
  };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/dashboard/posts");
  }

  // Define the correct type for categories
  const categories: InferModel<typeof categoriesTable>[] = await db
    .select({
      id: categoriesTable.id,
      name: categoriesTable.name,
      slug: categoriesTable.slug,
      description: categoriesTable.description,
      createdAt: categoriesTable.createdAt,
      updatedAt: categoriesTable.updatedAt,
    })
    .from(categoriesTable);

  // Adjust the post query to exclude `categoryId` if it doesn't exist in the schema
  const post = await db
    .select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      excerpt: posts.excerpt ?? "", // Ensure excerpt is a string
      slug: posts.slug,
      status: posts.status,
      publishedAt: posts.publishedAt,
    })
    .from(posts)
    .where(eq(posts.id, params.id))
    .then((res) => res[0]);

  if (!post) {
    redirect("/dashboard/posts");
  }

  // Ensure `excerpt` is always a string before passing to PostForm
  const formattedPost = {
    ...post,
    excerpt: post.excerpt ?? "", // Default to an empty string if null
  };

  // Ensure `excerpt` is always a string in `mappedPost`
  const mappedPost = {
    ...post,
    status: post.status === "ARCHIVED" ? "DRAFT" : post.status, // Map ARCHIVED to DRAFT
    excerpt: post.excerpt ?? "", // Default to an empty string if null
  };

  return (
    <DashboardShell>
      <DashboardNav />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <DashboardHeader
          heading="Edit Post"
          text="Make changes to your post and update it"
        />

        <div className="grid gap-4">
          <PostForm post={mappedPost} categories={categories} />
        </div>

        <Toaster />
      </div>
    </DashboardShell>
  );
}
