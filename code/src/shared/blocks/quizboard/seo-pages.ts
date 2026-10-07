export type QuizboardSeoPage = {
  slug: string;
  keyword: string;
  title: string;
  description: string;
  topic: string;
  h1: string;
  lede: string;
  introHeading: string;
  intro: string;
  sections: Array<{ heading: string; body: string }>;
  related: string[];
};

export const quizboardSeoPages: Record<string, QuizboardSeoPage> = {
  'jeopardy-game-maker': {
    slug: 'jeopardy-game-maker',
    keyword: 'jeopardy game maker',
    title: 'Jeopardy Game Maker | Create Online Quiz Boards in Minutes',
    description:
      'Create a Jeopardy-style quiz board from a topic, review every answer, and host it with teams online or offline.',
    topic: 'Create a Jeopardy-style classroom review game',
    h1: 'Jeopardy Game Maker for Classrooms, Training, and Teams',
    lede: 'Turn one topic into a playable quiz board, review the questions with AI, and host the game on a big screen in minutes.',
    introHeading: 'A faster way to make a Jeopardy-style game',
    intro:
      'Quizboard Maker gives you the familiar categories, points, answers, and team scoring of a Jeopardy-style review game without the spreadsheet or slide-deck setup. Start with a subject, keep the questions that work, and edit anything before you host.',
    sections: [
      {
        heading: 'Create, review, and host in one workflow',
        body: 'Generate a 5 by 5 board, scan all 25 questions in the review view, then launch a presentation screen with team totals, a room code, and optional offline play.',
      },
      {
        heading: 'Built for real classroom and training moments',
        body: 'Use grade level, subject, audience, and time limits to shape the board. Every answer remains editable so a teacher or trainer stays in control of accuracy and tone.',
      },
    ],
    related: [
      'ai-jeopardy-game-maker',
      'classroom-review-game-maker',
      'online-jeopardy',
    ],
  },
  'make-a-jeopardy-game': {
    slug: 'make-a-jeopardy-game',
    keyword: 'make a jeopardy game',
    title: 'Make a Jeopardy Game Online | AI Quiz Board Maker',
    description:
      'Make a playable Jeopardy-style game online from a topic. Edit the questions, save the board, and host it with teams.',
    topic: 'Make a classroom Jeopardy-style game',
    h1: 'Make a Jeopardy Game Online in Three Simple Steps',
    lede: 'Describe the lesson, meeting, or party topic and get a ready-to-edit quiz board you can play with a projector or remote teams.',
    introHeading: 'How to make a Jeopardy game without building slides',
    intro:
      'Choose a topic, review the generated categories and answers, and start the game when the board is ready. You can change a single question or rewrite the whole board before sharing it.',
    sections: [
      {
        heading: '1. Describe your topic and audience',
        body: 'Include the grade, subject, chapter, training goal, or event theme. The generator uses that context to make questions more specific and useful.',
      },
      {
        heading: '2. Review every question',
        body: 'Open the batch review list to check answers, explanations, difficulty, and points. Keep, rewrite, simplify, or increase the challenge of any square.',
      },
    ],
    related: [
      'free-jeopardy-game-maker',
      'how-to-make-a-jeopardy-game',
      'quiz-board-maker',
    ],
  },
  'free-jeopardy-game-maker': {
    slug: 'free-jeopardy-game-maker',
    keyword: 'free jeopardy game maker',
    title: 'Free Jeopardy Game Maker | Build and Host a Quiz Board',
    description:
      'Use a free Jeopardy game maker to generate a 5 by 5 quiz board, edit the questions, and host a review game online.',
    topic: 'Free classroom quiz board game',
    h1: 'Free Jeopardy Game Maker for Your Next Review Game',
    lede: 'Generate a free board from a topic, check every answer, and try the host mode before you decide what to save or share.',
    introHeading: 'What you can do with the free quiz board maker',
    intro:
      'The free workflow is designed for a quick classroom review, training warm-up, or family game. You can generate a board, edit questions, start a game, and test team scoring without manually wiring a presentation.',
    sections: [
      {
        heading: 'Start without a blank template',
        body: 'Enter a topic such as “Grade 7 weather systems” or “new employee safety basics” and receive categories, questions, answers, and point values to review.',
      },
      {
        heading: 'Keep the questions you trust',
        body: 'AI suggestions are drafts, not a replacement for your judgment. Review the answer and explanation for each square before you use the board with students or colleagues.',
      },
    ],
    related: ['jeopardy-game-maker', 'make-a-jeopardy-game', 'templates'],
  },
  'how-to-make-a-jeopardy-game': {
    slug: 'how-to-make-a-jeopardy-game',
    keyword: 'how to make a jeopardy game',
    title: 'How to Make a Jeopardy Game | Online Tutorial and Maker',
    description:
      'Learn how to make a Jeopardy-style game in three steps, from topic and questions to review, team setup, and live hosting.',
    topic: 'How to make a Jeopardy-style review game',
    h1: 'How to Make a Jeopardy Game: A Practical 3-Step Guide',
    lede: 'Follow a simple workflow to create a board, improve the questions, and run a team game without hand-building every slide.',
    introHeading: 'The three parts of a good Jeopardy-style game',
    intro:
      'A useful game needs more than a grid. It needs focused categories, answers that can be checked, and a host view that keeps the room moving. This guide puts those tasks in one workflow.',
    sections: [
      {
        heading: 'Step 1: Choose a focused subject',
        body: 'A specific chapter, skill, or event theme produces better categories than a broad one-word prompt. Add the audience and time limit when you can.',
      },
      {
        heading: 'Step 2: Review for accuracy and difficulty',
        body: 'Check each answer, remove duplicates, and make sure the point values become more challenging. Edit or rewrite any question that is vague.',
      },
      {
        heading: 'Step 3: Host with teams',
        body: 'Use the presentation view to reveal questions and answers, track team totals, and let players join with a room code when you want online participation.',
      },
    ],
    related: [
      'jeopardy-powerpoint',
      'jeopardy-google-slides',
      'online-jeopardy',
    ],
  },
  'jeopardy-powerpoint': {
    slug: 'jeopardy-powerpoint',
    keyword: 'jeopardy powerpoint',
    title:
      'Jeopardy PowerPoint Alternative | Create Editable Quiz Games Online',
    description:
      'Skip the fragile PowerPoint links. Build an editable Jeopardy-style quiz board with questions, answers, and team scoring online.',
    topic: 'PowerPoint Jeopardy alternative for classroom review',
    h1: 'A Jeopardy PowerPoint Alternative That Is Ready to Host',
    lede: 'Create the board online, edit questions in one review list, and host with a presentation view instead of maintaining dozens of linked slides.',
    introHeading: 'Why use an online quiz board instead of PowerPoint?',
    intro:
      'PowerPoint can work, but manually connecting categories, point values, answer slides, and back buttons takes time. An online board keeps the game state, question review, and team scores together.',
    sections: [
      {
        heading: 'Keep the familiar classroom format',
        body: 'The board still uses categories, point values, question reveal, answer reveal, and team totals. The difference is that the interaction is generated and editable instead of hand-linked.',
      },
      {
        heading: 'Use an offline copy when needed',
        body: 'After reviewing the board, download an independent offline game so the host screen does not depend on a live internet connection during class.',
      },
    ],
    related: [
      'how-to-make-a-jeopardy-game',
      'jeopardy-google-slides',
      'jeopardy-game-maker',
    ],
  },
  'jeopardy-google-slides': {
    slug: 'jeopardy-google-slides',
    keyword: 'jeopardy google slides',
    title: 'Jeopardy Google Slides Alternative | Make Online Quiz Boards',
    description:
      'Create an editable Jeopardy-style quiz board without manually wiring Google Slides. Review questions and host with live team scores.',
    topic: 'Google Slides Jeopardy alternative',
    h1: 'Make a Jeopardy Game Without Wiring Google Slides',
    lede: 'Start from a topic, review a complete board, and run the game in a purpose-built host view with room codes and team scoring.',
    introHeading: 'A simpler Google Slides alternative for review games',
    intro:
      'Slides are useful for presenting content, but a quiz board also needs state: which squares are used, what answer is revealed, and how teams are scored. Quizboard Maker handles those interactions for you.',
    sections: [
      {
        heading: 'Build the content before the presentation',
        body: 'Generate a draft, edit the wording and answers, then publish only after the board passes your review. The host screen stays focused on the current question.',
      },
      {
        heading: 'Invite players with a room code',
        body: 'For remote or hybrid groups, share a short code or QR entry instead of asking every player to open and navigate a slide deck.',
      },
    ],
    related: ['jeopardy-powerpoint', 'online-jeopardy', 'team-quiz'],
  },
  'ai-jeopardy-game-maker': {
    slug: 'ai-jeopardy-game-maker',
    keyword: 'AI jeopardy game maker',
    title: 'AI Jeopardy Game Maker | Generate, Review, and Host Quiz Boards',
    description:
      'Use AI to draft a Jeopardy-style game from a topic, review every question and answer, then host it with teams online or offline.',
    topic: 'AI-generated classroom review game',
    h1: 'AI Jeopardy Game Maker with Human Review Built In',
    lede: 'Let AI draft the board, then stay in control of every question, answer, explanation, difficulty level, and point value.',
    introHeading: 'AI should speed up game creation, not remove review',
    intro:
      'Quizboard Maker treats generated questions as editable drafts. You can scan all questions, rewrite one square, adjust difficulty, and check the answer before the game reaches your classroom or team.',
    sections: [
      {
        heading: 'Generate from a topic or learning goal',
        body: 'Describe the subject, audience, language, and time available. The generator turns that context into categories and a progressive set of questions.',
      },
      {
        heading: 'Review with targeted AI actions',
        body: 'Ask for a clearer, easier, harder, or corrected version of one question instead of regenerating the whole board. Accept changes only when they match your intent.',
      },
    ],
    related: ['jeopardy-game-maker', 'classroom-review-game-maker', 'from-pdf'],
  },
  'classroom-review-game-maker': {
    slug: 'classroom-review-game-maker',
    keyword: 'classroom review game maker',
    title: 'Classroom Review Game Maker | AI Quiz Boards for Teachers',
    description:
      'Build a classroom review game for a grade, subject, and chapter. Generate questions, review answers, and host with team scoring.',
    topic: 'Grade 7 classroom review game',
    h1: 'Classroom Review Game Maker for Teachers',
    lede: 'Turn a lesson or unit into an interactive review board that is easy to project, edit, and play with student teams.',
    introHeading: 'Designed around the teacher’s review workflow',
    intro:
      'Start with a grade, subject, chapter, or learning goal. The board gives you a fast first draft while the review tools keep the final questions aligned with your class.',
    sections: [
      {
        heading: 'Make review time active',
        body: 'Use categories to revisit vocabulary, core ideas, real-world examples, and challenge questions. Point values make the progression visible to students.',
      },
      {
        heading: 'Keep the teacher in control',
        body: 'Edit any wording, answer, explanation, or point value. Use the host view to reveal answers, manage teams, undo scoring mistakes, and keep the pace of class.',
      },
    ],
    related: [
      'ai-jeopardy-game-maker',
      'free-jeopardy-game-maker',
      'templates',
    ],
  },
  'quiz-board-maker': {
    slug: 'quiz-board-maker',
    keyword: 'quiz board maker',
    title: 'Quiz Board Maker | Create Custom 5×5 Quiz Games Online',
    description:
      'Create a custom 5 by 5 quiz board from any topic. Edit questions, reveal answers, and host a team game online or offline.',
    topic: 'Quiz board maker demo',
    h1: 'Quiz Board Maker for Custom Team Games',
    lede: 'Build a category-and-points board for class review, training, trivia, or a group event, then host it from the same screen.',
    introHeading: 'What makes a quiz board useful?',
    intro:
      'A good quiz board helps the host make decisions quickly. It shows which squares remain, keeps answers close at hand, and makes team totals easy to adjust without losing the question context.',
    sections: [
      {
        heading: 'Start with a topic, not a blank grid',
        body: 'Describe the knowledge or theme you want to practice. The generator creates the board structure and gives you a complete draft to refine.',
      },
      {
        heading: 'Host in the format your group needs',
        body: 'Project the board for a room, invite remote players with a code, or download an offline copy for a low-connectivity setting.',
      },
    ],
    related: ['jeopardy-game-maker', 'team-quiz', 'templates'],
  },
  templates: {
    slug: 'templates',
    keyword: 'jeopardy game templates',
    title: 'Jeopardy Game Templates | Editable Quiz Boards for Any Topic',
    description:
      'Browse editable quiz game templates for classroom review, training, trivia, and team activities. Customize every question before hosting.',
    topic: 'Quiz game template',
    h1: 'Jeopardy Game Templates You Can Actually Edit',
    lede: 'Start with a proven category structure, then make the questions fit your grade, subject, audience, and event.',
    introHeading: 'Templates are a starting point, not a final answer',
    intro:
      'Use a template when you know the activity format but do not want to design the board from scratch. You can replace questions, adjust point values, and save a version for your group.',
    sections: [
      {
        heading: 'Choose a structure that fits the activity',
        body: 'Classroom review, onboarding, product training, and party trivia all benefit from different category labels and difficulty progressions.',
      },
      {
        heading: 'Customize before you publish',
        body: 'Review answers and explanations, remove anything that does not fit your audience, and share the finished board only after it is ready to host.',
      },
    ],
    related: [
      'classroom-review-game-maker',
      'free-jeopardy-game-maker',
      'quiz-board-maker',
    ],
  },
  'from-pdf': {
    slug: 'from-pdf',
    keyword: 'jeopardy game maker from PDF',
    title: 'Jeopardy Game Maker from PDF | Turn Notes into Review Questions',
    description:
      'Turn a PDF or lesson source into an editable quiz board with reviewable questions, answers, and explanations.',
    topic: 'Quiz game from PDF and lesson notes',
    h1: 'Make a Jeopardy-Style Game from a PDF',
    lede: 'Use your existing lesson notes or training material as the starting point for a review board instead of rewriting everything by hand.',
    introHeading: 'From source material to a reviewable board',
    intro:
      'A source-based workflow can save preparation time, but the generated questions still need a human check. The goal is to surface useful draft questions while keeping the original material and your judgment in the loop.',
    sections: [
      {
        heading: 'Keep questions grounded in the source',
        body: 'Use the document’s concepts, examples, and terminology as the boundaries for the board. Look for unsupported claims or questions that go beyond the material.',
      },
      {
        heading: 'Review before students see the game',
        body: 'Check the answer, explanation, reading level, and point value of every question. Replace any item that is ambiguous or cannot be answered from the source.',
      },
    ],
    related: [
      'ai-jeopardy-game-maker',
      'classroom-review-game-maker',
      'jeopardy-game-maker',
    ],
  },
  'team-quiz': {
    slug: 'team-quiz',
    keyword: 'online team quiz game maker',
    title: 'Online Team Quiz Game Maker | Host Live Games with Room Codes',
    description:
      'Create an online team quiz with a host screen, room code, QR entry, live scores, and editable questions.',
    topic: 'Online team quiz game',
    h1: 'Online Team Quiz Game Maker for Live Groups',
    lede: 'Create the questions, invite teams with a short room code, and keep the game moving with a focused host screen.',
    introHeading: 'A team quiz needs more than a question list',
    intro:
      'The host needs to reveal the right information at the right time, track totals, and recover from a scoring mistake. This workflow keeps the board, question, answer, and team controls connected.',
    sections: [
      {
        heading: 'Invite teams without account friction',
        body: 'Share a room code or QR entry so players can join from their own devices while the host controls the board and scoring.',
      },
      {
        heading: 'Run the room from one presentation view',
        body: 'Reveal the prompt and answer, adjust a team’s current score, undo an accidental change, and return to the board without losing the game state.',
      },
    ],
    related: ['online-jeopardy', 'quiz-board-maker', 'jeopardy-game-maker'],
  },
  'online-jeopardy': {
    slug: 'online-jeopardy',
    keyword: 'online jeopardy',
    title: 'Online Jeopardy Game | Play with Teams from Any Device',
    description:
      'Host an online Jeopardy-style game with a shared board, room code, team scores, and an optional offline mode.',
    topic: 'Online Jeopardy-style team game',
    h1: 'Online Jeopardy-Style Games for Remote and In-Person Teams',
    lede: 'Give the host a clear board and let players join from their own devices with a room code or QR link.',
    introHeading: 'Make an online game feel easy to host',
    intro:
      'Remote groups need more than a video call and a list of questions. The host view should make the board state, answer reveal, and team totals obvious even when players are joining from different devices.',
    sections: [
      {
        heading: 'Use the same board online or offline',
        body: 'Build and review the questions once, then choose the live room mode or download an independent copy for an in-person session without reliable internet.',
      },
      {
        heading: 'Keep the focus on play',
        body: 'The presentation view emphasizes the current question and keeps team controls compact, so the scoreboard does not take over the screen.',
      },
    ],
    related: ['team-quiz', 'jeopardy-game-maker', 'jeopardy-powerpoint'],
  },
};

export const quizboardSeoSlugs = Object.keys(quizboardSeoPages);
