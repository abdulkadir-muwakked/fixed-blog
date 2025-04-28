import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Share2,
  ChevronLeft,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import prisma from "@/lib/db";
import { useEffect, useState } from "react";
import BlogPost from "./BlogPost";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    select: { slug: true },
  });

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: true,
      categories: { include: { category: true } },
      comments: { include: { user: true } },
    },
  });

  if (!post) notFound();

  return <BlogPost post={post} />;
}
