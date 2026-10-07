import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getThemePage } from '@/core/theme';
import { envConfigs } from '@/config';
import { getLocalPage } from '@/shared/models/post';
import { QuizboardApp } from '@/shared/blocks/quizboard/quizboard-app';

export const revalidate = 3600;

const quizboardPages: Record<string, { title: string; description: string; topic: string }> = {
  'make-a-jeopardy-game': { title: 'Make a Jeopardy Game Online | Quizboard Maker', description: 'Make a playable quiz board from one topic, then edit and host it online.', topic: 'Create a classroom review game' },
  'free-jeopardy-game-maker': { title: 'Free Jeopardy Game Maker | Quizboard Maker', description: 'Generate a free 5 by 5 quiz board and host it with your team.', topic: 'Free quiz board game' },
  'how-to-make-a-jeopardy-game': { title: 'How to Make a Jeopardy Game | Quizboard Maker', description: 'Follow a simple three-step workflow to create and host a quiz board.', topic: 'How to make a classroom quiz game' },
  'jeopardy-powerpoint': { title: 'Jeopardy PowerPoint Alternative | Quizboard Maker', description: 'Move from hand-built PowerPoint boards to an editable online quiz game.', topic: 'PowerPoint review game alternative' },
  'jeopardy-google-slides': { title: 'Jeopardy Google Slides Alternative | Quizboard Maker', description: 'Create an online quiz board without manually wiring Google Slides.', topic: 'Google Slides quiz game alternative' },
  'ai-jeopardy-game-maker': { title: 'AI Jeopardy Game Maker | Quizboard Maker', description: 'Use AI to draft a review board, inspect every answer, and host the game.', topic: 'AI-generated classroom review game' },
  'classroom-review-game-maker': { title: 'Classroom Review Game Maker | Quizboard Maker', description: 'Build a review game for a grade, subject, chapter, and class period.', topic: 'Grade 7 classroom review game' },
  'quiz-board-maker': { title: 'Quiz Board Maker | Quizboard Maker', description: 'Create an editable 5 by 5 quiz board from a topic in minutes.', topic: 'Quiz board maker demo' },
  'templates': { title: 'Quiz Game Templates | Quizboard Maker', description: 'Start from a review game template, then make every question your own.', topic: 'Quiz game template' },
  'from-pdf': { title: 'Quiz Game Maker from PDF | Quizboard Maker', description: 'Turn source material into a review board with answer review and citations.', topic: 'Quiz game from source material' },
  'team-quiz': { title: 'Online Team Quiz Maker | Quizboard Maker', description: 'Create a team quiz with a host screen, room code, and live scores.', topic: 'Online team quiz' },
  'online-jeopardy': { title: 'Online Jeopardy Game | Quizboard Maker', description: 'Host a team quiz online with a board, room code, and live scores.', topic: 'Online team quiz game' },
};

// dynamic page metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string | string[] }>;
}) {
  const { locale, slug } = await params;
  const quizboardPage = quizboardPages[typeof slug === 'string' ? slug : (slug as string[])[0]];
  if (quizboardPage) return { title: quizboardPage.title, description: quizboardPage.description };

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

  const quizboardSlug = typeof slug === 'string' ? slug : (slug as string[]).join('/');
  const quizboardPage = quizboardPages[quizboardSlug];
  if (quizboardPage) return <QuizboardApp initialTopic={quizboardPage.topic} />;

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
