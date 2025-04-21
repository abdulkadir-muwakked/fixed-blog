"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RegisterPage;
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const lucide_react_1 = require("lucide-react");
const navigation_1 = require("next/navigation");
const react_1 = require("next-auth/react");
function RegisterPage() {
    const router = (0, navigation_1.useRouter)();
    const { data: session, status } = (0, react_1.useSession)();
    // Handle loading state
    if (status === "loading") {
        return (<div className="container flex h-screen max-w-screen-md flex-col items-center justify-center py-12">
        <div className="flex items-center gap-2">
          <lucide_react_1.Loader2 className="h-6 w-6 animate-spin"/>
          <span>Checking authentication...</span>
        </div>
      </div>);
    }
    // If not authenticated
    if (!session) {
        return (<div className="container flex h-screen max-w-screen-md flex-col items-center justify-center py-12">
        <card_1.Card className="w-full max-w-md">
          <card_1.CardHeader className="space-y-1">
            <card_1.CardTitle className="text-2xl font-bold text-center">
              Access Denied
            </card_1.CardTitle>
            <card_1.CardDescription className="text-center">
              You must be logged in to access this page
            </card_1.CardDescription>
          </card_1.CardHeader>
          <card_1.CardFooter className="flex justify-center">
            <button_1.Button onClick={() => router.push("/login")}>
              Go to Login
            </button_1.Button>
          </card_1.CardFooter>
        </card_1.Card>
      </div>);
    }
    // Main content for authenticated users
    return (<div className="container flex h-screen max-w-screen-md flex-col items-center justify-center py-12">
      <card_1.Card className="w-full max-w-md">
        <card_1.CardHeader className="space-y-1">
          <card_1.CardTitle className="text-2xl font-bold text-center">
            Registration Disabled
          </card_1.CardTitle>
          <card_1.CardDescription className="text-center">
            Public registration is not available for this application
          </card_1.CardDescription>
        </card_1.CardHeader>
        <card_1.CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center space-y-4 py-6">
            <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-900">
              <lucide_react_1.AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400"/>
            </div>
            <div className="text-center">
              <p className="font-medium">Administrator Access Only</p>
              <p className="text-sm text-muted-foreground mt-1">
                This is a restricted admin portal. New accounts can only be created by existing administrators.
              </p>
            </div>
          </div>
        </card_1.CardContent>
        <card_1.CardFooter className="flex justify-center">
          <button_1.Button variant="outline" onClick={() => router.push("/dashboard")}>
            Go to Dashboard
          </button_1.Button>
        </card_1.CardFooter>
      </card_1.Card>
    </div>);
}
