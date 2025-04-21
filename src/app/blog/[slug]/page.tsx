import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Clock,
  Share2,
  MessageSquare,
  ChevronLeft,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import prisma from "@/lib/db";

// Mock blog post data
const posts = [
  {
    id: "1",
    title: "Getting Started with Next.js 14",
    excerpt:
      "Learn how to build modern web applications with Next.js 14 and React 18.",
    content: `
      <h2>Introduction to Next.js 14</h2>
      <p>Next.js 14 is a major release that brings significant improvements to the React framework. It offers better performance, enhanced developer experience, and new features that make building web applications more efficient.</p>

      <h3>Key Features</h3>
      <p>Some of the key features introduced in Next.js 14 include:</p>
      <ul>
        <li><strong>Turbopack:</strong> An incremental bundler built with Rust that offers up to 700x faster updates than Webpack.</li>
        <li><strong>Server Components:</strong> React Server Components are now stable, allowing you to render components on the server for improved performance.</li>
        <li><strong>Streaming:</strong> Next.js 14 supports streaming, allowing you to progressively render UI from the server.</li>
        <li><strong>Partial Rendering:</strong> Only the parts of the page that need to be updated are re-rendered, improving performance.</li>
      </ul>

      <h3>Setting Up a Next.js 14 Project</h3>
      <p>To create a new Next.js 14 project, you can use the following command:</p>
      <pre><code>npx create-next-app@latest my-app</code></pre>
      <p>This will set up a new Next.js project with the latest version. During the setup process, you'll be asked a few questions about your project, such as whether you want to use TypeScript, ESLint, and Tailwind CSS.</p>

      <h3>Understanding the Project Structure</h3>
      <p>Next.js 14 introduces a new project structure with the app directory. Here's a brief overview:</p>
      <ul>
        <li><strong>app/:</strong> The main directory for your application code.</li>
        <li><strong>app/layout.tsx:</strong> The root layout component that wraps all pages.</li>
        <li><strong>app/page.tsx:</strong> The main page component.</li>
        <li><strong>app/[route]/page.tsx:</strong> Page components for different routes.</li>
        <li><strong>components/:</strong> A directory for reusable components.</li>
        <li><strong>public/:</strong> Static assets like images and fonts.</li>
      </ul>

      <h3>Routing in Next.js 14</h3>
      <p>Next.js 14 uses a file-system based router where:</p>
      <ul>
        <li>Folders define routes</li>
        <li>Files create UI for the route segments</li>
        <li>Special files like page.tsx and layout.tsx define the behavior of the route</li>
      </ul>
      <p>For example, to create a route for /blog, you would create a folder at app/blog/ and add a page.tsx file inside it.</p>

      <h3>Server and Client Components</h3>
      <p>Next.js 14 makes a clear distinction between server and client components:</p>
      <ul>
        <li><strong>Server Components:</strong> Render on the server and don't require client-side JavaScript. They're great for static content and data fetching.</li>
        <li><strong>Client Components:</strong> Render on the client and can use React hooks, event handlers, and browser APIs. Add the "use client" directive at the top of the file to mark a component as a client component.</li>
      </ul>

      <h3>Data Fetching</h3>
      <p>Next.js 14 simplifies data fetching with server components. You can fetch data directly in server components using async/await:</p>
      <pre><code>async function getProducts() {
  const res = await fetch('https://api.example.com/products')
  return res.json()
}

export default async function Page() {
  const products = await getProducts()
  return (
    &lt;div&gt;
      {products.map((product) => (
        &lt;div key={product.id}&gt;{product.name}&lt;/div&gt;
      ))}
    &lt;/div&gt;
  )
}</code></pre>

      <h3>Conclusion</h3>
      <p>Next.js 14 is a powerful framework for building modern web applications with React. It offers improved performance, developer experience, and new features that make it easier to build fast, responsive applications. Whether you're building a simple blog or a complex web application, Next.js 14 has the tools and features you need to succeed.</p>
    `,
    slug: "getting-started-with-nextjs-14",
    featuredImage:
      "https://images.unsplash.com/photo-1587620962725-abab7fe55159",
    publishedAt: new Date("2023-10-15"),
    readingTime: "8 min read",
    author: {
      name: "John Doe",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      bio: "Frontend developer passionate about React and Next.js",
    },
    categories: ["Next.js", "React"],
    relatedPosts: ["2", "3"],
    comments: [
      {
        id: "c1",
        author: {
          name: "Alice Johnson",
          image: "https://randomuser.me/api/portraits/women/23.jpg",
        },
        content:
          "Great article! I've been looking to get started with Next.js 14, and this provides a clear introduction.",
        createdAt: new Date("2023-10-16T08:30:00"),
      },
      {
        id: "c2",
        author: {
          name: "Bob Smith",
          image: "https://randomuser.me/api/portraits/men/45.jpg",
        },
        content:
          "I'm curious about how Server Components work with third-party libraries. Have you run into any compatibility issues?",
        createdAt: new Date("2023-10-16T10:15:00"),
      },
    ],
  },
  {
    id: "2",
    title: "Styling Modern Applications with Tailwind CSS",
    excerpt:
      "Discover how to use Tailwind CSS to create beautiful user interfaces quickly.",
    slug: "styling-with-tailwind-css",
    featuredImage:
      "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8",
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
    featuredImage:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643",
    publishedAt: new Date("2023-09-28"),
    author: {
      name: "Alex Johnson",
      image: "https://randomuser.me/api/portraits/men/54.jpg",
    },
    categories: ["Next.js", "Markdown"],
  },
];

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    select: { slug: true },
  });

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = posts.find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  // Get related posts
  const relatedPosts = post.relatedPosts
    ? posts.filter((p) => post.relatedPosts?.includes(p.id))
    : [];

  return (
    <article className="pb-16">
      {/* Hero Section */}
      <div className="relative h-[40vh] overflow-hidden">
        <Image
          src={post.featuredImage || "/default-image.jpg"}
          alt={post.title || "Default Title"}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container max-w-4xl -mt-16 relative">
        {/* Categories and back link */}
        <div className="flex justify-between items-center mb-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/blog" className="flex items-center">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Blog
            </Link>
          </Button>
          <div className="flex gap-2">
            {post.categories?.map((category) => (
              <Link
                key={category}
                href={`/blog?category=${category.toLowerCase()}`}
                className="text-xs py-1 px-2 bg-muted rounded-full hover:bg-muted/80"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>

        {/* Post card */}
        <Card className="p-8 shadow-lg">
          <CardContent className="p-0">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {post.title}
            </h1>

            {/* Author and metadata */}
            <div className="flex items-center justify-between flex-wrap mb-8 pb-6 border-b">
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 rounded-full overflow-hidden">
                  <Image
                    src={post.author.image}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-medium">{post.author.name}</div>
                  {post.author.bio && (
                    <div className="text-sm text-muted-foreground">
                      {post.author.bio}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-4 sm:mt-0">
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4 mr-1" />
                  <time dateTime={post.publishedAt.toISOString()}>
                    {post.publishedAt.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                </div>
                {post.readingTime && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    {post.readingTime}
                  </div>
                )}
              </div>
            </div>

            {/* Post content */}
            <div
              className="prose prose-zinc dark:prose-invert max-w-none mb-8"
              dangerouslySetInnerHTML={{
                __html: post.content || "<p>No content available.</p>",
              }}
            />

            {/* Share buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t pt-6 mt-8">
              <div className="text-sm font-medium mb-4 sm:mb-0">
                Share this article
              </div>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  aria-label="Share on Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  aria-label="Share on Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" aria-label="Copy link">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="flex gap-4 items-start group"
                >
                  <div className="relative h-16 w-24 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={`${relatedPost.featuredImage}?w=200&h=120&fit=crop`}
                      alt={relatedPost.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium group-hover:underline line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <div className="text-sm text-muted-foreground mt-1">
                      {new Date(relatedPost.publishedAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Comments section */}
        {post.comments && post.comments.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-2xl font-bold">Comments</h2>
              <span className="text-muted-foreground">
                ({post.comments.length})
              </span>
            </div>

            <div className="space-y-6">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex gap-4 border-b pb-6">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={comment.author.image}
                      alt={comment.author.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div className="font-medium">{comment.author.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </div>
                    </div>
                    <p className="mt-2 text-sm">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Comment form */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Leave a comment</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium mb-1"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="comment"
                    className="block text-sm font-medium mb-1"
                  >
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[120px]"
                    required
                  />
                </div>
                <Button type="submit">Submit Comment</Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
