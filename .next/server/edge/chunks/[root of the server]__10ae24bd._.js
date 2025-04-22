(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["chunks/[root of the server]__10ae24bd._.js", {

"[externals]/node:async_hooks [external] (node:async_hooks, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}}),
"[externals]/node:buffer [external] (node:buffer, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}}),
"[project]/middleware.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
//middleware.ts
__turbopack_context__.s({});
;
 // Temporarily disable middleware by commenting out the export
 // export default withAuth(
 //   async function middleware(req) {
 //     console.log("Request path:", req.nextUrl.pathname);
 //     if (!req.nextUrl.origin) {
 //       console.error("Request origin is missing");
 //       return NextResponse.json({ error: "Request origin is missing" }, { status: 400 });
 //     }
 //     // تجاهل طلبات API والملفات الثابتة
 //     if (
 //       req.nextUrl.pathname.startsWith("/api") ||
 //       req.nextUrl.pathname.startsWith("/_next") ||
 //       req.nextUrl.pathname.includes(".")
 //     ) {
 //       console.log("Request is for API or static file, continuing...");
 //       return NextResponse.next();
 //     }
 //     // التحقق من الحاجة للإعداد فقط للمسارات غير العامة
 //     if (!["/setup", "/login", "/register"].includes(req.nextUrl.pathname)) {
 //       try {
 //         console.log("Checking setup status...");
 //         const setupCheck = await fetch(
 //           new URL("/api/auth/setup", req.nextUrl.origin)
 //         );
 //         const { setupRequired } = await setupCheck.json();
 //         console.log("Setup required:", setupRequired);
 //         if (setupRequired && req.nextUrl.pathname !== "/setup") {
 //           console.log("Redirecting to /setup...");
 //           return NextResponse.redirect(new URL("/setup", req.nextUrl.origin));
 //         }
 //       } catch (error) {
 //         console.error("Setup check failed:", error);
 //       }
 //     }
 //     // لا تقم بإعادة التوجيه إلى صفحة login حتى لو كان هناك مستخدم ADMIN
 //     if (req.nextUrl.pathname === "/setup") {
 //       console.log("Allowing access to /setup...");
 //       return NextResponse.next(); // إبقاء المستخدم في صفحة setup
 //     }
 //     // Restrict access to dashboard for admins only
 //     if (req.nextUrl.pathname.startsWith("/dashboard")) {
 //       const token = req.cookies.get("next-auth.session-token")?.value; // Access the value property of the cookie
 //       if (!token) {
 //         console.log("No token found, redirecting to login...");
 //         return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
 //       }
 //       try {
 //         const user = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
 //         // Check if the user exists in the database
 //         const userExists = await fetch(
 //           new URL("/api/users/admins", req.nextUrl.origin),
 //           {
 //             method: "POST",
 //             headers: { "Content-Type": "application/json" },
 //             body: JSON.stringify({ email: user.email }),
 //           }
 //         ).then((res) => res.json());
 //         if (!userExists.exists) {
 //           console.log(
 //             "User does not exist in the database, redirecting to login..."
 //           );
 //           return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
 //         }
 //         if (user.role !== "ADMIN") {
 //           console.log("User is not an admin, redirecting to login...");
 //           return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
 //         }
 //       } catch (error) {
 //         console.error("Failed to decode token or check user existence:", error);
 //         return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
 //       }
 //     }
 //     console.log("Proceeding to next page...");
 //     return NextResponse.next();
 //   },
 //   {
 //     callbacks: {
 //       authorized: ({ token }) => !!token,
 //     },
 //     pages: {
 //       signIn: "/login",
 //       error: "/login",
 //     },
 //   }
 // );
 // export const config = {
 //   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
 // };
}}),
}]);

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__10ae24bd._.js.map