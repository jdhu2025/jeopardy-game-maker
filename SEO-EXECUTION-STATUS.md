# SEO 30 天冲刺：执行状态与反馈

> 关联计划：[SEO-EXECUTION-PLAN-US-EN.md](./SEO-EXECUTION-PLAN-US-EN.md)  
> 执行负责人：Codex  
> 开始日期：2026-10-13  
> 证据截止：2026-10-27
> 当前阶段：W3 / Day 15，进行中

## 当前总览

| 工作流                         | 状态               | 已验证结果                                                                                                                                                    | 下一步                                                                                  |
| ------------------------------ | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| 生产站可抓取性核验             | 已完成（线上复核） | 2026-10-27 用 bb-browser 复核 4 个核心 URL：均为 200、唯一 H1、自指 canonical、`index, follow`、`lang=en`，正文和结构化数据可读；sitemap、robots 返回 200；HTTP、非 www、`/zh` 和近义 URL 归一正确；用户随后提供 GSC 逐 URL 收录截图 | 部署后版本变更再抽查；Google 的 canonical/抓取细节以 URL Inspection 展开项为准 |
| GSC / Bing 验证与 sitemap 提交 | GSC 已完成；Bing 未验证 | 用户提供的 4 张 GSC URL Inspection 截图分别确认首页、`/jeopardy-game-maker`、`/how-to-make-a-jeopardy-game`、`/classroom-review-game-maker` 均“网址已收录到 Google”；sitemap 截图显示上次读取 `2026/10/23`、已发现网页 `4`；Bing 无证据 | 保留 GSC 证据；Bing 由有权限的人验证，或明确暂不接入 |
| GA4 / Clarity 生产配置         | GA4、Clarity 已配置并线上加载 | Measurement ID `G-690K2CQ0PF` 和 Clarity ID `z42b62ywxw` 均已通过管理员设置保存；公网复核 `window.gtag`、`window.clarity` 均为 function，Google Tag 和 `https://www.clarity.ms/tag/z42b62ywxw` 均出现在页面资源中，并观察到 GA4/Clarity 请求 | 在 GA4 DebugView 确认完整事件；在 Clarity 控制台确认实时会话和录制数据 |
| 漏斗埋点                       | 代码完成；生产匿名漏斗已回归 | 源码含 9 个不含用户内容的事件；公网回归观察到 `landing_view`、`topic_input_started`、`generate_started`、`generate_completed`、`review_opened`、`game_started`、`offline_game_downloaded`、`feedback_submitted`，并观察到 Google Analytics collect 请求 | 仍需在正确的 GA4 属性 DebugView 确认收数，把结果填入下方清单 |
| 用户反馈可靠性                 | 生产成功/失败路径已回归 | 不敏感测试反馈 `POST /api/feedback` 返回 200，页面显示 `Thanks — feedback received`；临时模拟 503 时页面显示失败、弹窗保持打开且反馈文本保留；未伪造后台管理页证据 | 由产品所有者在后台或数据库确认该测试记录；删除测试记录如有需要 |
| 产品承诺校准                   | 已完成并线上验证   | 2026-10-27 线上 4 个核心页均使用 editable/topic-based board 文案；未发现旧的 AI-powered、Join room、QR 或跨设备实时承诺；当前页面展示生成、审核、主持和离线下载 | 后续若重新启用 AI 或实时能力，必须先完成能力验证再恢复文案 |
| 外链发布                       | 未发布；仍受人工门禁阻塞 | 发布文案与渠道追踪表已准备；3 张生产截图已生成，但仍无 contacted、published URL、referral 或 qualified reply 证据；支持邮箱、品牌账号、视频和模板审阅仍不完整 | 由产品所有者确认品牌账号、支持邮箱、最终文案和首批渠道；之后逐项提交并记录 URL/UTM/referral |
| 真实用户反馈                   | 尚无样本           | 已有 GSC 索引/搜索截图，但没有 GA4/Clarity/访谈或 referral 样本，因此仍没有可报告的用户行为结论 | W2 招募并完成 5 次可用性测试；原话记录到反馈表 |

## 已完成的 Day 1 工作

以下表格保留 2026-10-13 当时的历史记录；当前状态以 2026-10-27 复核结果为准。

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
| 2026-10-27 | 关系型外联候选研究                                    | 完成首轮研究，未进入外联 | 渠道追踪表仍列出 10 个教师/L&D 候选；没有联系、提交、published URL、referral 或 qualified reply 证据。它是研究完成，不是外链发布完成。                                                                                                           |

## 2026-10-27 复核结果

本节只记录本轮可复核证据；“已上线”不等于“已被 Google 收录”，收录数量以用户提供的 Search Console 截图为准。

| 检查项 | 结果 | 证据 | 仍需人工确认 |
| --- | --- | --- | --- |
| 4 个核心 URL 线上可访问 | 已确认 | bb-browser 逐页读取 `/`、`/jeopardy-game-maker`、`/how-to-make-a-jeopardy-game`、`/classroom-review-game-maker`，均返回 HTTP 200 | 无 |
| 线上 SEO 基础元素 | 已确认 | 4 页均有唯一 H1、`lang=en`、`index, follow`、自指 canonical、description；4 页均有 JSON-LD；GSC URL Inspection 已确认 4 页可出现在 Google | 截图未展开的 Google-selected canonical、最后抓取时间和 sitemap discovery 详情仍不作推断 |
| sitemap / robots | 已确认 | `https://www.quizboardly.xyz/google-sitemap.xml` 和 `/robots.txt` 均返回 200；robots 只声明该 sitemap，sitemap 列出 4 个公开 URL；用户提供的 GSC sitemap 截图显示上次读取 `2026/10/23`、已发现网页 `4` | 无；如需持续监控，后续记录新的 last read 日期 |
| URL 归一 | 已确认 | 非 www、HTTP、`/zh/jeopardy-game-maker`、`/free-jeopardy-game-maker` 访问后均归一至 `/jeopardy-game-maker` | 无 |
| Google 索引数量 | 已确认 4 个具体 URL | 用户提供的 4 张 GSC URL Inspection 截图分别显示：首页、`/jeopardy-game-maker`、`/how-to-make-a-jeopardy-game`、`/classroom-review-game-maker` 均“网址已收录到 Google”；页面索引编制均显示“网页已编入索引” | 截图未展开 Google-selected canonical、最后抓取时间和 sitemap discovery 详情；这些不是当前收录结论的阻塞项 |
| 产品文案上线 | 已确认 | 线上页面已显示 editable/topic-based board、review、host、offline download；未发现旧 AI/QR/Join room 文案 | 无；重新部署后需抽查 |
| 匿名核心流程 | 已确认 | 线上完成“输入主题 -> 生成 25 题 -> Review -> Start game -> 返回 Review -> Download offline game”；页面状态分别显示 `Board ready`、主持界面和 `Offline game downloaded`；成功反馈 API 返回 200，失败模拟显示失败并保留输入 | 由产品所有者在后台/数据库确认测试反馈记录 |
| GA4 / Clarity | 脚本已线上加载；控制台确认待完成 | bb-browser 刷新公网首页后复核：`window.gtag`、`window.clarity` 均为 function；页面资源含 GA4/Clarity 脚本，并观察到 Google Analytics collect、`c.clarity.ms/c.gif`、`n.clarity.ms/collect` 请求；Clarity 页面仍停留在“即将完成”引导 | 用拥有 `G-690K2CQ0PF` 的 GA4 属性进入 DebugView；在 Clarity 控制台确认实时会话和录制数据 |
| 漏斗事件代码 | 已确认代码和首事件队列 | 代码有 9 个事件；线上首页可见 `dataLayer` 中的 `landing_view`，且 gtag/Google Tag 已加载 | 在 GA4 DebugView 验证完整漏斗 |
| 模板 starter 自动质量 | 已确认自动门槛 | `node --import tsx scripts/check-template-starters.ts` 通过：3 个 starter 均 5 类/25 题、无空字段和重复题面 | 学科/EHS 专家逐题审阅；在此之前不能称为已审核模板 |
| TypeScript | 已确认 | `pnpm exec tsc --noEmit` 退出码 0 | 无 |
| 目标 ESLint / Prettier | 未完全通过 | ESLint 有 1 个 React 规则 error、3 个 `<img>` warning；Prettier 提示 4 个文件未格式化 | 后续由代码侧修复；不影响线上当前 4 页索引结论 |
| 发布截图 | 已确认 | 真实生产截图已保存至 `code/public/seo-assets/quizboard-landing.png`、`quizboard-review.png`、`quizboard-host.png` | 产品所有者确认最终裁切和公开使用；真实 30-60 秒操作录屏仍待人工完成 |
| 生产构建 | 本轮未取得新通过证据 | 使用本地 Supabase 配置，以及显式 `DATABASE_URL=''` 的隔离环境，`pnpm build:fast` 均在 `Creating an optimized production build` 长时间无输出后中断；此前 2026-10-13 记录的构建通过仍属于历史证据 | 提供 CI/Vercel 构建日志，或在可运行的本地构建环境重新跑 build |

## 初始反馈与已作决策

| 来源              | 发现                                                                                    | 影响                                                           | 决策                                                                 | 状态           |
| ----------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------- | -------------- |
| 源码审计          | 自定义 GA4 漏斗事件缺失                                                                 | 无法判断 SEO 流量是否完成生成或开始游戏                        | 已补齐事件，部署后以 GA4 DebugView 验证                              | 已修复，待部署 |
| 源码审计          | 反馈请求失败时仍显示“已收到”                                                            | 反馈样本会被虚假成功状态污染，用户也无法知道保存失败           | 已改为仅在 API 成功后确认                                            | 已修复，待部署 |
| 生产浏览器核验    | 旧生产版本曾显示 starter-board fallback 和 AI/QR/房间承诺；2026-10-27 线上复核已看到校准后的文案 | 旧承诺会损害信任；当前公开页面已与已验证能力一致 | 保持当前文案；若恢复 AI/多人功能，先完成真实能力验证 | 已修复并线上验证 |
| 生产浏览器核验    | 旧版本 GA4、Clarity 均未加载；当前两者均已加载                  | GA4、Clarity 已可接收页面请求，但还没有 DebugView 完整链路和 Clarity 录屏数据 | 在 DebugView 验证 `generate_completed`、`game_started` 等关键事件，并在 Clarity 控制台确认会话 | 部分解除 |
| 构建验证          | 远程 Google Fonts 依赖会在受限网络中阻断构建                                            | 发布可靠性受第三方构建时网络影响                               | 改用系统字体并通过完整生产构建                                       | 已修复         |
| 真实用户/搜索数据 | GSC 已有 4 个已编入索引页面；另有 28 天截图显示 75 次展示、2 次点击、平均排名 48.8；尚无可报告的 GA4/Clarity 行为样本、访谈或引荐数据 | 已能确认索引和早期搜索基线，但尚不能判断漏斗转化或用户需求 | 导出 GSC Queries/Pages，确认 GA4/Clarity 报表，并开始 5 次目标用户测试 | 部分完成 |

## 事件验证清单（部署后）

在 GA4 DebugView 使用一个匿名测试会话完成以下流程；结果填回此表。`expected` 是代码已发送的事件，不代表 GA4 已收到。

| 测试步骤             | Expected event                           | GA4 DebugView | 状态   |
| -------------------- | ---------------------------------------- | ------------- | ------ |
| 打开核心英文落地页   | `landing_view`                           | 公网 `dataLayer` 已观察到；gtag 和 Google Tag 已加载 | 正确 GA4 属性 DebugView 确认收数 |
| 聚焦主题输入框       | `topic_input_started`                    | 生产匿名回归 `dataLayer` 已观察到 | 正确 GA4 属性 DebugView 确认收数 |
| 点击生成             | `generate_started`                       | 生产匿名回归 `dataLayer` 已观察到 | 正确 GA4 属性 DebugView 确认收数 |
| 生成成功/失败        | `generate_completed` / `generate_failed` | 生产匿名回归已观察到 `generate_completed`；未执行真实失败请求 | 正确 GA4 属性 DebugView 确认；真实失败请求可单独补测 |
| 打开审核区或完成生成 | `review_opened`                          | 生产匿名回归 `dataLayer` 已观察到 | 正确 GA4 属性 DebugView 确认收数 |
| 点击 Start game      | `game_started`                           | 生产匿名回归 `dataLayer` 已观察到 | 正确 GA4 属性 DebugView 确认收数 |
| 下载离线网页         | `offline_game_downloaded`                | 生产匿名回归 `dataLayer` 已观察到 | 正确 GA4 属性 DebugView 确认收数 |
| 成功提交反馈         | `feedback_submitted`                     | 生产 API 200 后 `dataLayer` 已观察到，GA collect 请求已发起 | 正确 GA4 属性 DebugView 和后台记录确认 |

## 当前剩余门禁

以下条件全部满足后，才能把本轮 SEO 冲刺状态标记为“线上完成”，并开始首批目录提交：

1. 记录当前生产站对应的部署 commit 或 CI/Vercel 构建记录；公开页面已确认使用校准后的产品文案。
2. GSC 的 4 个具体 URL Inspection 和 sitemap 最近读取记录已完成；Bing 仍需完成验证或明确暂不接入。
3. 主流程“输入 -> 生成 -> Review -> Start game -> Download”及反馈成功/失败路径已通过线上回归；仍需由后台所有者确认测试记录。
4. GA4 已线上加载但当前登录账号无法进入 `G-690K2CQ0PF` 对应属性的 DebugView；Clarity 已线上加载但控制台仍需确认实时会话和录制数据；确保事件参数不含主题、题目、反馈正文、房间码或身份信息。
5. 至少一个模板完成学科/EHS 人工逐题审阅；外链提交前补齐支持邮箱、品牌账号和真实截图/演示。

## Day 2 优先动作

1. 记录生产部署 commit/构建记录，并保留本轮匿名生成、审核、主持、下载和反馈成功/失败路径回归证据。
2. 用正确的 GA4 属性账号完成 DebugView；由有权限的人完成 Bing 验证或明确暂不接入；在 Clarity 控制台确认实时会话。
3. 保持当前 starter-board / editable draft 定位；在 AI provider 未完成生产验证前，不恢复 AI-powered 文案。
4. 剩余门禁通过后，从 [SEO-CHANNEL-TRACKER-US-EN.md](./SEO-CHANNEL-TRACKER-US-EN.md) 开始首批 5 个入口；外部提交前确认品牌账号、支持邮箱和最终对外身份。
5. 招募 5 位目标用户并排期 W2 可用性测试；在获得真实访谈前，反馈数量继续保持 0。

## Day 30 KPI 快照

| 指标                                  |       Day 0 | Day 14 | Day 30 | 备注                            |
| ------------------------------------- | ----------: | -----: | -----: | ------------------------------- |
| 已索引核心 URL                        | 4（4 个 URL Inspection 截图确认） |        |        | 继续观察新增页面；当前 4 个核心 URL 已有 Google 收录证据 |
| 美国非品牌查询展现                    | 75 展示 / 2 点击 / 平均排名 48.8（截图确认） |        |        | 需导出 Queries/Pages/Countries/Devices，区分品牌与非品牌 |
| 自然/引荐 `generate_completed` 转化率 | 待 GA4 部署 |        |        |                                 |
| 有效发布/引荐入口                     |           0 |        |        | 未发布即为 0，不填估值          |
| 有效用户反馈                          |           0 |        |        | 当前无真实用户样本              |
