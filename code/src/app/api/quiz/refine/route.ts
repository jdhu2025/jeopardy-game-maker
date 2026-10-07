import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const topic = String(body.topic || '').trim();
  const instruction = String(body.instruction || '').trim();
  if (!topic || !instruction) return NextResponse.json({ error: 'Topic and instruction are required.' }, { status: 400 });
  const { AI_API_URL, AI_API_KEY, AI_MODEL } = process.env;
  if (AI_API_URL && AI_API_KEY && AI_MODEL) {
    try {
      const upstream = await fetch(AI_API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${AI_API_KEY}` }, body: JSON.stringify({ model: AI_MODEL, temperature: 0.4, messages: [{ role: 'user', content: `Rewrite this quiz game theme in one concise sentence. Keep the subject and add the user's adjustment. Return JSON only as {"topic":"..."}. Theme: ${topic}. Adjustment: ${instruction}.` }] }) });
      if (upstream.ok) {
        const payload = await upstream.json();
        const raw = payload.choices?.[0]?.message?.content || payload.output_text || '{}';
        const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
        const parsed = JSON.parse(fenced ? fenced[1] : raw);
        if (parsed.topic) return NextResponse.json({ topic: String(parsed.topic) });
      }
    } catch { /* use the local refinement below */ }
  }
  return NextResponse.json({ topic: `${topic} — ${instruction}` });
}
