# Grok Bot Execution Setup

> Goal: run a daily, unattended, evidence-tracked distribution batch for Quizboard Maker.
> Suggested schedule: every day at 09:00, `Asia/Shanghai`.
> This file contains no passwords, tokens, inbox addresses, or API keys.

## One-time Workspace upload

Create a Workspace folder named `quizboard-grok-assets` and upload these files:

- `GROK-LOCAL-IMPORT.md`
- `GROK-LOCAL-MANIFEST.json`

- `GROK-BACKLINK-AGENT-BRIEF.md`
- `GROK-EXECUTION-SETUP.md`
- `SEO-LAUNCH-PACK-US-EN.md`
- `SEO-CHANNEL-TRACKER-US-EN.md`
- `SEO-EXECUTION-STATUS.md`
- `SEO-TEMPLATE-EDITORIAL-REVIEW.md`
- `BRAND-ACCOUNT-PACK.md`
- `backlink-queue.csv`
- `code/public/logo.png`
- `code/public/logo.svg`
- `code/public/favicon.ico`
- `code/public/preview.png`
- `code/public/seo-assets/quizboard-landing.png`
- `code/public/seo-assets/quizboard-review.png`
- `code/public/seo-assets/quizboard-host.png`
- `promo-video/out/final-1080p.mp4`

If the local Grok client can read the repository directly, add `/Users/ken/hjd/code/SEO/jeopardy-game-maker` as its Workspace/Project folder instead of uploading duplicates. Read `GROK-LOCAL-IMPORT.md` first so the client knows how to reload changed assets and write back to `backlink-queue.csv`.

Keep `promo-video/out/check_final-1080p.jpg` as internal visual QA evidence. It does not need to be uploaded to a public listing.

## Cloudflare support alias

Create `support@quizboardly.xyz` with Cloudflare Email Routing and forward it to a separate, real receiving mailbox used by Grok. The destination may be the Grok bot's own inbox if that inbox can receive ordinary mail and is different from `support@quizboardly.xyz`. Do not route the alias to itself.

Cloudflare requires a one-time destination verification. After that, send a test message and record the route as verified outside the prompt. Email Routing is inbound only; it does not authorize outbound mail as the support alias.

If a platform asks for domain ownership proof, a personal-owner click, or a reply from the domain address, Grok must skip the site and log `skipped_owner_action`. Routine verification links sent to the bot inbox may be handled by the email routine in the brief.

## One-time Grok permissions

1. Sign in to the Grok account that will own the routine.
2. Grant only the browser, Workspace, inbox, and GitHub permissions needed for the distribution workflow.
3. Configure any password-manager or secrets-vault access through the supported account interface. Never paste credentials into a prompt or file.
4. Paste the `Grok master prompt` from section 12 of `GROK-BACKLINK-AGENT-BRIEF.md` once.
5. Confirm that the agent can read the Workspace folder and update `backlink-queue.csv`.
6. Confirm the real brand account is logged in only where a platform requires an account. Do not create an invented founder identity.

If the local Grok client exposes a setting named `经此电脑转发流量` or similar, you may enable it manually in that client. The client must remain open for it to work. This may change the network exit used by browser sessions, but it does not bypass hCaptcha/CAPTCHA and does not change the rule to skip a site when a challenge appears.

## Daily routine to create

Create a recurring Grok Routine with these settings:

- Name: `Quizboard Maker Daily Distribution`
- Schedule: daily at `09:00 Asia/Shanghai`
- Approval behavior: do not ask for batch approval
- Notifications: stay quiet when the queue is unchanged; notify only for a completed batch, failure, owner action, payment, or platform control
- Workspace: `quizboard-grok-assets`

Paste this routine prompt:

```text
Run today's unattended Quizboard Maker distribution batch.

Read GROK-LOCAL-MANIFEST.json, GROK-LOCAL-IMPORT.md, GROK-BACKLINK-AGENT-BRIEF.md, GROK-EXECUTION-SETUP.md, SEO-LAUNCH-PACK-US-EN.md, SEO-CHANNEL-TRACKER-US-EN.md, SEO-EXECUTION-STATUS.md, BRAND-ACCOUNT-PACK.md, SEO-TEMPLATE-EDITORIAL-REVIEW.md, and backlink-queue.csv first.

Do not ask me to approve a batch. Skip any domain already submitted, published, rejected, stopped, or under cooldown. Discover and vet relevant education, teacher-tool, classroom-resource, training/L&D, quiz/presentation, and clearly relevant GitHub opportunities. Select 6-12 highest-fit eligible free sites, submit sequentially, and update backlink-queue.csv immediately after each result.

Use only approved product facts. Never invent a founder, company, price, funding, team, customer, review, or performance claim. Do not claim AI-powered generation, online multiplayer, QR joining, real-time rooms, or official Jeopardy affiliation. Never bypass CAPTCHA, rate limits, login controls, payment, domain ownership, legal acceptance, or platform rules.

Use support@quizboardly.xyz only if the Cloudflare route is verified in the account. Normal one-click verification links in the bot inbox may be opened by the email routine. Domain-owner checks, personal-owner clicks, unknown conditions, and missing facts must be logged and skipped without asking me.

For GitHub, read README and CONTRIBUTING, open at most 2-4 relevant PRs, and record every PR URL. Do not send unsolicited emails or DMs. Never mark a site published without a live URL or direct evidence.

Return the Daily Report from the brief. Keep the routine quiet when nothing meaningful changed.
```

## Inbox verification routine

If Grok supports a separate recurring inbox routine, create one named `Quizboard Maker Submission Verification` and paste the email routine from section 14 of the brief. Run it frequently enough to catch normal verification mail, but keep the same skip rules for domain-owner actions, payment links, password resets, marketing links, and unrelated mail.

## First-run acceptance test

The first unattended run is considered configured only when it can:

- read all Workspace assets;
- parse the 31-column CSV and preserve one row per domain;
- vet a real submission page before attempting a form;
- skip payment, CAPTCHA, unknown rules, and unsupported facts without asking;
- capture a confirmation URL or screenshot for every actual submission;
- return a Daily Report with domains, decisions, reasons, and next checks.

If a capability is missing in the Grok account, do not simulate it. Keep the routine enabled for discovery and logging, and record the missing capability in the report.
