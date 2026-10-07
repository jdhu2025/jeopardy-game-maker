import Link from 'next/link';

import styles from './seo-page-content.module.css';
import { quizboardSeoPages } from './seo-pages';

export function SeoPageContent({ slug }: { slug: string }) {
  const page = quizboardSeoPages[slug];
  if (!page) return null;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Quizboard Maker',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    description: page.description,
    featureList: [
      'AI quiz board generation',
      'Question and answer review',
      'Team scoring and host mode',
      'Offline quiz game download',
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
            <p className={styles.eyebrow}>ABOUT THIS QUIZ BOARD WORKFLOW</p>
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
            <nav
              className={styles.related}
              aria-label="Related quiz maker pages"
            >
              <h2>Explore related quiz maker pages</h2>
              <div>
                {page.related.map((relatedSlug) => {
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
