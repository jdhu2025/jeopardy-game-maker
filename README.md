# Jeopardy Game Maker

关键词项目目录：`jeopardy game maker`

## 项目目的

研究一个面向教师、培训师和活动组织者的 AI 互动竞答游戏制作工具，为后续产品 SPEC、MVP 和 SEO 页面规划提供素材。

## 当前判断

- 关键词意图：工具型，用户在寻找可以创建 Jeopardy 风格问答游戏的产品。
- 截图指标：Volume 18,100；KD 25；CPC 1.45 USD。
- 长尾截图：486 个变体（总量 39.2K）和 236 个问题词（总量 6.2K）；重点包含免费、PowerPoint、Google Slides、review game 和 online jeopardy 意图。
- SaaS 机会：较高，但不能只做一个静态题目棋盘。
- 主要切入点：AI 根据主题或上传资料生成游戏、人工审核、实时主持、房间码、团队计分和题库资产管理。
- 主要竞争参考：JeopardyLabs（https://jeopardylabs.com/）。

## 文档索引

- [`01-keyword-intent.md`](./01-keyword-intent.md)：关键词意图、用户和场景
- [`02-competitor-jeopardylabs.md`](./02-competitor-jeopardylabs.md)：JeopardyLabs 公开产品观察和不足
- [`03-ai-product-opportunity.md`](./03-ai-product-opportunity.md)：AI 产品方案、功能优先级和商业模式
- [`04-spec-preparation.md`](./04-spec-preparation.md)：后续 SPEC 需要确认的范围、假设和问题
- [`05-research-log.md`](./05-research-log.md)：来源、观察日期和证据记录
- [`06-product-spec.md`](./06-product-spec.md)：正式产品 SPEC、MVP 边界、页面/关键词结构、技术约束和验收标准
- [`code/README.md`](./code/README.md)：基于 ShipAny Two 的 Node.js/Next.js/Vercel MVP 代码说明
- [`code/config/ai.config.example.json`](./code/config/ai.config.example.json)：留白 AI 参数配置模板

## 研究边界

目前资料来自关键词工具截图和 JeopardyLabs 公开页面观察。搜索量、排名难度和 CPC 是第三方工具估算值，不等同于实时 SERP 结果或收入预测。正式开发前需要补充 SERP、用户访谈、AI 生成质量测试和商标/内容合规审查。

## 当前阶段结论

长尾关键词和 JeopardyLabs 公开页面实测已经转化为正式 SPEC。SPEC 仍明确区分已观察事实、产品假设和需要负责人定案的歧义；未登录会员区、后台数据或付费转化没有被当成已证实事实。

## 开发实现

代码统一放在 `code/`，复制自 `/Users/Zhuanz/code/shipany-two/shipany-template-dev` 的 Next.js/TypeScript 架构，并已接入 Quizboard Maker 首页、Node.js Route Handler、浏览器草稿保存、题目编辑和主持模式。AI 环境变量暂时留白；未配置时使用本地 demo 生成器。
