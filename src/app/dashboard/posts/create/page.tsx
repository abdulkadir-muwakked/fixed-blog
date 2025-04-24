import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/config";
import DashboardNav from "@/components/dashboard/dashboard-nav";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import PostForm from "@/components/dashboard/post-form";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from "@/lib/db";

export default async function CreatePostPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/dashboard/posts/create");
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <DashboardShell>
      <DashboardNav />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <DashboardHeader heading="Create Post" text="Add a new blog post">
          <Button asChild>
            <Link href="/dashboard/posts">Back to Posts</Link>
          </Button>
        </DashboardHeader>

        <PostForm categories={categories} isEditMode={false} />
      </div>
    </DashboardShell>
  );
}
