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
exports.default = EditPostPage;
const next_auth_1 = require("next-auth");
const navigation_1 = require("next/navigation");
const config_1 = require("@/lib/auth/config");
const dashboard_nav_1 = __importDefault(require("@/components/dashboard/dashboard-nav"));
const dashboard_shell_1 = __importDefault(require("@/components/dashboard/dashboard-shell"));
const dashboard_header_1 = __importDefault(require("@/components/dashboard/dashboard-header"));
const post_form_1 = __importDefault(require("@/components/dashboard/post-form"));
const toaster_1 = require("@/components/ui/toaster");
const db_1 = require("@/lib/db");
const schema_1 = require("@/lib/db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const schema_2 = require("@/lib/db/schema");
function EditPostPage(_a) {
    return __awaiter(this, arguments, void 0, function* ({ params }) {
        var _b, _c, _d;
        const session = yield (0, next_auth_1.getServerSession)(config_1.authOptions);
        if (!session) {
            (0, navigation_1.redirect)("/login?callbackUrl=/dashboard/posts");
        }
        // Define the correct type for categories
        const categories = yield db_1.db
            .select({
            id: schema_2.categories.id,
            name: schema_2.categories.name,
            slug: schema_2.categories.slug,
            description: schema_2.categories.description,
            createdAt: schema_2.categories.createdAt,
            updatedAt: schema_2.categories.updatedAt,
        })
            .from(schema_2.categories);
        // Adjust the post query to exclude `categoryId` if it doesn't exist in the schema
        const post = yield db_1.db
            .select({
            id: schema_1.posts.id,
            title: schema_1.posts.title,
            content: schema_1.posts.content,
            excerpt: (_b = schema_1.posts.excerpt) !== null && _b !== void 0 ? _b : "", // Ensure excerpt is a string
            slug: schema_1.posts.slug,
            status: schema_1.posts.status,
            publishedAt: schema_1.posts.publishedAt,
        })
            .from(schema_1.posts)
            .where((0, drizzle_orm_1.eq)(schema_1.posts.id, params.id))
            .then((res) => res[0]);
        if (!post) {
            (0, navigation_1.redirect)("/dashboard/posts");
        }
        // Ensure `excerpt` is always a string before passing to PostForm
        const formattedPost = Object.assign(Object.assign({}, post), { excerpt: (_c = post.excerpt) !== null && _c !== void 0 ? _c : "" });
        // Ensure `excerpt` is always a string in `mappedPost`
        const mappedPost = Object.assign(Object.assign({}, post), { status: post.status === "ARCHIVED" ? "DRAFT" : post.status, excerpt: (_d = post.excerpt) !== null && _d !== void 0 ? _d : "" });
        return (<dashboard_shell_1.default>
      <dashboard_nav_1.default />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <dashboard_header_1.default heading="Edit Post" text="Make changes to your post and update it"/>

        <div className="grid gap-4">
          <post_form_1.default post={mappedPost} categories={categories}/>
        </div>

        <toaster_1.Toaster />
      </div>
    </dashboard_shell_1.default>);
    });
}
