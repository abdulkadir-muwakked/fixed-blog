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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SetupPage;
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const input_1 = require("@/components/ui/input");
const label_1 = require("@/components/ui/label");
const navigation_1 = require("next/navigation");
const sonner_1 = require("sonner");
const lucide_react_1 = require("lucide-react");
function SetupPage() {
    const router = (0, navigation_1.useRouter)();
    const [formData, setFormData] = (0, react_1.useState)({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [isCheckingSetup, setIsCheckingSetup] = (0, react_1.useState)(true);
    const [setupRequired, setSetupRequired] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        function checkSetupStatus() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const response = yield fetch("/api/auth/setup");
                    const data = yield response.json();
                    if (!data.setupRequired) {
                        // If setup is not required, redirect to login
                        router.push("/login");
                    }
                    else {
                        setSetupRequired(true);
                    }
                }
                catch (error) {
                    console.error("Failed to check setup status:", error);
                    sonner_1.toast.error("Failed to check setup status");
                }
                finally {
                    setIsCheckingSetup(false);
                }
            });
        }
        checkSetupStatus();
    }, [router]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => (Object.assign(Object.assign({}, prev), { [name]: value })));
    };
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        // Validation
        if (formData.password !== formData.confirmPassword) {
            sonner_1.toast.error("Passwords do not match");
            return;
        }
        if (formData.password.length < 8) {
            sonner_1.toast.error("Password must be at least 8 characters");
            return;
        }
        setIsLoading(true);
        try {
            const response = yield fetch("/api/auth/setup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });
            const data = yield response.json();
            if (!response.ok) {
                throw new Error(data.error || "Setup failed");
            }
            sonner_1.toast.success("Admin account created successfully");
            // Redirect to login page after successful setup
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        }
        catch (error) {
            console.error("Setup error:", error);
            sonner_1.toast.error(error instanceof Error ? error.message : "Setup failed");
        }
        finally {
            setIsLoading(false);
        }
    });
    if (isCheckingSetup) {
        return (<div className="container flex h-screen max-w-screen-md flex-col items-center justify-center py-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          <lucide_react_1.Loader2 className="h-8 w-8 animate-spin text-primary"/>
          <p className="text-muted-foreground">Checking setup status...</p>
        </div>
      </div>);
    }
    if (!setupRequired) {
        return (<div className="container flex h-screen max-w-screen-md flex-col items-center justify-center py-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          <lucide_react_1.Check className="h-8 w-8 text-green-500"/>
          <p className="text-muted-foreground">Setup already completed. Redirecting...</p>
        </div>
      </div>);
    }
    return (<div className="container flex h-screen max-w-screen-md flex-col items-center justify-center py-12">
      <card_1.Card className="w-full max-w-md">
        <card_1.CardHeader className="space-y-1">
          <card_1.CardTitle className="text-2xl font-bold text-center">Admin Setup</card_1.CardTitle>
          <card_1.CardDescription className="text-center">
            Create the root administrator account for your blog
          </card_1.CardDescription>
        </card_1.CardHeader>
        <card_1.CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label_1.Label htmlFor="name">Name</label_1.Label>
              <input_1.Input id="name" name="name" placeholder="John Doe" required value={formData.name} onChange={handleChange} disabled={isLoading}/>
            </div>
            <div className="space-y-2">
              <label_1.Label htmlFor="email">Email</label_1.Label>
              <input_1.Input id="email" name="email" placeholder="admin@example.com" required type="email" value={formData.email} onChange={handleChange} disabled={isLoading}/>
            </div>
            <div className="space-y-2">
              <label_1.Label htmlFor="password">Password</label_1.Label>
              <input_1.Input id="password" name="password" required type="password" value={formData.password} onChange={handleChange} disabled={isLoading}/>
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters long
              </p>
            </div>
            <div className="space-y-2">
              <label_1.Label htmlFor="confirmPassword">Confirm Password</label_1.Label>
              <input_1.Input id="confirmPassword" name="confirmPassword" required type="password" value={formData.confirmPassword} onChange={handleChange} disabled={isLoading}/>
            </div>
            <button_1.Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Admin Account"}
            </button_1.Button>
          </form>
        </card_1.CardContent>
        <card_1.CardFooter>
          <p className="text-xs text-center w-full text-muted-foreground">
            This account will have full administrative privileges. Please keep your credentials safe.
          </p>
        </card_1.CardFooter>
      </card_1.Card>
    </div>);
}
