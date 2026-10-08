import { QuizboardApp } from '@/shared/blocks/quizboard/quizboard-app';
import { getMetadata } from '@/shared/lib/seo';

export const generateMetadata = getMetadata({
  title: 'Quizboard Maker | AI Quiz Board Maker for Classrooms and Teams',
  description:
    'Create an AI quiz board from any topic in minutes. Review every question, edit answers, and host a team game online or offline.',
  keywords:
    'quiz board maker, AI quiz game maker, classroom review game, online team quiz',
  canonicalUrl: '/',
});

export default function LandingPage() {
  return (
    <QuizboardApp
      heroTitle="Jeopardy Game Maker for Better Quiz Games"
      heroLede="Create an AI-powered quiz board for classroom review, team training, or a live event. Review every question, then host it online or offline."
    />
  );
}
