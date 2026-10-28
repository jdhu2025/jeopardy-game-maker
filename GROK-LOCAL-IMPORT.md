# Grok Bot 本地客户端导入说明

这份文件是给本地 Grok Bot 客户端读取的入口，不是产品宣传文案。它告诉客户端本地资料在哪里、哪些文件可以作为事实源，以及每日执行后要写回哪里。

## 1. 添加本地资料夹

在本地 Grok 客户端中把下面的目录添加为 Workspace / Project / Knowledge folder：

`/Users/ken/hjd/code/SEO/jeopardy-game-maker`

如果客户端不能读取本地目录，就新建一个名为 `quizboard-grok-assets` 的 Workspace，并上传本文件、`GROK-LOCAL-MANIFEST.json` 以及 manifest 中的 `upload: true` 文件。不要上传 `.env`、`.env.local`、密码、token、`node_modules`、`.git` 或浏览器配置目录。

客户端不会因为看到文件就自动理解执行关系，所以首次打开项目后，在同一个 Grok Bot 对话中发送第 4 节的 bootstrap prompt；后续 Routine 只需要读取 manifest 和 brief。

## 2. 文件优先级

按下面顺序读取：

1. `GROK-LOCAL-MANIFEST.json`
2. `GROK-BACKLINK-AGENT-BRIEF.md`
3. `GROK-EXECUTION-SETUP.md`
4. `BRAND-ACCOUNT-PACK.md`
5. `SEO-LAUNCH-PACK-US-EN.md`
6. `SEO-CHANNEL-TRACKER-US-EN.md`
7. `SEO-EXECUTION-STATUS.md`
8. `SEO-TEMPLATE-EDITORIAL-REVIEW.md`
9. `backlink-queue.csv`

品牌素材只能从 manifest 中列出的文件读取。Markdown 中的产品事实优先于网页搜索结果；网页搜索只用于发现和核验候选站点。

## 3. 执行能力检查

首次执行先报告客户端是否具备以下能力：

- 读取这个本地目录或 Workspace 文件夹；
- 浏览器控制和登录态；
- 读取 Grok Bot 自己的收件箱；
- 修改并保存 `backlink-queue.csv`；
- 每日定时触发；
- GitHub 账号和 PR 权限（如果要提交 PR）。

如果本地 Grok 客户端提供“经此电脑转发流量”之类的网络选项，可以由你在客户端设置中手动打开。它只会让客户端在你的电脑保持运行时使用本机网络出口，可能改变某些站点的风控结果，但不能保证 hCaptcha 消失，也不等于获得绕过 CAPTCHA 的许可。项目和 Bot 都不应自动点击、识别或破解 CAPTCHA。

缺少某项时，不要假装已经执行。继续做能做的候选发现和队列记录；缺少浏览器、收件箱或写权限时，明确记录 `capability_missing`。

## 4. 首次 bootstrap prompt

把下面整段发送给本地 Grok Bot：

```text
You are the local Quizboard Maker distribution agent.

Your working folder is /Users/ken/hjd/code/SEO/jeopardy-game-maker. Read GROK-LOCAL-MANIFEST.json first, then read the files in its read_order. Treat GROK-BACKLINK-AGENT-BRIEF.md as the operating policy and the approved asset pack as the only source of product claims.

Before the first action, report which capabilities are available: local file read, Workspace read, browser control, logged-in account access, Grok inbox access, CSV write access, scheduler/Routine, and GitHub PR access. Do not report a capability as available unless you can actually use it.

For every run, read the current backlink-queue.csv, preserve its 31-column schema, and update one row per domain immediately after each result. Do not wait for my daily approval. Discover and vet relevant free opportunities, then submit only truthful, low-risk, relevant forms. Use the logo, preview, screenshots, and video from the manifest when a site requests assets.

Never invent a founder, company, price, funding, customer, review, expert sign-off, or account handle. Do not claim AI generation, online multiplayer, QR joining, real-time rooms, official Jeopardy affiliation, or OSHA/legal compliance. Never bypass CAPTCHA, rate limits, login controls, payment, domain ownership, personal identity checks, legal acceptance, or platform rules. When a site needs one of those, record the exact reason and continue with the next candidate without asking me.

Use support@quizboardly.xyz only after the Cloudflare destination route has been verified and a test message has arrived in the receiving mailbox. Cloudflare forwarding is inbound only; do not claim that it authorizes outbound sending. Normal one-click verification links from a matching submission may be handled by the inbox routine. Owner clicks, domain ownership checks, personal email actions, password resets, payment links, and unknown links must be skipped.

At the end, return the Daily Report from GROK-BACKLINK-AGENT-BRIEF.md with domains, status, evidence paths or URLs, skips, and next checks. Keep notifications quiet when nothing meaningful changed.
```

## 5. 每日 Routine prompt

把 `GROK-EXECUTION-SETUP.md` 中的 daily routine prompt 设置为每天 `09:00 Asia/Shanghai`。如果本地客户端没有 Routine 或系统 scheduler，就只能在客户端已有的定时能力中配置，不能仅靠这份 Markdown 自动运行。

Routine 的权限只给本地文件夹、浏览器、Grok 收件箱和需要的真实品牌/GitHub 账号。密码、验证码和私有邮箱地址放在客户端支持的密码管理器或 secrets vault，不放进仓库和 prompt。

## 6. 让它识别“新文件”的方法

新增或替换品牌素材后，先让 Bot 重新读取 `GROK-LOCAL-MANIFEST.json`，再发送：

```text
Reload GROK-LOCAL-MANIFEST.json and verify the SHA-256 and dimensions of every changed asset before using it. Use only the newest files marked active. Do not use cached or old ShipAny assets. Report the active logo, preview, and demo video paths before the next distribution run.
```

若报告仍出现 ShipAny logo、旧 preview 或不存在的文件，先停止提交并修正 Workspace 缓存或重新上传；不要让 Bot自行猜测文件替代关系。
