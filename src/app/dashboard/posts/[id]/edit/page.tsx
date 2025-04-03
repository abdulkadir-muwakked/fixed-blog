import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/config";
import DashboardNav from "@/components/dashboard/dashboard-nav";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import PostForm from "@/components/dashboard/post-form";
import { Toaster } from "@/components/ui/toaster";

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

  // In a real app, we would fetch the post from the database
  // We're using mock data for demonstration purposes
  const posts = [
    {
      id: "1",
      title: "Getting Started with Next.js 14",
      content: "<h1>Getting Started with Next.js 14</h1><p>This is a comprehensive guide to getting started with Next.js 14...</p>",
      excerpt: "Learn how to build modern web applications with Next.js 14 and React 18.",
      slug: "getting-started-with-nextjs-14",
      status: "PUBLISHED",
      categoryId: "3",
      publishedAt: new Date("2023-10-15"),
    },
    {
      id: "2",
      title: "Styling Modern Applications with Tailwind CSS",
      content: "<h1>Styling Modern Applications with Tailwind CSS</h1><p>This guide explores how to use Tailwind CSS effectively...</p>",
      excerpt: "Discover how to use Tailwind CSS to create beautiful user interfaces quickly.",
      slug: "styling-with-tailwind-css",
      status: "PUBLISHED",
      categoryId: "2",
      publishedAt: new Date("2023-10-10"),
    },
    {
      id: "3",
      title: "Building a Blog with Markdown and Next.js",
      content: "<h1>Building a Blog with Markdown and Next.js</h1><p>In this tutorial, we'll explore how to build a blog using Markdown...</p>",
      excerpt: "Create a powerful blog using Markdown for content and Next.js for delivery.",
      slug: "blog-with-markdown-nextjs",
      status: "DRAFT",
      categoryId: "3",
      publishedAt: null,
    },
    {
      id: "4",
      title: "Authentication in Modern Web Applications",
      content: "<h1>Authentication in Modern Web Applications</h1><p>This guide covers authentication best practices...</p>",
      excerpt: "Implement secure authentication for your web applications using NextAuth.js.",
      slug: "authentication-modern-web-apps",
      status: "DRAFT",
      categoryId: "1",
      publishedAt: null,
    },
  ];

  const post = posts.find(post => post.id === params.id);

  if (!post) {
    redirect("/dashboard/posts");
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
          heading="Edit Post"
          text="Make changes to your post and update it"
        />

        <div className="grid gap-4">
          <PostForm
            post={post}
            categories={categories}
          />
        </div>

        <Toaster />
      </div>
    </DashboardShell>
  );
}
