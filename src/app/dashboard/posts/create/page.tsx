import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/config";
import DashboardNav from "@/components/dashboard/dashboard-nav";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import PostForm from "@/components/dashboard/post-form";
import { Toaster } from "@/components/ui/toaster";
import { db } from "@/lib/db";
import { InferModel } from "drizzle-orm";
import { categories as categoriesTable } from "@/lib/db/schema";

export default async function CreatePostPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/dashboard/posts/create");
  }

  // Fetch categories dynamically from the database
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

  return (
    <DashboardShell>
      <DashboardNav />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <DashboardHeader
          heading="Create Post"
          text="Create a new blog post and publish it or save as draft"
        />

        <div className="grid gap-4">
          <PostForm categories={categories} />
        </div>

        <Toaster />
      </div>
    </DashboardShell>
  );
}
