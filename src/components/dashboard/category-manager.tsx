"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Edit,
  MoreHorizontal,
  Trash2,
  Plus,
  Tag
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

interface CategoryManagerProps {
  categories: Category[];
}

export default function CategoryManager({ categories: initialCategories }: CategoryManagerProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [showNewCategoryDialog, setShowNewCategoryDialog] = useState(false);
  const [showEditCategoryDialog, setShowEditCategoryDialog] = useState(false);
  const [showDeleteCategoryDialog, setShowDeleteCategoryDialog] = useState(false);
  const [formData, setFormData] = useState({ name: "", slug: "" });
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateCategory = async () => {
    if (!formData.name) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Generate slug if it doesn't exist
      const slug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Create new category with a random ID
      const newCategory: Category = {
        id: Math.random().toString(36).substring(2, 9),
        name: formData.name,
        slug,
        postCount: 0,
      };

      setCategories(prev => [...prev, newCategory]);

      toast({
        title: "Success",
        description: "Category created successfully",
      });

      setShowNewCategoryDialog(false);
      setFormData({ name: "", slug: "" });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCategory = async () => {
    if (!formData.name || !selectedCategory) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Generate slug if it doesn't exist
      const slug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setCategories(prev =>
        prev.map(cat =>
          cat.id === selectedCategory.id
            ? { ...cat, name: formData.name, slug }
            : cat
        )
      );

      toast({
        title: "Success",
        description: "Category updated successfully",
      });

      setShowEditCategoryDialog(false);
      setFormData({ name: "", slug: "" });
      setSelectedCategory(null);
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    try {
      setIsSubmitting(true);

      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setCategories(prev => prev.filter(cat => cat.id !== selectedCategory.id));

      toast({
        title: "Success",
        description: "Category deleted successfully",
      });

      setShowDeleteCategoryDialog(false);
      setSelectedCategory(null);
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category);
    setFormData({ name: category.name, slug: category.slug });
    setShowEditCategoryDialog(true);
  };

  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
    setShowDeleteCategoryDialog(true);
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight px-2">Categories</h2>
        <Button onClick={() => setShowNewCategoryDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Category
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-8">
              <div className="flex flex-col items-center justify-center text-center space-y-3">
                <div className="text-muted-foreground">No categories found.</div>
                <Button onClick={() => setShowNewCategoryDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create your first category
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          categories.map((category) => (
            <Card key={category.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold">{category.name}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => openEditDialog(category)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => openDeleteDialog(category)}
                        className="text-destructive focus:text-destructive"
                        disabled={category.postCount > 0}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription className="flex items-center gap-1">
                  <Tag className="h-3.5 w-3.5" /> {category.slug}
                </CardDescription>
              </CardHeader>
              <CardFooter className="pb-4">
                <div className="text-sm">
                  {category.postCount} {category.postCount === 1 ? "post" : "posts"}
                </div>
                {category.postCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto"
                    asChild
                  >
                    <Link href={`/blog?category=${category.slug}`}>
                      View posts
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {/* New Category Dialog */}
      <Dialog open={showNewCategoryDialog} onOpenChange={setShowNewCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription>
              Add a new category to organize your blog posts.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    name: e.target.value,
                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
                  });
                }}
                placeholder="e.g., Web Development"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g., web-development"
              />
              <p className="text-xs text-muted-foreground">
                This will be used in the URL: /blog?category=<span className="font-mono">{formData.slug || "slug"}</span>
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewCategoryDialog(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleCreateCategory} disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={showEditCategoryDialog} onOpenChange={setShowEditCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the category details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  });
                }}
                placeholder="e.g., Web Development"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-slug">Slug</Label>
              <Input
                id="edit-slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g., web-development"
              />
              <p className="text-xs text-muted-foreground">
                This will be used in the URL: /blog?category=<span className="font-mono">{formData.slug || "slug"}</span>
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditCategoryDialog(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleEditCategory} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Dialog */}
      <Dialog open={showDeleteCategoryDialog} onOpenChange={setShowDeleteCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              {selectedCategory?.postCount > 0
                ? `This category contains ${selectedCategory.postCount} posts and cannot be deleted.`
                : "Are you sure you want to delete this category? This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteCategoryDialog(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCategory}
              disabled={selectedCategory?.postCount! > 0 || isSubmitting}
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
