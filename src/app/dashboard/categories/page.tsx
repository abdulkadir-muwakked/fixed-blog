import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/config";
import DashboardNav from "@/components/dashboard/dashboard-nav";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import CategoryManager from "@/components/dashboard/category-manager";
import { Toaster } from "@/components/ui/toaster";

export default async function CategoriesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/dashboard/categories");
  }

  // In a real app, we would fetch categories from the database
  const categories = [
    { id: "1", name: "Technology", slug: "technology", postCount: 5 },
    { id: "2", name: "Design", slug: "design", postCount: 3 },
    { id: "3", name: "Development", slug: "development", postCount: 7 },
    { id: "4", name: "Marketing", slug: "marketing", postCount: 2 },
    { id: "5", name: "Business", slug: "business", postCount: 4 },
  ];

  return (
    <DashboardShell>
      <DashboardNav />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <DashboardHeader
          heading="Categories"
          text="Manage blog categories"
        />

        <div className="grid gap-4">
          <CategoryManager categories={categories} />
        </div>

        <Toaster />
      </div>
    </DashboardShell>
  );
}
