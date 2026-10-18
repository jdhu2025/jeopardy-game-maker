# Quizboardly 模板 QA 与发布门禁

> Owner：Codex（结构、技术与发布状态）  
> 建立日期：2026-10-13  
> 原则：自动生成只产生 starter draft。没有学科/培训审阅人与逐题记录，不创建可索引模板 URL，不写“已审核”。

## 模板队列

| Template | Audience | Learning target | Starter support | Human reviewer | QA status | Publish status |
|---|---|---|---|---|---|---|
| Grade 7 Weather Systems | 美国 Grade 7 science | 解释气压、湿度、锋面、云和预报证据之间的关系 | 专用 `weather systems` profile，5 类/25 题自动完整性检查通过 | 待指定美国中学科学教师或具备课程经验的审阅人 | blocked: 未逐题核实课程适配与事实 | blocked |
| US History Review | 美国 middle/high school social studies | 用因果、证据、政府权力、视角和变化解释历史问题 | 专用 `history and civics` profile，5 类/25 题自动完整性检查通过 | 待指定美国历史/公民学科审阅人 | blocked: 需限定具体时期并逐题核实 | blocked |
| Workplace Safety Fundamentals | 美国新员工/L&D | 识别危害、控制层级、PPE、事件报告和应急响应 | 新增专用 `workplace safety fundamentals` profile，5 类/25 题自动完整性检查通过 | 待指定 EHS/L&D 审阅人 | blocked: 必须核对场所政策与 OSHA 适用范围 | blocked |

## 单个模板发布前逐题门禁

- [ ] 明确美国目标受众、年级/岗位、场景和预计游戏时长。
- [ ] 25 题均有唯一 prompt、可判定 answer、简短 explanation 和递增难度。
- [ ] 学科/培训审阅人逐题标记 `approved / revise / remove`，留下姓名或角色、日期和修改记录。
- [ ] Weather：核对锋面、气压、湿度、云与预报表述，不把概率预报写成确定结果。
- [ ] US History：限定具体时期；至少使用一手/二手证据区别，避免把复杂因果缩成单一原因。
- [ ] Workplace Safety：不把通用内容写成法律意见；场所政策、SDS、PPE 和应急流程以雇主/主管部门要求为准。
- [ ] 匿名用户能打开模板、审阅、编辑、开始主持和下载离线版。
- [ ] 页面 title、H1、description、canonical、`index, follow`、WebApplication/Breadcrumb schema 和 3 条内部链接通过检查。
- [ ] 页面写明最后审阅日期、适用对象、题数、预计时长和“可编辑草稿”边界。
- [ ] 部署后通过 GSC URL Inspection，再加入 sitemap；未通过时保持 noindex 或不创建 URL。

## 自动检查证据

运行：

```bash
cd code
node --import tsx scripts/check-template-starters.ts
```

自动检查只覆盖：已命中专用主题画像、5 个类别、25 题、无空 prompt/answer/explanation、无重复 prompt。它不替代事实核查、课程适配、法律/安全审阅或真实用户测试。
