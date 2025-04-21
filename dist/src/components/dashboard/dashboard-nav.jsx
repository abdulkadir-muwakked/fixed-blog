"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DashboardNav;
const link_1 = __importDefault(require("next/link"));
const navigation_1 = require("next/navigation");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
function NavItem({ href, title, icon }) {
    const pathname = (0, navigation_1.usePathname)();
    const isActive = pathname === href;
    return (<button_1.Button asChild variant={isActive ? "secondary" : "ghost"} size="sm" className="w-full justify-start">
      <link_1.default href={href}>
        {icon}
        <span className="ml-2">{title}</span>
      </link_1.default>
    </button_1.Button>);
}
function DashboardNav() {
    return (<div className="flex flex-col gap-2 py-8">
      <h2 className="px-2 text-lg font-semibold tracking-tight mb-2">Dashboard</h2>
      <div className="space-y-1">
        <NavItem href="/dashboard" title="Overview" icon={<lucide_react_1.LayoutDashboard className="h-4 w-4"/>}/>
        <NavItem href="/dashboard/posts" title="Posts" icon={<lucide_react_1.FileText className="h-4 w-4"/>}/>
        <NavItem href="/dashboard/categories" title="Categories" icon={<lucide_react_1.Tag className="h-4 w-4"/>}/>
        <NavItem href="/dashboard/comments" title="Comments" icon={<lucide_react_1.MessageSquare className="h-4 w-4"/>}/>
        <NavItem href="/dashboard/media" title="Media Library" icon={<lucide_react_1.Image className="h-4 w-4"/>}/>
        <NavItem href="/dashboard/admins" title="Admin Users" icon={<lucide_react_1.Users className="h-4 w-4"/>}/>
        <NavItem href="/dashboard/settings" title="Settings" icon={<lucide_react_1.Settings className="h-4 w-4"/>}/>
      </div>

      <div className="py-2">
        <h2 className="relative px-2 text-lg font-semibold tracking-tight">
          Actions
        </h2>
      </div>

      <div className="space-y-1">
        <button_1.Button asChild variant="outline" size="sm" className="w-full justify-start">
          <link_1.default href="/dashboard/posts/create">
            <span className="ml-2">Create New Post</span>
          </link_1.default>
        </button_1.Button>
        <button_1.Button asChild variant="outline" size="sm" className="w-full justify-start text-muted-foreground">
          <link_1.default href="/blog" target="_blank">
            <lucide_react_1.PanelLeft className="h-4 w-4 mr-2"/>
            View Blog
          </link_1.default>
        </button_1.Button>
      </div>
    </div>);
}
