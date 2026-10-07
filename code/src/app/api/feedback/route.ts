import { NextResponse } from 'next/server';
import { db } from '@/core/db';
import { quizFeedback } from '@/config/db/schema';
import { getUuid } from '@/shared/lib/hash';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  if (!String(body.message || '').trim()) return NextResponse.json({ error: 'Feedback is required.' }, { status: 400 });
  const message = String(body.message).trim().slice(0, 4000);
  const page = String(body.page || '/').slice(0, 300);
  try {
    await db().insert(quizFeedback).values({ id: getUuid(), message, page, category: body.category ? String(body.category).slice(0, 80) : null });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[quizboard feedback]', error);
    return NextResponse.json({ error: 'Feedback could not be saved right now.' }, { status: 503 });
  }
}
