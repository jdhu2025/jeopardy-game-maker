import {
  createFallbackGame,
  createTopicProfile,
} from '../src/app/api/quiz/generation-utils';

const templates = [
  {
    topic: 'Grade 7 weather systems: fronts, pressure, and forecasts',
    expectedProfile: 'weather systems',
  },
  {
    topic: 'US history review: causes, evidence, government, and change',
    expectedProfile: 'history and civics',
  },
  {
    topic:
      'Workplace safety fundamentals: hazards, controls, PPE, reporting, and emergency response',
    expectedProfile: 'workplace safety fundamentals',
  },
];

const results = templates.map(({ topic, expectedProfile }) => {
  const profile = createTopicProfile(topic);
  const game = createFallbackGame(topic, 'Classroom', 'English');
  const questions = game.categories.flatMap((category) => category.questions);
  const prompts = questions.map((question) => question.prompt.trim());

  if (!profile.isKnown || !profile.label.includes(expectedProfile)) {
    throw new Error(`${topic}: expected known profile ${expectedProfile}`);
  }
  if (game.categories.length !== 5 || questions.length !== 25) {
    throw new Error(`${topic}: expected a complete 5 by 5 board`);
  }
  if (
    questions.some(
      (question) =>
        !question.prompt.trim() ||
        !question.answer.trim() ||
        !question.explanation.trim()
    )
  ) {
    throw new Error(`${topic}: found an incomplete question`);
  }
  if (new Set(prompts).size !== prompts.length) {
    throw new Error(`${topic}: found duplicate question prompts`);
  }

  return {
    topic,
    profile: profile.label,
    categories: game.categories.length,
    questions: questions.length,
    status: 'starter-generated; human subject review required',
  };
});

console.log(JSON.stringify(results, null, 2));
