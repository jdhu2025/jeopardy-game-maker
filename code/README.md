# Quizboard Maker app

This app uses the ShipAny Two Next.js architecture copied from `/Users/Zhuanz/code/shipany-two/shipany-template-dev` and adapts its public landing route for the Quizboard Maker MVP.

## Run

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`. The default locale route is `/` because the template uses `localePrefix: "as-needed"`.

## AI configuration

AI settings are intentionally blank:

- `.env.example` contains `AI_API_URL`, `AI_API_KEY`, and `AI_MODEL`.
- `config/ai.config.example.json` documents the future budget and token fields.

When these variables are blank, `/api/quiz/generate` returns a local demo board so the product flow can be reviewed without an API key. When configured, the route expects an OpenAI-compatible chat response (`choices[0].message.content`) or `output_text`.

For a real AI test, copy the example to `.env.local` and fill all three values. `.env.example` is documentation only and is never loaded by Next.js:

```bash
cp .env.example .env.local
```

The current adapter requires `AI_API_URL`, `AI_API_KEY`, and `AI_MODEL`. `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_APP_NAME`, database variables, and `AUTH_SECRET` are optional for the public generator/board flow; authentication, database persistence, and admin routes will need their own values when those features are enabled.

## MVP route

- `src/app/[locale]/(landing)/page.tsx`: Quizboard Maker landing page.
- `src/app/[locale]/(landing)/[...slug]/page.tsx`: long-tail keyword routes with prefilled game prompts.
- `src/shared/blocks/quizboard/quizboard-app.tsx`: generator, board editor, Supabase save, local fallback and host mode.
- `src/app/api/quiz/generate/route.ts`: demo generator and AI provider adapter.
- `src/app/api/boards/route.ts`: public board save and topic search API.
- `src/app/[locale]/(landing)/boards/page.tsx`: public board library.
- `src/app/[locale]/(landing)/board/[shareId]/page.tsx`: shared board view.

The MVP now includes generation, editing, browser fallback plus Supabase board persistence, public board search/share links, feedback persistence, board hosting, local scores, long-tail landing routes, and the room-code presentation. Multi-device realtime rooms, QR rendering, authentication and provider-specific AI schemas remain future work.

Board visibility and permissions: anonymous saves are public-only; signed-in users can save public or private boards and delete their own boards; `admin` and `super_admin` users can delete any board. These checks run in the server API, not only in the UI.

## Supabase setup

Set `DATABASE_PROVIDER=postgresql` and `DATABASE_URL` in `.env.local`. The URL may be a quoted Supabase connection string. Apply the generated migration before testing save/search:

```bash
pnpm db:migrate
```

The read-only connection check should be run from a network that can reach the Supabase database host. If direct port `5432` access is blocked, use Supabase's pooler connection string instead.
