"use strict";
"use client";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SettingsPage;
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const input_1 = require("@/components/ui/input");
const label_1 = require("@/components/ui/label");
const textarea_1 = require("@/components/ui/textarea");
const sonner_1 = require("sonner");
const navigation_1 = require("next/navigation");
const tabs_1 = require("@/components/ui/tabs");
const lucide_react_1 = require("lucide-react");
const dashboard_shell_1 = __importDefault(require("@/components/dashboard/dashboard-shell"));
function SettingsPage() {
    const router = (0, navigation_1.useRouter)();
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [isSaving, setIsSaving] = (0, react_1.useState)(false);
    const [settings, setSettings] = (0, react_1.useState)(null);
    // Load settings on component mount
    (0, react_1.useEffect)(() => {
        fetchSettings();
    }, []);
    const fetchSettings = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setIsLoading(true);
            const response = yield fetch("/api/settings");
            if (!response.ok) {
                throw new Error("Failed to fetch site settings");
            }
            const data = yield response.json();
            setSettings(data.settings);
        }
        catch (error) {
            console.error("Error fetching settings:", error);
            sonner_1.toast.error("Failed to load site settings");
        }
        finally {
            setIsLoading(false);
        }
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (settings) {
            setSettings(Object.assign(Object.assign({}, settings), { [name]: value }));
        }
    };
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        if (!settings)
            return;
        setIsSaving(true);
        try {
            const response = yield fetch("/api/settings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(settings),
            });
            if (!response.ok) {
                throw new Error("Failed to save settings");
            }
            sonner_1.toast.success("Settings saved successfully");
            router.refresh();
        }
        catch (error) {
            console.error("Error saving settings:", error);
            sonner_1.toast.error("Failed to save settings");
        }
        finally {
            setIsSaving(false);
        }
    });
    if (isLoading) {
        return (<dashboard_shell_1.default>
        <div className="flex justify-center py-12">
          <lucide_react_1.Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/>
        </div>
      </dashboard_shell_1.default>);
    }
    if (!settings) {
        return (<dashboard_shell_1.default>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="mb-4 text-muted-foreground">No settings found.</p>
          <button_1.Button onClick={fetchSettings}>Retry</button_1.Button>
        </div>
      </dashboard_shell_1.default>);
    }
    return (<dashboard_shell_1.default>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Site Settings</h1>
        <button_1.Button onClick={handleSubmit} disabled={isSaving}>
          {isSaving ? (<>
              <lucide_react_1.Loader2 className="mr-2 h-4 w-4 animate-spin"/>
              Saving...
            </>) : (<>
              <lucide_react_1.Save className="mr-2 h-4 w-4"/>
              Save Changes
            </>)}
        </button_1.Button>
      </div>

      <tabs_1.Tabs defaultValue="general">
        <tabs_1.TabsList className="mb-6">
          <tabs_1.TabsTrigger value="general">General</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="social">Social Media</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="appearance">Appearance</tabs_1.TabsTrigger>
        </tabs_1.TabsList>

        <tabs_1.TabsContent value="general">
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle>General Settings</card_1.CardTitle>
              <card_1.CardDescription>
                Configure the basic information for your blog.
              </card_1.CardDescription>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-4">
              <div className="space-y-2">
                <label_1.Label htmlFor="title">Site Title</label_1.Label>
                <input_1.Input id="title" name="title" value={settings.title} onChange={handleChange} placeholder="My Blog"/>
              </div>
              <div className="space-y-2">
                <label_1.Label htmlFor="description">Site Description</label_1.Label>
                <textarea_1.Textarea id="description" name="description" value={settings.description || ""} onChange={handleChange} placeholder="A brief description of your blog" rows={3}/>
              </div>
              <div className="space-y-2">
                <label_1.Label htmlFor="footerText">Footer Text</label_1.Label>
                <input_1.Input id="footerText" name="footerText" value={settings.footerText || ""} onChange={handleChange} placeholder="© 2025 My Blog. All rights reserved."/>
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="social">
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle>Social Media</card_1.CardTitle>
              <card_1.CardDescription>
                Connect your social media accounts.
              </card_1.CardDescription>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-4">
              <div className="space-y-2">
                <label_1.Label htmlFor="socialFacebook">Facebook</label_1.Label>
                <input_1.Input id="socialFacebook" name="socialFacebook" value={settings.socialFacebook || ""} onChange={handleChange} placeholder="https://facebook.com/myblog"/>
              </div>
              <div className="space-y-2">
                <label_1.Label htmlFor="socialTwitter">Twitter</label_1.Label>
                <input_1.Input id="socialTwitter" name="socialTwitter" value={settings.socialTwitter || ""} onChange={handleChange} placeholder="https://twitter.com/myblog"/>
              </div>
              <div className="space-y-2">
                <label_1.Label htmlFor="socialInstagram">Instagram</label_1.Label>
                <input_1.Input id="socialInstagram" name="socialInstagram" value={settings.socialInstagram || ""} onChange={handleChange} placeholder="https://instagram.com/myblog"/>
              </div>
              <div className="space-y-2">
                <label_1.Label htmlFor="socialLinkedIn">LinkedIn</label_1.Label>
                <input_1.Input id="socialLinkedIn" name="socialLinkedIn" value={settings.socialLinkedIn || ""} onChange={handleChange} placeholder="https://linkedin.com/company/myblog"/>
              </div>
              <div className="space-y-2">
                <label_1.Label htmlFor="socialGithub">GitHub</label_1.Label>
                <input_1.Input id="socialGithub" name="socialGithub" value={settings.socialGithub || ""} onChange={handleChange} placeholder="https://github.com/myblog"/>
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="appearance">
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle>Appearance</card_1.CardTitle>
              <card_1.CardDescription>
                Customize the look and feel of your blog.
              </card_1.CardDescription>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-4">
              <div className="space-y-2">
                <label_1.Label htmlFor="logo">Logo URL</label_1.Label>
                <input_1.Input id="logo" name="logo" value={settings.logo || ""} onChange={handleChange} placeholder="https://example.com/logo.png"/>
                <p className="text-xs text-muted-foreground">
                  Link to your logo image (recommended size: 120x40px)
                </p>
              </div>
              <div className="space-y-2">
                <label_1.Label htmlFor="favicon">Favicon URL</label_1.Label>
                <input_1.Input id="favicon" name="favicon" value={settings.favicon || ""} onChange={handleChange} placeholder="https://example.com/favicon.ico"/>
                <p className="text-xs text-muted-foreground">
                  Link to your favicon (recommended size: 32x32px)
                </p>
              </div>
              <div className="pt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Coming soon: Media upload functionality for images and customization of colors and typography.
                </p>
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </tabs_1.TabsContent>
      </tabs_1.Tabs>
    </dashboard_shell_1.default>);
}
