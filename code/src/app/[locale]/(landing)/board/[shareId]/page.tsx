import Link from 'next/link';
import { notFound } from 'next/navigation';
import { and, eq } from 'drizzle-orm';

import { db } from '@/core/db';
import { quizBoard } from '@/config/db/schema';
import { QuizboardApp } from '@/shared/blocks/quizboard/quizboard-app';
import { getSignUser } from '@/shared/models/user';
import { hasAnyRole, ROLES } from '@/shared/services/rbac';

export default async function SharedBoardPage({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const { shareId } = await params;
  let row;
  const sessionUser = await getSignUser();
  try {
    [row] = await db()
      .select()
      .from(quizBoard)
      .where(
        and(
          eq(quizBoard.shareId, shareId.toUpperCase()),
          sessionUser ? undefined : eq(quizBoard.isPublic, true)
        )
      )
      .limit(1);
  } catch {
    notFound();
  }
  if (!row) notFound();
  if (!row.isPublic && row.userId !== sessionUser?.id) notFound();
  let board;
  try {
    board = JSON.parse(row.board);
  } catch {
    notFound();
  }
  const canDelete =
    !!sessionUser &&
    (row.userId === sessionUser.id ||
      (await hasAnyRole(sessionUser.id, [ROLES.ADMIN, ROLES.SUPER_ADMIN])));
  return (
    <>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '18px 5vw 0' }}>
        <Link href="/boards">← Browse public boards</Link>
      </div>
      <QuizboardApp
        initialTopic={row.topic}
        initialGame={board}
        initialShareId={row.shareId}
        canDelete={canDelete}
      />
    </>
  );
}
