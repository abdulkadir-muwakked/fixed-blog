import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { redirect } from 'next/navigation';

// تصحيح: نقل عملية التوجيه داخل المكون بشكل صحيح
export default function Home() {
  // إعادة التوجيه إلى اللغة الافتراضية إذا كانت الصفحة الرئيسية
 
  const featuredPosts = [
    {
      id: "1",
      title: "Getting Started with Next.js 14",
      excerpt:
        "Learn how to build modern web applications with Next.js 14 and React 18.",
      slug: "getting-started-with-nextjs-14",
      featuredImage: "https://images.unsplash.com/photo-1587620962725-abab7fe55159",
      publishedAt: new Date("2023-10-15"),
      author: {
        name: "John Doe",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
      },
      categories: ["Next.js", "React"],
    },
    {
      id: "2",
      title: "Styling Modern Applications with Tailwind CSS",
      excerpt:
        "Discover how to use Tailwind CSS to create beautiful user interfaces quickly.",
      slug: "styling-with-tailwind-css",
      featuredImage: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8",
      publishedAt: new Date("2023-10-10"),
      author: {
        name: "Jane Smith",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
      },
      categories: ["CSS", "Design"],
    },
    {
      id: "3",
      title: "Building a Blog with Markdown and Next.js",
      excerpt:
        "Create a powerful blog using Markdown for content and Next.js for delivery.",
      slug: "blog-with-markdown-nextjs",
      featuredImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643",
      publishedAt: new Date("2023-09-28"),
      author: {
        name: "Alex Johnson",
        image: "https://randomuser.me/api/portraits/men/54.jpg",
      },
      categories: ["Next.js", "Markdown"],
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-slate-950 py-20 md:py-32 overflow-hidden">
        <div className="container relative z-10 flex flex-col items-center text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white max-w-4xl">
            Insights and Ideas for the Modern Developer
          </h1>
          <p className="mt-6 text-lg text-slate-300 max-w-2xl">
            Stay up-to-date with the latest in web development, design, and
            tech, with our expertly curated content and in-depth tutorials.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg">
              <Link href="/blog">
                Explore Articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="bg-transparent text-white border-white hover:bg-white hover:text-slate-950">
              <Link href="/categories">Browse Categories</Link>
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
            {featuredPosts.map((post) => (
              <article
                key={post.id}
                className="flex flex-col overflow-hidden rounded-lg border bg-background transition-all hover:shadow-md"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={`${post.featuredImage}?w=600&h=400&fit=crop`}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                </div>
                <div className="flex flex-col flex-1 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    {post.categories.map((category) => (
                      <span
                        key={category}
                        className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-semibold leading-tight mb-2">
                    <Link href={`/blog/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-muted-foreground flex-1 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="relative h-8 w-8 rounded-full overflow-hidden">
                        <Image
                          src={post.author.image}
                          alt={post.author.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-sm font-medium">{post.author.name}</span>
                    </div>
                    <time className="text-sm text-muted-foreground">
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
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
      <section className="bg-muted py-16">
        <div className="container flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
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
      </section>
    </>
  );
}
