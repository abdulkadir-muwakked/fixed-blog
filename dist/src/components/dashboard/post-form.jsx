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
exports.default = PostForm;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const label_1 = require("@/components/ui/label");
const textarea_1 = require("@/components/ui/textarea");
const select_1 = require("@/components/ui/select");
const card_1 = require("@/components/ui/card");
const use_toast_1 = require("@/components/ui/use-toast");
const react_2 = require("@tiptap/react");
const starter_kit_1 = __importDefault(require("@tiptap/starter-kit"));
const extension_placeholder_1 = __importDefault(require("@tiptap/extension-placeholder"));
const extension_link_1 = __importDefault(require("@tiptap/extension-link"));
const extension_image_1 = __importDefault(require("@tiptap/extension-image"));
const extension_underline_1 = __importDefault(require("@tiptap/extension-underline"));
const extension_code_block_lowlight_1 = __importDefault(require("@tiptap/extension-code-block-lowlight"));
const extension_text_style_1 = __importDefault(require("@tiptap/extension-text-style"));
const extension_color_1 = __importDefault(require("@tiptap/extension-color"));
const extension_typography_1 = __importDefault(require("@tiptap/extension-typography"));
const extension_text_align_1 = __importDefault(require("@tiptap/extension-text-align"));
const lowlight_1 = require("lowlight");
const toolbar_1 = __importDefault(require("../editor/toolbar"));
// Initialize lowlight with all languages
const lowlight = (0, lowlight_1.createLowlight)();
function PostForm({ post, categories }) {
    const router = (0, navigation_1.useRouter)();
    const { toast } = (0, use_toast_1.useToast)();
    const isEditing = !!(post === null || post === void 0 ? void 0 : post.id);
    // Form state
    const [title, setTitle] = (0, react_1.useState)((post === null || post === void 0 ? void 0 : post.title) || "");
    const [slug, setSlug] = (0, react_1.useState)((post === null || post === void 0 ? void 0 : post.slug) || "");
    const [excerpt, setExcerpt] = (0, react_1.useState)((post === null || post === void 0 ? void 0 : post.excerpt) || "");
    const [categoryId, setCategoryId] = (0, react_1.useState)((post === null || post === void 0 ? void 0 : post.categoryId) || "");
    const [status, setStatus] = (0, react_1.useState)((post === null || post === void 0 ? void 0 : post.status) || "DRAFT");
    const [isSubmitting, setIsSubmitting] = (0, react_1.useState)(false);
    // Editor
    const editor = (0, react_2.useEditor)({
        extensions: [
            starter_kit_1.default,
            extension_placeholder_1.default.configure({
                placeholder: "Start writing your post content here...",
            }),
            extension_link_1.default.configure({
                openOnClick: false,
            }),
            extension_image_1.default,
            extension_underline_1.default,
            extension_code_block_lowlight_1.default.configure({
                lowlight,
            }),
            extension_text_style_1.default,
            extension_color_1.default,
            extension_typography_1.default,
            extension_text_align_1.default.configure({
                types: ["heading", "paragraph"],
            }), // Added TextAlign extension
        ],
        content: (post === null || post === void 0 ? void 0 : post.content) || "",
        immediatelyRender: false, // Added to avoid SSR hydration mismatches
    });
    // Generate slug from title
    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");
    };
    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        if (!isEditing || !(post === null || post === void 0 ? void 0 : post.slug)) {
            setSlug(generateSlug(newTitle));
        }
    };
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        if (!title || !(editor === null || editor === void 0 ? void 0 : editor.getHTML())) {
            toast({
                title: "Error",
                description: "Title and content are required",
                variant: "destructive",
            });
            return;
        }
        try {
            setIsSubmitting(true);
            // Post data
            const formData = {
                id: post === null || post === void 0 ? void 0 : post.id,
                title,
                content: editor === null || editor === void 0 ? void 0 : editor.getHTML(),
                excerpt,
                slug,
                categoryId,
                status,
            };
            console.log("Form data:", formData);
            // Send form data to the API
            const response = yield fetch("/api/posts", {
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
        }
        catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            });
        }
        finally {
            setIsSubmitting(false);
        }
    });
    return (<form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label_1.Label htmlFor="title">Title</label_1.Label>
          <input_1.Input id="title" value={title} onChange={handleTitleChange} placeholder="Enter post title" required/>
        </div>
        <div className="space-y-2">
          <label_1.Label htmlFor="slug">Slug</label_1.Label>
          <input_1.Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="post-url-slug" required/>
        </div>
      </div>

      <div className="space-y-2">
        <label_1.Label htmlFor="excerpt">Excerpt</label_1.Label>
        <textarea_1.Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Brief summary of your post" rows={3}/>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label_1.Label htmlFor="category">Category</label_1.Label>
          <select_1.Select value={categoryId} onValueChange={setCategoryId}>
            <select_1.SelectTrigger id="category">
              <select_1.SelectValue placeholder="Select a category"/>
            </select_1.SelectTrigger>
            <select_1.SelectContent>
              {categories.map((category) => (<select_1.SelectItem key={category.id} value={category.id}>
                  {category.name}
                </select_1.SelectItem>))}
            </select_1.SelectContent>
          </select_1.Select>
        </div>
        <div className="space-y-2">
          <label_1.Label htmlFor="status">Status</label_1.Label>
          <select_1.Select value={status} onValueChange={(value) => setStatus(value)}>
            <select_1.SelectTrigger id="status">
              <select_1.SelectValue placeholder="Select status"/>
            </select_1.SelectTrigger>
            <select_1.SelectContent>
              <select_1.SelectItem value="DRAFT">Draft</select_1.SelectItem>
              <select_1.SelectItem value="PUBLISHED">Published</select_1.SelectItem>
            </select_1.SelectContent>
          </select_1.Select>
        </div>
      </div>

      <div className="space-y-2">
        <label_1.Label htmlFor="content">Content</label_1.Label>
        <card_1.Card className="border rounded-md">
          <card_1.CardContent className="p-3">
            {editor && <toolbar_1.default editor={editor}/>}
            <div className="prose prose-stone dark:prose-invert min-h-[300px] w-full">
              <react_2.EditorContent editor={editor}/>
            </div>
          </card_1.CardContent>
        </card_1.Card>
      </div>

      <div className="flex justify-end gap-3">
        <button_1.Button type="button" variant="outline" onClick={() => router.push("/dashboard/posts")} disabled={isSubmitting}>
          Cancel
        </button_1.Button>
        <button_1.Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : isEditing
                ? "Update Post"
                : "Create Post"}
        </button_1.Button>
      </div>
    </form>);
}
