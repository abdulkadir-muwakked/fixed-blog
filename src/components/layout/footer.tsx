"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin, Facebook, Instagram } from "lucide-react";

// تعريف النصوص العربية مباشرة
const arabicText = {
  home: "الرئيسية",
  blog: "المدونة",
  categories: "التصنيفات"
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex flex-col md:flex-row md:justify-between py-10">
        <div className="flex flex-col space-y-4 mb-8 md:mb-0">
          <h3 className="text-lg font-semibold">مدونة Next.js</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            مدونة حديثة مبنية بتقنيات Next.js و React و Tailwind CSS،
            تتميز بتصميم أنيق ونظام قوي لإدارة المحتوى.
          </p>
          <div className="flex space-x-4">
            <Link href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          <div className="flex flex-col space-y-2">
            <h4 className="font-medium text-sm">تصفح</h4>
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary">{arabicText.home}</Link>
            <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary">{arabicText.blog}</Link>
            <Link href="/categories" className="text-sm text-muted-foreground hover:text-primary">{arabicText.categories}</Link>
          </div>

          <div className="flex flex-col space-y-2">
            <h4 className="font-medium text-sm">موارد</h4>
            <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">حول المدونة</Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">سياسة الخصوصية</Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">شروط الاستخدام</Link>
          </div>

          <div className="flex flex-col space-y-2 col-span-2 md:col-span-1">
            <h4 className="font-medium text-sm">اتصل بنا</h4>
            <Link href="mailto:contact@example.com" className="text-sm text-muted-foreground hover:text-primary">
              contact@example.com
            </Link>
            <Link href="tel:+1234567890" className="text-sm text-muted-foreground hover:text-primary">
              +1 (234) 567-890
            </Link>
          </div>
        </div>
      </div>

      <div className="container border-t py-6">
        <p className="text-sm text-center text-muted-foreground">
          © {currentYear} مدونة Next.js. جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  );
}