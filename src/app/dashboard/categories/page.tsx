import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/config";
import DashboardNav from "@/components/dashboard/dashboard-nav";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import CategoryManager from "@/components/dashboard/category-manager";
import { Toaster } from "@/components/ui/toaster";
import { fetchCategories } from "@/lib/db";

export default async function CategoriesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/dashboard/categories");
  }

  // Fetch categories from the database
  const categories = await fetchCategories();

  return (
    <DashboardShell>
      <DashboardNav />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <DashboardHeader heading="Categories" text="Manage blog categories" />

        <div className="grid gap-4">
          <CategoryManager categories={categories} />
        </div>

        <Toaster />
      </div>
    </DashboardShell>
  );
}
