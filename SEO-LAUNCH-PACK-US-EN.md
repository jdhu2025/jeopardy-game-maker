# Quizboard Maker: US/English Launch Pack

> 状态：W1 文案与基础素材完成，生产已核验；本地承诺校准尚未部署，外部提交暂停。  
> 使用范围：Product Hunt、Indie Hackers、AlternativeTo、SaaSHub、Crunchbase、教师/培训师外联。  
> 发布前门槛：生产站通过第 1 周验收；只使用与生产功能一致的版本。

## Product Facts: Approved for External Copy

- Brand: `Quizboard Maker`
- URL: `https://www.quizboardly.xyz`
- Category: `Education` / `Teacher Tools` / `Training` / `Productivity`，按平台现有分类选择最精确的一项。
- Core flow: Enter a topic, get an editable 5 by 5 quiz board, review questions and answers, then host the board on a shared screen.
- Editing: Users can edit prompts, answers, explanations, and points; individual questions can be rewritten.
- Offline: A reviewed board can be downloaded as a self-contained HTML game.
- No-account start: A visitor can begin creating a board without creating an account.

## Production Check Result

- Production generated a complete 25-question board, but the response identified it as a subject-grounded starter board. Treat the AI provider as unverified or unavailable.
- Production currently still displays “AI-powered” and room-code/QR claims. Local copy removes those claims, but this is not complete until the new version is deployed and rechecked.
- “AI-powered” or “AI-generated”: do not use unless `AI_API_URL`, `AI_API_KEY`, and `AI_MODEL` are configured and a production generation is verified as provider-backed.
- “Online multiplayer”, “real-time rooms”, “player collaboration”, “QR join”, or “live cross-device scoring”: do not use. The current MVP does not provide a verified real-time multiplayer service.
- “Private boards”: use only after an authenticated production save flow is verified.
- Pricing, free quota, customer counts, ratings, security/compliance claims, and outcome claims: do not invent; leave blank until evidence exists.

## Copy

### Tagline (55 characters)

Turn a topic into an editable quiz board in minutes.

### Short description (94 words)

Quizboard Maker turns a lesson, training topic, or event idea into an editable 5 by 5 quiz board. Start with a topic, review every question and answer, then host the game on a shared screen. Teachers can use it for classroom review, trainers can use it for team learning, and organizers can use it to make group activities more interactive. Edit prompts, explanations, and point values before you play. When internet access is uncertain, download a reviewed board as a self-contained offline HTML game. No account is required to start building.

### Long description (244 words)

Quizboard Maker is a quiz board builder for teachers, trainers, and group hosts who want a faster alternative to hand-building linked slides. Describe the lesson, training goal, or event topic you have in mind, then start from a structured 5 by 5 board that you can edit before anyone sees it.

The workflow is designed for review and facilitation, not just a grid of questions. Open the board, check every prompt and answer, rewrite individual questions when needed, adjust explanations and point values, and keep the final content aligned with the people in the room. A teacher can tailor a board to a specific unit; a trainer can turn a policy or product topic into a team activity; an event host can prepare a shared-screen quiz without wiring together a slide deck.

When the board is ready, use the host view to reveal questions, reveal answers, and manage team totals on one screen. You can also download a reviewed board as a self-contained HTML file for offline use.

Quizboard Maker is not an official Jeopardy product. It supports a category-and-points format that can be adapted for classroom review, training, and group activities. Start with a topic, keep control of the questions, and make the board fit your session.

## Submission Fields

| Field               | Approved value                                                                | Status                                                |
| ------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------- |
| Product name        | Quizboard Maker                                                               | Ready                                                 |
| Website             | https://www.quizboardly.xyz                                                   | Production accessible; copy update pending deployment |
| Tagline             | Turn a topic into an editable quiz board in minutes.                          | Ready                                                 |
| Short description   | Use the 94-word version above; shorten only without adding claims             | Ready                                                 |
| Long description    | Use the 244-word version above                                                | Ready                                                 |
| Logo                | `code/public/logo.png`, 1024×1024                                             | Ready                                                 |
| Social preview      | `code/public/preview.png`, 2540×1350                                          | Ready                                                 |
| Product screenshots | Need 3-5 captures of the corrected production release                         | Blocked by deployment, not browser access             |
| Demo video          | Need 30-60 second recording of the corrected production flow                  | Blocked by deployment                                 |
| Support email       | Not found in repository configuration                                         | Needs owner input                                     |
| Pricing             | Not verified                                                                  | Leave blank / do not claim                            |
| UTM convention      | `utm_source={platform-domain}&utm_medium=referral&utm_campaign=launch_2026q4` | Ready                                                 |

## Channel Notes

| Channel                | Target URL                                             | Framing                                                                         | Do not say                                                |
| ---------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Product Hunt           | `/jeopardy-game-maker` after corrected release         | Editable quiz boards for classroom review and team learning                     | Real-time player rooms, unverified AI claims              |
| Indie Hackers          | `/how-to-make-a-jeopardy-game` after corrected release | Build story: replacing hand-linked review slides with a review-first board flow | Rankings, revenue, or user count claims                   |
| AlternativeTo          | `/jeopardy-game-maker` after corrected release         | A category-and-points quiz board alternative for shared-screen review           | Official affiliation with Jeopardy                        |
| SaaSHub / Crunchbase   | Homepage after corrected release                       | Product entity and intended audience                                            | Funding, team, pricing, or review claims without evidence |
| Teacher / L&D outreach | A future reviewed template URL                         | A specific, usable lesson/training template with author review                  | Generic link-exchange request                             |
