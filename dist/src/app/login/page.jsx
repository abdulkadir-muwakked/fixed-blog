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
exports.default = LoginPage;
const link_1 = __importDefault(require("next/link"));
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const input_1 = require("@/components/ui/input");
const label_1 = require("@/components/ui/label");
const lucide_react_1 = require("lucide-react");
const react_2 = require("next-auth/react");
const navigation_1 = require("next/navigation");
const sonner_1 = require("sonner");
function LoginPage() {
    const router = (0, navigation_1.useRouter)();
    const searchParams = (0, navigation_1.useSearchParams)();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [formData, setFormData] = (0, react_1.useState)({
        email: "",
        password: "",
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => (Object.assign(Object.assign({}, prev), { [name]: value })));
    };
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        // Prevent rapid successive attempts
        if (isLoading)
            return;
        setIsLoading(true);
        try {
            const result = yield (0, react_2.signIn)("credentials", {
                redirect: false,
                email: formData.email,
                password: formData.password,
                callbackUrl: callbackUrl || "/dashboard"
            });
            if (result === null || result === void 0 ? void 0 : result.error) {
                // Add delay on failed attempt
                yield new Promise(resolve => setTimeout(resolve, 1000));
                sonner_1.toast.error("Invalid email or password");
            }
            else {
                router.push(callbackUrl || "/dashboard");
            }
        }
        catch (error) {
            sonner_1.toast.error("Something went wrong");
        }
        finally {
            setIsLoading(false);
        }
    });
    const handleOAuthSignIn = (provider) => {
        setIsLoading(true);
        (0, react_2.signIn)(provider, { callbackUrl });
    };
    return (<div className="container flex h-screen max-w-screen-md flex-col items-center justify-center py-12">
      <card_1.Card className="w-full max-w-md">
        <card_1.CardHeader className="space-y-1">
          <card_1.CardTitle className="text-2xl font-bold text-center">Login</card_1.CardTitle>
          <card_1.CardDescription className="text-center">
            Enter your credentials to access your account
          </card_1.CardDescription>
        </card_1.CardHeader>
        <card_1.CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label_1.Label htmlFor="email">Email</label_1.Label>
              <input_1.Input id="email" name="email" placeholder="m@example.com" required type="email" value={formData.email} onChange={handleChange} disabled={isLoading}/>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label_1.Label htmlFor="password">Password</label_1.Label>
                <link_1.default href="/forgot-password" className="text-sm text-primary underline-offset-4 hover:underline">
                  Forgot password?
                </link_1.default>
              </div>
              <input_1.Input id="password" name="password" required type="password" value={formData.password} onChange={handleChange} disabled={isLoading}/>
            </div>
            <button_1.Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </button_1.Button>
          </form>

          <div className="relative flex justify-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"/>
            </div>
            <span className="relative bg-background px-3 text-xs uppercase text-muted-foreground">
              Or continue with
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button_1.Button variant="outline" type="button" disabled={isLoading} onClick={() => handleOAuthSignIn("github")}>
              <lucide_react_1.Github className="mr-2 h-4 w-4"/>
              Github
            </button_1.Button>
            <button_1.Button variant="outline" type="button" disabled={isLoading} onClick={() => handleOAuthSignIn("google")}>
              <lucide_react_1.Mail className="mr-2 h-4 w-4"/>
              Google
            </button_1.Button>
          </div>
        </card_1.CardContent>
        <card_1.CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{" "}
            <link_1.default href="/register" className="text-primary underline-offset-4 hover:underline">
              Register
            </link_1.default>
          </div>
          <div className="text-xs text-center text-muted-foreground">
            By signing in, you agree to our{" "}
            <link_1.default href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </link_1.default>{" "}
            and{" "}
            <link_1.default href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </link_1.default>
            .
          </div>
        </card_1.CardFooter>
      </card_1.Card>
    </div>);
}
