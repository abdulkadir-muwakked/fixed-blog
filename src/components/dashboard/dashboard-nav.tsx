"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  Settings,
  Tag,
  MessageSquare,
  PanelLeft,
  Users,
  Image,
} from "lucide-react";

interface NavItemProps {
  href: string;
  title: string;
  icon: React.ReactNode;
}

function NavItem({ href, title, icon }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Button
      asChild
      variant={isActive ? "secondary" : "ghost"}
      size="sm"
      className="w-full justify-start"
    >
      <Link href={href}>
        {icon}
        <span className="ml-2">{title}</span>
      </Link>
    </Button>
  );
}

export default function DashboardNav() {
  return (
    <div className="flex flex-col gap-2 py-8">
      <h2 className="px-2 text-lg font-semibold tracking-tight mb-2">Dashboard</h2>
      <div className="space-y-1">
        <NavItem
          href="/dashboard"
          title="Overview"
          icon={<LayoutDashboard className="h-4 w-4" />}
        />
        <NavItem
          href="/dashboard/posts"
          title="Posts"
          icon={<FileText className="h-4 w-4" />}
        />
        <NavItem
          href="/dashboard/categories"
          title="Categories"
          icon={<Tag className="h-4 w-4" />}
        />
        <NavItem
          href="/dashboard/comments"
          title="Comments"
          icon={<MessageSquare className="h-4 w-4" />}
        />
        <NavItem
          href="/dashboard/media"
          title="Media Library"
          icon={<Image className="h-4 w-4" />}
        />
        <NavItem
          href="/dashboard/admins"
          title="Admin Users"
          icon={<Users className="h-4 w-4" />}
        />
        <NavItem
          href="/dashboard/settings"
          title="Settings"
          icon={<Settings className="h-4 w-4" />}
        />
      </div>

      <div className="py-2">
        <h2 className="relative px-2 text-lg font-semibold tracking-tight">
          Actions
        </h2>
      </div>

      <div className="space-y-1">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="w-full justify-start"
        >
          <Link href="/dashboard/posts/create">
            <span className="ml-2">Create New Post</span>
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="w-full justify-start text-muted-foreground"
        >
          <Link href="/blog" target="_blank">
            <PanelLeft className="h-4 w-4 mr-2" />
            View Blog
          </Link>
        </Button>
      </div>
    </div>
  );
}
