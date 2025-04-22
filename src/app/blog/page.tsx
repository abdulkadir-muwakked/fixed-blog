import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import prisma from "@/lib/db";

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
      categories: {
        include: {
          category: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <section className="bg-muted py-10 md:py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">The Blog</h1>
          <p className="text-muted-foreground max-w-2xl mb-6">
            Explore our collection of articles, tutorials, and insights on web
            development, design, and technology.
          </p>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search articles..."
                className="w-full pl-10 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <div className="w-40">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="react">React</SelectItem>
                    <SelectItem value="nextjs">Next.js</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-40">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Latest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(
              (post: {
                id: string;
                title: string;
                slug: string;
                excerpt: string | null;
                featuredImage: string | null;
                publishedAt: Date | null;
                author: { name: string | null; image: string | null };
                categories: { category: { id: string; name: string } }[];
              }) => (
                <article
                  key={post.id}
                  className="flex flex-col overflow-hidden rounded-lg border bg-background transition-all hover:shadow-md"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={post.featuredImage || "/uploads/default-image.jpg"}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col flex-1 p-6">
                    <div className="flex items-center gap-2 mb-2">
                      {post.categories.map(
                        ({
                          category,
                        }: {
                          category: { id: string; name: string };
                        }) => (
                          <span
                            key={category.id}
                            className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors"
                          >
                            {category.name}
                          </span>
                        )
                      )}
                    </div>
                    <h2 className="text-xl font-semibold leading-tight mb-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="hover:underline"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-muted-foreground flex-1 mb-4">
                      {post.excerpt || "No excerpt available."}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="relative h-8 w-8 rounded-full overflow-hidden">
                          <Image
                            src={
                              post.author.image || "/uploads/default-avatar.jpg"
                            }
                            alt={post.author.name || "Author"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {post.author.name || "Unknown Author"}
                        </span>
                      </div>
                      <time className="text-sm text-muted-foreground">
                        {new Date(
                          post.publishedAt || new Date()
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </time>
                    </div>
                  </div>
                </article>
              )
            )}
          </div>

          <div className="flex justify-center mt-10">
            <div className="flex gap-2">
              <Button variant="outline" size="icon" disabled>
                <span className="sr-only">Previous page</span>
                <span aria-hidden>←</span>
              </Button>
              <Button variant="outline" size="sm" className="font-medium">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <span className="flex h-10 w-10 items-center justify-center text-sm">
                ...
              </span>
              <Button variant="outline" size="sm">
                10
              </Button>
              <Button variant="outline" size="icon">
                <span className="sr-only">Next page</span>
                <span aria-hidden>→</span>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
