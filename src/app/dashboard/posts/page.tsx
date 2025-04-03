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

export default async function PostsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/dashboard/posts");
  }

  // In a real app, we would fetch posts from the database for the authenticated user
  // We'll use the same mock data for now
  const posts = [
    {
      id: "1",
      title: "Getting Started with Next.js 14",
      excerpt: "Learn how to build modern web applications with Next.js 14 and React 18.",
      slug: "getting-started-with-nextjs-14",
      status: "PUBLISHED",
      publishedAt: new Date("2023-10-15"),
    },
    {
      id: "2",
      title: "Styling Modern Applications with Tailwind CSS",
      excerpt: "Discover how to use Tailwind CSS to create beautiful user interfaces quickly.",
      slug: "styling-with-tailwind-css",
      status: "PUBLISHED",
      publishedAt: new Date("2023-10-10"),
    },
    {
      id: "3",
      title: "Building a Blog with Markdown and Next.js",
      excerpt: "Create a powerful blog using Markdown for content and Next.js for delivery.",
      slug: "blog-with-markdown-nextjs",
      status: "DRAFT",
      publishedAt: null,
    },
    {
      id: "4",
      title: "Authentication in Modern Web Applications",
      excerpt: "Implement secure authentication for your web applications using NextAuth.js.",
      slug: "authentication-modern-web-apps",
      status: "DRAFT",
      publishedAt: null,
    },
  ];

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

        <PostsList posts={posts} />
      </div>
    </DashboardShell>
  );
}
