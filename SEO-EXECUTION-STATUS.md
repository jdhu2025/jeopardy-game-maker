# SEO 30 天冲刺：执行状态与反馈

> 关联计划：[SEO-EXECUTION-PLAN-US-EN.md](./SEO-EXECUTION-PLAN-US-EN.md)  
> 执行负责人：Codex  
> 开始日期：2026-10-13  
> 当前阶段：W1 / Day 1，进行中

## 当前总览

| 工作流                         | 状态               | 已验证结果                                                                                                                                                    | 下一步                                                                                  |
| ------------------------------ | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| 生产站可抓取性核验             | 已完成首轮         | 浏览器逐页检查 4 个核心 URL：均可加载、唯一 H1、自指 canonical、`index, follow`、`lang=en`，正文可在 DOM 中读取；www/HTTPS 与近义 URL 重定向正确              | 部署本轮修改后重跑同一检查，并以 GSC URL Inspection 补齐 Google 视角                    |
| GSC / Bing 验证与 sitemap 提交 | 等待账号访问       | 当前工作区没有 Search Console 或 Bing Webmaster Tools 凭证/会话；未声称已提交                                                                                 | 由具备域名/DNS 或已登录账号的人员完成验证；随后记录属性、提交日期和 URL Inspection 结果 |
| GA4 / Clarity 生产配置         | 阻塞：未配置       | 生产页未发现 GA4 或 Clarity 脚本，`window.gtag` 不存在；当前没有可读取的真实流量/录屏数据                                                                     | 在生产管理后台填写 ID；检查隐私/同意要求，再用 DebugView 验证下方事件                   |
| 漏斗埋点                       | 已完成，待部署     | 已加入 9 个不含用户内容的客户端事件；gtag 未加载时事件会进入 `dataLayer` 队列                                                                                 | 部署后完成一次生成流程，在 GA4 DebugView 验证                                           |
| 用户反馈可靠性                 | 已完成，待部署     | 反馈 UI 过去即使 API 失败也会显示成功；现已改为只在 API 返回成功后显示成功并计数事件                                                                          | 部署后从匿名会话提交一次测试反馈并确认后台记录                                          |
| 产品承诺校准                   | 本地已修，待部署   | 生产生成可得到 25 题，但返回 starter-board fallback；生产页仍写 AI、分享码/QR 等未完全兑现承诺。本地已改成 `editable/topic-based drafts` 并移除跨设备房间承诺 | 部署后再次截图和跑完整流程；通过前不对外使用 AI/实时多人宣称                            |
| 外链发布                       | 素材就绪，尚未提交 | 发布文案与渠道追踪表已准备；未创建账号、未向外部平台提交，避免传播尚未部署的旧承诺                                                                            | 部署并完成生产回归后，按追踪表逐项提交；对外发布前由产品所有者确认账户身份与最终文案    |
| 真实用户反馈                   | 尚无样本           | 当前无 GSC/GA4/访谈数据，因此没有可报告的用户结论                                                                                                             | W2 招募并完成 5 次可用性测试；原话记录到反馈表                                          |

## 已完成的 Day 1 工作

| 时间       | 动作                                                  | 状态               | 证据/结果                                                                                                                                                                                                                                             |
| ---------- | ----------------------------------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-10-13 | 审计 robots、sitemap、canonical 和 SEO 路由的源码基础 | 完成（源码级）     | `robots.txt` 指向 `https://www.quizboardly.xyz/google-sitemap.xml`；sitemap 目前包含首页和 3 个核心英语页面；近义词 URL 在应用层合并。生产结果尚未验证。                                                                                              |
| 2026-10-13 | 审计分析实现                                          | 完成               | GA4、Clarity 等 provider 仅负责加载脚本；此前没有产品漏斗事件。                                                                                                                                                                                       |
| 2026-10-13 | 新增隐私安全的漏斗事件                                | 完成，待部署       | 新增 `landing_view`、`topic_input_started`、`generate_started`、`generate_completed`、`generate_failed`、`review_opened`、`game_started`、`offline_game_downloaded`、`feedback_submitted`；事件不发送题目、主题、反馈文本、房间码或用户标识。         |
| 2026-10-13 | 修复反馈成功状态                                      | 完成，待部署       | `/api/feedback` 返回非 2xx 或请求失败时，UI 显示失败并保留用户输入；成功后才显示确认和记录 `feedback_submitted`。                                                                                                                                     |
| 2026-10-13 | 本地代码检查                                          | 通过（目标范围）   | 已补 ESLint 9 flat config；目标 SEO/Quizboard 文件为 0 error、3 个已知 `<img>` warning；`git diff --check` 通过。全仓既有 baseline 单独记录，不混入本轮结果。                                                                                       |
| 2026-10-13 | 类型与格式检查                                        | 通过               | 最新修订的 `pnpm exec tsc --noEmit` 无错误退出；全部目标文件通过 Prettier 检查。                                                                                                                                                                     |
| 2026-10-13 | 生产站浏览器核验                                      | 已恢复并完成       | 应用内浏览器已完成 4 个核心 URL、重定向、页面 DOM、生成流程和测量脚本核验；Tabbit CLI 仍受审批服务 503 影响，但不再阻塞生产检查。                                                                                                                       |
| 2026-10-13 | 生产站 HTTP/浏览器核验                                | 已完成浏览器侧     | 浏览器确认 www/HTTPS 与近义页重定向；命令行 `curl` 仍受本机失效代理限制。Google 视角仍必须由 GSC URL Inspection 补齐。                                                                                                                               |
| 2026-10-13 | 启动本地 production server                            | 环境阻塞           | 最新 production build 可生成；沙箱拒绝绑定 `127.0.0.1:3100`（`EPERM`）。部署后的真实交互回归仍是必要门禁。                                                                                                                                         |
| 2026-10-13 | 准备英文发布素材包                                    | 完成               | [SEO-LAUNCH-PACK-US-EN.md](./SEO-LAUNCH-PACK-US-EN.md) 已包含经当前 MVP 功能校准的英文文案、渠道定位、UTM 规则与发布门槛。                                                                                                                            |
| 2026-10-13 | 核验基础视觉素材                                      | 基础素材完成       | `code/public/logo.png` 为 1024×1024；`code/public/preview.png` 为 2540×1350。已取得旧生产首屏截图证据；用于发布的 3-5 张截图和演示视频必须等待校准版本部署。                                                                                           |
| 2026-10-13 | 生产站 4 个核心页面核验                               | 完成               | `/`、`/jeopardy-game-maker`、`/how-to-make-a-jeopardy-game`、`/classroom-review-game-maker` 均正常加载；每页有唯一 H1、自指 canonical、`index, follow`、`lang=en`，正文在 DOM 中可见。三个长尾页有 `WebApplication` JSON-LD；首页缺失项已在本地补齐。 |
| 2026-10-13 | 重定向核验                                            | 完成               | `/free-jeopardy-game-maker` 与 `/zh/jeopardy-game-maker` 均归一到英文核心页；non-www 归一到 www；HTTP 归一到 HTTPS。                                                                                                                                  |
| 2026-10-13 | 生产生成流程核验                                      | 完成但发现能力差距 | `Generate my board` 成功生成 25 题，并显示 Review、Start game、Download offline game；返回文案明确为 subject-grounded starter board，说明 AI provider 未配置或调用失败。                                                                              |
| 2026-10-13 | 校准公开产品承诺                                      | 完成，待部署       | 首页及索引页从 AI 生成承诺降级为真实可兑现的 editable/topic-based board drafts；移除实时多人、QR 加入、跨设备房间宣传。生产站仍是旧文案，部署后才生效。                                                                                               |
| 2026-10-13 | 补首页结构化数据                                      | 完成，待部署       | 首页新增 `WebApplication` JSON-LD，与三个长尾页保持一致；需在部署后重新读取生产 HTML 验证。                                                                                                                                                           |
| 2026-10-13 | 补 ESLint 9 flat config                               | 完成               | 目标 SEO/Quizboard 文件 ESLint 为 0 error、3 warning；warning 均来自题面 data URL/离线内容使用 `<img>`。全仓 baseline 为 59 errors、49 warnings，属于既有模板代码，未在本次 SEO 冲刺中扩大范围。                                                      |
| 2026-10-13 | 生产构建                                              | 通过               | 最新修订的 `pnpm exec next build --webpack` 以退出码 0 完成编译、TypeScript、30/30 静态页生成、页面优化和 build trace；构建时 Supabase DNS 不可达导致配置读取告警，但未阻断构建。                                                                    |
| 2026-10-13 | 移除构建期远程字体依赖                                | 完成               | 移除 `next/font/google`，改用系统字体变量；构建不再因失效代理下的 Google Fonts 下载失败。                                                                                                                                                             |
| 2026-10-13 | 索引公开查询尝试                                      | 无可靠结论         | Google `site:` 查询触发异常流量页，Bing 结果不足以证明收录；不把公开搜索结果当作 GSC URL Inspection 证据。                                                                                                                                            |
| 2026-10-13 | 移除伪实时多人界面                                    | 完成，待部署       | 删除公开的 Join room、固定房间码、QR 和本地等待页；核心可索引页改为真实的 shared-screen host + team scoring + offline download。                                                                                                                       |
| 2026-10-13 | 部署前本地服务回归                                    | 环境阻塞           | production build 已生成，但沙箱拒绝绑定 `127.0.0.1:3100`（`EPERM`）；因此本轮以构建、类型、lint、格式和源码断言作为部署前证据，交互回归必须在部署后完成。                                                                                             |
| 2026-10-13 | 三个模板 starter 能力补齐                             | 完成，待人工审阅   | Weather、US History、Workplace Safety 均命中专用主题画像；自动检查确认每个 starter 为 5 类/25 题、无空字段和重复 prompt。模板仍按 [SEO-TEMPLATE-QA-BACKLOG.md](./SEO-TEMPLATE-QA-BACKLOG.md) 阻塞发布，不能把自动草稿标成已审核。                     |
| 2026-10-13 | 关系型外联候选研究                                    | 完成首轮           | 渠道追踪表已列出 10 个教师/L&D 候选及逐项研究条件；尚未联系、未提交、未产生 referral，成果指标仍为 0。                                                                                                                                               |

## 初始反馈与已作决策

| 来源              | 发现                                                                                    | 影响                                                           | 决策                                                                 | 状态           |
| ----------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------- | -------------- |
| 源码审计          | 自定义 GA4 漏斗事件缺失                                                                 | 无法判断 SEO 流量是否完成生成或开始游戏                        | 已补齐事件，部署后以 GA4 DebugView 验证                              | 已修复，待部署 |
| 源码审计          | 反馈请求失败时仍显示“已收到”                                                            | 反馈样本会被虚假成功状态污染，用户也无法知道保存失败           | 已改为仅在 API 成功后确认                                            | 已修复，待部署 |
| 生产浏览器核验    | 页面能生成 25 题，但显示 starter-board fallback；首屏仍宣称 AI，后续段落仍宣称分享码/QR | 对外推广会把 fallback 能力包装成未验证的 AI/多人能力，损害信任 | 本地校准全部公开承诺；在新版本部署并回归前暂停外部提交               | 已修复，待部署 |
| 生产浏览器核验    | GA4、Clarity 均未加载                                                                   | 即使开始推广也无法看到关键词流量后的产品行为                   | 优先配置测量，再把 `generate_completed`、`game_started` 设为关键事件 | 等待账号/配置  |
| 构建验证          | 远程 Google Fonts 依赖会在受限网络中阻断构建                                            | 发布可靠性受第三方构建时网络影响                               | 改用系统字体并通过完整生产构建                                       | 已修复         |
| 真实用户/搜索数据 | 尚无可读取的 GSC、GA4、访谈或引荐数据                                                   | 不能对关键词、CTR、转化率或用户需求下结论                      | W1 先完成账号验证与事件验证；W2 才开始收集可用性反馈                 | 待执行         |

## 事件验证清单（部署后）

在 GA4 DebugView 使用一个匿名测试会话完成以下流程；结果填回此表。`expected` 是代码已发送的事件，不代表 GA4 已收到。

| 测试步骤             | Expected event                           | GA4 DebugView | 状态   |
| -------------------- | ---------------------------------------- | ------------- | ------ |
| 打开核心英文落地页   | `landing_view`                           | 待验证        | 待部署 |
| 聚焦主题输入框       | `topic_input_started`                    | 待验证        | 待部署 |
| 点击生成             | `generate_started`                       | 待验证        | 待部署 |
| 生成成功/失败        | `generate_completed` / `generate_failed` | 待验证        | 待部署 |
| 打开审核区或完成生成 | `review_opened`                          | 待验证        | 待部署 |
| 点击 Start game      | `game_started`                           | 待验证        | 待部署 |
| 下载离线网页         | `offline_game_downloaded`                | 待验证        | 待部署 |
| 成功提交反馈         | `feedback_submitted`                     | 待验证        | 待部署 |

## 当前部署门禁

以下条件全部满足后，才能把本轮代码状态从“本地完成”改为“线上完成”，并开始首批目录提交：

1. 将当前工作区修改部署到 `www.quizboardly.xyz`。
2. 生产首页和三个核心页不再宣传未启用的 AI 生成、实时房间、分享码或 QR 加入。
3. 生产 HTML 可读取首页 `WebApplication` JSON-LD，canonical/robots/H1 未回退。
4. 匿名用户完成一次“输入 -> 生成 -> Review -> Start game -> Download”回归；反馈失败时不得显示成功。
5. GA4/Clarity 脚本实际加载；DebugView 收到完整事件链，且事件参数不含主题、题目、反馈正文、房间码或身份信息。

## Day 2 优先动作

1. 部署本轮已通过构建的修改，按“当前部署门禁”完成生产回归。
2. 取得 Search Console、Bing Webmaster Tools、GA4 和 Clarity 的已登录访问，执行域名验证、sitemap 提交、URL Inspection 与 DebugView 检查。
3. 配置或明确关闭 AI provider：未配置时继续使用 starter-board 定位，不允许恢复 AI-powered 文案。
4. 生产回归通过后，从 [SEO-CHANNEL-TRACKER-US-EN.md](./SEO-CHANNEL-TRACKER-US-EN.md) 开始首批 5 个入口；外部提交前确认品牌账号、支持邮箱和最终对外身份。
5. 招募 5 位目标用户并排期 W2 可用性测试；在获得真实访谈前，反馈数量继续保持 0。

## Day 30 KPI 快照

| 指标                                  |       Day 0 | Day 14 | Day 30 | 备注                            |
| ------------------------------------- | ----------: | -----: | -----: | ------------------------------- |
| 已索引核心 URL                        | 待 GSC 访问 |        |        | 不能以本地 sitemap 代替索引状态 |
| 美国非品牌查询展现                    | 待 GSC 访问 |        |        |                                 |
| 自然/引荐 `generate_completed` 转化率 | 待 GA4 部署 |        |        |                                 |
| 有效发布/引荐入口                     |           0 |        |        | 未发布即为 0，不填估值          |
| 有效用户反馈                          |           0 |        |        | 当前无真实用户样本              |
