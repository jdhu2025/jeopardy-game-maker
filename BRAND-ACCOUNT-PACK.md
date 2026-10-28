# Quizboard Maker Brand Account Pack

> Version: 2026-10-28
> Status: copy and assets prepared; account handles and Cloudflare routing are not verified until the owner completes the one-time setup.

## Canonical identity

- Brand: `Quizboard Maker`
- Website: `https://www.quizboardly.xyz`
- Support alias to create: `support@quizboardly.xyz`
- Tagline: `Turn a topic into an editable quiz board in minutes.`
- Audience: teachers, trainers, and group hosts
- Categories: Education, Teacher Tools, Training, Productivity
- Primary product path: `https://www.quizboardly.xyz/jeopardy-game-maker`
- Support routing state: `planned_unverified`

Do not invent a founder name, company address, founding year, pricing, funding, customer count, rating, or team size. If a platform requires one of those fields, leave it blank when allowed; otherwise skip the submission and record `skipped_missing_fact`.

## Handle candidates

Try these in order and record the actual handle only after registration succeeds:

1. `@quizboardmaker`
2. `@quizboardly`
3. `@quizboardlyapp`
4. `@quizboardly_xyz`

These are availability candidates, not existing accounts. Grok must not claim that any handle is registered until it can see the account page.

## Copy bank

### One-line bio

`Editable 5x5 quiz boards for classroom review, training sessions, and shared-screen group activities.`

### Short profile

`Quizboard Maker turns a lesson, training topic, or event idea into an editable 5x5 quiz board. Review every question and answer, then host it on a shared screen or download a reviewed board as a self-contained HTML game.`

### Product Hunt profile

- Tagline: `Turn a topic into an editable quiz board in minutes.`
- Description: `Quizboard Maker helps teachers, trainers, and group hosts build a 5x5 quiz board from a topic, review and edit every question, host it on a shared screen, and download a reviewed board for offline use.`
- Topics: `Education`, `Teacher Tools`, `Productivity`, `Training`
- Website: `https://www.quizboardly.xyz/jeopardy-game-maker`

### Indie Hackers profile

`I am building Quizboard Maker for people who still spend too much time wiring quiz categories, answer slides, and score tracking by hand. The workflow starts with a topic, creates an editable 5x5 board, lets the host review every question, and provides a shared-screen host view plus an offline HTML download.`

### AlternativeTo listing

- Name: `Quizboard Maker`
- Type: `Education / Quiz / Presentation alternative`
- Description: `A category-and-points quiz board for classroom review, training, and group activities. Start with a topic, edit the questions and answers, host the board on a shared screen, and download a reviewed offline HTML game.`
- Official affiliation note: `Quizboard Maker is not an official Jeopardy product.`

### SaaSHub or directory listing

`Quizboard Maker is a quiz board builder for teachers, trainers, and group hosts. It creates a structured 5x5 board from a topic, keeps prompts, answers, explanations, and points editable, and provides a shared-screen host view and self-contained offline HTML download.`

### GitHub list description

`Quizboard Maker - Editable 5x5 quiz boards for classroom review, training sessions, and shared-screen group activities. Users can review and edit questions before hosting, then download a reviewed board as a self-contained HTML game.`

Use the clean URL `https://www.quizboardly.xyz/jeopardy-game-maker` in GitHub PR text unless the repository explicitly documents another convention.

## Asset manifest

| Asset | Local path | Use |
|---|---|---|
| Logo | `code/public/logo.png` | avatar, directory logo |
| Logo source | `brand/quizboard-maker-mark.svg` | editable vector source |
| Favicon | `code/public/favicon.ico` | browser tab icon |
| Social preview | `code/public/preview.png` | directory or launch preview |
| Landing screenshot | `code/public/seo-assets/quizboard-landing.png` | topic input / first step |
| Review screenshot | `code/public/seo-assets/quizboard-review.png` | editing and answer review |
| Host screenshot | `code/public/seo-assets/quizboard-host.png` | shared-screen host view |
| Final demo video | `promo-video/out/final-1080p.mp4` | Product Hunt or directory demo |
| Video preview | `promo-video/out/preview.mp4` | local review fallback |

The final video is a 48-second 1920x1080 composition showing topic input, review, host mode, and offline download. It does not claim AI generation, online multiplayer, QR joining, real-time cross-device scoring, pricing, or performance results.

## Cloudflare Email Routing setup

`support@quizboardly.xyz` is the public-facing alias. It must forward to a different, real receiving mailbox used by the Grok workflow, for example the Grok account's own inbox. Never route the alias to itself, because that creates a loop or is rejected.

One-time setup in Cloudflare:

1. Open the `quizboardly.xyz` zone in Cloudflare.
2. Open `Email` -> `Email Routing` and enable routing if it is not enabled.
3. Add the destination mailbox used by Grok. Cloudflare sends a verification message to that destination; complete this one-time verification.
4. Add a custom address `support` and select the verified Grok destination.
5. Confirm that Cloudflare added the required MX and SPF-related DNS records, without deleting existing mail records.
6. Send a test email from a separate mailbox and confirm that it arrives in the Grok inbox.

Important limitations:

- Email Routing is inbound forwarding. It does not by itself authorize Grok to send mail as `support@quizboardly.xyz`.
- If a site requires a reply from the domain address, domain ownership proof, or an owner click, Grok must skip it and log `skipped_owner_action`.
- Do not put the private destination address, password, or verification token into the Grok prompt or repository.
- After the destination is verified, routine one-click verification links from ordinary submissions may be handled by the email routine in `GROK-BACKLINK-AGENT-BRIEF.md`.

## Account setup boundaries

Grok can use this pack after the owner has logged in and granted the minimum browser, Workspace, inbox, and GitHub permissions. Actual account creation still needs the platform's login, email verification, and any legally required identity information. Grok must not create fake identities or bypass those gates.

## Claims to keep out of every profile

- `AI-powered` or `AI-generated` unless provider-backed production generation is verified.
- Online multiplayer, real-time rooms, QR join, player collaboration, or live cross-device scoring.
- Official affiliation with Jeopardy.
- Pricing, free quotas, customer counts, ratings, funding, revenue, or outcome claims.
- OSHA compliance or legal advice for the workplace safety template.
