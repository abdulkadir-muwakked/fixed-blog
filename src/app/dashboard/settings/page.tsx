"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save } from "lucide-react";
import DashboardShell from "@/components/dashboard/dashboard-shell";

type SiteSettings = {
  id: string;
  title: string;
  description: string;
  logo: string | null;
  favicon: string | null;
  socialFacebook: string | null;
  socialTwitter: string | null;
  socialInstagram: string | null;
  socialLinkedIn: string | null;
  socialGithub: string | null;
  footerText: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
};

// Define types for banners
interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  link?: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [footerContent, setFooterContent] = useState("");
  const [navbarLinks, setNavbarLinks] = useState("[]");
  const [banners, setBanners] = useState<Banner[]>([]);

  // Load settings on component mount
  useEffect(() => {
    fetchSettings();
    fetchData();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/settings");

      if (!response.ok) {
        throw new Error("Failed to fetch site settings");
      }

      const data = await response.json();
      setSettings(data.settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load site settings");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async () => {
    const footerRes = await fetch("/api/settings/footer");
    const footerData = await footerRes.json();
    setFooterContent(footerData?.content || "");

    const navbarRes = await fetch("/api/settings/navbar");
    const navbarData = await navbarRes.json();
    setNavbarLinks(JSON.stringify(navbarData?.links || []));

    const bannersRes = await fetch("/api/settings/banners");
    const bannersData = await bannersRes.json();
    setBanners(bannersData || []);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (settings) {
      setSettings({
        ...settings,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!settings) return;

    setIsSaving(true);

    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      toast.success("Settings saved successfully");
      router.refresh();
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFooterSave = async () => {
    await fetch("/api/settings/footer", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: footerContent }),
    });
  };

  const handleNavbarSave = async () => {
    await fetch("/api/settings/navbar", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ links: JSON.parse(navbarLinks) }),
    });
  };

  // Update the `handleBannerAdd` function to use the `Banner` type
  const handleBannerAdd = async (newBanner: Banner) => {
    await fetch("/api/settings/banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBanner),
    });
    setBanners([...banners, newBanner]);
  };

  // Update the `handleBannerDelete` function to type the `id` parameter
  const handleBannerDelete = async (id: string) => {
    await fetch("/api/settings/banners", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setBanners(banners.filter((banner) => banner.id !== id));
  };

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardShell>
    );
  }

  if (!settings) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="mb-4 text-muted-foreground">No settings found.</p>
          <Button onClick={fetchSettings}>Retry</Button>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Site Settings</h1>
        <Button onClick={handleSubmit} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
          <TabsTrigger value="navbar">Navbar</TabsTrigger>
          <TabsTrigger value="banners">Banners</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure the basic information for your blog.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Site Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={settings.title}
                  onChange={handleChange}
                  placeholder="My Blog"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Site Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={settings.description || ""}
                  onChange={handleChange}
                  placeholder="A brief description of your blog"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="footerText">Footer Text</Label>
                <Input
                  id="footerText"
                  name="footerText"
                  value={settings.footerText || ""}
                  onChange={handleChange}
                  placeholder="© 2025 My Blog. All rights reserved."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  value={settings.contactEmail || ""}
                  onChange={handleChange}
                  placeholder="contact@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  name="contactPhone"
                  value={settings.contactPhone || ""}
                  onChange={handleChange}
                  placeholder="+1 (234) 567-890"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>
                Connect your social media accounts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="socialFacebook">Facebook</Label>
                <Input
                  id="socialFacebook"
                  name="socialFacebook"
                  value={settings.socialFacebook || ""}
                  onChange={handleChange}
                  placeholder="https://facebook.com/myblog"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="socialTwitter">Twitter</Label>
                <Input
                  id="socialTwitter"
                  name="socialTwitter"
                  value={settings.socialTwitter || ""}
                  onChange={handleChange}
                  placeholder="https://twitter.com/myblog"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="socialInstagram">Instagram</Label>
                <Input
                  id="socialInstagram"
                  name="socialInstagram"
                  value={settings.socialInstagram || ""}
                  onChange={handleChange}
                  placeholder="https://instagram.com/myblog"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="socialLinkedIn">LinkedIn</Label>
                <Input
                  id="socialLinkedIn"
                  name="socialLinkedIn"
                  value={settings.socialLinkedIn || ""}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/company/myblog"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="socialGithub">GitHub</Label>
                <Input
                  id="socialGithub"
                  name="socialGithub"
                  value={settings.socialGithub || ""}
                  onChange={handleChange}
                  placeholder="https://github.com/myblog"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of your blog.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logo">Logo URL</Label>
                <Input
                  id="logo"
                  name="logo"
                  value={settings.logo || ""}
                  onChange={handleChange}
                  placeholder="https://example.com/logo.png"
                />
                <p className="text-xs text-muted-foreground">
                  Link to your logo image (recommended size: 120x40px)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="favicon">Favicon URL</Label>
                <Input
                  id="favicon"
                  name="favicon"
                  value={settings.favicon || ""}
                  onChange={handleChange}
                  placeholder="https://example.com/favicon.ico"
                />
                <p className="text-xs text-muted-foreground">
                  Link to your favicon (recommended size: 32x32px)
                </p>
              </div>
              <div className="pt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Coming soon: Media upload functionality for images and
                  customization of colors and typography.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="footer">
          <Card>
            <CardHeader>
              <CardTitle>Footer</CardTitle>
              <CardDescription>
                Manage the content of your site's footer.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="footer">Footer Content</Label>
                <Textarea
                  id="footer"
                  value={footerContent}
                  onChange={(e) => setFooterContent(e.target.value)}
                />
              </div>
              <Button onClick={handleFooterSave}>Save Footer</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="navbar">
          <Card>
            <CardHeader>
              <CardTitle>Navbar</CardTitle>
              <CardDescription>
                Manage the links in your site's navbar.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="navbar">Navbar Links (JSON)</Label>
                <Textarea
                  id="navbar"
                  value={navbarLinks}
                  onChange={(e) => setNavbarLinks(e.target.value)}
                />
              </div>
              <Button onClick={handleNavbarSave}>Save Navbar</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banners">
          <Card>
            <CardHeader>
              <CardTitle>Banners</CardTitle>
              <CardDescription>
                Manage the banners displayed on your site.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul>
                {banners.map((banner) => (
                  <li key={banner.id} className="flex justify-between">
                    <span>{banner.title}</span>
                    <Button onClick={() => handleBannerDelete(banner.id)}>
                      Delete
                    </Button>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() =>
                  handleBannerAdd({
                    id: "new",
                    title: "New Banner",
                    imageUrl: "",
                    link: "",
                  })
                }
              >
                Add Banner
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
