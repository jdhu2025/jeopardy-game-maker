'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '@/shared/blocks/quizboard/quizboard-app.module.css';

type Board = { shareId: string; title: string; topic: string; audience: string; language: string; createdAt: string };

export default function BoardsPage() {
  const [query, setQuery] = useState('');
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function search(value = query) {
    setLoading(true); setError('');
    try {
      const response = await fetch(`/api/boards?q=${encodeURIComponent(value)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Search failed');
      setBoards(data.boards || []);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Search failed'); }
    finally { setLoading(false); }
  }

  useEffect(() => { void search(''); }, []);

  return <main className={styles.libraryPage}>
    <div className={styles.libraryHeader}>
      <Link className={styles.brand} href="/"><span className={styles.brandMark}>Q</span><span>quizboard<span className={styles.brandDot}>.</span></span></Link>
      <Link className={styles.ghostButton} href="/">Make a game</Link>
    </div>
    <section className={styles.libraryHero}>
      <p className={styles.eyebrow}>PUBLIC BOARD LIBRARY</p>
      <h1>Find a board worth playing.</h1>
      <p>Search public games shared by teachers, trainers, and hosts. Open one to review it, then make it your own.</p>
      <form className={styles.librarySearch} onSubmit={(event) => { event.preventDefault(); void search(); }}>
        <input aria-label="Search board topics" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search topics, subjects, or grades" />
        <button className={styles.primaryButton} type="submit">Search <span>↗</span></button>
      </form>
    </section>
    {error && <p className={styles.libraryError}>{error}</p>}
    <section className={styles.libraryGrid} aria-live="polite">
      {loading ? <p>Looking for boards…</p> : boards.length === 0 ? <p>No public boards match that topic yet.</p> : boards.map((board) => <Link className={styles.libraryCard} href={`/board/${board.shareId}`} key={board.shareId}>
        <span className={styles.libraryCardMeta}>{board.audience} · {board.language}</span>
        <h2>{board.title}</h2>
        <p>{board.topic}</p>
        <span className={styles.libraryCardLink}>Open board ↗</span>
      </Link>)}
    </section>
  </main>;
}
