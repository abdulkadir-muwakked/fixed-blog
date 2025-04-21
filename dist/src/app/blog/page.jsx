"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BlogPage;
const link_1 = __importDefault(require("next/link"));
const image_1 = __importDefault(require("next/image"));
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const select_1 = require("@/components/ui/select");
function BlogPage() {
    // In a real app, we would fetch these from the database and support pagination
    const posts = [
        {
            id: "1",
            title: "Getting Started with Next.js 14",
            excerpt: "Learn how to build modern web applications with Next.js 14 and React 18.",
            slug: "getting-started-with-nextjs-14",
            featuredImage: "https://images.unsplash.com/photo-1587620962725-abab7fe55159",
            publishedAt: new Date("2023-10-15"),
            author: {
                name: "John Doe",
                image: "https://randomuser.me/api/portraits/men/32.jpg",
            },
            categories: ["Next.js", "React"],
        },
        {
            id: "2",
            title: "Styling Modern Applications with Tailwind CSS",
            excerpt: "Discover how to use Tailwind CSS to create beautiful user interfaces quickly.",
            slug: "styling-with-tailwind-css",
            featuredImage: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8",
            publishedAt: new Date("2023-10-10"),
            author: {
                name: "Jane Smith",
                image: "https://randomuser.me/api/portraits/women/44.jpg",
            },
            categories: ["CSS", "Design"],
        },
        {
            id: "3",
            title: "Building a Blog with Markdown and Next.js",
            excerpt: "Create a powerful blog using Markdown for content and Next.js for delivery.",
            slug: "blog-with-markdown-nextjs",
            featuredImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643",
            publishedAt: new Date("2023-09-28"),
            author: {
                name: "Alex Johnson",
                image: "https://randomuser.me/api/portraits/men/54.jpg",
            },
            categories: ["Next.js", "Markdown"],
        },
        {
            id: "4",
            title: "Authentication in Modern Web Applications",
            excerpt: "Implement secure authentication for your web applications using NextAuth.js.",
            slug: "authentication-modern-web-apps",
            featuredImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
            publishedAt: new Date("2023-09-20"),
            author: {
                name: "Sarah Williams",
                image: "https://randomuser.me/api/portraits/women/67.jpg",
            },
            categories: ["Security", "Next.js"],
        },
        {
            id: "5",
            title: "State Management with React Context and Hooks",
            excerpt: "Learn how to manage application state effectively using React's built-in tools.",
            slug: "state-management-react",
            featuredImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
            publishedAt: new Date("2023-09-15"),
            author: {
                name: "Mike Thompson",
                image: "https://randomuser.me/api/portraits/men/41.jpg",
            },
            categories: ["React", "JavaScript"],
        },
        {
            id: "6",
            title: "Building a RESTful API with Node.js and Express",
            excerpt: "Create a robust and scalable API using Node.js, Express, and MongoDB.",
            slug: "restful-api-nodejs-express",
            featuredImage: "https://images.unsplash.com/photo-1599507593499-a3f7d7d97667",
            publishedAt: new Date("2023-09-10"),
            author: {
                name: "David Lee",
                image: "https://randomuser.me/api/portraits/men/23.jpg",
            },
            categories: ["Node.js", "Backend"],
        },
    ];
    return (<>
      <section className="bg-muted py-10 md:py-16">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">The Blog</h1>
          <p className="text-muted-foreground max-w-2xl mb-6">
            Explore our collection of articles, tutorials, and insights on web development,
            design, and technology.
          </p>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <lucide_react_1.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
              <input type="search" placeholder="Search articles..." className="w-full pl-10 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"/>
            </div>
            <div className="flex gap-2">
              <div className="w-40">
                <select_1.Select>
                  <select_1.SelectTrigger>
                    <select_1.SelectValue placeholder="Category"/>
                  </select_1.SelectTrigger>
                  <select_1.SelectContent>
                    <select_1.SelectItem value="all">All Categories</select_1.SelectItem>
                    <select_1.SelectItem value="react">React</select_1.SelectItem>
                    <select_1.SelectItem value="nextjs">Next.js</select_1.SelectItem>
                    <select_1.SelectItem value="javascript">JavaScript</select_1.SelectItem>
                    <select_1.SelectItem value="design">Design</select_1.SelectItem>
                  </select_1.SelectContent>
                </select_1.Select>
              </div>
              <div className="w-40">
                <select_1.Select>
                  <select_1.SelectTrigger>
                    <select_1.SelectValue placeholder="Sort By"/>
                  </select_1.SelectTrigger>
                  <select_1.SelectContent>
                    <select_1.SelectItem value="latest">Latest</select_1.SelectItem>
                    <select_1.SelectItem value="oldest">Oldest</select_1.SelectItem>
                    <select_1.SelectItem value="popular">Most Popular</select_1.SelectItem>
                  </select_1.SelectContent>
                </select_1.Select>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (<article key={post.id} className="flex flex-col overflow-hidden rounded-lg border bg-background transition-all hover:shadow-md">
                <div className="relative h-48 w-full overflow-hidden">
                  <image_1.default src={`${post.featuredImage}?w=600&h=400&fit=crop`} alt={post.title} fill className="object-cover transition-transform hover:scale-105"/>
                </div>
                <div className="flex flex-col flex-1 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    {post.categories.map((category) => (<span key={category} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors">
                        {category}
                      </span>))}
                  </div>
                  <h2 className="text-xl font-semibold leading-tight mb-2">
                    <link_1.default href={`/blog/${post.slug}`} className="hover:underline">
                      {post.title}
                    </link_1.default>
                  </h2>
                  <p className="text-muted-foreground flex-1 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="relative h-8 w-8 rounded-full overflow-hidden">
                        <image_1.default src={post.author.image} alt={post.author.name} fill className="object-cover"/>
                      </div>
                      <span className="text-sm font-medium">{post.author.name}</span>
                    </div>
                    <time className="text-sm text-muted-foreground">
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            })}
                    </time>
                  </div>
                </div>
              </article>))}
          </div>

          <div className="flex justify-center mt-10">
            <div className="flex gap-2">
              <button_1.Button variant="outline" size="icon" disabled>
                <span className="sr-only">Previous page</span>
                <span aria-hidden>←</span>
              </button_1.Button>
              <button_1.Button variant="outline" size="sm" className="font-medium">
                1
              </button_1.Button>
              <button_1.Button variant="outline" size="sm">
                2
              </button_1.Button>
              <button_1.Button variant="outline" size="sm">
                3
              </button_1.Button>
              <span className="flex h-10 w-10 items-center justify-center text-sm">...</span>
              <button_1.Button variant="outline" size="sm">
                10
              </button_1.Button>
              <button_1.Button variant="outline" size="icon">
                <span className="sr-only">Next page</span>
                <span aria-hidden>→</span>
              </button_1.Button>
            </div>
          </div>
        </div>
      </section>
    </>);
}
