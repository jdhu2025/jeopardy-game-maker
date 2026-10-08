import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getThemePage } from '@/core/theme';
import { envConfigs } from '@/config';
import { defaultLocale } from '@/config/locale';
import { QuizboardApp } from '@/shared/blocks/quizboard/quizboard-app';
import { SeoPageContent } from '@/shared/blocks/quizboard/seo-page-content';
import {
  quizboardSeoPages,
  quizboardSeoSlugs,
} from '@/shared/blocks/quizboard/seo-pages';
import { getLocalPage } from '@/shared/models/post';
import { getLocalizedAlternates } from '@/shared/lib/seo';

export const revalidate = 3600;

export function generateStaticParams() {
  // The keyword pages are intentionally English-first. Avoid publishing a
  // second, untranslated URL set that would compete with the canonical pages.
  // Catch-all route parameters must be arrays, even when a route only has one
  // path segment (for example, /en/jeopardy-game-maker).
  return quizboardSeoSlugs.map((slug) => ({
    locale: defaultLocale,
    slug: [slug],
  }));
}

function getCanonicalUrl(locale: string, slug: string) {
  const base = envConfigs.app_url.replace(/\/$/, '');
  return `${base}${locale === defaultLocale ? '' : `/${locale}`}/${slug}`;
}

// dynamic page metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string | string[] }>;
}) {
  const { locale, slug } = await params;
  const quizboardSlug = typeof slug === 'string' ? slug : slug.join('/');
  const quizboardPage = quizboardSeoPages[quizboardSlug];
  if (quizboardPage) {
    // Keyword landing pages are intentionally English-only. Keep every
    // accidental /zh variant out of the index and point it to the English URL.
    const canonical = getCanonicalUrl(defaultLocale, quizboardPage.slug);
    return {
      title: quizboardPage.title,
      description: quizboardPage.description,
      keywords: [
        quizboardPage.keyword,
        'quiz board maker',
        'classroom review game',
        'online quiz game',
      ],
      alternates: {
        canonical,
        languages: { en: canonical, 'x-default': canonical },
      },
      openGraph: {
        type: 'website',
        url: canonical,
        title: quizboardPage.title,
        description: quizboardPage.description,
        siteName: envConfigs.app_name,
      },
      robots: { index: locale === defaultLocale, follow: true },
    };
  }

  // metadata values
  let title = '';
  let description = '';

  // 1. try to get static page metadata from
  // content/pages/**/*.mdx

  // static page slug
  const staticPageSlug =
    typeof slug === 'string' ? slug : (slug as string[]).join('/') || '';

  // filter invalid slug
  if (staticPageSlug.includes('.')) {
    return;
  }

  // build canonical url
  // get static page content
  const staticPage = await getLocalPage({ slug: staticPageSlug, locale });

  // return static page metadata
  if (staticPage) {
    title = staticPage.title || '';
    description = staticPage.description || '';

    return {
      title,
      description,
      alternates: getLocalizedAlternates(`/${staticPageSlug}`, locale),
    };
  }

  // 2. static page not found, try to get dynamic page metadata from
  // src/config/locale/messages/{locale}/pages/**/*.json

  // dynamic page slug
  const dynamicPageSlug =
    typeof slug === 'string' ? slug : (slug as string[]).join('.') || '';

  const messageKey = `pages.${dynamicPageSlug}`;
  const t = await getTranslations({ locale, namespace: messageKey });

  // return dynamic page metadata
  if (t.has('metadata')) {
    title = t.raw('metadata.title');
    description = t.raw('metadata.description');

    return {
      title,
      description,
      alternates: getLocalizedAlternates(`/${staticPageSlug}`, locale),
    };
  }

  // 3. return common metadata
  const tc = await getTranslations('common.metadata');

  title = tc('title');
  description = tc('description');

  return {
    title,
    description,
    alternates: getLocalizedAlternates(`/${staticPageSlug}`, locale),
  };
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string | string[] }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const quizboardSlug =
    typeof slug === 'string' ? slug : (slug as string[]).join('/');
  const quizboardPage = quizboardSeoPages[quizboardSlug];
  if (quizboardPage)
    return (
      <>
        <QuizboardApp
          initialTopic={quizboardPage.topic}
          heroTitle={quizboardPage.h1}
          heroLede={quizboardPage.lede}
        />
        <SeoPageContent slug={quizboardPage.slug} />
      </>
    );

  // 1. try to get static page from
  // content/pages/**/*.mdx

  // static page slug
  const staticPageSlug =
    typeof slug === 'string' ? slug : (slug as string[]).join('/') || '';

  // filter invalid slug
  if (staticPageSlug.includes('.')) {
    return notFound();
  }

  // get static page content
  const staticPage = await getLocalPage({ slug: staticPageSlug, locale });

  // return static page
  if (staticPage) {
    const Page = await getThemePage('static-page');

    return <Page locale={locale} post={staticPage} />;
  }

  // 2. static page not found
  // try to get dynamic page content from
  // src/config/locale/messages/{locale}/pages/**/*.json

  // dynamic page slug
  const dynamicPageSlug =
    typeof slug === 'string' ? slug : (slug as string[]).join('.') || '';

  const messageKey = `pages.${dynamicPageSlug}`;

  try {
    const t = await getTranslations({ locale, namespace: messageKey });

    // return dynamic page
    if (t.has('page')) {
      const Page = await getThemePage('dynamic-page');
      return <Page locale={locale} page={t.raw('page')} />;
    }
  } catch (error) {
    // ignore error if translation not found
    return notFound();
  }

  // 3. page not found
  return notFound();
}
