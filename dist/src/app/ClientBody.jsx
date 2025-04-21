"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ClientBody;
const react_1 = require("react");
function ClientBody({ children, }) {
    // Remove any extension-added classes during hydration
    (0, react_1.useEffect)(() => {
        // This runs only on the client after hydration
        document.body.className = "antialiased";
    }, []);
    return (<body className="antialiased" suppressHydrationWarning>
      {children}
    </body>);
}
