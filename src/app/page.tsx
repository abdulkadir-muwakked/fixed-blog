import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";

// تصحيح: نقل عملية التوجيه داخل المكون بشكل صحيح
export default async function Page() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-slate-950 py-20 md:py-32 overflow-hidden">
        <div className="container relative z-10 flex flex-col items-center text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white max-w-4xl">
            موقع متخصص بالمقلات الطبية
          </h1>
          <p className="mt-6 text-lg text-slate-300 max-w-2xl">
            مقلات طبية عن عمليات الطبية والتجملية في تركيا
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg">
              <Link href="/blog">
                اقراء المقالات
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="bg-transparent text-white border-white hover:bg-white hover:text-slate-950"
            >
              <Link href="https://o9medical.com/">تصفح الفئات</Link>
            </Button>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-700/20 to-purple-700/20 z-0" />
        <div className="absolute inset-0 bg-slate-950/60 z-0" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497215842964-222b430dc094')] bg-cover bg-center opacity-20 z-0" />
      </section>

      {/* Featured Posts */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold">Featured Articles</h2>
              <p className="mt-2 text-muted-foreground">
                Explore our most popular and insightful content
              </p>
            </div>
            <Button asChild variant="ghost" className="mt-4 md:mt-0">
              <Link href="/blog">
                View all articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id as string} // Explicitly cast to string
                className="flex flex-col overflow-hidden rounded-lg border bg-background transition-all hover:shadow-md"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={post.featuredImage || "/default-image.jpg"}
                    alt={post.title || "Default Title"}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                </div>
                <div className="flex flex-col flex-1 p-6">
                  <h3 className="text-xl font-semibold leading-tight mb-2">
                    <Link
                      href={`/blog/${post.slug as string}`} // Explicitly cast to string
                      className="hover:underline"
                    >
                      {post.title as string}
                    </Link>
                  </h3>
                  <p className="text-muted-foreground flex-1 mb-4">
                    {post.excerpt as string}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        Author ID: {post.authorId as string}
                        to string
                      </span>
                    </div>
                    <time className="text-sm text-muted-foreground">
                      {post.publishedAt &&
                        new Date(
                          post.publishedAt as unknown as string
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                    </time>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      {/* <section className="bg-muted py-16">
        <div className="container flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-muted-foreground max-w-2xl mb-8">
            Stay updated with the latest articles, tutorials, and insights
            delivered directly to your inbox.
          </p>
          <form className="flex w-full max-w-md flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              required
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </section> */}
    </>
  );
}
