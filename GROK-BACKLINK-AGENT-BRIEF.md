# Grok 外链执行 Brief：Quizboard Maker

> 目的：把人工审核过的外链研究、目录提交、GitHub 资源列表 PR 和后续跟进交给 Grok Bot 的 agent 流程执行。
> 版本：2026-10-28。本文档不包含密码、验证码、API key 或任何登录凭据。

## 0. 先读这几份资料

在开始任何外部提交前，读取并以它们为准：

- `SEO-LAUNCH-PACK-US-EN.md`：对外产品事实、英文文案、图片和渠道定位。
- `SEO-CHANNEL-TRACKER-US-EN.md`：首批渠道、候选外联对象和状态变更规则。
- `SEO-EXECUTION-STATUS.md`：当前线上证据、剩余门禁和已知限制。
- `code/public/logo.png`
- `code/public/preview.png`
- `code/public/seo-assets/quizboard-landing.png`
- `code/public/seo-assets/quizboard-review.png`
- `code/public/seo-assets/quizboard-host.png`
- `BRAND-ACCOUNT-PACK.md`
- `GROK-EXECUTION-SETUP.md`
- `SEO-TEMPLATE-EDITORIAL-REVIEW.md`
- `promo-video/out/final-1080p.mp4`

如果 Grok Workspace 不能直接访问本地仓库，先把上述 Markdown 和图片上传到一个名为 `quizboard-grok-assets` 的 Workspace 文件夹，再开始任务。

## 1. 产品事实白名单

只使用以下已经核实的事实：

- Brand: `Quizboard Maker`
- Website: `https://www.quizboardly.xyz`
- Support alias: `support@quizboardly.xyz` (planned Cloudflare alias; `unverified` until the destination is verified and a test message arrives)
- Audience: teachers, trainers, and group hosts
- Categories: Education, Teacher Tools, Training, Productivity
- Core flow: enter a topic, start from an editable 5 by 5 quiz board, review prompts and answers, then host it on a shared screen.
- Editing: users can edit prompts, answers, explanations, point values, and individual questions.
- Offline: a reviewed board can be downloaded as a self-contained HTML game.
- Account: visitors can start building without an account.
- Approved tagline: `Turn a topic into an editable quiz board in minutes.`

Approved English description:

> Quizboard Maker turns a lesson, training topic, or event idea into an editable 5 by 5 quiz board. Start with a topic, review every question and answer, then host the game on a shared screen. Teachers can use it for classroom review, trainers can use it for team learning, and organizers can use it to make group activities more interactive. Edit prompts, explanations, and point values before you play. When internet access is uncertain, download a reviewed board as a self-contained offline HTML game. No account is required to start building.

## 2. Claims that are forbidden

Never claim or imply any of the following:

- AI-powered or AI-generated, unless a provider-backed production generation has been verified first.
- Online multiplayer, real-time rooms, player collaboration, QR join, cross-device scoring, or live player devices.
- Private boards, saved boards, pricing, free quotas, customer counts, ratings, security/compliance, or performance outcomes unless fresh evidence is provided.
- Official affiliation with Jeopardy. Use `Jeopardy-style` only when useful and add the existing disclaimer where appropriate.
- Funding, revenue, team size, launch results, reviews, or user numbers that are not in the approved asset pack.

Never invent a founder name, company address, founding year, pricing, funding status, monthly revenue, testimonial, review, or email address. If a form requires unavailable information, stop and mark the site `skipped_missing_fact`.

The prepared brand copy, handle candidates, screenshots, video, and Cloudflare routing instructions are in `BRAND-ACCOUNT-PACK.md`. The three starter templates have editorial QA records in `SEO-TEMPLATE-EDITORIAL-REVIEW.md`; they are not represented as external teacher or EHS sign-off. Do not publish a template URL until a real domain reviewer has completed the required fields.

## 3. Goal and operating model

The objective is qualified referral exposure and useful distribution, not a raw backlink count. Prefer sites where a teacher, trainer, event host, or education-tool buyer could realistically discover Quizboard Maker.

Use four stages:

1. `discover`: collect candidate sites from relevant directories, submission lists, public datasets, and GitHub lists.
2. `vet`: inspect the real submission page and classify cost, queue, audience fit, content quality, and requirements.
3. `submit`: submit only the approved daily batch, one time per site, with the correct UTM URL and truthful product facts.
4. `follow_up`: check receipts, moderation status, live URLs, expiry dates, GitHub PR status, and referral evidence.

Each daily run must end with a report and a durable queue update. Never submit first and reconstruct the evidence later.

Recommended daily limits:

- Discover and vet: 20-50 candidates.
- Submit: 6-12 low-risk, relevant sites per batch.
- GitHub: at most 2-4 highly relevant PRs per run, each following the repository's contribution rules.
- Relationship outreach: at most 2 personalized contacts per run.
- Stop the run when the batch has 2 consecutive failures, a platform asks for payment, or a human approval gate appears.

## 4. Hard submission rules

### Auto-allowed after vetting

- A real, relevant, publicly open submission form.
- Free submission or a clearly free queue, with no hidden payment requirement discovered.
- No reciprocal link, badge, mandatory vote/like/comment farming, or fake review.
- Truthful fields can be completed from the asset pack.
- One submission per domain, with a receipt or visible confirmation captured.

### Always skip or pause

- Paid-only, free-to-submit-but-paid-to-publish, or unexplained checkout.
- Required backlink, reciprocal dofollow exchange, badge placement, or embed code on Quizboard Maker.
- Bulk account creation, fake profiles, forum signature links, or personal bio links created only for SEO.
- CAPTCHA solving, rate-limit bypass, login bypass, proxy rotation to evade controls, or ToS violations.
- Upvote/comment tasks that are not genuinely relevant. A genuine community action may be proposed, but do not perform it automatically.
- Adult, gambling, pharma, piracy, malware, scraped-content, PBN, or obvious AI-directory spam sites.
- Forms requiring unsupported facts or a fabricated identity.
- Any action involving payment, legal acceptance, domain ownership proof, or a personal email verification that the owner must click.

When uncertain, do not guess. Put the site in `needs_owner_review` with the exact question, URL, screenshot, and proposed action.

The owner may manually enable a local Grok client option such as `经此电脑转发流量` if the client provides it. This only changes the browser's network path while that computer and client remain running; it is not a CAPTCHA solver or a guarantee that a challenge will disappear. Never automate CAPTCHA solving or use traffic forwarding to evade a site's controls. If hCaptcha or another CAPTCHA appears, log `skipped_platform_control` and continue.

## 5. Prioritization

Score each candidate from 0 to 5 for each dimension:

- `audience_fit`: teachers, trainers, education-tool buyers, event hosts, or relevant product builders.
- `intent_fit`: the page helps users find a quiz-board, classroom-review, training, or presentation alternative.
- `editorial_quality`: real site, maintained content, clear ownership, and useful pages.
- `submission_fit`: open free submission with reasonable moderation and no manipulative conditions.
- `referral_potential`: a realistic chance of relevant visitors, not just a crawled link.

Submit only when `audience_fit >= 3`, `intent_fit >= 3`, `editorial_quality >= 2`, and `submission_fit >= 3`. Prefer a smaller set with strong fit over a large generic directory list.

Search directions for this product:

- classroom review games, teacher tools, education technology, lesson resources;
- training tools, L&D resources, workshop activities, team learning;
- quiz tools, presentation alternatives, shared-screen classroom activities;
- GitHub `awesome` lists for education, teaching resources, classroom tools, training, productivity, or relevant startup resources.

Do not repeatedly scrape the same generic AI-tool submission lists. Change the search angle by audience, use case, geography, or language.

## 6. Submission URLs and UTM rules

Use only the target page that matches the channel:

- Product Hunt: `https://www.quizboardly.xyz/jeopardy-game-maker?utm_source=producthunt.com&utm_medium=referral&utm_campaign=launch_2026q4`
- Indie Hackers: `https://www.quizboardly.xyz/how-to-make-a-jeopardy-game?utm_source=indiehackers.com&utm_medium=referral&utm_campaign=launch_2026q4`
- AlternativeTo: `https://www.quizboardly.xyz/jeopardy-game-maker?utm_source=alternativeto.net&utm_medium=referral&utm_campaign=launch_2026q4`
- SaaSHub: `https://www.quizboardly.xyz/?utm_source=saashub.com&utm_medium=referral&utm_campaign=launch_2026q4`
- Crunchbase: `https://www.quizboardly.xyz/?utm_source=crunchbase.com&utm_medium=referral&utm_campaign=launch_2026q4`

For a new domain, use:

`https://www.quizboardly.xyz/<relevant-path>?utm_source=<normalized-domain>&utm_medium=referral&utm_campaign=launch_2026q4`

Do not use a generic homepage when a relevant page exists. Do not add UTM parameters to GitHub PR text unless the repository convention allows it; use the clean relevant URL when the list is intended for humans.

## 7. Queue CSV schema

Create and maintain `backlink-queue.csv` in the Workspace. One row per domain, never one row per attempt. Required columns:

```text
candidate_url,domain,source,submission_url,category,audience_fit,intent_fit,editorial_quality,submission_fit,referral_potential,free_type,price,queue_days,requires_login,requires_domain_email,requires_reciprocal_link,requires_badge,requires_votes,requires_payment,decision,status,reason,submitted_at,confirmation_url,live_url,follow_type,expiry_date,next_check_at,utm_url,screenshot_path,notes
```

Allowed `free_type` values:

- `free_immediate`
- `free_queue`
- `free_but_paid_to_publish`
- `paid_only`
- `unknown`

Allowed `status` values:

- `discovered`, `vetted`, `ready`, `needs_owner_review`, `submitted`, `under_review`, `scheduled`, `published`, `rejected`, `skipped`, `expired`, `stopped`

For every submitted site, record the exact submission URL, timestamp, confirmation or receipt, live URL when available, follow type if visible, expiry date if stated, and the next check date. Never report `published` without a live URL or direct evidence.

## 8. Autonomous mode and one-time setup

Run in unattended mode after the one-time account setup. Do not pause for routine approval and do not ask the owner to approve a daily batch. Apply this decision table:

| Situation | Autonomous action |
|---|---|
| Clearly free, relevant form; truthful fields available | Submit automatically |
| Normal verification email in the bot inbox | Open the exact verification link automatically and log it |
| GitHub repository has clear contribution rules and the product is relevant | Open the PR automatically and log the PR URL |
| Scheduled publication or moderation receipt | Record the date and set the next check automatically |
| Paid option, payment, reciprocal link, badge, partner page, or embed | Skip and log `skipped_policy` |
| Domain ownership email, personal identity, legal acceptance, or unsupported fact | Skip and log `skipped_owner_action` |
| CAPTCHA, rate limit, anti-bot wall, or unclear platform rule | Stop that site, log `skipped_platform_control`, continue with the next site |
| Unknown or ambiguous result | Do not ask; log `needs_owner_review` and move on |

The only required human work is one-time setup: sign in to Grok, grant the minimum browser/Workspace/GitHub permissions, place approved assets in the Workspace, and configure any secrets through a supported password manager or secrets vault. Never paste passwords or tokens into the prompt. The autonomous run must not use a personal identity or domain email unless that credential and the exact permitted scope were configured outside the chat.

For email, use the verified destination mailbox configured behind Cloudflare Email Routing. `support@quizboardly.xyz` must forward to a different mailbox; never route it to itself. Email Routing provides inbound forwarding only and does not prove that Grok can send as the alias. If a submission needs domain ownership proof or an owner click, skip it as `skipped_owner_action`.

Do not create a workaround to bypass an approval gate. When a gate cannot be automated safely, skip the opportunity rather than interrupting the daily run.

## 9. GitHub PR rules

For each candidate repository:

1. Read `README`, `CONTRIBUTING`, and the relevant list format.
2. Confirm Quizboard Maker is genuinely relevant to that list.
3. Use the clean relevant URL and a short factual description.
4. Follow alphabetical/order/category conventions and existing link formatting.
5. Open at most one PR per repository and record the PR URL.
6. Do not mass-open PRs to unrelated `awesome` lists.
7. Do not claim approval, merge, traffic, or endorsement until the repository shows it.

Suggested description for an education or training list:

`Quizboard Maker - Editable 5x5 quiz boards for classroom review, training sessions, and shared-screen group activities. Users can review and edit questions before hosting, then download a reviewed board as a self-contained HTML game.`

## 10. Tracking and follow-up

- Check submitted or under-review sites after 7 days, then no more than once every 30 days unless the platform gives a scheduled date.
- Record scheduled publication dates in `next_check_at` and create a calendar reminder.
- Record the expiry date of temporary directory listings; do not resubmit automatically.
- A nofollow link may remain in the log when it brings relevant visitors or a qualified reply.
- After 30 days with no moderation progress, no relevant visit, and no qualified reply, set `stopped` and record why.
- Update `SEO-CHANNEL-TRACKER-US-EN.md` only when there is evidence: submission receipt, published URL, screenshot, referral data, or a qualified reply.

## 11. Daily report format

End every run with:

```text
Run date:
Batch ID:
Candidates discovered:
Candidates vetted:
Submitted:
Scheduled:
Published with evidence:
Skipped with reasons:
Owner actions needed (routine run should be zero):
GitHub PRs opened:
Verification emails skipped for owner action:
Next checks:
CSV path:
Evidence paths/URLs:
```

Do not summarize only counts. Include the domains, status, reason, and evidence for every action.

## 12. Grok master prompt

Paste this after uploading the asset pack:

```text
You are the unattended distribution agent for Quizboard Maker, not a generic backlink generator.

Read GROK-BACKLINK-AGENT-BRIEF.md, GROK-EXECUTION-SETUP.md, SEO-LAUNCH-PACK-US-EN.md, SEO-CHANNEL-TRACKER-US-EN.md, and SEO-EXECUTION-STATUS.md before taking action. Treat those files as the source of truth. Audit the asset pack first, then immediately execute all eligible low-risk submissions. Do not wait for approval or ask me to approve a batch.

Your job is to discover, vet, submit, and follow up on relevant free distribution opportunities for https://www.quizboardly.xyz. Optimize for qualified referral visitors and trustworthy placements, not backlink volume.

Use the product facts and forbidden-claims sections exactly. Never invent missing facts. Skip paid-only sites, paid-to-publish sites, reciprocal links, badge requirements, fake profiles, forum signature links, bulk voting/commenting, and unrelated directories. Never bypass CAPTCHA, rate limits, anti-bot controls, login controls, or platform rules. For payment, domain-email verification, personal facts, outreach messages, unclear GitHub rules, and unknown conditions, skip and log the reason instead of asking me.

Create or update backlink-queue.csv with one row per domain and all required evidence fields. Discover 20-50 candidates, vet them, and automatically submit the 6-12 highest-fit eligible sites. Submit sequentially with the correct target URL and UTM convention, capture confirmations, and update the CSV immediately after each site. Do not wait for a reply from me.

For GitHub, read each repository's README and CONTRIBUTING file, submit only highly relevant lists with clear rules, follow their exact format, and record every PR URL. Do not send unsolicited emails or DMs in unattended mode. Use public submission forms when available; otherwise log the outreach candidate as `needs_owner_review` and continue.

At the end, provide the Daily Report format from the brief and list skipped items by reason. Never mark a site published without direct evidence. Use `support@quizboardly.xyz` only after the Cloudflare route is verified. A missing approval is not a reason to wait; it is a reason to skip.
```

## 13. Daily execution prompt

Use this after the one-time account setup and asset upload. It does not require daily approval:

```text
Run today's Quizboard Maker distribution batch.

1. Read the current backlink-queue.csv and skip any domain already submitted, published, rejected, stopped, or under an active cooldown.
2. Vet new candidates only in education, teacher tools, classroom resources, training/L&D, quiz/presentation tools, or clearly relevant GitHub lists.
3. Select 6-12 eligible sites, sorted by audience fit and referral potential. Do not ask for approval.
4. Submit one site at a time. Use only approved facts and the correct UTM URL. Never invent a field. Automatically skip any site that needs an owner action.
5. Route normal bot-inbox verification emails to the email routine. Skip domain-email or personal-owner clicks and record them as `skipped_owner_action`.
6. Update backlink-queue.csv after each result with status, evidence URL, screenshot, next_check_at, and reason.
7. Run no more than 2-4 relevant GitHub PRs, and only when repository rules are clear.
8. Do not send unsolicited outreach emails or DMs. Record at most two highly relevant outreach candidates as `needs_owner_review` without interrupting the run.
9. Return the Daily Report. If there is no qualified batch, report that and do not manufacture work.
```

## 14. Email verification routine prompt

If the Grok account exposes a Routine feature, create a routine with this behavior:

```text
Monitor the Grok agent inbox for verification messages related to the Quizboard Maker distribution queue. Match an email to a queue row by domain, sender, subject, or submission reference. For a normal one-click verification link, open only the exact link from the matching message and update the queue with timestamp and result. For a short code, pass the code only to the currently waiting submission task. Do not open marketing links, unsubscribe links, password-reset links, payment links, or unrelated messages.

If a site requires support@quizboardly.xyz or another domain-owner action, do not click or submit it automatically. Mark it `skipped_owner_action`, record the sender, domain, URL, and deadline, then continue. Never expose credentials in chat or logs.
```

If Routine, Workspace, Executor, computer-use, or the native inbox is not available in the account, do not simulate them. Run the same workflow manually in smaller batches or use a separate approved automation tool with its own credentials and audit log.

## 15. Current project blockers

Before the first unattended run, the one-time setup still needs:

- completion of Cloudflare destination verification and a test message for `support@quizboardly.xyz`;
- registration or confirmation of a real brand account handle, if a channel requires one;
- external subject-matter review of at least one starter template; Codex editorial QA is recorded but is not expert sign-off;
- any domain-email ownership checks;
- the Grok account's Workspace, browser, inbox, and GitHub permissions.

The screenshots, brand copy, QA record, and 48-second 1920x1080 demo are prepared locally. The project currently has four indexed core URLs and verified production flow evidence, but external publishing remains gated by account access, support-route verification, and any channel-specific owner or expert review. If a gate is not supplied, skip the affected channel and continue with eligible free submissions; do not invent it or override the status just because a form is technically accessible.
