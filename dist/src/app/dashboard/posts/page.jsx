"use strict";
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
exports.default = PostsPage;
const next_auth_1 = require("next-auth");
const navigation_1 = require("next/navigation");
const config_1 = require("@/lib/auth/config");
const dashboard_nav_1 = __importDefault(require("@/components/dashboard/dashboard-nav"));
const dashboard_shell_1 = __importDefault(require("@/components/dashboard/dashboard-shell"));
const dashboard_header_1 = __importDefault(require("@/components/dashboard/dashboard-header"));
const posts_list_1 = __importDefault(require("@/components/dashboard/posts-list"));
const button_1 = require("@/components/ui/button");
const link_1 = __importDefault(require("next/link"));
const lucide_react_1 = require("lucide-react");
const db_1 = require("@/lib/db");
const schema_1 = require("@/lib/db/schema");
const drizzle_orm_1 = require("drizzle-orm");
function PostsPage() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const session = yield (0, next_auth_1.getServerSession)(config_1.authOptions);
        if (!session) {
            (0, navigation_1.redirect)("/login?callbackUrl=/dashboard/posts");
        }
        // Update the posts query to include all required fields
        const posts = yield db_1.db
            .select({
            id: schema_1.posts.id,
            slug: schema_1.posts.slug,
            createdAt: schema_1.posts.createdAt,
            updatedAt: schema_1.posts.updatedAt,
            title: schema_1.posts.title,
            content: schema_1.posts.content,
            excerpt: (_a = schema_1.posts.excerpt) !== null && _a !== void 0 ? _a : "", // Ensure excerpt is a string
            featuredImage: schema_1.posts.featuredImage,
            status: schema_1.posts.status,
            publishedAt: schema_1.posts.publishedAt,
            isFeatured: schema_1.posts.isFeatured,
            metaDescription: schema_1.posts.metaDescription,
            metaKeywords: schema_1.posts.metaKeywords,
            locale: schema_1.posts.locale,
            authorId: schema_1.posts.authorId,
        })
            .from(schema_1.posts)
            .where((0, drizzle_orm_1.eq)(schema_1.posts.authorId, session.user.id));
        // Map posts to ensure `excerpt` is always a string
        const formattedPosts = posts.map((post) => {
            var _a;
            return (Object.assign(Object.assign({}, post), { excerpt: (_a = post.excerpt) !== null && _a !== void 0 ? _a : "" }));
        });
        // Filter out posts with the "ARCHIVED" status
        const filteredPosts = formattedPosts.filter((post) => post.status !== "ARCHIVED");
        // Explicitly cast filteredPosts to the expected type
        const typedPosts = filteredPosts;
        return (<dashboard_shell_1.default>
      <dashboard_nav_1.default />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <dashboard_header_1.default heading="Posts" text="Manage your blog posts">
          <button_1.Button asChild>
            <link_1.default href="/dashboard/posts/create">
              <lucide_react_1.Plus className="mr-2 h-4 w-4"/>
              New Post
            </link_1.default>
          </button_1.Button>
        </dashboard_header_1.default>

        <posts_list_1.default posts={typedPosts}/>
      </div>
    </dashboard_shell_1.default>);
    });
}
