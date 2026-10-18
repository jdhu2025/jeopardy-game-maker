import { QuizboardApp } from '@/shared/blocks/quizboard/quizboard-app';
import { getMetadata } from '@/shared/lib/seo';

export const generateMetadata = getMetadata({
  title: 'Quizboard Maker | Editable Quiz Boards for Classes and Teams',
  description:
    'Create an editable quiz board from a topic. Review every question, edit answers, host on a shared screen, or download an offline game.',
  keywords:
    'quiz board maker, jeopardy game maker, classroom review game, team quiz',
  canonicalUrl: '/',
});

export default function LandingPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Quizboard Maker',
    url: 'https://www.quizboardly.xyz',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    description:
      'Create an editable quiz board from a topic, review every question and answer, then host it on a shared screen or download an offline game.',
    featureList: [
      'Topic-based quiz board drafts',
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
      <QuizboardApp
        heroTitle="Jeopardy Game Maker for Better Quiz Games"
        heroLede="Create an editable quiz board for classroom review, team training, or a live event. Review every question, then host it on a shared screen or download it for offline play."
      />
    </>
  );
}
