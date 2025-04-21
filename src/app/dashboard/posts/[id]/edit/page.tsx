import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/config";
import DashboardNav from "@/components/dashboard/dashboard-nav";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import PostForm from "@/components/dashboard/post-form";
import { Toaster } from "@/components/ui/toaster";
import prisma from "@/lib/db";

interface EditPostPageProps {
  params: {
    id: string;
  };
}

export default async function EditPostPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/dashboard/posts");
  }

  const { id: postId } = await params; // Await `params` to resolve the error

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: { categories: true },
  });

  if (!post) {
    return <div>Post not found</div>;
  }

  const normalizedPost = {
    ...post,
    excerpt: post.excerpt ?? "",
    status: post.status as "PUBLISHED" | "DRAFT",
  };

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <DashboardShell>
      <DashboardNav />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <DashboardHeader
          heading="Edit Post"
          text="Make changes to your post and update it"
        />

        <div className="grid gap-4">
          <PostForm post={normalizedPost} categories={categories} />
        </div>

        <Toaster />
      </div>
    </DashboardShell>
  );
}
