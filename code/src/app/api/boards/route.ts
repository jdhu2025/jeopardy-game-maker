import { NextResponse } from 'next/server';
import { and, desc, eq, ilike, or } from 'drizzle-orm';

import { db } from '@/core/db';
import { quizBoard } from '@/config/db/schema';
import { getUuid } from '@/shared/lib/hash';
import { getSignUser } from '@/shared/models/user';
import { hasAnyRole, ROLES } from '@/shared/services/rbac';

const MAX_BOARD_BYTES = 500_000;

function publicBoard(row: typeof quizBoard.$inferSelect) {
  let board: unknown;
  try {
    board = JSON.parse(row.board);
  } catch {
    board = null;
  }
  return {
    id: row.id,
    shareId: row.shareId,
    title: row.title,
    topic: row.topic,
    audience: row.audience,
    language: row.language,
    board,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q')?.trim().slice(0, 120) || '';
  const shareId = url.searchParams.get('shareId')?.trim();
  const limit = Math.min(
    Math.max(Number(url.searchParams.get('limit')) || 24, 1),
    50
  );
  try {
    const sessionUser = shareId ? await getSignUser() : null;
    const rows = await db()
      .select()
      .from(quizBoard)
      .where(
        and(
          shareId && sessionUser
            ? or(
                eq(quizBoard.isPublic, true),
                eq(quizBoard.userId, sessionUser.id)
              )
            : eq(quizBoard.isPublic, true),
          shareId ? eq(quizBoard.shareId, shareId) : undefined,
          query
            ? or(
                ilike(quizBoard.topic, `%${query.replace(/[%_]/g, '')}%`),
                ilike(quizBoard.title, `%${query.replace(/[%_]/g, '')}%`)
              )
            : undefined
        )
      )
      .orderBy(desc(quizBoard.updatedAt))
      .limit(shareId ? 1 : limit);
    return NextResponse.json({ boards: rows.map(publicBoard) });
  } catch (error) {
    console.error('[quizboard boards GET]', error);
    return NextResponse.json(
      { error: 'Board search is temporarily unavailable.' },
      { status: 503 }
    );
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const game = body.board && typeof body.board === 'object' ? body.board : null;
  if (
    !game ||
    !String(game.title || '').trim() ||
    !String(game.topic || '').trim()
  ) {
    return NextResponse.json(
      { error: 'A board title and topic are required.' },
      { status: 400 }
    );
  }
  const board = JSON.stringify(game);
  if (Buffer.byteLength(board, 'utf8') > MAX_BOARD_BYTES) {
    return NextResponse.json(
      { error: 'This board is too large to save.' },
      { status: 413 }
    );
  }
  try {
    const sessionUser = await getSignUser();
    const isPublic = body.isPublic !== false;
    if (!isPublic && !sessionUser) {
      return NextResponse.json(
        { error: 'Sign in to save a private board.' },
        { status: 401 }
      );
    }
    const requestedShareId = String(body.shareId || '')
      .trim()
      .toUpperCase();
    const id = getUuid();
    const shareId =
      requestedShareId || id.replace(/-/g, '').slice(0, 12).toUpperCase();
    const values = {
      id,
      shareId,
      title: String(game.title).slice(0, 180),
      topic: String(game.topic).slice(0, 500),
      audience: String(game.audience || 'Classroom').slice(0, 80),
      language: String(game.language || 'English').slice(0, 80),
      board,
      isPublic,
      userId: sessionUser?.id,
    };
    const { id: _newId, ...updateValues } = values;
    let [row] = requestedShareId
      ? await db()
          .select()
          .from(quizBoard)
          .where(eq(quizBoard.shareId, requestedShareId))
          .limit(1)
      : await db().insert(quizBoard).values(values).returning();
    if (requestedShareId) {
      if (!row)
        return NextResponse.json(
          { error: 'The saved board could not be found.' },
          { status: 404 }
        );
      const isAdmin = sessionUser
        ? await hasAnyRole(sessionUser.id, [ROLES.ADMIN, ROLES.SUPER_ADMIN])
        : false;
      if (!sessionUser || (!isAdmin && row.userId !== sessionUser.id)) {
        return NextResponse.json(
          { error: 'Only the board owner can update this board.' },
          { status: 403 }
        );
      }
      [row] = await db()
        .update(quizBoard)
        .set({ ...updateValues, userId: row.userId || sessionUser.id })
        .where(eq(quizBoard.shareId, requestedShareId))
        .returning();
    }
    if (!row)
      return NextResponse.json(
        { error: 'The saved board could not be found.' },
        { status: 404 }
      );
    return NextResponse.json({
      board: publicBoard(row),
      shareUrl: `/board/${shareId}`,
    });
  } catch (error) {
    console.error('[quizboard boards POST]', error);
    return NextResponse.json(
      { error: 'Board could not be saved. Check the database setup.' },
      { status: 503 }
    );
  }
}

export async function DELETE(request: Request) {
  const shareId = new URL(request.url).searchParams
    .get('shareId')
    ?.trim()
    .toUpperCase();
  if (!shareId)
    return NextResponse.json(
      { error: 'A board share code is required.' },
      { status: 400 }
    );
  try {
    const sessionUser = await getSignUser();
    if (!sessionUser)
      return NextResponse.json(
        { error: 'Sign in to delete a board.' },
        { status: 401 }
      );
    const [row] = await db()
      .select({ id: quizBoard.id, userId: quizBoard.userId })
      .from(quizBoard)
      .where(eq(quizBoard.shareId, shareId))
      .limit(1);
    if (!row)
      return NextResponse.json({ error: 'Board not found.' }, { status: 404 });
    const isAdmin = await hasAnyRole(sessionUser.id, [
      ROLES.ADMIN,
      ROLES.SUPER_ADMIN,
    ]);
    if (!isAdmin && row.userId !== sessionUser.id)
      return NextResponse.json(
        { error: 'You can only delete your own boards.' },
        { status: 403 }
      );
    await db().delete(quizBoard).where(eq(quizBoard.id, row.id));
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[quizboard boards DELETE]', error);
    return NextResponse.json(
      { error: 'Board could not be deleted right now.' },
      { status: 503 }
    );
  }
}
