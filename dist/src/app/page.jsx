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
exports.default = Home;
const link_1 = __importDefault(require("next/link"));
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const image_1 = __importDefault(require("next/image"));
const db_1 = require("@/lib/db");
const schema_1 = require("@/lib/db/schema");
const drizzle_orm_1 = require("drizzle-orm");
// تصحيح: نقل عملية التوجيه داخل المكون بشكل صحيح
function Home() {
    return __awaiter(this, void 0, void 0, function* () {
        // Fetch featured posts from the database
        const featuredPosts = yield db_1.db
            .select({
            id: schema_1.posts.id,
            title: schema_1.posts.title,
            slug: schema_1.posts.slug,
            content: schema_1.posts.content,
            excerpt: schema_1.posts.excerpt,
            featuredImage: schema_1.posts.featuredImage,
            status: schema_1.posts.status,
            publishedAt: schema_1.posts.publishedAt,
            authorId: schema_1.posts.authorId,
        })
            .from(schema_1.posts)
            .where((0, drizzle_orm_1.eq)(schema_1.posts.isFeatured, true))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.posts.publishedAt))
            .limit(3);
        return (<>
      {/* Hero Section */}
      <section className="relative bg-slate-950 py-20 md:py-32 overflow-hidden">
        <div className="container relative z-10 flex flex-col items-center text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white max-w-4xl">
            Insights and Ideas for the Modern Developer
          </h1>
          <p className="mt-6 text-lg text-slate-300 max-w-2xl">
            Stay up-to-date with the latest in web development, design, and
            tech, with our expertly curated content and in-depth tutorials.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button_1.Button asChild size="lg">
              <link_1.default href="/blog">
                Explore Articles
                <lucide_react_1.ArrowRight className="ml-2 h-4 w-4"/>
              </link_1.default>
            </button_1.Button>
            <button_1.Button variant="outline" size="lg" className="bg-transparent text-white border-white hover:bg-white hover:text-slate-950">
              <link_1.default href="/categories">Browse Categories</link_1.default>
            </button_1.Button>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-700/20 to-purple-700/20 z-0"/>
        <div className="absolute inset-0 bg-slate-950/60 z-0"/>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497215842964-222b430dc094')] bg-cover bg-center opacity-20 z-0"/>
      </section>

      {/* Featured Posts */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold">Featured Articles</h2>
              <p className="mt-2 text-muted-foreground">
                Explore our most popular and insightful content
              </p>
            </div>
            <button_1.Button asChild variant="ghost" className="mt-4 md:mt-0">
              <link_1.default href="/blog">
                View all articles
                <lucide_react_1.ArrowRight className="ml-2 h-4 w-4"/>
              </link_1.default>
            </button_1.Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (<article key={post.id} // Explicitly cast to string
             className="flex flex-col overflow-hidden rounded-lg border bg-background transition-all hover:shadow-md">
                <div className="relative h-48 w-full overflow-hidden">
                  <image_1.default src={`${post.featuredImage}?w=600&h=400&fit=crop`} // Explicitly cast to string
             alt={post.title} // Explicitly cast to string
             fill className="object-cover transition-transform hover:scale-105"/>
                </div>
                <div className="flex flex-col flex-1 p-6">
                  <h3 className="text-xl font-semibold leading-tight mb-2">
                    <link_1.default href={`/blog/${post.slug}`} // Explicitly cast to string
             className="hover:underline">
                      {post.title}
                    </link_1.default>
                  </h3>
                  <p className="text-muted-foreground flex-1 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        Author ID: {post.authorId}
                        to string
                      </span>
                    </div>
                    <time className="text-sm text-muted-foreground">
                      {post.publishedAt &&
                    new Date(post.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })}
                    </time>
                  </div>
                </div>
              </article>))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-muted py-16">
        <div className="container flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-muted-foreground max-w-2xl mb-8">
            Stay updated with the latest articles, tutorials, and insights
            delivered directly to your inbox.
          </p>
          <form className="flex w-full max-w-md flex-col sm:flex-row gap-2">
            <input type="email" placeholder="Enter your email" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required/>
            <button_1.Button type="submit">Subscribe</button_1.Button>
          </form>
        </div>
      </section>
    </>);
    });
}
