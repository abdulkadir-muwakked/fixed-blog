"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NavBar;
const react_1 = require("react");
const react_2 = require("next-auth/react");
const link_1 = __importDefault(require("next/link"));
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const avatar_1 = require("@/components/ui/avatar");
const dropdown_menu_1 = require("@/components/ui/dropdown-menu");
const theme_toggle_1 = __importDefault(require("./theme-toggle"));
const utils_1 = require("@/lib/utils");
function NavBar({ session }) {
    const [mobileMenuOpen, setMobileMenuOpen] = (0, react_1.useState)(false);
    const user = session === null || session === void 0 ? void 0 : session.user;
    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };
    return (<header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Logo and Site Name */}
          <link_1.default href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">Next.js Blog</span>
          </link_1.default>

          {/* Desktop Menu */}
          <nav className="hidden md:ms-6 md:flex md:items-center md:gap-5">
            <link_1.default href="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Home
            </link_1.default>
            <link_1.default href="/blog" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Blog
            </link_1.default>
            <link_1.default href="/categories" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Categories
            </link_1.default>
          </nav>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Search Button */}
          <button_1.Button variant="ghost" size="icon" aria-label="Search">
            <lucide_react_1.Search className="h-5 w-5"/>
          </button_1.Button>

          {/* Theme Toggle */}
          <theme_toggle_1.default />

          {/* User Menu or Login Button */}
          {user ? (<dropdown_menu_1.DropdownMenu>
              <dropdown_menu_1.DropdownMenuTrigger asChild>
                <button_1.Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <avatar_1.Avatar className="h-8 w-8">
                    <avatar_1.AvatarImage src={user.image || ""} alt={user.name || "Dashboard"}/>
                    <avatar_1.AvatarFallback>
                      {user.name ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase() : <lucide_react_1.UserCircle2 className="h-6 w-6"/>}
                    </avatar_1.AvatarFallback>
                  </avatar_1.Avatar>
                </button_1.Button>
              </dropdown_menu_1.DropdownMenuTrigger>
              <dropdown_menu_1.DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <dropdown_menu_1.DropdownMenuSeparator />
                <dropdown_menu_1.DropdownMenuItem asChild>
                  <link_1.default href="/dashboard" className="cursor-pointer">
                    <lucide_react_1.User className="me-2 h-4 w-4"/>
                    <span>Dashboard</span>
                  </link_1.default>
                </dropdown_menu_1.DropdownMenuItem>
                <dropdown_menu_1.DropdownMenuItem asChild>
                  <link_1.default href="/settings" className="cursor-pointer">
                    <lucide_react_1.Settings className="me-2 h-4 w-4"/>
                    <span>Settings</span>
                  </link_1.default>
                </dropdown_menu_1.DropdownMenuItem>
                <dropdown_menu_1.DropdownMenuSeparator />
                <dropdown_menu_1.DropdownMenuItem className="cursor-pointer" onClick={() => (0, react_2.signOut)()}>
                  <lucide_react_1.LogOut className="me-2 h-4 w-4"/>
                  <span>Logout</span>
                </dropdown_menu_1.DropdownMenuItem>
              </dropdown_menu_1.DropdownMenuContent>
            </dropdown_menu_1.DropdownMenu>) : (<button_1.Button variant="default" size="sm" onClick={() => (0, react_2.signIn)()}>
              Login
            </button_1.Button>)}

          {/* Mobile Menu Button */}
          <button_1.Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMobileMenu} aria-label="Toggle Menu">
            {mobileMenuOpen ? <lucide_react_1.X className="h-5 w-5"/> : <lucide_react_1.Menu className="h-5 w-5"/>}
          </button_1.Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={(0, utils_1.cn)("container md:hidden", mobileMenuOpen ? "block" : "hidden")}>
        <nav className="flex flex-col space-y-3 pb-3">
          <link_1.default href="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
            Home
          </link_1.default>
          <link_1.default href="/blog" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
            Blog
          </link_1.default>
          <link_1.default href="/categories" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
            Categories
          </link_1.default>
        </nav>
      </div>
    </header>);
}
