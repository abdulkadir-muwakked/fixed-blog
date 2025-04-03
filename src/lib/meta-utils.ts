import { type Metadata } from 'next';

export type MetadataProps = {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  // Additional optional properties
  type?: 'website' | 'article' | 'profile';
  locale?: 'en' | 'ar';
  keywords?: string[];
  noIndex?: boolean;
};

/**
 * Generates consistent metadata for all pages
 */
export function constructMetadata({
  title,
  description,
  image,
  url,
  type = 'website',
  locale = 'en',
  keywords = [],
  noIndex = false,
}: MetadataProps): Metadata {
  const baseTitle = 'Next.js Blog';
  const baseDescription = 'A blog built with Next.js, React, and Tailwind CSS';
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://example.com';
  const baseImage = `${baseUrl}/images/og-image.jpg`;

  const formattedTitle = title ? `${title} | ${baseTitle}` : baseTitle;

  return {
    title: formattedTitle,
    description: description || baseDescription,
    openGraph: {
      title: formattedTitle,
      description: description || baseDescription,
      url: url || baseUrl,
      siteName: baseTitle,
      images: [
        {
          url: image || baseImage,
          width: 1200,
          height: 630,
          alt: formattedTitle,
        },
      ],
      locale,
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: formattedTitle,
      description: description || baseDescription,
      images: [image || baseImage],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
      },
    },
    alternates: {
      canonical: url || baseUrl,
      languages: {
        'en': `${baseUrl}/en`,
        'ar': `${baseUrl}/ar`,
      },
    },
    keywords: [
      'Next.js',
      'React',
      'Blog',
      'Tailwind CSS',
      ...keywords,
    ],
  };
}
