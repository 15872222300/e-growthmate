# 鹅伴 GrowthMate — 线稿风视觉规范文档

> **Design System v2.0 — 黄蓝线稿极简风**
> 
> 适用范围：鹅伴 GrowthMate 全站页面与组件
> 规范版本：2026.06

---

## 一、整体美术风格

**极简干净线稿风 (Clean Line Art Minimalism)**

- 全部元素以 **细黑色轮廓线条勾勒**，无厚重填充渐变
- 图形、按钮、卡片、图标统一采用 **单线手绘质感**
- 弱化写实，轻量化简约视觉
- 留白为主，线条为辅，追求"未完成的手稿感"

---

## 二、主配色系统

| 角色 | 色值 | 用途 |
|------|------|------|
| **主黄色** | `#FFD149` | 主按钮、重点高亮、标题点缀、选中态 |
| **主蓝色** | `#4A86E8` | 次要操作栏、分割线、模块边框、链接 |
| **背景色** | `#FFFFFF` | 纯白页面底色 |
| **浅灰辅助** | `#F5F5F5` | 卡片微背景、hover 底色 |
| **深灰文字** | `#333333` | 正文文字 |
| **次要文字** | `#777777` | 说明文字、辅助信息 |
| **极淡边框** | `#E0E0E0` | 分割线、卡片描边 |
| **黑色线条** | `#222222` | 1px 描边轮廓 |

**禁用色：禁止使用高饱和刺眼色彩（如 `#FF0000`、`#00FF00`、`#0000FF` 纯色）**

---

## 三、字体规范

| 层级 | 字号 | 字重 | 颜色 |
|------|------|------|------|
| H1 标题 | 36-48px | 800 | `#333333` |
| H2 标题 | 28-32px | 700 | `#333333` |
| H3 标题 | 18-22px | 700 | `#333333` |
| 正文 | 15-16px | 400 | `#333333` |
| 次要文字 | 13-14px | 400 | `#777777` |
| 小字/标签 | 11-12px | 500 | `#777777` |

**字体族：** `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif`

**排版规则：**
- 行间距 1.7-1.8
- 标题字间距 -0.5px
- 模块间距统一 24-32px

---

## 四、组件统一标准

### 4.1 按钮 (Button)

**主按钮（黄色）**
```
background: #FFD149
color: #333333
border: 1px solid #222222
border-radius: 8px
font-weight: 600
hover: background: #FFC107
```

**次按钮（蓝色描边）**
```
background: transparent
color: #4A86E8
border: 1px solid #4A86E8
border-radius: 8px
hover: background: rgba(74,134,232,0.05)
```

**幽灵按钮**
```
background: transparent
color: #333333
border: 1px solid #222222
hover: background: #F5F5F5
```

### 4.2 卡片 (Card)

```
background: #FFFFFF
border: 1px solid #222222
border-radius: 12px
padding: 24px
hover: border-color: #FFD149（仅边框变色，无阴影）
```

**禁止：** 不使用 box-shadow，不使用渐变填充，不使用圆角 > 14px

### 4.3 输入框 (Input/Textarea)

```
background: #FFFFFF
border: 1px solid #222222
border-radius: 8px
color: #333333
placeholder: #AAAAAA
focus: border-color: #FFD149
```

### 4.4 标签 (Tag)

```
border: 1px solid #222222
border-radius: 6px
background: transparent / #F5F5F5
color: #333333
```

### 4.5 进度条 (Progress)

```
轨道: #F5F5F5，1px solid #222222 描边
填充: #FFD149 或 #4A86E8
```

### 4.6 弹窗 (Dialog/Modal)

```
background: #FFFFFF
border: 1px solid #222222
border-radius: 12px
header: 底部 1px solid #E0E0E0 分割线
```

### 4.7 导航栏

```
background: #FFFFFF
border-bottom: 1px solid #222222
导航项 hover: background: #F5F5F5
导航项 active: background: #FFD149, color: #333333
```

### 4.8 下拉菜单

```
background: #FFFFFF
border: 1px solid #222222
border-radius: 8px
选项 hover: background: #F5F5F5
```

---

## 五、排版布局规则

- 页面最大宽度：`1200px`，居中
- 内容区 padding：`32px 24px 48px`
- 卡片网格间距：`24px`
- 移动端 padding：`20px 14px 36px`
- 响应式断点：768px（移动端）、1120px（中等屏幕）

---

## 六、图标规范

- 优先使用 **emoji 图标**（保持手绘亲和感）
- 不使用复杂 SVG 图标库
- 图标尺寸统一：导航 18px，卡片标题 24-28px，装饰 36-48px

---

## 七、动画规范

- 过渡时间：`0.2s cubic-bezier(0.4, 0, 0.2, 1)`
- hover 效果：仅轻微变色，无复杂阴影变化
- 入场动画：`fadeInUp` 0.5s ease-out
- **禁止：** 不使用 scale 放大效果，不使用 box-shadow 动画，不使用呼吸/发光动画

---

## 八、CSS 变量对照表

```css
:root {
  /* 主色 */
  --brand-yellow: #FFD149;
  --brand-blue: #4A86E8;
  
  /* 背景 */
  --bg-page: #FFFFFF;
  --bg-card: #FFFFFF;
  --bg-hover: #F5F5F5;
  
  /* 文字 */
  --text-primary: #333333;
  --text-secondary: #777777;
  --text-muted: #AAAAAA;
  
  /* 边框 */
  --border-color: #222222;
  --border-light: #E0E0E0;
  
  /* 圆角 */
  --radius-sm: 6px;
  --radius: 8px;
  --radius-lg: 12px;
  
  /* 过渡 */
  --transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## 九、页面清单与改造优先级

| 页面 | 文件 | 改造重点 |
|------|------|----------|
| 首页 | `Home.jsx` | Hero 区域、功能卡片、CTA 按钮 |
| 成长诊断 | `Diagnosis.jsx` | 表单样式、结果卡片 |
| AI 聊天 | `AiChat.jsx` | 聊天气泡、模式切换、输入框 |
| 情绪陪伴室 | `EmotionComfort.jsx` | 情绪卡片、聊天区、小工具 |
| 求职准备 | `JobPrep.jsx` | 简历优化、面试题卡片 |
| 面试复盘 | `InterviewReview.jsx` | 复盘表单、结果弹窗 |
| A/B 测试 | `ABTestLab.jsx` | 实验卡片、柱状图、数据表格 |
| 布局组件 | `Layout.jsx` | 导航栏、页脚 |
| 全局样式 | `global.css` | CSS 变量、基础组件类 |
