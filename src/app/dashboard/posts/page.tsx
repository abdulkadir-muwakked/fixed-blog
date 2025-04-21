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
import prisma from "@/lib/db";

export default async function PostsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/dashboard/posts");
  }

  const posts = await prisma.post.findMany({
    where: { authorId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const normalizedPosts = posts.map((post) => ({
    ...post,
    excerpt: post.excerpt ?? "",
    status: post.status as "PUBLISHED" | "DRAFT",
    featuredImage: post.featuredImage
      ? post.featuredImage
      : "/default-image.jpg",
  }));

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

        <PostsList posts={normalizedPosts} />
      </div>
    </DashboardShell>
  );
}
