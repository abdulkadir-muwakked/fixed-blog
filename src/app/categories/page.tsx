import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function CategoriesPage() {
  // In a real app, we would fetch these from the database
  const categories = [
    {
      id: "1",
      name: "Next.js",
      slug: "nextjs",
      description: "Articles about the Next.js framework and ecosystem",
      count: 12,
    },
    {
      id: "2",
      name: "React",
      slug: "react",
      description: "Everything related to React, hooks, and component patterns",
      count: 18,
    },
    {
      id: "3",
      name: "JavaScript",
      slug: "javascript",
      description: "Core JavaScript concepts, ES6+, and best practices",
      count: 24,
    },
    {
      id: "4",
      name: "CSS",
      slug: "css",
      description: "CSS tips, tricks, and modern styling approaches",
      count: 9,
    },
    {
      id: "5",
      name: "Tailwind CSS",
      slug: "tailwind",
      description: "Using Tailwind CSS for rapid UI development",
      count: 7,
    },
    {
      id: "6",
      name: "Design",
      slug: "design",
      description: "UI/UX design principles and implementation",
      count: 11,
    },
    {
      id: "7",
      name: "TypeScript",
      slug: "typescript",
      description: "TypeScript tips, patterns, and best practices",
      count: 15,
    },
    {
      id: "8",
      name: "Backend",
      slug: "backend",
      description: "Server-side development with Node.js and other technologies",
      count: 13,
    },
    {
      id: "9",
      name: "DevOps",
      slug: "devops",
      description: "Deployment, CI/CD, and infrastructure as code",
      count: 5,
    },
    {
      id: "10",
      name: "Security",
      slug: "security",
      description: "Web application security best practices",
      count: 8,
    },
    {
      id: "11",
      name: "Performance",
      slug: "performance",
      description: "Web performance optimization techniques",
      count: 6,
    },
    {
      id: "12",
      name: "Testing",
      slug: "testing",
      description: "Testing frameworks and methodologies for web applications",
      count: 9,
    },
  ];

  return (
    <>
      <section className="bg-muted py-10 md:py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Categories</h1>
          <p className="text-muted-foreground max-w-2xl mb-6">
            Browse our articles by category to find exactly what you're looking for.
          </p>

          {/* Search */}
          <div className="max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search categories..."
                className="w-full pl-10 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/blog?category=${category.slug}`}
                className="flex flex-col p-6 rounded-lg border bg-background hover:shadow-md transition-all"
              >
                <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
                <p className="text-sm text-muted-foreground mb-4 flex-1">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{category.count} articles</span>
                  <Button variant="ghost" size="sm" className="font-medium">
                    Browse
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
