"use strict";
"use client";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CategoryManager;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const label_1 = require("@/components/ui/label");
const card_1 = require("@/components/ui/card");
const dropdown_menu_1 = require("@/components/ui/dropdown-menu");
const dialog_1 = require("@/components/ui/dialog");
const lucide_react_1 = require("lucide-react");
const use_toast_1 = require("@/components/ui/use-toast");
const link_1 = __importDefault(require("next/link"));
function CategoryManager({ categories: initialCategories, }) {
    var _a, _b;
    const router = (0, navigation_1.useRouter)();
    const { toast } = (0, use_toast_1.useToast)();
    const [categories, setCategories] = (0, react_1.useState)(initialCategories);
    const [showNewCategoryDialog, setShowNewCategoryDialog] = (0, react_1.useState)(false);
    const [showEditCategoryDialog, setShowEditCategoryDialog] = (0, react_1.useState)(false);
    const [showDeleteCategoryDialog, setShowDeleteCategoryDialog] = (0, react_1.useState)(false);
    const [formData, setFormData] = (0, react_1.useState)({ name: "", slug: "" });
    const [selectedCategory, setSelectedCategory] = (0, react_1.useState)(null);
    const [isSubmitting, setIsSubmitting] = (0, react_1.useState)(false);
    const handleCreateCategory = () => __awaiter(this, void 0, void 0, function* () {
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
            const response = yield fetch("/api/categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    slug: formData.slug,
                }),
            });
            if (!response.ok) {
                throw new Error("Failed to create category");
            }
            const newCategory = yield response.json();
            setCategories((prev) => [...prev, newCategory]);
            toast({
                title: "Success",
                description: "Category created successfully",
            });
            setShowNewCategoryDialog(false);
            setFormData({ name: "", slug: "" });
            router.refresh();
        }
        catch (error) {
            if (error instanceof Error) {
                toast({
                    title: "Error",
                    description: error.message || "Failed to create category",
                    variant: "destructive",
                });
            }
        }
        finally {
            setIsSubmitting(false);
        }
    });
    const handleEditCategory = () => __awaiter(this, void 0, void 0, function* () {
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
            const slug = formData.slug ||
                formData.name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)+/g, "");
            yield new Promise((resolve) => setTimeout(resolve, 500));
            setCategories((prev) => prev.map((cat) => cat.id === selectedCategory.id
                ? Object.assign(Object.assign({}, cat), { name: formData.name, slug }) : cat));
            toast({
                title: "Success",
                description: "Category updated successfully",
            });
            setShowEditCategoryDialog(false);
            setFormData({ name: "", slug: "" });
            setSelectedCategory(null);
            router.refresh();
        }
        catch (error) {
            if (error instanceof Error) {
                toast({
                    title: "Error",
                    description: "Failed to update category",
                    variant: "destructive",
                });
            }
        }
        finally {
            setIsSubmitting(false);
        }
    });
    const handleDeleteCategory = () => __awaiter(this, void 0, void 0, function* () {
        if (!selectedCategory)
            return;
        try {
            setIsSubmitting(true);
            yield new Promise((resolve) => setTimeout(resolve, 500));
            setCategories((prev) => prev.filter((cat) => cat.id !== selectedCategory.id));
            toast({
                title: "Success",
                description: "Category deleted successfully",
            });
            setShowDeleteCategoryDialog(false);
            setSelectedCategory(null);
            router.refresh();
        }
        catch (error) {
            if (error instanceof Error) {
                toast({
                    title: "Error",
                    description: "Failed to delete category",
                    variant: "destructive",
                });
            }
        }
        finally {
            setIsSubmitting(false);
        }
    });
    const openEditDialog = (category) => {
        setSelectedCategory(category);
        setFormData({ name: category.name, slug: category.slug });
        setShowEditCategoryDialog(true);
    };
    const openDeleteDialog = (category) => {
        setSelectedCategory(category);
        setShowDeleteCategoryDialog(true);
    };
    (0, react_1.useEffect)(() => {
        const fetchCategories = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch("/api/categories");
                if (!response.ok) {
                    throw new Error("Failed to fetch categories");
                }
                const data = yield response.json();
                setCategories(data);
            }
            catch (error) {
                if (error instanceof Error) {
                    toast({
                        title: "Error",
                        description: error.message || "Failed to fetch categories",
                        variant: "destructive",
                    });
                }
            }
        });
        fetchCategories();
    }, [toast]);
    return (<>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight px-2">Categories</h2>
        <button_1.Button onClick={() => setShowNewCategoryDialog(true)}>
          <lucide_react_1.Plus className="mr-2 h-4 w-4"/>
          New Category
        </button_1.Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.length === 0 ? (<card_1.Card className="col-span-full">
            <card_1.CardContent className="py-8">
              <div className="flex flex-col items-center justify-center text-center space-y-3">
                <div className="text-muted-foreground">
                  No categories found.
                </div>
                <button_1.Button onClick={() => setShowNewCategoryDialog(true)}>
                  <lucide_react_1.Plus className="mr-2 h-4 w-4"/>
                  Create your first category
                </button_1.Button>
              </div>
            </card_1.CardContent>
          </card_1.Card>) : (categories.map((category) => {
            var _a, _b, _c;
            return (<card_1.Card key={category.id}>
              <card_1.CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <card_1.CardTitle className="text-xl font-bold">
                    {category.name}
                  </card_1.CardTitle>
                  <dropdown_menu_1.DropdownMenu>
                    <dropdown_menu_1.DropdownMenuTrigger asChild>
                      <button_1.Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <lucide_react_1.MoreHorizontal className="h-4 w-4"/>
                        <span className="sr-only">Open menu</span>
                      </button_1.Button>
                    </dropdown_menu_1.DropdownMenuTrigger>
                    <dropdown_menu_1.DropdownMenuContent align="end">
                      <dropdown_menu_1.DropdownMenuLabel>Actions</dropdown_menu_1.DropdownMenuLabel>
                      <dropdown_menu_1.DropdownMenuItem onClick={() => openEditDialog(category)}>
                        <lucide_react_1.Edit className="mr-2 h-4 w-4"/>
                        <span>Edit</span>
                      </dropdown_menu_1.DropdownMenuItem>
                      <dropdown_menu_1.DropdownMenuSeparator />
                      <dropdown_menu_1.DropdownMenuItem onClick={() => openDeleteDialog(category)} className="text-destructive focus:text-destructive" disabled={((_a = category.postCount) !== null && _a !== void 0 ? _a : 0) > 0}>
                        <lucide_react_1.Trash2 className="mr-2 h-4 w-4"/>
                        <span>Delete</span>
                      </dropdown_menu_1.DropdownMenuItem>
                    </dropdown_menu_1.DropdownMenuContent>
                  </dropdown_menu_1.DropdownMenu>
                </div>
                <card_1.CardDescription className="flex items-center gap-1">
                  <lucide_react_1.Tag className="h-3.5 w-3.5"/> {category.slug}
                </card_1.CardDescription>
              </card_1.CardHeader>
              <card_1.CardFooter className="pb-4">
                <div className="text-sm">
                  {(_b = category.postCount) !== null && _b !== void 0 ? _b : 0}{" "}
                  {category.postCount === 1 ? "post" : "posts"}
                </div>
                {((_c = category.postCount) !== null && _c !== void 0 ? _c : 0) > 0 && (<button_1.Button variant="outline" size="sm" className="ml-auto" asChild>
                    <link_1.default href={`/blog?category=${category.slug}`}>
                      View posts
                    </link_1.default>
                  </button_1.Button>)}
              </card_1.CardFooter>
            </card_1.Card>);
        }))}
      </div>

      {/* New Category Dialog */}
      <dialog_1.Dialog open={showNewCategoryDialog} onOpenChange={setShowNewCategoryDialog}>
        <dialog_1.DialogContent>
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>Create New Category</dialog_1.DialogTitle>
            <dialog_1.DialogDescription>
              Add a new category to organize your blog posts.
            </dialog_1.DialogDescription>
          </dialog_1.DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label_1.Label htmlFor="name">Name</label_1.Label>
              <input_1.Input id="name" value={formData.name} onChange={(e) => {
            setFormData(Object.assign(Object.assign({}, formData), { name: e.target.value, slug: e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)+/g, "") }));
        }} placeholder="e.g., Web Development"/>
            </div>
            <div className="grid gap-2">
              <label_1.Label htmlFor="slug">Slug</label_1.Label>
              <input_1.Input id="slug" value={formData.slug} onChange={(e) => setFormData(Object.assign(Object.assign({}, formData), { slug: e.target.value }))} placeholder="e.g., web-development"/>
              <p className="text-xs text-muted-foreground">
                This will be used in the URL: /blog?category=
                <span className="font-mono">{formData.slug || "slug"}</span>
              </p>
            </div>
          </div>
          <dialog_1.DialogFooter>
            <button_1.Button variant="outline" onClick={() => setShowNewCategoryDialog(false)} disabled={isSubmitting}>
              Cancel
            </button_1.Button>
            <button_1.Button onClick={handleCreateCategory} disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create"}
            </button_1.Button>
          </dialog_1.DialogFooter>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>

      {/* Edit Category Dialog */}
      <dialog_1.Dialog open={showEditCategoryDialog} onOpenChange={setShowEditCategoryDialog}>
        <dialog_1.DialogContent>
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>Edit Category</dialog_1.DialogTitle>
            <dialog_1.DialogDescription>Update the category details.</dialog_1.DialogDescription>
          </dialog_1.DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label_1.Label htmlFor="edit-name">Name</label_1.Label>
              <input_1.Input id="edit-name" value={formData.name} onChange={(e) => {
            setFormData(Object.assign(Object.assign({}, formData), { name: e.target.value }));
        }} placeholder="e.g., Web Development"/>
            </div>
            <div className="grid gap-2">
              <label_1.Label htmlFor="edit-slug">Slug</label_1.Label>
              <input_1.Input id="edit-slug" value={formData.slug} onChange={(e) => setFormData(Object.assign(Object.assign({}, formData), { slug: e.target.value }))} placeholder="e.g., web-development"/>
              <p className="text-xs text-muted-foreground">
                This will be used in the URL: /blog?category=
                <span className="font-mono">{formData.slug || "slug"}</span>
              </p>
            </div>
          </div>
          <dialog_1.DialogFooter>
            <button_1.Button variant="outline" onClick={() => setShowEditCategoryDialog(false)} disabled={isSubmitting}>
              Cancel
            </button_1.Button>
            <button_1.Button onClick={handleEditCategory} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button_1.Button>
          </dialog_1.DialogFooter>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>

      {/* Delete Category Dialog */}
      <dialog_1.Dialog open={showDeleteCategoryDialog} onOpenChange={setShowDeleteCategoryDialog}>
        <dialog_1.DialogContent>
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>Delete Category</dialog_1.DialogTitle>
            <dialog_1.DialogDescription>
              {selectedCategory && ((_a = selectedCategory.postCount) !== null && _a !== void 0 ? _a : 0) > 0
            ? `This category contains ${selectedCategory.postCount} posts and cannot be deleted.`
            : "Are you sure you want to delete this category? This action cannot be undone."}
            </dialog_1.DialogDescription>
          </dialog_1.DialogHeader>
          <dialog_1.DialogFooter>
            <button_1.Button variant="outline" onClick={() => setShowDeleteCategoryDialog(false)} disabled={isSubmitting}>
              Cancel
            </button_1.Button>
            <button_1.Button variant="destructive" onClick={handleDeleteCategory} disabled={!selectedCategory ||
            ((_b = selectedCategory.postCount) !== null && _b !== void 0 ? _b : 0) > 0 ||
            isSubmitting}>
              {isSubmitting ? "Deleting..." : "Delete"}
            </button_1.Button>
          </dialog_1.DialogFooter>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>
    </>);
}
