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

interface PostFormProps {
  post: {
    categories: { id: string; name: string }[];
    excerpt: string;
    status: "DRAFT" | "PUBLISHED";
    author: { id: string; name: string | null; email: string };
    id: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
    title?: string; // Add specific optional fields if needed
  };
  categories: { id: string; name: string }[];
  isEditMode: boolean;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/dashboard/posts");
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        categories: {
          select: {
            category: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!post) {
      return <div>Post not found</div>;
    }

    // تحويل categories إلى التنسيق المتوقع
    const postCategories = post.categories.map((cat) => ({
      id: cat.category.id,
      name: cat.category.name,
    }));

    const normalizedPost = {
      ...post,
      categories: postCategories,
      excerpt: post.excerpt ?? "",
      status: post.status as "PUBLISHED" | "DRAFT",
    };

    const allCategories = await prisma.category.findMany({
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
            <PostForm
              post={normalizedPost}
              categories={allCategories}
              isEditMode={true}
            />
          </div>

          <Toaster />
        </div>
      </DashboardShell>
    );
  } catch (error) {
    console.error("Error fetching post data:", error);
    return <div>Error loading post data</div>;
  }
}
