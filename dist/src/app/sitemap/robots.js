"use strict";
/**
 * @File: src/app/sitemap/robots.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = robots;
// This generates the robots.txt file for the application
function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/dashboard/', '/api/'],
        },
        sitemap: 'https://example.com/sitemap.xml',
    };
}
