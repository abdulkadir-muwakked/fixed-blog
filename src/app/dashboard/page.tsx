import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/config";
import DashboardNav from "@/components/dashboard/dashboard-nav";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import PostsList from "@/components/dashboard/posts-list";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/dashboard");
  }

  // In a real app, we would fetch posts from the database for the authenticated user
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
        <DashboardHeader
          heading="Dashboard"
          text="Manage your blog posts and settings"
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
            <div className="flex flex-row items-center justify-between">
              <h3 className="tracking-tight text-sm font-medium">Total Posts</h3>
            </div>
            <div className="flex flex-col">
              <div className="text-2xl font-bold">{posts.length}</div>
              <p className="text-xs text-muted-foreground">
                {posts.filter(post => post.status === "PUBLISHED").length} published
              </p>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
            <div className="flex flex-row items-center justify-between">
              <h3 className="tracking-tight text-sm font-medium">Total Views</h3>
            </div>
            <div className="flex flex-col">
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
            <div className="flex flex-row items-center justify-between">
              <h3 className="tracking-tight text-sm font-medium">Engagement</h3>
            </div>
            <div className="flex flex-col">
              <div className="text-2xl font-bold">12%</div>
              <p className="text-xs text-muted-foreground">
                +2.2% from last month
              </p>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
            <div className="flex flex-row items-center justify-between">
              <h3 className="tracking-tight text-sm font-medium">Comments</h3>
            </div>
            <div className="flex flex-col">
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground">
                12 new since last login
              </p>
            </div>
          </div>
        </div>

        <PostsList posts={posts} />
      </div>
    </DashboardShell>
  );
}
