"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Edit,
  MoreHorizontal,
  Eye,
  Trash2,
  Plus,
  FileUp,
  FileDown,
  ClipboardList
} from "lucide-react";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  status: "PUBLISHED" | "DRAFT";
  publishedAt: Date | null;
}

interface PostsListProps {
  posts: Post[];
}

export default function PostsList({ posts }: PostsListProps) {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<"ALL" | "PUBLISHED" | "DRAFT">("ALL");

  const filteredPosts = posts.filter(post => {
    if (selectedFilter === "ALL") return true;
    return post.status === selectedFilter;
  });

  const deletePost = async (id: string) => {
    // In a real app, you would call an API to delete the post
    console.log(`Deleting post with id: ${id}`);
    // Then refresh the data
    router.refresh();
  };

  const publishPost = async (id: string) => {
    // In a real app, you would call an API to publish the post
    console.log(`Publishing post with id: ${id}`);
    // Then refresh the data
    router.refresh();
  };

  const unpublishPost = async (id: string) => {
    // In a real app, you would call an API to unpublish the post
    console.log(`Unpublishing post with id: ${id}`);
    // Then refresh the data
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight px-2">Your Posts</h2>
        <div className="flex gap-2">
          <Button
            variant={selectedFilter === "ALL" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter("ALL")}
          >
            <ClipboardList className="mr-2 h-4 w-4" />
            All
          </Button>
          <Button
            variant={selectedFilter === "PUBLISHED" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter("PUBLISHED")}
          >
            <FileUp className="mr-2 h-4 w-4" />
            Published
          </Button>
          <Button
            variant={selectedFilter === "DRAFT" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter("DRAFT")}
          >
            <FileDown className="mr-2 h-4 w-4" />
            Drafts
          </Button>
          <Button size="sm" asChild>
            <Link href="/dashboard/posts/create">
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Link>
          </Button>
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="flex flex-col items-center justify-center text-center space-y-3">
              <div className="text-muted-foreground">No posts found.</div>
              <Button size="sm" asChild>
                <Link href="/dashboard/posts/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create your first post
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredPosts.map((post) => (
            <Card key={post.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold">{post.title}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        post.status === "PUBLISHED"
                          ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                      }`}
                    >
                      {post.status === "PUBLISHED" ? "Published" : "Draft"}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/posts/${post.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/blog/${post.slug}`} target="_blank">
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View</span>
                          </Link>
                        </DropdownMenuItem>
                        {post.status === "DRAFT" ? (
                          <DropdownMenuItem onClick={() => publishPost(post.id)}>
                            <FileUp className="mr-2 h-4 w-4" />
                            <span>Publish</span>
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => unpublishPost(post.id)}>
                            <FileDown className="mr-2 h-4 w-4" />
                            <span>Unpublish</span>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => deletePost(post.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <CardDescription className="text-md line-clamp-1">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <div className="text-sm text-muted-foreground flex justify-between w-full">
                  <div>Slug: <span className="font-mono">{post.slug}</span></div>
                  <div>
                    {post.publishedAt
                      ? `Published: ${post.publishedAt.toLocaleDateString()}`
                      : "Not published yet"}
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
