import "@/app/globals.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import NavBar from "@/components/layout/nav-bar";
import Footer from "@/components/layout/footer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import type { Viewport } from "next";
import ClientProviders from "./providers";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "موقع طبي",
  description:
    ".موقع متخصص بالمقلات الطبية\nمقلات طبية عن عمليات الطبية والتجملية في تركيا",
  keywords: ["مقالات طبية", "العلاج في تركيا", "مدونة", "تجميل"],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};
export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <Head>
        <meta
          name="google-site-verification"
          content="IrhvVIjS-qyMMdgxEVHsPiFAsrMNq7NWvz5Asj0ELn8"
        />
        <meta
          name="google-site-verification"
          content="nwyop0KikGHz2UQAaTDP6lqYstkKdgUdK5rggWTxAVg"
        />
      </Head>
      <body
        className={cn(
          "min-h-screen bg-background antialiased",
          inter.className
        )}
      >
        <ClientProviders session={session}>
          <div className="relative flex min-h-screen flex-col">
            <NavBar session={session} />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ClientProviders>
        <Toaster />
      </body>
    </html>
  );
}
