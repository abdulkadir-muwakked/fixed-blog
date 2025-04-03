import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/config";
import DashboardNav from "@/components/dashboard/dashboard-nav";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import PostForm from "@/components/dashboard/post-form";
import { Toaster } from "@/components/ui/toaster";

export default async function CreatePostPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/dashboard/posts/create");
  }

  // In a real app, we would fetch categories from the database
  const categories = [
    { id: "1", name: "Technology" },
    { id: "2", name: "Design" },
    { id: "3", name: "Development" },
    { id: "4", name: "Marketing" },
    { id: "5", name: "Business" },
  ];

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
