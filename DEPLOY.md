# 鹅伴 GrowthMate — 部署说明

## 项目简介

**鹅伴 GrowthMate** 是一个 AI 求职成长陪伴 Demo 平台，面向大学生提供从校园到职场的全周期成长陪伴服务。

- **技术栈**：React 18 + Vite 5 + React Router v6 + TDesign React
- **数据**：全部为本地 Mock 数据，不依赖真实后端
- **AI 对话**：使用本地模拟回复，无需真实 API Key

---

## 本地运行

```bash
# 1. 进入项目目录
cd growthmate

# 2. 安装依赖
npm install

# 3. 启动开发服务器（端口 8080）
npm run dev

# 4. 预览生产构建
npm run build
npm run preview
```

---

## Vercel 部署配置

### 方式一：通过 Vercel CLI

```bash
npm i -g vercel
cd growthmate
vercel --prod
```

### 方式二：通过 Vercel Dashboard（推荐）

1. 将项目上传到 GitHub 仓库
2. 登录 [vercel.com](https://vercel.com) 并 Import 该仓库
3. 配置如下：

| 配置项 | 值 |
|--------|-----|
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

> ⚠️ 注意：Vercel 会自动识别 `vercel.json`（已包含在项目中），无需额外配置路由重写。

### 需要上传到 GitHub 的文件

以下文件需要上传（`node_modules/` 和 `dist/` 不需要）：

```
growthmate/
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── vercel.json
├── DEPLOY.md
├── public/           （如有）
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── components/
    │   ├── Layout.jsx
    │   └── SidePanel.jsx
    ├── context/
    │   └── AuthContext.jsx
    ├── data/
    │   └── mockData.js
    ├── pages/
    │   ├── Home.jsx
    │   ├── Diagnosis.jsx
    │   ├── CareerMap.jsx
    │   ├── AiSkill.jsx
    │   ├── AiChat.jsx
    │   ├── SkillCenter.jsx
    │   ├── ProjectWorkshop.jsx
    │   ├── JobPrep.jsx
    │   ├── InterviewReview.jsx
    │   ├── EmotionComfort.jsx
    │   ├── StudyPlan.jsx
    │   └── Community.jsx
    └── styles/
        └── global.css
```

---

## vercel.json 说明

项目根目录下的 `vercel.json` 内容如下：

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

作用：将所有路由请求重定向到 `index.html`，确保 React Router 的 SPA 路由在刷新页面时不会出现 404。

---

## 路由列表

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | 产品介绍与功能入口 |
| `/diagnosis` | 成长诊断 | 评估当前阶段，生成个性化建议 |
| `/career-map` | 职业探索 | 了解岗位与企业文化 |
| `/ai-skill` | AI 能力定制 | 根据专业生成 AI 能力培养路径 |
| `/skill-center` | 技能成长 | 每日任务卡驱动 |
| `/project-workshop` | 项目实践 | 可写入简历的实战项目 |
| `/job-prep` | 求职准备 | 简历优化、模拟面试 |
| `/interview-review` | 面试复盘 | 面试记录与复盘分析 |
| `/emotion-comfort` | 情绪陪伴室 | 情绪疏导与陪伴 |
| `/study-plan` | 学习计划 | 个性化学习计划管理 |
| `/ai-chat` | AI 聊天 | AI 企鹅陪伴对话 |
| `/community` | 成长社区 | 社区互动与岗位信息 |

---

## 注意事项

1. **纯前端 Demo**：所有数据为本地模拟数据，无后端依赖
2. **AI 对话**：使用本地关键词匹配模拟回复，无需 API Key
3. **用户数据**：使用 localStorage 存储，仅在浏览器本地保存
4. **浏览器兼容**：支持 Chrome、Edge、Firefox、Safari 最新版本
5. **响应式**：同时适配桌面和移动端，课堂展示建议使用桌面端
