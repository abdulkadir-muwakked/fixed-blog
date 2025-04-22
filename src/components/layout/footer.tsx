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

// Updated footer to dynamically fetch footer text from the dashboard

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    github: "",
  });
  const [footerText, setFooterText] = useState("");
  const [descriptionText, setDescriptionText] = useState("");
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
  });

  useEffect(() => {
    async function fetchFooterData() {
      try {
        const response = await fetch("/api/settings");
        if (!response.ok) {
          throw new Error("Failed to fetch footer data");
        }
        const data = await response.json();
        setSocialLinks({
          facebook: data.settings.socialFacebook || "",
          twitter: data.settings.socialTwitter || "",
          instagram: data.settings.socialInstagram || "",
          linkedin: data.settings.socialLinkedIn || "",
          github: data.settings.socialGithub || "",
        });
        setFooterText(
          data.settings.footerText ||
            "© " + currentYear + " مدونة Next.js. جميع الحقوق محفوظة."
        );
      } catch (error) {
        console.error("Error fetching footer data:", error);
      }
    }

    fetchFooterData();
  }, [currentYear]);

  useEffect(() => {
    async function fetchDescriptionText() {
      try {
        const response = await fetch("/api/settings");
        if (!response.ok) {
          throw new Error("Failed to fetch description text");
        }
        const data = await response.json();
        setDescriptionText(
          data.settings.description ||
            "مدونة حديثة مبنية بتقنيات Next.js و React و Tailwind CSS، تتميز بتصميم أنيق ونظام قوي لإدارة المحتوى."
        );
      } catch (error) {
        console.error("Error fetching description text:", error);
      }
    }

    fetchDescriptionText();
  }, []);

  useEffect(() => {
    async function fetchContactInfo() {
      try {
        const response = await fetch("/api/settings");
        if (!response.ok) {
          throw new Error("Failed to fetch contact information");
        }
        const data = await response.json();
        console.log(data, "data");
        setContactInfo({
          email: data.settings.contactEmail || "contact@example.com",
          phone: data.settings.contactPhone || "+1 (234) 567-890",
        });
      } catch (error) {
        console.error("Error fetching contact information:", error);
      }
    }

    fetchContactInfo();
  }, []);

  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex flex-col md:flex-row md:justify-between py-10">
        <div className="flex flex-col space-y-4 mb-8 md:mb-0">
          <h3 className="text-lg font-semibold">مدونة Next.js</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            {descriptionText}
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
              href={`mailto:${contactInfo.email}`}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              {contactInfo.email}
            </Link>
            <Link
              href={`tel:${contactInfo.phone}`}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              {contactInfo.phone}
            </Link>
          </div>
        </div>
      </div>

      <div className="container border-t py-6">
        <p className="text-sm text-center text-muted-foreground">
          {footerText}
        </p>
      </div>
    </footer>
  );
}
