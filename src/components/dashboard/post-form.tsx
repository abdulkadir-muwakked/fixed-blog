"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import Heading from "@tiptap/extension-heading";
import { createLowlight } from "lowlight";
import Toolbar from "../editor/toolbar";
import { postSchema } from "@/lib/validations/post";
import type { z } from "zod";

type FormData = z.infer<typeof postSchema>;

// Initialize lowlight with all languages
const lowlight = createLowlight();

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
    featuredImage?: string | null;
    metaDescription?: string;
    metaKeywords?: string;
  };
  categories: Category[];
  isEditMode: boolean; // Added isEditMode property
}

export default function PostForm({ post, categories }: PostFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!post?.id;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      excerpt: post?.excerpt || "",
      content: post?.content || "",
      categoryId: post?.categoryId || "",
      status: post?.status || "DRAFT",
      metaDescription: post?.metaDescription || "",
      metaKeywords: post?.metaKeywords || "",
    },
  });

  // Initialize editor with content
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
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
    ],
    content: watch("content"),
    onUpdate: ({ editor }) => {
      setValue("content", editor.getHTML(), { shouldValidate: true });
    },
  });

  // Set initial editor content
  useEffect(() => {
    if (editor && post?.content) {
      editor.commands.setContent(post.content);
    }
  }, [editor, post?.content]);

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setValue("title", newTitle, { shouldValidate: true });

    if (!isEditing || !post?.slug) {
      setValue("slug", generateSlug(newTitle), { shouldValidate: true });
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();

      // Required fields
      formData.append("title", data.title);
      formData.append("content", data.content);
      formData.append("slug", data.slug);
      formData.append("status", data.status);

      // Optional fields
      if (data.excerpt) formData.append("excerpt", data.excerpt);
      if (data.categoryId) formData.append("categoryId", data.categoryId);

      // Handle file upload
      if (data.photo?.[0]) {
        formData.append("photo", data.photo[0]);
      } else if (isEditing && !data.photo) {
        // Keep existing image if not changed
        formData.append("featuredImage", post?.featuredImage || "");
      }

      const method = isEditing ? "PUT" : "POST";
      const url = isEditing ? `/api/posts/${post.id}` : "/api/posts";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save post");
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
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            {...register("title")}
            onChange={handleTitleChange}
            placeholder="Enter post title"
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            {...register("slug")}
            placeholder="post-url-slug"
            className={errors.slug ? "border-red-500" : ""}
          />
          {errors.slug && (
            <p className="text-sm text-red-500">{errors.slug.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          {...register("excerpt")}
          placeholder="Brief summary of your post"
          rows={3}
          className={errors.excerpt ? "border-red-500" : ""}
        />
        {errors.excerpt && (
          <p className="text-sm text-red-500">{errors.excerpt.message}</p>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select
            value={watch("categoryId")}
            onValueChange={(value) =>
              setValue("categoryId", value, { shouldValidate: true })
            }
          >
            <SelectTrigger
              id="category"
              className={errors.categoryId ? "border-red-500" : ""}
            >
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
          {errors.categoryId && (
            <p className="text-sm text-red-500">{errors.categoryId.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select
            value={watch("status")}
            onValueChange={(value: "PUBLISHED" | "DRAFT") =>
              setValue("status", value, { shouldValidate: true })
            }
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
        <Label htmlFor="content">Content *</Label>
        <Card className="border rounded-md">
          <CardContent className="p-3">
            {editor && <Toolbar editor={editor} />}
            <div className="prose prose-stone dark:prose-invert min-h-[300px] w-full">
              <EditorContent editor={editor} />
            </div>
          </CardContent>
        </Card>
        {errors.content && (
          <p className="text-sm text-red-500">{errors.content.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="photo">Featured Image</Label>
        <Input id="photo" type="file" accept="image/*" {...register("photo")} />
        {post?.featuredImage && (
          <div className="mt-2">
            <p className="text-sm text-muted-foreground">Current Image:</p>
            <img
              src={post.featuredImage}
              alt="Current featured"
              className="h-20 object-cover rounded"
            />
            {isEditing && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-2 text-red-500"
                onClick={() => setValue("photo", undefined)}
              >
                Remove Image
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Add inputs for metaKeywords and metaDescription */}
      <div className="space-y-2">
        <Label htmlFor="metaKeywords">Meta Keywords</Label>
        <Input
          id="metaKeywords"
          {...register("metaKeywords")}
          placeholder="Enter meta keywords (comma-separated)"
          className={errors.metaKeywords ? "border-red-500" : ""}
        />
        {errors.metaKeywords && (
          <p className="text-sm text-red-500">{errors.metaKeywords.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="metaDescription">Meta Description</Label>
        <Textarea
          id="metaDescription"
          {...register("metaDescription")}
          placeholder="Enter meta description"
          rows={3}
          className={errors.metaDescription ? "border-red-500" : ""}
        />
        {errors.metaDescription && (
          <p className="text-sm text-red-500">
            {errors.metaDescription.message}
          </p>
        )}
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
