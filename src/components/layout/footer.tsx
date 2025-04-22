"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin, Facebook, Instagram } from "lucide-react";
import { useEffect, useState } from "react";

// تعريف النصوص العربية مباشرة
const arabicText = {
  home: "الرئيسية",
  blog: "المدونة",
  categories: "التصنيفات",
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    github: "",
  });

  useEffect(() => {
    async function fetchSocialLinks() {
      try {
        const response = await fetch("/api/settings");
        if (!response.ok) {
          throw new Error("Failed to fetch social links");
        }
        const data = await response.json();
        setSocialLinks({
          facebook: data.settings.socialFacebook || "",
          twitter: data.settings.socialTwitter || "",
          instagram: data.settings.socialInstagram || "",
          linkedin: data.settings.socialLinkedIn || "",
          github: data.settings.socialGithub || "",
        });
      } catch (error) {
        console.error("Error fetching social links:", error);
      }
    }

    fetchSocialLinks();
  }, []);

  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex flex-col md:flex-row md:justify-between py-10">
        <div className="flex flex-col space-y-4 mb-8 md:mb-0">
          <h3 className="text-lg font-semibold">مدونة Next.js</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            مدونة حديثة مبنية بتقنيات Next.js و React و Tailwind CSS، تتميز
            بتصميم أنيق ونظام قوي لإدارة المحتوى.
          </p>
          <div className="flex space-x-4">
            {socialLinks.github && (
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            )}
            {socialLinks.twitter && (
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
            )}
            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            )}
            {socialLinks.facebook && (
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
            )}
            {socialLinks.instagram && (
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          <div className="flex flex-col space-y-2">
            <h4 className="font-medium text-sm">تصفح</h4>
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              {arabicText.home}
            </Link>
            <Link
              href="/blog"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              {arabicText.blog}
            </Link>
            <Link
              href="/categories"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              {arabicText.categories}
            </Link>
          </div>

          <div className="flex flex-col space-y-2">
            <h4 className="font-medium text-sm">موارد</h4>
            <Link
              href="/about"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              حول المدونة
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              سياسة الخصوصية
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              شروط الاستخدام
            </Link>
          </div>

          <div className="flex flex-col space-y-2 col-span-2 md:col-span-1">
            <h4 className="font-medium text-sm">اتصل بنا</h4>
            <Link
              href="mailto:contact@example.com"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              contact@example.com
            </Link>
            <Link
              href="tel:+1234567890"
              className="text-sm text-muted-foreground hover:text-primary"
            >
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
