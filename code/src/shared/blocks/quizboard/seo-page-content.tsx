import Link from 'next/link';

import { envConfigs } from '@/config';

import styles from './seo-page-content.module.css';
import { indexableQuizboardSeoSlugs, quizboardSeoPages } from './seo-pages';

export function SeoPageContent({ slug }: { slug: string }) {
  const page = quizboardSeoPages[slug];
  if (!page) return null;

  const baseUrl = envConfigs.app_url.replace(/\/$/, '');
  const pageUrl = `${baseUrl}/${page.slug}`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: page.title,
        description: page.description,
        isPartOf: { '@id': `${baseUrl}#website` },
        about: { '@id': `${baseUrl}#quizboard-maker` },
      },
      {
        '@type': 'WebApplication',
        '@id': `${baseUrl}#quizboard-maker`,
        name: 'Quizboard Maker',
        url: baseUrl,
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web',
        description:
          'A web application for creating, reviewing, and hosting editable quiz boards.',
        featureList: [
          'Topic-based quiz board drafts',
          'Question and answer review',
          'Team scoring and host mode',
          'Offline quiz game download',
        ],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Quizboard Maker',
            item: baseUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: page.keyword,
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section
        className={styles.wrapper}
        aria-labelledby={`${slug}-content-title`}
      >
        <div className={styles.inner}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>
              {page.contentEyebrow || 'QUIZ BOARD WORKFLOW'}
            </p>
            <h2 id={`${slug}-content-title`}>{page.introHeading}</h2>
            <p className={styles.intro}>{page.intro}</p>
            <div className={styles.grid}>
              {page.sections.map((section) => (
                <article key={section.heading} className={styles.card}>
                  <h3>{section.heading}</h3>
                  <p>{section.body}</p>
                </article>
              ))}
            </div>
            {page.details && page.details.length > 0 && (
              <div className={styles.details}>
                {page.details.map((detail) => (
                  <article key={detail.heading}>
                    <h3>{detail.heading}</h3>
                    <p>{detail.body}</p>
                    {detail.bullets && detail.bullets.length > 0 && (
                      <ul>
                        {detail.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </article>
                ))}
              </div>
            )}
            {page.references && page.references.length > 0 && (
              <section
                className={styles.references}
                aria-labelledby={`${slug}-references`}
              >
                <h2 id={`${slug}-references`}>
                  {page.referencesHeading || 'Useful references'}
                </h2>
                <div className={styles.referenceList}>
                  {page.references.map((reference) => (
                    <article key={reference.url}>
                      <h3>
                        <a
                          href={reference.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {reference.label}
                        </a>
                      </h3>
                      <p>{reference.description}</p>
                    </article>
                  ))}
                </div>
              </section>
            )}
            {page.faqs && page.faqs.length > 0 && (
              <section className={styles.faq} aria-labelledby={`${slug}-faq`}>
                <h2 id={`${slug}-faq`}>
                  {page.faqHeading || 'Questions about this quiz workflow'}
                </h2>
                {page.faqs.map((faq) => (
                  <details key={faq.question}>
                    <summary>{faq.question}</summary>
                    <p>{faq.answer}</p>
                  </details>
                ))}
              </section>
            )}
            <nav
              className={styles.related}
              aria-label="Related quiz maker pages"
            >
              <h2>{page.relatedHeading || 'Explore related quiz pages'}</h2>
              <div>
                {page.related
                  .filter((relatedSlug) =>
                    indexableQuizboardSeoSlugs.includes(
                      relatedSlug as (typeof indexableQuizboardSeoSlugs)[number]
                    )
                  )
                  .map((relatedSlug) => {
                    const related = quizboardSeoPages[relatedSlug];
                    if (!related) return null;
                    return (
                      <Link key={related.slug} href={`/${related.slug}`}>
                        {related.keyword}
                      </Link>
                    );
                  })}
              </div>
            </nav>
          </div>
        </div>
      </section>
    </>
  );
}
