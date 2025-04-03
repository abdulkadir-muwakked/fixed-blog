//middleware.ts
import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  async function middleware(req) {
    console.log("Request path:", req.nextUrl.pathname);

    // تجاهل طلبات API والملفات الثابتة
    if (
      req.nextUrl.pathname.startsWith('/api') ||
      req.nextUrl.pathname.startsWith('/_next') ||
      req.nextUrl.pathname.includes('.')
    ) {
      console.log("Request is for API or static file, continuing...");
      return NextResponse.next();
    }

    // التحقق من الحاجة للإعداد فقط للمسارات غير العامة
    if (!['/setup', '/login', '/register'].includes(req.nextUrl.pathname)) {
      try {
        console.log("Checking setup status...");
        const setupCheck = await fetch(
          new URL('/api/auth/setup', req.nextUrl.origin)
        );
        const { setupRequired } = await setupCheck.json();
        console.log("Setup required:", setupRequired);

        if (setupRequired && req.nextUrl.pathname !== '/setup') {
          console.log("Redirecting to /setup...");
          return NextResponse.redirect(new URL('/setup', req.nextUrl.origin));
        }
      } catch (error) {
        console.error('Setup check failed:', error);
      }
    }

    // لا تقم بإعادة التوجيه إلى صفحة login حتى لو كان هناك مستخدم ADMIN
    if (req.nextUrl.pathname === '/setup') {
      console.log("Allowing access to /setup...");
      return NextResponse.next(); // إبقاء المستخدم في صفحة setup
    }

    console.log("Proceeding to next page...");
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
      error: '/login',
    },
  }
);

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
