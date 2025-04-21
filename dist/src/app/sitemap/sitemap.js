"use strict";
/**
 * @File: src/app/sitemap/sitemap.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = sitemap;
// In a real application, you would fetch this data from your database
// and generate entries for all your blog posts, categories, etc.
function sitemap() {
    // Base URL - replace with your actual domain in production
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://example.com';
    // Common routes for both English and Arabic
    const routes = [
        '',
        '/blog',
        '/categories',
    ];
    // Generate entries for each locale
    const locales = ['en', 'ar'];
    // Create sitemap entries
    const entries = [];
    // Add entries for each route in each locale
    for (const locale of locales) {
        for (const route of routes) {
            entries.push({
                url: `${baseUrl}/${locale}${route}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: route === '' ? 1.0 : 0.8,
            });
        }
    }
    // Add additional entries for blog posts
    // This is a placeholder - in a real app, these would be dynamically generated
    const blogPosts = [
        {
            slug: 'getting-started-with-nextjs-14',
            lastModified: new Date('2023-10-15'),
        },
        {
            slug: 'styling-with-tailwind-css',
            lastModified: new Date('2023-10-10'),
        },
        {
            slug: 'blog-with-markdown-nextjs',
            lastModified: new Date('2023-09-28'),
        },
    ];
    // Add blog post entries for each locale
    for (const locale of locales) {
        for (const post of blogPosts) {
            entries.push({
                url: `${baseUrl}/${locale}/blog/${post.slug}`,
                lastModified: post.lastModified,
                changeFrequency: 'monthly',
                priority: 0.7,
            });
        }
    }
    return entries;
}
