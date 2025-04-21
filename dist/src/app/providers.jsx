"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ClientProviders;
const react_1 = require("next-auth/react");
const theme_provider_1 = require("@/components/theme-provider");
function ClientProviders({ children, session, }) {
    return (<react_1.SessionProvider session={session}>
      <theme_provider_1.ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
      </theme_provider_1.ThemeProvider>
    </react_1.SessionProvider>);
}
