'use client';

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type TextareaHTMLAttributes,
} from 'react';

import { buildOfflineGameHtml } from './offline-game';
import {
  inferQuestionMedia,
  normalizeQuestionMedia,
  type QuestionMedia,
} from './question-media';
import styles from './quizboard-app.module.css';

const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

type Question = {
  id: string;
  value: number;
  prompt: string;
  answer: string;
  explanation: string;
  status?: string;
  difficulty?: string;
  category?: string;
  topicConcept?: string;
  grounding?: string;
  media?: QuestionMedia;
};
type Category = { name: string; hint?: string; questions: Question[] };
type Game = {
  title: string;
  topic: string;
  sourceTopic?: string;
  audience: string;
  language: string;
  mode?: string;
  notice?: string;
  topicSummary?: string;
  categories: Category[];
};
type ScoreEvent = {
  id: string;
  teamIndex: number;
  teamName: string;
  questionId: string;
  category: string;
  prompt: string;
  value: number;
  delta: number;
  timestamp: number;
};
const roomCode = 'QZ-4821';
const topicSuggestions = [
  {
    label: 'Budgeting & Credit',
    value: 'Budgeting and credit basics for middle school',
  },
  {
    label: 'Proportional Relationships',
    value: 'Grade 7 proportional relationships',
  },
  {
    label: 'Moon Phases, Gravity & Tides',
    value: 'Moon phases, gravity, and tides',
  },
  { label: 'Cell Biology', value: 'Biology: cell structure and function' },
  { label: 'Weather Systems', value: 'Grade 7 weather systems' },
  {
    label: 'World Geography',
    value: 'World geography: maps, climate, and migration',
  },
  { label: 'Music Theory', value: 'Music theory: rhythm, scales, and harmony' },
];

function AutosizeTextarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const value = props.value;
  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const resize = () => {
      // Reset before measuring so shortening text also shrinks the field. The
      // CSS width stays fluid; only the height follows the rendered content.
      element.style.height = '0px';
      element.style.height = `${Math.min(420, Math.max(78, element.scrollHeight))}px`;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [value]);
  return <textarea {...props} ref={ref} />;
}

function enrichGame(nextGame: Game): Game {
  return {
    ...nextGame,
    categories: nextGame.categories.map((category) => ({
      ...category,
      questions: category.questions.map((question) => ({
        ...question,
        media: inferQuestionMedia(
          nextGame.topic,
          question.prompt,
          normalizeQuestionMedia(question.media)
        ),
      })),
    })),
  };
}

export function QuizboardApp({
  initialTopic = 'Grade 7 weather systems, 30-minute review',
  initialGame,
  initialShareId,
  canDelete = false,
  heroTitle = 'Turn a topic into a room full of aha moments.',
  heroLede = 'Build a board for class review, team training, or your next big get-together. Start with one sentence, then make every question yours.',
}: {
  initialTopic?: string;
  initialGame?: Game;
  initialShareId?: string;
  canDelete?: boolean;
  heroTitle?: string;
  heroLede?: string;
}) {
  const [topic, setTopic] = useState(initialTopic);
  const [audience, setAudience] = useState('Classroom');
  const [language, setLanguage] = useState('English');
  const [game, setGame] = useState<Game | null>(
    initialGame ? enrichGame(initialGame) : null
  );
  const [selected, setSelected] = useState<Question | null>(null);
  const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null);
  const [scores, setScores] = useState<number[]>([0, 0]);
  const [teamNames, setTeamNames] = useState(['Team A', 'Team B']);
  const [hostMode, setHostMode] = useState(false);
  const [playerMode, setPlayerMode] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [refineOpen, setRefineOpen] = useState(false);
  const [refineText, setRefineText] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Ready to build');
  const [notice, setNotice] = useState('');
  const [savedShareId, setSavedShareId] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [batchReviewOpen, setBatchReviewOpen] = useState(false);
  const [batchFilter, setBatchFilter] = useState<
    'all' | 'edited' | 'needs-review'
  >('all');
  const [rewriteSuggestions, setRewriteSuggestions] = useState<
    Record<string, Partial<Question>>
  >({});
  const flatQuestions = useMemo(
    () =>
      game?.categories.flatMap((category) =>
        category.questions.map((question) => ({
          ...question,
          category: category.name,
        }))
      ) || [],
    [game]
  );
  const batchCounts = useMemo(() => {
    const questions =
      game?.categories.flatMap((category) => category.questions) || [];
    return {
      all: questions.length,
      edited: questions.filter((question) => question.status === 'edited')
        .length,
      needsReview: questions.filter(
        (question) =>
          !question.prompt.trim() ||
          !question.answer.trim() ||
          question.status === 'needs-review'
      ).length,
    };
  }, [game]);

  useEffect(() => {
    if (initialGame) {
      setStatus('Shared board loaded');
      return;
    }
    const saved = window.localStorage.getItem('quizboard-draft');
    if (!saved) return;
    try {
      setGame(enrichGame(JSON.parse(saved) as Game));
      setStatus('Saved board restored');
    } catch {
      window.localStorage.removeItem('quizboard-draft');
    }
  }, [initialGame]);

  useEffect(() => {
    const enterFullscreenForGame = (event: MouseEvent) => {
      const button =
        event.target instanceof Element ? event.target.closest('button') : null;
      if (
        !button?.textContent?.includes('Start game') ||
        document.fullscreenElement
      )
        return;
      document.documentElement.requestFullscreen?.().catch(() => undefined);
    };
    document.addEventListener('click', enterFullscreenForGame, true);
    return () =>
      document.removeEventListener('click', enterFullscreenForGame, true);
  }, []);

  async function generate(nextTopic = topic) {
    if (!nextTopic.trim()) {
      setStatus('Add a topic first');
      return;
    }
    setLoading(true);
    setStatus('Building your board');
    setNotice('');
    try {
      const response = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: nextTopic, audience, language }),
      });
      if (!response.ok) throw new Error('We could not build this board yet.');
      const nextGame = enrichGame((await response.json()) as Game);
      setGame(nextGame);
      setTopic(nextGame.topic || nextTopic);
      setStatus('Board ready');
      if (nextGame.notice) setNotice(nextGame.notice);
      window.setTimeout(
        () =>
          document
            .getElementById('review')
            ?.scrollIntoView({ behavior: 'smooth' }),
        50
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Generation failed');
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    if (!game) return;
    window.localStorage.setItem('quizboard-draft', JSON.stringify(game));
    setStatus('Saving board…');
    try {
      const response = await fetch('/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          board: game,
          shareId: savedShareId || initialShareId,
          isPublic,
        }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || 'Board could not be saved');
      setSavedShareId(data.board.shareId);
      setStatus(`Saved · share code ${data.board.shareId}`);
      setNotice(
        `Public board saved. Share /board/${data.board.shareId} with your group.`
      );
    } catch (error) {
      setStatus(
        error instanceof Error
          ? `${error.message} (browser copy kept)`
          : 'Browser copy saved'
      );
    }
  }

  async function deleteSavedBoard() {
    const shareId = savedShareId || initialShareId;
    if (!shareId || !window.confirm('Delete this board permanently?')) return;
    const response = await fetch(
      `/api/boards?shareId=${encodeURIComponent(shareId)}`,
      { method: 'DELETE' }
    );
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setStatus(data.error || 'Board could not be deleted');
      return;
    }
    window.location.href = '/boards';
  }

  function downloadOfflineGame() {
    if (!game) return;
    const html = buildOfflineGameHtml({ ...game, teamNames });
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(game.title || 'quizboard-game').replace(/[^a-z0-9\u4e00-\u9fff]+/gi, '-').replace(/^-|-$/g, '') || 'quizboard-game'}-offline.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setStatus('Offline game downloaded');
  }

  function updateQuestion(
    field: 'prompt' | 'answer' | 'explanation' | 'value',
    value: string
  ) {
    if (!game || !selected) return;
    const nextGame = {
      ...game,
      categories: game.categories.map((category) => ({
        ...category,
        questions: category.questions.map((question) => {
          if (question.id !== selected.id) return question;
          const nextQuestion = {
            ...question,
            [field]: field === 'value' ? Number(value) || 0 : value,
            status: 'edited',
          };
          return {
            ...nextQuestion,
            media: inferQuestionMedia(
              game.topic,
              String(nextQuestion.prompt || ''),
              normalizeQuestionMedia(nextQuestion.media)
            ),
          };
        }),
      })),
    };
    setGame(nextGame);
    setSelected(
      nextGame.categories
        .flatMap((category) => category.questions)
        .find((question) => question.id === selected.id) || null
    );
  }

  function updateQuestionById(
    id: string,
    field: 'prompt' | 'answer' | 'explanation' | 'value',
    value: string
  ) {
    if (!game) return;
    setGame({
      ...game,
      categories: game.categories.map((category) => ({
        ...category,
        questions: category.questions.map((question) => {
          if (question.id !== id) return question;
          const nextQuestion = {
            ...question,
            [field]: field === 'value' ? Number(value) || 0 : value,
            status: 'edited',
          };
          return {
            ...nextQuestion,
            media: inferQuestionMedia(
              game.topic,
              String(nextQuestion.prompt || ''),
              normalizeQuestionMedia(nextQuestion.media)
            ),
          };
        }),
      })),
    });
  }

  async function rewriteQuestionById(question: Question) {
    if (!game) return;
    setLoading(true);
    setStatus('Rewriting question');
    try {
      const category = game.categories.find((item) =>
        item.questions.some((itemQuestion) => itemQuestion.id === question.id)
      )?.name;
      const response = await fetch('/api/quiz/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: game.topic,
          language: game.language || language,
          category,
          question,
        }),
      });
      const next = response.ok
        ? await response.json()
        : {
            ...question,
            prompt: `${question.prompt} Include one concrete example and explain why it matters.`,
            answer: `${question.answer} A concrete example makes the idea easier to check.`,
          };
      setRewriteSuggestions((suggestions) => ({
        ...suggestions,
        [question.id]: next,
      }));
      setStatus('AI suggestion ready — review before saving');
    } catch {
      setStatus('Question kept; try again in a moment');
    } finally {
      setLoading(false);
    }
  }

  function acceptRewrite(id: string) {
    if (!game || !rewriteSuggestions[id]) return;
    const suggestion = rewriteSuggestions[id];
    setGame(
      enrichGame({
        ...game,
        categories: game.categories.map((category) => ({
          ...category,
          questions: category.questions.map((question) =>
            question.id === id
              ? {
                  ...question,
                  ...suggestion,
                  id: question.id,
                  value: question.value,
                  status: 'edited',
                }
              : question
          ),
        })),
      })
    );
    setRewriteSuggestions((suggestions) => {
      const next = { ...suggestions };
      delete next[id];
      return next;
    });
    setStatus('AI suggestion accepted');
  }

  function discardRewrite(id: string) {
    setRewriteSuggestions((suggestions) => {
      const next = { ...suggestions };
      delete next[id];
      return next;
    });
    setStatus('AI suggestion discarded');
  }

  async function rewriteQuestion() {
    if (!selected || !game) return;
    setLoading(true);
    setStatus('Rewriting selected question');
    try {
      const response = await fetch('/api/quiz/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: game.topic,
          language: game.language || language,
          category: game.categories.find((category) =>
            category.questions.some((question) => question.id === selected.id)
          )?.name,
          question: selected,
        }),
      });
      const next = response.ok
        ? await response.json()
        : {
            ...selected,
            prompt: `${selected.prompt} Include one concrete example and explain why it matters.`,
            answer: `${selected.answer} A concrete example makes the idea easier to check.`,
          };
      const nextGame = enrichGame({
        ...game,
        categories: game.categories.map((category) => ({
          ...category,
          questions: category.questions.map((question) =>
            question.id === selected.id
              ? {
                  ...question,
                  ...next,
                  id: question.id,
                  value: question.value,
                  status: 'edited',
                }
              : question
          ),
        })),
      });
      const nextQuestion =
        nextGame.categories
          .flatMap((category) => category.questions)
          .find((question) => question.id === selected.id) || null;
      setGame(nextGame);
      setSelected(nextQuestion);
      setStatus('Question rewritten');
    } catch {
      setStatus('Question kept; try again in a moment');
    } finally {
      setLoading(false);
    }
  }

  async function refineTopic() {
    if (!refineText.trim()) return;
    setLoading(true);
    setStatus('Refining your theme');
    try {
      const response = await fetch('/api/quiz/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, instruction: refineText }),
      });
      const data = response.ok
        ? await response.json()
        : { topic: `${topic}; ${refineText}` };
      setTopic(data.topic);
      setRefineOpen(false);
      setRefineText('');
      setStatus('Theme updated');
    } finally {
      setLoading(false);
    }
  }

  async function submitFeedback() {
    if (!feedbackText.trim()) return;
    await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: feedbackText,
        page: window.location.pathname,
      }),
    }).catch(() => undefined);
    setFeedbackText('');
    setFeedbackOpen(false);
    setStatus('Thanks — feedback received');
  }

  function joinRoom() {
    if (joinCode.replace(/\W/g, '').length < 4) return;
    setJoinOpen(false);
    setPlayerMode(true);
    setHostMode(false);
  }

  function updateBoardTeam(index: number, name: string) {
    setTeamNames(
      teamNames.map((team, teamIndex) => (teamIndex === index ? name : team))
    );
  }
  function addBoardTeam() {
    if (teamNames.length >= 8) return;
    setTeamNames([
      ...teamNames,
      `Team ${String.fromCharCode(65 + teamNames.length)}`,
    ]);
    setScores([...scores, 0]);
  }
  function removeBoardTeam(
    index?: number | React.MouseEvent<HTMLButtonElement>
  ) {
    if (teamNames.length <= 1) return;
    const teamIndexToRemove =
      typeof index === 'number' ? index : teamNames.length - 1;
    setTeamNames(
      teamNames.filter((_, teamIndex) => teamIndex !== teamIndexToRemove)
    );
    setScores(
      scores.filter((_, scoreIndex) => scoreIndex !== teamIndexToRemove)
    );
  }

  if (playerMode)
    return (
      <PlayerView
        code={joinCode || roomCode}
        exit={() => setPlayerMode(false)}
      />
    );

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <a className={styles.brand} href="/">
          <span className={styles.brandMark}>Q</span>
          <span>
            quizboard<span className={styles.brandDot}>.</span>
          </span>
        </a>
        <nav>
          <a href="#how">How it works</a>
          <a href="/boards">Browse boards</a>
          <a href="#templates">Templates</a>
          <button
            className={styles.ghostButton}
            onClick={() => setJoinOpen(true)}
          >
            Join a room
          </button>
        </nav>
      </header>
      {!hostMode ? (
        <main>
          <section className={styles.hero}>
            <div className={styles.generatorCard}>
              <div className={styles.cardTopline}>
                <span>01 / CREATE A GAME</span>
                <span className={styles.savedState}>{status}</span>
              </div>
              <label htmlFor="topic">What should this game be about?</label>
              <textarea
                id="topic"
                rows={4}
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                placeholder="e.g. Grade 7 weather systems"
              />
              <div className={styles.topicLibrary}>
                <span>Browse a subject</span>
                <div className={styles.topicChips}>
                  {topicSuggestions.map((suggestion) => (
                    <button
                      type="button"
                      key={suggestion.label}
                      onClick={() => setTopic(suggestion.value)}
                    >
                      {suggestion.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.themeActions}>
                <button
                  className={styles.inlineButton}
                  onClick={() => setRefineOpen(true)}
                >
                  ✦ Adjust theme with AI
                </button>
                <span>Keep or change any suggestion</span>
              </div>
              {refineOpen && (
                <div className={styles.refineBox}>
                  <label htmlFor="refine">How should the theme change?</label>
                  <input
                    id="refine"
                    value={refineText}
                    onChange={(event) => setRefineText(event.target.value)}
                    placeholder="Make it more practical and beginner-friendly"
                  />
                  <div>
                    <button
                      className={styles.textButton}
                      onClick={() => setRefineOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className={styles.miniPrimary}
                      onClick={refineTopic}
                      disabled={loading}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
              <div className={styles.formGrid}>
                <label>
                  Audience
                  <select
                    value={audience}
                    onChange={(event) => setAudience(event.target.value)}
                  >
                    <option>Classroom</option>
                    <option>Team training</option>
                    <option>Friends & family</option>
                  </select>
                </label>
                <label>
                  Question language
                  <select
                    value={language}
                    onChange={(event) => setLanguage(event.target.value)}
                  >
                    <option>English</option>
                    <option>Spanish</option>
                  </select>
                </label>
              </div>
              <button
                className={styles.primaryButton}
                onClick={() => generate()}
                disabled={loading}
              >
                <span>
                  {loading ? 'Building your board…' : 'Generate my board'}
                </span>
                <span>↗</span>
              </button>
              <p className={styles.microcopy}>
                You’ll get a board you can review, revise, and host.
              </p>
            </div>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>
                <span className={styles.pulse} /> AI QUIZ BOARD MAKER
              </p>
              <h1>{heroTitle}</h1>
              <p className={styles.lede}>{heroLede}</p>
              <div className={styles.trustRow}>
                <span>✦ no account to start</span>
                <span>✦ 5 × 5 board</span>
                <span>✦ host or share</span>
              </div>
            </div>
          </section>
          {game && (
            <section className={styles.workbench} id="review">
              <div className={styles.sectionHeading}>
                <div>
                  <p className={styles.eyebrow}>02 / REVIEW YOUR BOARD</p>
                  <h2>{game.title}</h2>
                  <p className={styles.sectionMeta}>
                    Generated from “{game.topic}” · edit any square before
                    hosting
                  </p>
                </div>
                <div className={styles.toolbar}>
                  <label className={styles.visibilityControl}>
                    Visibility
                    <select
                      value={isPublic ? 'public' : 'private'}
                      onChange={(event) =>
                        setIsPublic(event.target.value === 'public')
                      }
                    >
                      <option value="public">Public</option>
                      <option value="private">
                        Private · sign in required
                      </option>
                    </select>
                  </label>
                  <button className={styles.secondaryButton} onClick={save}>
                    Save board
                  </button>
                  {canDelete && (
                    <button
                      className={styles.secondaryButton}
                      onClick={deleteSavedBoard}
                    >
                      Delete board
                    </button>
                  )}
                  <button
                    className={styles.secondaryButton}
                    onClick={() => setBatchReviewOpen(true)}
                  >
                    Review all questions
                  </button>
                  <button
                    className={styles.secondaryButton}
                    onClick={downloadOfflineGame}
                  >
                    Download offline game
                  </button>
                  <button
                    className={styles.secondaryButton}
                    onClick={() => generate()}
                  >
                    Regenerate all
                  </button>
                  <button
                    className={`${styles.primaryButton} ${styles.compact}`}
                    onClick={() => setHostMode(true)}
                  >
                    Start game ↗
                  </button>
                </div>
              </div>
              {notice && <div className={styles.notice}>{notice}</div>}
              <div className={styles.boardTeams}>
                <div>
                  <strong>Teams</strong>
                  <span>
                    {teamNames.length}/8 teams · totals carry into the game
                  </span>
                </div>
                <div className={styles.boardTeamList}>
                  {teamNames.map((team, index) => (
                    <label key={`${team}-${index}`}>
                      <span>Team {index + 1}</span>
                      <input
                        aria-label={`Team ${index + 1} name`}
                        value={team}
                        onChange={(event) =>
                          updateBoardTeam(index, event.target.value)
                        }
                      />
                      <strong>{scores[index] || 0}</strong>
                    </label>
                  ))}
                  <button
                    className={styles.teamManagerButton}
                    onClick={addBoardTeam}
                    disabled={teamNames.length >= 8}
                  >
                    + Add team
                  </button>
                  <button
                    className={styles.teamManagerButton}
                    onClick={removeBoardTeam}
                    disabled={teamNames.length <= 1}
                  >
                    − Remove team
                  </button>
                </div>
              </div>
              <div className={styles.board}>
                {game.categories.map((category) => (
                  <div key={category.name} className={styles.categoryHead}>
                    <span>{category.name}</span>
                    <small>{category.hint}</small>
                  </div>
                ))}
                {[0, 1, 2, 3, 4].flatMap((row) =>
                  game.categories.map((category) => {
                    const question = category.questions[row];
                    return (
                      <button
                        className={styles.boardCell}
                        key={question.id}
                        onClick={() => {
                          setSelected(question);
                          setPreviewQuestion(null);
                        }}
                        aria-label={`Edit ${category.name}, ${question.value} points`}
                      >
                        {question.value}
                      </button>
                    );
                  })
                )}
              </div>
              {previewQuestion && (
                <div className={styles.questionPreview}>
                  <div>
                    <p className={styles.eyebrow}>
                      SAVED QUESTION · {previewQuestion.value} POINTS
                    </p>
                    <h3>{previewQuestion.prompt}</h3>
                    <QuestionVisual question={previewQuestion} />
                    <p>
                      <strong>Answer:</strong> {previewQuestion.answer}
                    </p>
                    <p className={styles.previewExplanation}>
                      {previewQuestion.explanation}
                    </p>
                  </div>
                  <button
                    className={styles.iconButton}
                    onClick={() => setPreviewQuestion(null)}
                    aria-label="Close question preview"
                  >
                    ×
                  </button>
                </div>
              )}
              <p className={styles.boardHint}>
                Select a square to edit the question, answer, explanation, or
                points. Start the game to open the presentation view.
              </p>
            </section>
          )}
          {batchReviewOpen && game && (
            <BatchReview
              game={game}
              filter={batchFilter}
              counts={batchCounts}
              loading={loading}
              onFilterChange={setBatchFilter}
              onSave={save}
              onClose={() => setBatchReviewOpen(false)}
              onUpdate={updateQuestionById}
              onRewrite={rewriteQuestionById}
              suggestions={rewriteSuggestions}
              onAcceptRewrite={acceptRewrite}
              onDiscardRewrite={discardRewrite}
            />
          )}
          {selected && (
            <aside className={styles.editorPanel}>
              <div className={styles.editorHead}>
                <span>{selected.value} POINTS · EDIT</span>
                <button
                  className={styles.iconButton}
                  onClick={() => setSelected(null)}
                >
                  ×
                </button>
              </div>
              <label>
                Question
                <AutosizeTextarea
                  rows={3}
                  value={selected.prompt}
                  onChange={(event) =>
                    updateQuestion('prompt', event.target.value)
                  }
                />
              </label>
              <div className={styles.editorGrid}>
                <label>
                  Points
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={selected.value}
                    onChange={(event) =>
                      updateQuestion('value', event.target.value)
                    }
                  />
                </label>
                <label>
                  Difficulty
                  <select
                    value={selected.difficulty || 'medium'}
                    onChange={() => undefined}
                  >
                    <option>easy</option>
                    <option>medium</option>
                    <option>hard</option>
                  </select>
                </label>
              </div>
              <label>
                Answer
                <AutosizeTextarea
                  rows={3}
                  value={selected.answer}
                  onChange={(event) =>
                    updateQuestion('answer', event.target.value)
                  }
                />
              </label>
              <label>
                Explanation
                <AutosizeTextarea
                  rows={3}
                  value={selected.explanation}
                  onChange={(event) =>
                    updateQuestion('explanation', event.target.value)
                  }
                />
              </label>
              {selected.media?.url && (
                <figure className={styles.editorMedia}>
                  <img src={selected.media.url} alt={selected.media.alt} />
                  <figcaption>
                    Optional visual · {selected.media.kind}
                  </figcaption>
                </figure>
              )}
              <div className={styles.editorActions}>
                <button
                  className={styles.secondaryButton}
                  onClick={rewriteQuestion}
                  disabled={loading}
                >
                  Rewrite question
                </button>
                <button
                  className={`${styles.primaryButton} ${styles.compact}`}
                  onClick={() => {
                    setPreviewQuestion(selected);
                    setSelected(null);
                    setStatus('Question saved');
                  }}
                >
                  Done · show
                </button>
              </div>
            </aside>
          )}
          {game && <QualitySummary game={game} />}
          <InfoSections />
        </main>
      ) : (
        <HostView
          game={game}
          scores={scores}
          setScores={setScores}
          teamNames={teamNames}
          setTeamNames={setTeamNames}
          questions={flatQuestions}
          exit={() => setHostMode(false)}
          initialCompetitionMode
        />
      )}
      <button
        className={styles.feedbackFab}
        onClick={() => setFeedbackOpen(true)}
      >
        ✎ Feedback
      </button>
      {joinOpen && (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
          <div className={styles.modal}>
            <button
              className={styles.modalClose}
              onClick={() => setJoinOpen(false)}
            >
              ×
            </button>
            <p className={styles.eyebrow}>JOIN A ROOM</p>
            <h2>Enter the room code</h2>
            <p>Use the 6-character code shown on your host’s screen.</p>
            <input
              autoFocus
              value={joinCode}
              onChange={(event) =>
                setJoinCode(event.target.value.toUpperCase())
              }
              placeholder="e.g. QZ-4821"
              maxLength={8}
              onKeyDown={(event) => event.key === 'Enter' && joinRoom()}
            />
            <button className={styles.primaryButton} onClick={joinRoom}>
              <span>Join room</span>
              <span>↗</span>
            </button>
            <small>
              No account needed. You can change teams after joining.
            </small>
          </div>
        </div>
      )}
      {feedbackOpen && (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
          <div className={styles.modal}>
            <button
              className={styles.modalClose}
              onClick={() => setFeedbackOpen(false)}
            >
              ×
            </button>
            <p className={styles.eyebrow}>HELP US IMPROVE</p>
            <h2>What should we fix?</h2>
            <textarea
              rows={5}
              autoFocus
              value={feedbackText}
              onChange={(event) => setFeedbackText(event.target.value)}
              placeholder="Tell us what felt confusing or what you want to see next."
            />
            <button className={styles.primaryButton} onClick={submitFeedback}>
              <span>Send feedback</span>
              <span>↗</span>
            </button>
          </div>
        </div>
      )}
      <footer>
        <span>quizboard maker / build something people remember</span>
        <span>Questions stay editable until you host.</span>
      </footer>
    </div>
  );
}

function QualitySummary({ game }: { game: Game }) {
  const questions = game.categories.flatMap((category) => category.questions);
  const duplicateCount =
    questions.length -
    new Set(questions.map((question) => question.prompt.trim().toLowerCase()))
      .size;
  const missing = questions.filter(
    (question) => !question.prompt.trim() || !question.answer.trim()
  ).length;
  return (
    <section className={styles.qualitySummary}>
      <div>
        <span className={styles.qualityDot} /> <strong>Board check</strong>
      </div>
      <span>{questions.length} questions</span>
      <span>
        {duplicateCount
          ? `${duplicateCount} duplicates to review`
          : 'No duplicate prompts'}
      </span>
      <span>
        {missing ? `${missing} incomplete` : 'Every answer is filled in'}
      </span>
    </section>
  );
}

function QuestionVisual({
  question,
  className = '',
}: {
  question: Question;
  className?: string;
}) {
  if (!question.media?.url) return null;
  return (
    <figure className={`${styles.questionVisual} ${className}`}>
      <img src={question.media.url} alt={question.media.alt} />
      <figcaption>Optional visual · {question.media.kind}</figcaption>
    </figure>
  );
}

function InfoSections() {
  return (
    <>
      <section className={styles.featureStrip} id="how">
        {[
          [
            '01',
            'Say what you need',
            'One plain-language prompt becomes a structured board draft.',
          ],
          [
            '02',
            'Make it yours',
            'Edit a question, answer, points, or explanation. Rewrite one square or the whole board with AI.',
          ],
          [
            '03',
            'Get the room moving',
            'Host on a big screen or share a code and QR entry for players.',
          ],
        ].map(([num, title, body]) => (
          <div key={num}>
            <span className={styles.featureNum}>{num}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </div>
        ))}
      </section>
      <section className={styles.keywordBand} id="templates">
        <p className={styles.eyebrow}>MADE FOR THE WAY YOU SEARCH</p>
        <div className={styles.keywordList}>
          {[
            'classroom review game',
            'free quiz board maker',
            'online team quiz',
            'AI game generator',
            'PowerPoint alternative',
          ].map((keyword) => (
            <span key={keyword}>{keyword}</span>
          ))}
        </div>
      </section>
    </>
  );
}

type BatchFilter = 'all' | 'edited' | 'needs-review';

function BatchReview({
  game,
  filter,
  counts,
  loading,
  onFilterChange,
  onSave,
  onClose,
  onUpdate,
  onRewrite,
  suggestions,
  onAcceptRewrite,
  onDiscardRewrite,
}: {
  game: Game;
  filter: BatchFilter;
  counts: { all: number; edited: number; needsReview: number };
  loading: boolean;
  onFilterChange: (filter: BatchFilter) => void;
  onSave: () => void;
  onClose: () => void;
  onUpdate: (
    id: string,
    field: 'prompt' | 'answer' | 'explanation' | 'value',
    value: string
  ) => void;
  onRewrite: (question: Question) => void;
  suggestions: Record<string, Partial<Question>>;
  onAcceptRewrite: (id: string) => void;
  onDiscardRewrite: (id: string) => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const visible = (question: Question) =>
    filter === 'all' ||
    (filter === 'edited'
      ? question.status === 'edited'
      : !question.prompt.trim() ||
        !question.answer.trim() ||
        question.status === 'needs-review');
  return (
    <section
      className={styles.batchReview}
      aria-label="Batch review all questions"
    >
      <div className={styles.batchReviewHeader}>
        <div>
          <p className={styles.eyebrow}>BATCH REVIEW</p>
          <h2>Review every question</h2>
          <p>
            Scan the whole board as a list, expand only what needs attention,
            then save all changes.
          </p>
        </div>
        <div className={styles.toolbar}>
          <button className={styles.secondaryButton} onClick={onSave}>
            Save all changes
          </button>
          <button
            className={styles.iconButton}
            onClick={onClose}
            aria-label="Close batch review"
          >
            ×
          </button>
        </div>
      </div>
      <div
        className={styles.batchFilters}
        role="tablist"
        aria-label="Question filters"
      >
        <button
          className={filter === 'all' ? styles.batchFilterActive : ''}
          onClick={() => onFilterChange('all')}
        >
          All <b>{counts.all}</b>
        </button>
        <button
          className={filter === 'needs-review' ? styles.batchFilterActive : ''}
          onClick={() => onFilterChange('needs-review')}
        >
          Needs review <b>{counts.needsReview}</b>
        </button>
        <button
          className={filter === 'edited' ? styles.batchFilterActive : ''}
          onClick={() => onFilterChange('edited')}
        >
          Edited <b>{counts.edited}</b>
        </button>
      </div>
      {game.categories.map((category) => {
        const questions = category.questions.filter(visible);
        if (!questions.length) return null;
        return (
          <div className={styles.batchCategory} key={category.name}>
            <h3>
              {category.name}
              <span>{questions.length} questions</span>
            </h3>
            <div className={styles.batchListHeader}>
              <span>VALUE</span>
              <span>QUESTION / ANSWER</span>
              <span>STATUS</span>
              <span>ACTION</span>
            </div>
            {questions.map((question) => {
              const expanded = expandedId === question.id;
              const needsReview =
                !question.prompt.trim() ||
                !question.answer.trim() ||
                question.status === 'needs-review';
              const suggestion = suggestions[question.id];
              return (
                <article
                  className={`${styles.batchQuestion} ${expanded ? styles.batchQuestionExpanded : ''}`}
                  key={question.id}
                >
                  <button
                    className={styles.batchQuestionSummary}
                    onClick={() => setExpandedId(expanded ? null : question.id)}
                    aria-expanded={expanded}
                  >
                    <span className={styles.batchValue}>{question.value}</span>
                    <span className={styles.batchSummaryText}>
                      <strong>{question.prompt || 'Untitled question'}</strong>
                      <small>{question.answer || 'Answer missing'}</small>
                    </span>
                    <span
                      className={`${styles.batchStatus} ${needsReview ? styles.batchStatusWarning : ''}`}
                    >
                      {needsReview
                        ? 'Needs review'
                        : question.status === 'edited'
                          ? 'Edited'
                          : 'Draft'}
                      {question.media?.needsImage && <em> · visual</em>}
                    </span>
                    <span className={styles.batchExpand}>
                      {expanded ? 'Collapse' : 'Edit'}{' '}
                      <span aria-hidden="true">{expanded ? '↑' : '↓'}</span>
                    </span>
                  </button>
                  {expanded && (
                    <div className={styles.batchEditor}>
                      <div className={styles.batchEditorFields}>
                        <label>
                          Question
                          <AutosizeTextarea
                            rows={3}
                            value={question.prompt}
                            onChange={(event) =>
                              onUpdate(
                                question.id,
                                'prompt',
                                event.target.value
                              )
                            }
                          />
                        </label>
                        <div className={styles.batchFields}>
                          <label>
                            Points
                            <input
                              type="number"
                              min="0"
                              value={question.value}
                              onChange={(event) =>
                                onUpdate(
                                  question.id,
                                  'value',
                                  event.target.value
                                )
                              }
                            />
                          </label>
                          <label>
                            Answer
                            <AutosizeTextarea
                              rows={3}
                              value={question.answer}
                              onChange={(event) =>
                                onUpdate(
                                  question.id,
                                  'answer',
                                  event.target.value
                                )
                              }
                            />
                          </label>
                        </div>
                        <label>
                          Explanation
                          <AutosizeTextarea
                            rows={2}
                            value={question.explanation}
                            onChange={(event) =>
                              onUpdate(
                                question.id,
                                'explanation',
                                event.target.value
                              )
                            }
                          />
                        </label>
                      </div>
                      {question.media?.url && (
                        <figure className={styles.batchMedia}>
                          <img
                            src={question.media.url}
                            alt={question.media.alt}
                          />
                          <figcaption>
                            Optional visual · {question.media.kind}
                          </figcaption>
                        </figure>
                      )}
                      <div className={styles.editorActions}>
                        <button
                          className={styles.secondaryButton}
                          onClick={() => onRewrite(question)}
                          disabled={loading}
                        >
                          {loading ? 'Working…' : 'AI rewrite'}
                        </button>
                      </div>
                      {suggestion && (
                        <div className={styles.rewriteSuggestion}>
                          <div>
                            <strong>AI suggestion</strong>
                            <span>
                              Preview before it changes your saved question.
                            </span>
                          </div>
                          <p>
                            <b>Question</b>
                            {suggestion.prompt || question.prompt}
                          </p>
                          <p>
                            <b>Answer</b>
                            {suggestion.answer || question.answer}
                          </p>
                          <div className={styles.rewriteActions}>
                            <button
                              className={styles.secondaryButton}
                              onClick={() => onDiscardRewrite(question.id)}
                            >
                              Discard
                            </button>
                            <button
                              className={styles.primaryButton}
                              onClick={() => onAcceptRewrite(question.id)}
                            >
                              Accept & save
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        );
      })}
    </section>
  );
}

function HostView({
  game,
  scores,
  setScores,
  teamNames,
  setTeamNames,
  questions,
  exit,
  initialCompetitionMode = false,
}: {
  game: Game | null;
  scores: number[];
  setScores: (scores: number[]) => void;
  teamNames: string[];
  setTeamNames: (names: string[]) => void;
  questions: Question[];
  exit: () => void;
  initialCompetitionMode?: boolean;
}) {
  const [active, setActive] = useState<Question | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [usedQuestionIds, setUsedQuestionIds] = useState<string[]>([]);
  const [ended, setEnded] = useState(false);
  const [scoreHistory, setScoreHistory] = useState<ScoreEvent[]>([]);
  const [historyTeamIndex, setHistoryTeamIndex] = useState<number | null>(null);
  const [competitionMode, setCompetitionMode] = useState(
    initialCompetitionMode
  );
  const [competitionScoresVisible, setCompetitionScoresVisible] =
    useState(true);
  const [competitionDeltas, setCompetitionDeltas] = useState<
    Record<string, number>
  >({});
  const [questionFontScale, setQuestionFontScale] = useState(1);
  const firstQuestionStarted = useRef(false);
  useEffect(() => {
    if (
      !initialCompetitionMode ||
      firstQuestionStarted.current ||
      !questions.length
    )
      return;
    const firstQuestion = questions[0];
    firstQuestionStarted.current = true;
    setActive(firstQuestion);
    setRevealed(false);
    setUsedQuestionIds([firstQuestion.id]);
  }, [initialCompetitionMode, questions]);
  useEffect(() => {
    if (!competitionMode) return;
    const handleCompetitionKeys = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setCompetitionMode(false);
      if (event.key === ' ' && active) {
        event.preventDefault();
        setRevealed((isRevealed) => !isRevealed);
      }
    };
    window.addEventListener('keydown', handleCompetitionKeys);
    return () => window.removeEventListener('keydown', handleCompetitionKeys);
  }, [competitionMode, active]);
  if (!game)
    return (
      <main className={styles.emptyHost}>
        <h2>Generate a game first.</h2>
        <button className={styles.primaryButton} onClick={exit}>
          Back to generator
        </button>
      </main>
    );
  function updateTeam(index: number, name: string) {
    setTeamNames(
      teamNames.map((team, teamIndex) => (teamIndex === index ? name : team))
    );
  }
  function updateScore(index: number, value: string) {
    const nextScore = Number(value);
    if (!Number.isFinite(nextScore)) return;
    if (!active || !currentQuestionValue) {
      setScores(
        scores.map((score, scoreIndex) =>
          scoreIndex === index ? nextScore : score
        )
      );
      return;
    }
    const currentQuestionDelta =
      competitionDeltas[`${active.id}-${index}`] || 0;
    const previousTotal = scores[index] || 0;
    const scoreBeforeQuestion = previousTotal - currentQuestionDelta;
    const cappedDelta = Math.max(
      -currentQuestionValue,
      Math.min(currentQuestionValue, nextScore - scoreBeforeQuestion)
    );
    const cappedTotal = scoreBeforeQuestion + cappedDelta;
    setScores(
      scores.map((score, scoreIndex) =>
        scoreIndex === index ? cappedTotal : score
      )
    );
    setCompetitionDeltas((deltas) => ({
      ...deltas,
      [`${active.id}-${index}`]: cappedDelta,
    }));
  }
  function addTeam() {
    if (teamNames.length >= 8) return;
    setTeamNames([
      ...teamNames,
      `Team ${String.fromCharCode(65 + teamNames.length)}`,
    ]);
    setScores([...scores, 0]);
  }
  function removeTeam(index: number | React.MouseEvent<HTMLButtonElement>) {
    if (teamNames.length <= 1) return;
    const teamIndexToRemove =
      typeof index === 'number' ? index : teamNames.length - 1;
    setTeamNames(
      teamNames.filter((_, teamIndex) => teamIndex !== teamIndexToRemove)
    );
    setScores(
      scores.filter((_, scoreIndex) => scoreIndex !== teamIndexToRemove)
    );
    setScoreHistory(
      scoreHistory
        .filter((event) => event.teamIndex !== teamIndexToRemove)
        .map((event) =>
          event.teamIndex > teamIndexToRemove
            ? { ...event, teamIndex: event.teamIndex - 1 }
            : event
        )
    );
    setHistoryTeamIndex(null);
    setCompetitionDeltas({});
  }
  function chooseQuestion(question: Question) {
    if (ended || usedQuestionIds.includes(question.id)) return;
    setActive(question);
    setRevealed(false);
    setUsedQuestionIds([...usedQuestionIds, question.id]);
    setCompetitionMode(true);
  }
  function recordScore(index: number, delta: number) {
    if (!active || !revealed || !currentQuestionValue) return;
    const team = teamNames[index] || `Team ${index + 1}`;
    const currentQuestionDelta =
      competitionDeltas[`${active.id}-${index}`] || 0;
    const nextQuestionDelta = Math.max(
      -currentQuestionValue,
      Math.min(currentQuestionValue, currentQuestionDelta + delta)
    );
    const appliedDelta = nextQuestionDelta - currentQuestionDelta;
    if (!appliedDelta) return;
    setScores(
      scores.map((score, scoreIndex) =>
        scoreIndex === index ? score + appliedDelta : score
      )
    );
    setCompetitionDeltas((deltas) => ({
      ...deltas,
      [`${active.id}-${index}`]: nextQuestionDelta,
    }));
  }
  function recordCompetitionScore(index: number, delta: number) {
    if (!active || !currentQuestionValue) return;
    const key = `${active.id}-${index}`;
    const currentDelta = competitionDeltas[key] || 0;
    const nextDelta = Math.max(
      -currentQuestionValue,
      Math.min(currentQuestionValue, currentDelta + delta)
    );
    const appliedDelta = nextDelta - currentDelta;
    if (!appliedDelta) return;
    setScores(
      scores.map((score, scoreIndex) =>
        scoreIndex === index ? score + appliedDelta : score
      )
    );
    setCompetitionDeltas((deltas) => ({ ...deltas, [key]: nextDelta }));
  }
  function updateCompetitionScore(index: number, value: string) {
    const nextScore = Number(value);
    if (!Number.isFinite(nextScore)) return;
    if (!active || !currentQuestionValue) {
      setScores(
        scores.map((score, scoreIndex) =>
          scoreIndex === index ? nextScore : score
        )
      );
      return;
    }
    const key = `${active.id}-${index}`;
    const currentDelta = competitionDeltas[key] || 0;
    const scoreBeforeQuestion = (scores[index] || 0) - currentDelta;
    const cappedDelta = Math.max(
      -currentQuestionValue,
      Math.min(currentQuestionValue, nextScore - scoreBeforeQuestion)
    );
    setScores(
      scores.map((score, scoreIndex) =>
        scoreIndex === index ? scoreBeforeQuestion + cappedDelta : score
      )
    );
    setCompetitionDeltas((deltas) => ({ ...deltas, [key]: cappedDelta }));
  }
  function clearScores() {
    setScores(scores.map(() => 0));
    setCompetitionDeltas({});
  }
  function resetGame() {
    setActive(null);
    setRevealed(false);
    setUsedQuestionIds([]);
    setEnded(false);
    clearScores();
  }
  const ranking = teamNames
    .map((team, index) => ({ team, score: scores[index] || 0, index }))
    .sort((a, b) => b.score - a.score);
  const currentQuestionValue = active?.value ?? 0;
  const totalScore = scores.reduce(
    (sum, score) => sum + (Number.isFinite(score) ? score : 0),
    0
  );
  const selectedTeamHistory =
    historyTeamIndex === null
      ? []
      : scoreHistory.filter((event) => event.teamIndex === historyTeamIndex);
  if (!competitionMode)
    return (
      <main className={styles.hostBoardMode}>
        <header className={styles.hostBoardHeader}>
          <div>
            <p className={styles.eyebrow}>LIVE GAME BOARD · {roomCode}</p>
            <h1>{game.title}</h1>
          </div>
          <div className={styles.hostBoardActions}>
            <span>
              {usedQuestionIds.length}/{questions.length} used
            </span>
            <button className={styles.secondaryButton} onClick={resetGame}>
              Restart game
            </button>
            <button className={styles.secondaryButton} onClick={exit}>
              Exit host
            </button>
          </div>
        </header>
        <section
          className={styles.hostBoardGrid}
          style={
            { '--board-columns': game.categories.length } as React.CSSProperties
          }
          aria-label="Game board"
        >
          {game.categories.map((category) => (
            <div className={styles.hostBoardCategory} key={category.name}>
              <strong>{category.name}</strong>
              <small>{category.hint}</small>
            </div>
          ))}
          {[0, 1, 2, 3, 4].flatMap((row) =>
            game.categories.map((category) => {
              const question = category.questions[row];
              if (!question)
                return (
                  <div
                    className={styles.hostBoardEmpty}
                    key={`${category.name}-${row}`}
                  />
                );
              const used = usedQuestionIds.includes(question.id);
              return (
                <button
                  className={`${styles.hostBoardCell} ${used ? styles.hostBoardUsed : ''} ${active?.id === question.id ? styles.hostBoardCurrent : ''}`}
                  key={question.id}
                  disabled={used || ended}
                  onClick={() => chooseQuestion(question)}
                >
                  <span>{used ? 'Used' : 'Choose'}</span>
                  <strong>{question.value}</strong>
                </button>
              );
            })
          )}
        </section>
        <section className={styles.hostBoardTeams} aria-label="Team totals">
          <div className={styles.hostBoardTeamTools}>
            <strong>Team totals</strong>
            <span>{teamNames.length}/8 teams · all scores are cumulative</span>
            <button onClick={addTeam} disabled={teamNames.length >= 8}>
              + Add team
            </button>
          </div>
          {teamNames.map((team, index) => (
            <div className={styles.hostBoardTeam} key={`${team}-${index}`}>
              <button
                className={styles.hostBoardTeamRemove}
                aria-label={`Remove ${team}`}
                title={`Remove ${team}`}
                onClick={() => removeTeam(index)}
                disabled={teamNames.length <= 1}
              >
                ×
              </button>
              <input
                aria-label={`Team ${index + 1} name`}
                value={team}
                onChange={(event) => updateTeam(index, event.target.value)}
              />
              <input
                type="number"
                aria-label={`${team} total score`}
                value={scores[index] || 0}
                onChange={(event) => updateScore(index, event.target.value)}
              />
              <span>Total score</span>
            </div>
          ))}
        </section>
      </main>
    );
  const questionFitScale = active
    ? Math.max(
        0.52,
        Math.min(1.05, Math.sqrt(72 / Math.max(active.prompt.length, 1)))
      )
    : 1;
  if (competitionMode)
    return (
      <main
        className={`${styles.competitionMode} ${!competitionScoresVisible ? styles.competitionScoresHidden : ''}`}
        style={
          {
            '--question-scale': questionFontScale * questionFitScale,
          } as React.CSSProperties
        }
      >
        <header className={styles.competitionHeader}>
          <button onClick={() => setCompetitionMode(false)}>
            ← Back to board <kbd>Esc</kbd>
          </button>
          <span>
            {active
              ? `${active.category || 'Question'} · ${active.value} points`
              : 'Choose a question to begin'}
          </span>
          <div className={styles.competitionHeaderActions}>
            <button onClick={resetGame}>Restart game</button>
            <button
              onClick={() => active && setRevealed(!revealed)}
              disabled={!active}
            >
              {revealed ? 'Hide answer' : 'Reveal answer'} <kbd>Space</kbd>
            </button>
          </div>
        </header>
        <section className={styles.competitionStage}>
          <p>{active?.category || 'Classroom quiz'}</p>
          <h1>
            {active?.prompt || 'Choose a question below to start the game.'}
          </h1>
          {active && (
            <QuestionVisual
              question={active}
              className={styles.competitionVisual}
            />
          )}
          {active && revealed && (
            <div className={styles.competitionAnswer}>
              <strong>Correct response</strong>
              <span>{active.answer}</span>
              {active.explanation && <small>{active.explanation}</small>}
            </div>
          )}
        </section>
        {competitionScoresVisible && (
          <section
            className={styles.competitionScoreboard}
            aria-label="Team total scores"
          >
            <div className={styles.competitionTeamActions}>
              <button onClick={addTeam} disabled={teamNames.length >= 8}>
                + Add team
              </button>
              <span>{teamNames.length}/8 teams</span>
              <span className={styles.competitionProgress}>
                {usedQuestionIds.length}/{questions.length} questions
              </span>
            </div>
            {teamNames.map((team, index) => (
              <div className={styles.competitionTeam} key={`${team}-${index}`}>
                <button
                  className={styles.competitionTeamRemove}
                  aria-label={`Remove ${team}`}
                  title={`Remove ${team}`}
                  onClick={() => removeTeam(index)}
                  disabled={teamNames.length <= 1}
                >
                  ×
                </button>
                <input
                  aria-label={`Team ${index + 1} name`}
                  value={team}
                  onChange={(event) => updateTeam(index, event.target.value)}
                />
                <input
                  className={styles.competitionTotalInput}
                  type="number"
                  aria-label={`${team} total score`}
                  value={scores[index] || 0}
                  onChange={(event) =>
                    updateCompetitionScore(index, event.target.value)
                  }
                />
                <small>Total score</small>
                <div>
                  <button
                    aria-label={`Add ${currentQuestionValue} points to ${team}`}
                    disabled={!active || !revealed || !currentQuestionValue}
                    onClick={() =>
                      recordCompetitionScore(index, currentQuestionValue)
                    }
                  >
                    +{currentQuestionValue || 0}
                  </button>
                  <button
                    aria-label={`Deduct ${currentQuestionValue} points from ${team}`}
                    disabled={!active || !revealed || !currentQuestionValue}
                    onClick={() =>
                      recordCompetitionScore(index, -currentQuestionValue)
                    }
                  >
                    −{currentQuestionValue || 0}
                  </button>
                </div>
              </div>
            ))}
          </section>
        )}
        <button
          className={styles.competitionScoreToggle}
          onClick={() => setCompetitionScoresVisible((visible) => !visible)}
          aria-expanded={competitionScoresVisible}
        >
          {competitionScoresVisible ? 'Hide team scores' : 'Show team scores'}
        </button>
        <footer className={styles.competitionFooter}>
          <span>Totals only · details are not saved</span>
          <span>
            {active
              ? `±${currentQuestionValue} points this question`
              : 'Choose a question'}
          </span>
          <div
            className={styles.competitionFontControls}
            aria-label="Question size"
          >
            <button
              onClick={() =>
                setQuestionFontScale((scale) =>
                  Math.max(0.8, Number((scale - 0.1).toFixed(1)))
                )
              }
              aria-label="Decrease question size"
            >
              A−
            </button>
            <button
              onClick={() =>
                setQuestionFontScale((scale) =>
                  Math.min(1.2, Number((scale + 0.1).toFixed(1)))
                )
              }
              aria-label="Increase question size"
            >
              A+
            </button>
            <button
              onClick={() => setRevealed(false)}
              disabled={!revealed}
              aria-label="Hide answer"
            >
              Hide answer
            </button>
          </div>
        </footer>
      </main>
    );
  return (
    <main className={styles.hostView}>
      <div className={styles.hostTop}>
        <div>
          <p className={styles.eyebrow}>LIVE HOST MODE · {roomCode}</p>
          <h2>{game.title}</h2>
          <p className={styles.hostInstruction}>
            {ended
              ? 'Game complete — final standings are shown below.'
              : active
                ? 'After this question, choose another square to continue.'
                : 'Choose a category and value to start.'}
          </p>
        </div>
        <div className={styles.hostTopActions}>
          <button
            className={styles.secondaryButton}
            onClick={() => setCompetitionMode(true)}
          >
            Presentation mode
          </button>
          <button
            className={styles.secondaryButton}
            onClick={() => setEnded(true)}
            disabled={ended}
          >
            End game
          </button>
          <button className={styles.secondaryButton} onClick={exit}>
            Back to board
          </button>
        </div>
      </div>
      <div className={styles.hostLayout}>
        <div className={styles.stageCard}>
          {!ended ? (
            <>
              <span className={styles.stageLabel}>
                {active
                  ? `${active.category || 'QUESTION'} · ${active.value} POINTS`
                  : 'CHOOSE A SQUARE'}
              </span>
              <h3>{active?.prompt || 'Choose a question below.'}</h3>
              {active && <QuestionVisual question={active} />}
              {active && !revealed && (
                <button
                  className={styles.primaryButton}
                  onClick={() => setRevealed(true)}
                >
                  Reveal answer
                </button>
              )}
              {active && revealed && (
                <div className={styles.hostAnswer}>
                  <strong>Correct response</strong>
                  <p>{active.answer}</p>
                  <small>{active.explanation}</small>
                </div>
              )}
              <div className={styles.hostMiniBoard}>
                {questions.map((question) => {
                  const used = usedQuestionIds.includes(question.id);
                  const current = active?.id === question.id;
                  return (
                    <button
                      key={question.id}
                      className={`${current ? styles.activeMini : ''} ${used ? styles.usedMini : ''}`}
                      aria-current={current ? 'true' : undefined}
                      aria-label={`${question.category || 'Question'} ${question.value} points${current ? ', current question' : ''}`}
                      disabled={used}
                      onClick={() => chooseQuestion(question)}
                    >
                      <span>
                        {current
                          ? 'Current question'
                          : question.category || 'Question'}
                      </span>
                      <strong>{question.value}</strong>
                    </button>
                  );
                })}
              </div>
              <p className={styles.hostHint}>
                Orange marks the current question; gray squares are used; green
                borders are available.
              </p>
            </>
          ) : (
            <div className={styles.finalResult}>
              <span className={styles.stageLabel}>GAME COMPLETE</span>
              <h3>Game complete</h3>
              <p>Final totals are shown below. The highest score wins.</p>
              <p className={styles.finalTotal}>
                All teams total: <strong>{totalScore} points</strong>
              </p>
              <div className={styles.finalRanking}>
                {ranking.map((item, index) => (
                  <div
                    className={styles.finalRow}
                    key={`${item.team}-${item.index}`}
                  >
                    <span>
                      {index + 1}. {item.team}
                    </span>
                    <strong>{item.score} points</strong>
                  </div>
                ))}
              </div>
              <button className={styles.primaryButton} onClick={resetGame}>
                Restart game
              </button>
            </div>
          )}
        </div>
        <aside className={styles.scoreCard}>
          <div className={styles.scoreHeader}>
            <span>Team totals · {teamNames.length}/8 teams</span>
            <button className={styles.textButton} onClick={clearScores}>
              Clear scores
            </button>
          </div>
          <p className={styles.scoreHint}>
            After revealing the answer, add or deduct the question value. Each
            team can adjust ±{currentQuestionValue || 0} for this question;
            totals carry across the game.
          </p>
          <div className={styles.totalScoreSummary}>
            <span>All teams total</span>
            <strong>{totalScore} points</strong>
          </div>
          {teamNames.map((team, index) => (
            <div className={styles.scoreRow} key={`${team}-${index}`}>
              <input
                aria-label={`Team ${index + 1} name`}
                value={team}
                onChange={(event) => updateTeam(index, event.target.value)}
              />
              <span className={styles.scoreControls}>
                <input
                  type="number"
                  className={styles.scoreValue}
                  aria-label={`${team} current total`}
                  title={
                    active
                      ? `Current question limit: ±${currentQuestionValue}`
                      : 'Team total'
                  }
                  value={scores[index] || 0}
                  onChange={(event) => updateScore(index, event.target.value)}
                />
                <button
                  aria-label={`Add ${currentQuestionValue} points to ${team}`}
                  title={
                    active && revealed
                      ? `Add ${currentQuestionValue} points to ${team}`
                      : 'Select a question and reveal the answer first'
                  }
                  disabled={!active || !revealed || !currentQuestionValue}
                  onClick={() => recordScore(index, currentQuestionValue)}
                >
                  +{currentQuestionValue}
                </button>
                <button
                  aria-label={`Deduct ${currentQuestionValue} points from ${team}`}
                  title={
                    active && revealed
                      ? `Deduct ${currentQuestionValue} points from ${team}`
                      : 'Select a question and reveal the answer first'
                  }
                  disabled={!active || !revealed || !currentQuestionValue}
                  onClick={() => recordScore(index, -currentQuestionValue)}
                >
                  −{currentQuestionValue}
                </button>
                <button
                  className={styles.historyButton}
                  onClick={() =>
                    setHistoryTeamIndex(
                      historyTeamIndex === index ? null : index
                    )
                  }
                >
                  View history
                </button>
              </span>
            </div>
          ))}
          {historyTeamIndex !== null && (
            <div className={styles.historyPanel}>
              <div className={styles.historyHeader}>
                <strong>
                  {teamNames[historyTeamIndex] ||
                    `Team ${historyTeamIndex + 1}`}{' '}
                  score history
                </strong>
                <button
                  className={styles.textButton}
                  onClick={() => setHistoryTeamIndex(null)}
                >
                  Close
                </button>
              </div>
              {selectedTeamHistory.length === 0 ? (
                <p className={styles.emptyHistory}>No scoring entries yet.</p>
              ) : (
                <ol>
                  {selectedTeamHistory
                    .slice()
                    .reverse()
                    .map((event) => (
                      <li key={event.id}>
                        <div>
                          <strong>
                            {event.category} · {event.value} points
                          </strong>
                          <span
                            className={
                              event.delta > 0
                                ? styles.positiveDelta
                                : styles.negativeDelta
                            }
                          >
                            {event.delta > 0 ? '+' : ''}
                            {event.delta} points
                          </span>
                        </div>
                        <p>{event.prompt}</p>
                        <small>
                          {event.delta > 0
                            ? 'Correct response'
                            : 'Incorrect response'}{' '}
                          ·{' '}
                          {new Date(event.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </small>
                      </li>
                    ))}
                </ol>
              )}
            </div>
          )}
          <div className={styles.teamActions}>
            <button onClick={addTeam} disabled={teamNames.length >= 8}>
              + Add team
            </button>
            <button onClick={removeTeam} disabled={teamNames.length <= 1}>
              − Remove team
            </button>
          </div>
          <div className={styles.roomCode}>
            <span>Student room</span>
            <strong>{roomCode}</strong>
            <small>Students enter this code; the host controls scoring</small>
            <div className={styles.qrVisual} aria-label="QR code visual">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
            <button
              className={styles.copyCode}
              onClick={() => navigator.clipboard?.writeText(roomCode)}
            >
              Copy room code
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}

function PlayerView({ code, exit }: { code: string; exit: () => void }) {
  return (
    <main className={styles.playerView}>
      <div className={styles.playerCard}>
        <span className={styles.brandMark}>Q</span>
        <p className={styles.eyebrow}>ROOM {code}</p>
        <h1>You’re in.</h1>
        <p>Your host will start the next question. Keep this page open.</p>
        <div className={styles.playerPulse}>
          <span /> Waiting for the host
        </div>
        <button className={styles.secondaryButton} onClick={exit}>
          Leave room
        </button>
      </div>
    </main>
  );
}
