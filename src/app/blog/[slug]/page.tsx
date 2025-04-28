import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Share2,
  ChevronLeft,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    select: { slug: true },
  });

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

type BlogPostProps = {
  title: string;
  featuredImage?: string | null;
  publishedAt?: Date | null;
  content?: string | null;
  author?: {
    name?: string | null;
    image?: string | null;
  } | null;
  categories?: Array<{
    category: {
      id: string;
      name: string;
    };
  }> | null;
  views?: number | null;
};

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params; // Ensure params is not treated as a Promise

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

function BlogPost({ post }: { post: BlogPostProps }) {
  const publishedAt = post?.publishedAt || new Date();
  const authorImage = post?.author?.image || null;
  const authorName = post?.author?.name || "Unknown Author";
  const featuredImage = post?.featuredImage || "/uploads/default-image.jpg";
  const content = post?.content || "<p>No content available.</p>";

  return (
    <article className="pb-16">
      <div className="relative h-[40vh] overflow-hidden">
        <Image
          src={
            featuredImage.startsWith("/")
              ? featuredImage
              : `/uploads/${featuredImage}`
          }
          alt={post.title || "Default Title"}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container max-w-4xl -mt-16 relative">
        <div className="flex justify-between items-center mb-4">
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

        <Card className="p-8 shadow-lg">
          <CardContent className="p-0">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {post.title}
            </h1>

            <div className="flex items-center justify-between flex-wrap mb-8 pb-6 border-b">
              {post.author && (
                <div className="flex items-center gap-4">
                  {authorImage && (
                    <div className="relative h-12 w-12 rounded-full overflow-hidden">
                      <Image
                        src={
                          authorImage.startsWith("/")
                            ? authorImage
                            : `/uploads/${authorImage}`
                        }
                        alt={authorName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{authorName}</div>
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

            <div
              className="prose prose-zinc dark:prose-invert max-w-none mb-8"
              dangerouslySetInnerHTML={{
                __html: content,
              }}
            />

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
      </div>
    </article>
  );
}
