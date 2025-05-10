import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Clock,
  Share2,
  ChevronLeft,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import prisma from "@/lib/db";
import { Metadata } from "next";
export const dynamic = "force-dynamic";
export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    select: { slug: true },
  });

  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    select: {
      metaDescription: true,
      metaKeywords: true,
      title: true,
      featuredImage: true,
      publishedAt: true,
    },
  });

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested post could not be found.",
    };
  }

  return {
    title: post.title,
    description: post.metaDescription || "",
    keywords: post.metaKeywords
      ? post.metaKeywords.split(",").map((keyword) => keyword.trim())
      : [],
    openGraph: {
      title: post.title,
      description: post.metaDescription || "",
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      images: post.featuredImage
        ? [
            {
              url: new URL(
                post.featuredImage,
                process.env.NEXT_PUBLIC_SITE_URL
              ).toString(),
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.metaDescription || "",
      images: post.featuredImage
        ? [
            new URL(
              post.featuredImage,
              process.env.NEXT_PUBLIC_SITE_URL
            ).toString(),
          ]
        : [],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // Await the params to resolve the Promise

  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: true,
        categories: { include: { category: true } },
        comments: { include: { user: true } },
      },
    });

    if (!post) notFound();

    return <BlogPost post={post} />;
  } catch (error) {
    console.error("Blog post fetch failed:", error);
    notFound();
  }
}

function BlogPost({
  post,
}: {
  post: {
    title: string;
    featuredImage?: string | null;
    publishedAt?: Date | null;
    content?: string | null;
    author?: { name?: string | null; image?: string | null } | null;
    categories?: { category: { id: string; name: string } }[] | null;
    comments?:
      | {
          id: string;
          content: string;
          createdAt: Date;
          user?: { name?: string | null; image?: string | null };
        }[]
      | null;
    metaDescription?: string | null;
    metaKeywords?: string | null;
  };
}) {
  // Safely handle nullable properties
  const publishedAt = post?.publishedAt || new Date();

  return (
    <article className="pb-16 pt-16">
      <div className="container max-w-4xl -mt-16 relative">
        {/* Categories and back link */}
        <div className="flex justify-between items-center mb-4 relative z-10">
          <Button asChild variant="ghost" size="sm">
            <Link href="/blog" className="flex items-center">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Blog
            </Link>
          </Button>
          {post.categories && post.categories.length > 0 && (
            <div className="flex gap-2">
              {post.categories.map(
                ({ category }: { category: { id: string; name: string } }) => (
                  <Link
                    key={category.id}
                    href={`/blog?category=${category.name.toLowerCase()}`}
                    className="text-xs py-1 px-2 bg-muted rounded-full hover:bg-muted/80"
                  >
                    {category.name}
                  </Link>
                )
              )}
            </div>
          )}
        </div>

        {/* Post card */}
        <Card className="p-8 shadow-lg">
          <CardContent className="p-0">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {post.title}
            </h1>

            {/* Author and metadata */}
            <div className="flex items-center justify-between flex-wrap mb-8 pb-6 border-b">
              {post.author && (
                <div className="flex items-center gap-4">
                  {post.author.image && (
                    <div className="relative h-12 w-12 rounded-full overflow-hidden">
                      <Image
                        src={
                          post.author.image.startsWith("/")
                            ? post.author.image
                            : `/uploads/${post.author.image}`
                        }
                        alt={post.author.name || "Author"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <div className="font-medium">
                      {post.author.name || "Unknown Author"}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-4 sm:mt-0">
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4 mr-1" />
                  <time dateTime={publishedAt.toISOString()}>
                    {publishedAt.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                </div>
              </div>
            </div>
            {/* Hero Image */}
            <div className="relative h-[40vh] overflow-hidden">
              <Image
                src={
                  post.featuredImage
                    ? post.featuredImage.startsWith("/")
                      ? post.featuredImage
                      : `/uploads/${post.featuredImage}`
                    : "/uploads/default-image.jpg"
                }
                alt={post.title || "Default Title"}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
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
              {post?.comments?.map(
                (comment: {
                  id: string;
                  content: string;
                  createdAt: Date;
                  user?: { name?: string | null; image?: string | null };
                }) => (
                  <div key={comment.id} className="flex gap-4 border-b pb-6">
                    {comment.user && comment.user.image && (
                      <div className="relative h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={
                            comment.user.image.startsWith("/")
                              ? comment.user.image
                              : `/uploads/${comment.user.image}`
                          }
                          alt={comment.user.name || "Comment user"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div className="font-medium">
                          {comment.user?.name ?? "Anonymous"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {comment.createdAt.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                      <p className="mt-2 text-sm">{comment.content}</p>
                    </div>
                  </div>
                )
              )}
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
