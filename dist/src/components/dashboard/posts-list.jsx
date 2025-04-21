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
exports.default = PostsList;
const react_1 = require("react");
const link_1 = __importDefault(require("next/link"));
const navigation_1 = require("next/navigation");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const dropdown_menu_1 = require("@/components/ui/dropdown-menu");
const lucide_react_1 = require("lucide-react");
function PostsList({ posts }) {
    const router = (0, navigation_1.useRouter)();
    const [selectedFilter, setSelectedFilter] = (0, react_1.useState)("ALL");
    const filteredPosts = posts.filter(post => {
        if (selectedFilter === "ALL")
            return true;
        return post.status === selectedFilter;
    });
    const deletePost = (id) => __awaiter(this, void 0, void 0, function* () {
        // In a real app, you would call an API to delete the post
        console.log(`Deleting post with id: ${id}`);
        // Then refresh the data
        router.refresh();
    });
    const publishPost = (id) => __awaiter(this, void 0, void 0, function* () {
        // In a real app, you would call an API to publish the post
        console.log(`Publishing post with id: ${id}`);
        // Then refresh the data
        router.refresh();
    });
    const unpublishPost = (id) => __awaiter(this, void 0, void 0, function* () {
        // In a real app, you would call an API to unpublish the post
        console.log(`Unpublishing post with id: ${id}`);
        // Then refresh the data
        router.refresh();
    });
    return (<div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight px-2">Your Posts</h2>
        <div className="flex gap-2">
          <button_1.Button variant={selectedFilter === "ALL" ? "default" : "outline"} size="sm" onClick={() => setSelectedFilter("ALL")}>
            <lucide_react_1.ClipboardList className="mr-2 h-4 w-4"/>
            All
          </button_1.Button>
          <button_1.Button variant={selectedFilter === "PUBLISHED" ? "default" : "outline"} size="sm" onClick={() => setSelectedFilter("PUBLISHED")}>
            <lucide_react_1.FileUp className="mr-2 h-4 w-4"/>
            Published
          </button_1.Button>
          <button_1.Button variant={selectedFilter === "DRAFT" ? "default" : "outline"} size="sm" onClick={() => setSelectedFilter("DRAFT")}>
            <lucide_react_1.FileDown className="mr-2 h-4 w-4"/>
            Drafts
          </button_1.Button>
          <button_1.Button size="sm" asChild>
            <link_1.default href="/dashboard/posts/create">
              <lucide_react_1.Plus className="mr-2 h-4 w-4"/>
              New Post
            </link_1.default>
          </button_1.Button>
        </div>
      </div>

      {filteredPosts.length === 0 ? (<card_1.Card>
          <card_1.CardContent className="py-8">
            <div className="flex flex-col items-center justify-center text-center space-y-3">
              <div className="text-muted-foreground">No posts found.</div>
              <button_1.Button size="sm" asChild>
                <link_1.default href="/dashboard/posts/create">
                  <lucide_react_1.Plus className="mr-2 h-4 w-4"/>
                  Create your first post
                </link_1.default>
              </button_1.Button>
            </div>
          </card_1.CardContent>
        </card_1.Card>) : (<div className="grid gap-4">
          {filteredPosts.map((post) => (<card_1.Card key={post.id}>
              <card_1.CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <card_1.CardTitle className="text-xl font-bold">{post.title}</card_1.CardTitle>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${post.status === "PUBLISHED"
                    ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"}`}>
                      {post.status === "PUBLISHED" ? "Published" : "Draft"}
                    </span>
                    <dropdown_menu_1.DropdownMenu>
                      <dropdown_menu_1.DropdownMenuTrigger asChild>
                        <button_1.Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <lucide_react_1.MoreHorizontal className="h-4 w-4"/>
                          <span className="sr-only">Open menu</span>
                        </button_1.Button>
                      </dropdown_menu_1.DropdownMenuTrigger>
                      <dropdown_menu_1.DropdownMenuContent align="end">
                        <dropdown_menu_1.DropdownMenuLabel>Actions</dropdown_menu_1.DropdownMenuLabel>
                        <dropdown_menu_1.DropdownMenuSeparator />
                        <dropdown_menu_1.DropdownMenuItem asChild>
                          <link_1.default href={`/dashboard/posts/${post.id}/edit`}>
                            <lucide_react_1.Edit className="mr-2 h-4 w-4"/>
                            <span>Edit</span>
                          </link_1.default>
                        </dropdown_menu_1.DropdownMenuItem>
                        <dropdown_menu_1.DropdownMenuItem asChild>
                          <link_1.default href={`/blog/${post.slug}`} target="_blank">
                            <lucide_react_1.Eye className="mr-2 h-4 w-4"/>
                            <span>View</span>
                          </link_1.default>
                        </dropdown_menu_1.DropdownMenuItem>
                        {post.status === "DRAFT" ? (<dropdown_menu_1.DropdownMenuItem onClick={() => publishPost(post.id)}>
                            <lucide_react_1.FileUp className="mr-2 h-4 w-4"/>
                            <span>Publish</span>
                          </dropdown_menu_1.DropdownMenuItem>) : (<dropdown_menu_1.DropdownMenuItem onClick={() => unpublishPost(post.id)}>
                            <lucide_react_1.FileDown className="mr-2 h-4 w-4"/>
                            <span>Unpublish</span>
                          </dropdown_menu_1.DropdownMenuItem>)}
                        <dropdown_menu_1.DropdownMenuSeparator />
                        <dropdown_menu_1.DropdownMenuItem onClick={() => deletePost(post.id)} className="text-destructive focus:text-destructive">
                          <lucide_react_1.Trash2 className="mr-2 h-4 w-4"/>
                          <span>Delete</span>
                        </dropdown_menu_1.DropdownMenuItem>
                      </dropdown_menu_1.DropdownMenuContent>
                    </dropdown_menu_1.DropdownMenu>
                  </div>
                </div>
                <card_1.CardDescription className="text-md line-clamp-1">
                  {post.excerpt}
                </card_1.CardDescription>
              </card_1.CardHeader>
              <card_1.CardFooter>
                <div className="text-sm text-muted-foreground flex justify-between w-full">
                  <div>Slug: <span className="font-mono">{post.slug}</span></div>
                  <div>
                    {post.publishedAt
                    ? `Published: ${post.publishedAt.toLocaleDateString()}`
                    : "Not published yet"}
                  </div>
                </div>
              </card_1.CardFooter>
            </card_1.Card>))}
        </div>)}
    </div>);
}
