import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

// Define all supported locales
export const locales = ['en', 'ar'];

export default getRequestConfig(async ({locale}) => {
  // Validate that the locale is supported
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
