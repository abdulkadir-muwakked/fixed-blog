import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// Footer Management
export async function GETFooter() {
  const footer = await prisma.footer.findFirst();
  return NextResponse.json(footer);
}

export async function PUTFooter(req: Request) {
  const body = await req.json();
  const updatedFooter = await prisma.footer.upsert({
    where: { id: body.id || "default" },
    update: { content: body.content },
    create: { content: body.content },
  });
  return NextResponse.json(updatedFooter);
}

// Navbar Management
export async function GETNavbar() {
  const navbar = await prisma.navbar.findFirst();
  return NextResponse.json(navbar);
}

export async function PUTNavbar(req: Request) {
  const body = await req.json();
  const updatedNavbar = await prisma.navbar.upsert({
    where: { id: body.id || "default" },
    update: { links: body.links },
    create: { links: body.links },
  });
  return NextResponse.json(updatedNavbar);
}

// Banner Management
export async function GETBanners() {
  const banners = await prisma.banner.findMany();
  return NextResponse.json(banners);
}

export async function POSTBanner(req: Request) {
  const body = await req.json();
  const newBanner = await prisma.banner.create({
    data: {
      title: body.title,
      imageUrl: body.imageUrl,
      link: body.link,
    },
  });
  return NextResponse.json(newBanner);
}

export async function DELETEBanner(req: Request) {
  const { id } = await req.json();
  await prisma.banner.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

// Updated API to handle contactEmail and contactPhone fields

export async function GET(req: Request) {
  const settings = await prisma.siteSetting.findFirst();
  return NextResponse.json({ settings });
}

export async function POST(req: Request) {
  const body = await req.json();

  const updatedSettings = await prisma.siteSetting.upsert({
    where: { id: body.id || "default" },
    update: {
      title: body.title,
      description: body.description,
      logo: body.logo,
      favicon: body.favicon,
      socialFacebook: body.socialFacebook,
      socialTwitter: body.socialTwitter,
      socialInstagram: body.socialInstagram,
      socialLinkedIn: body.socialLinkedIn,
      socialGithub: body.socialGithub,
      footerText: body.footerText,
      contactEmail: body.contactEmail, // New field
      contactPhone: body.contactPhone, // New field
    },
    create: {
      title: body.title,
      description: body.description,
      logo: body.logo,
      favicon: body.favicon,
      socialFacebook: body.socialFacebook,
      socialTwitter: body.socialTwitter,
      socialInstagram: body.socialInstagram,
      socialLinkedIn: body.socialLinkedIn,
      socialGithub: body.socialGithub,
      footerText: body.footerText,
      contactEmail: body.contactEmail, // New field
      contactPhone: body.contactPhone, // New field
    },
  });

  return NextResponse.json({ settings: updatedSettings });
}
