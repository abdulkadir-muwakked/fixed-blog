"use strict";
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
exports.viewport = exports.metadata = void 0;
exports.default = RootLayout;
require("@/app/globals.css");
const google_1 = require("next/font/google");
const utils_1 = require("@/lib/utils");
const sonner_1 = require("sonner");
const nav_bar_1 = __importDefault(require("@/components/layout/nav-bar"));
const footer_1 = __importDefault(require("@/components/layout/footer"));
const next_auth_1 = require("next-auth");
const config_1 = require("@/lib/auth/config");
const providers_1 = __importDefault(require("./providers"));
const inter = (0, google_1.Inter)({ subsets: ["latin"] });
exports.metadata = {
    title: "مدونة Next.js",
    description: "مدونة مبنية بتقنيات Next.js و React و Tailwind CSS",
    keywords: ["Next.js", "React", "مدونة", "Tailwind CSS"],
};
exports.viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
};
function RootLayout(_a) {
    return __awaiter(this, arguments, void 0, function* ({ children, }) {
        const session = yield (0, next_auth_1.getServerSession)(config_1.authOptions);
        return (<html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={(0, utils_1.cn)("min-h-screen bg-background antialiased", inter.className)}>
        <providers_1.default session={session}>
          <div className="relative flex min-h-screen flex-col">
            <nav_bar_1.default session={session}/>
            <main className="flex-1">{children}</main>
            <footer_1.default />
          </div>
        </providers_1.default>
        <sonner_1.Toaster />
      </body>
    </html>);
    });
}
