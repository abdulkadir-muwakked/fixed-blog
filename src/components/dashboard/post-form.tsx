"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Typography from "@tiptap/extension-typography";
import TextAlign from "@tiptap/extension-text-align";
import { createLowlight } from "lowlight";
import Toolbar from "../editor/toolbar";

// Initialize lowlight with all languages
const lowlight = createLowlight();

// Types
interface Category {
  id: string;
  name: string;
}

interface PostFormProps {
  post?: {
    id?: string;
    title: string;
    content: string;
    excerpt: string;
    slug: string;
    status: "PUBLISHED" | "DRAFT";
    categoryId?: string;
  };
  categories: Category[];
}

export default function PostForm({ post, categories }: PostFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!post?.id;

  // Form state
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [categoryId, setCategoryId] = useState(post?.categoryId || "");
  const [status, setStatus] = useState(post?.status || "PUBLISHED");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start writing your post content here...",
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Underline,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      TextStyle,
      Color,
      Typography,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }), // Added TextAlign extension
    ],
    content: post?.content || "",
    immediatelyRender: false, // Added to avoid SSR hydration mismatches
  });

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!isEditing || !post?.slug) {
      setSlug(generateSlug(newTitle));
    }
  };

  // Fixed the issue with category and status selection by ensuring their values are correctly captured and sent.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !editor?.getHTML()) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    if (!categoryId) {
      toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Post data
      const formData = {
        id: post?.id,
        title,
        content: editor?.getHTML(),
        excerpt,
        slug,
        categoryId, // Ensure categoryId is included
        status: status || "PUBLISHED", // Ensure status is included
      };

      console.log("Form data:", formData);

      // Send form data to the API
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save post");
      }

      toast({
        title: isEditing ? "Post updated" : "Post created",
        description: isEditing
          ? "Your post has been updated successfully."
          : "Your post has been created successfully.",
      });

      router.push("/dashboard/posts");
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter post title"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="post-url-slug"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Brief summary of your post"
          rows={3}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={status}
            onValueChange={(value: "PUBLISHED" | "DRAFT") => setStatus(value)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Card className="border rounded-md">
          <CardContent className="p-3">
            {editor && <Toolbar editor={editor} />}
            <div className="prose prose-stone dark:prose-invert min-h-[300px] w-full">
              <EditorContent editor={editor} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/posts")}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : isEditing
            ? "Update Post"
            : "Create Post"}
        </Button>
      </div>
    </form>
  );
}
