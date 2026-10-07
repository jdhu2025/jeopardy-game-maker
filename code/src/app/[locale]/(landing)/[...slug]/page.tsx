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

export const revalidate = 3600;

export function generateStaticParams() {
  // The keyword pages are intentionally English-first. Avoid publishing a
  // second, untranslated URL set that would compete with the canonical pages.
  return quizboardSeoSlugs.map((slug) => ({ locale: defaultLocale, slug }));
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
    const canonical = getCanonicalUrl(locale, quizboardPage.slug);
    return {
      title: quizboardPage.title,
      description: quizboardPage.description,
      keywords: [
        quizboardPage.keyword,
        'quiz board maker',
        'classroom review game',
        'online quiz game',
      ],
      alternates: { canonical },
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
  let canonicalUrl = '';

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
  canonicalUrl =
    locale !== envConfigs.locale
      ? `${envConfigs.app_url}/${locale}/${staticPageSlug}`
      : `${envConfigs.app_url}/${staticPageSlug}`;

  // get static page content
  const staticPage = await getLocalPage({ slug: staticPageSlug, locale });

  // return static page metadata
  if (staticPage) {
    title = staticPage.title || '';
    description = staticPage.description || '';

    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
      },
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
      alternates: {
        canonical: canonicalUrl,
      },
    };
  }

  // 3. return common metadata
  const tc = await getTranslations('common.metadata');

  title = tc('title');
  description = tc('description');

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
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
