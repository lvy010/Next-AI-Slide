## Next AI Slide

[English README](./README.md)

AI 驱动的 Slidev Markdown 生成器。输入自然语言需求，生成 Slidev Markdown，并支持复制与下载。with:https://github.com/slidevjs/slidev/issues/2435

## 快速开始

### 1) 安装依赖

```bash
npm install
```

### 2) 配置环境变量（可选）

创建 `.env.local` 并填写：

```bash
OPENAI_API_KEY=你的 OpenAI Key
OPENAI_MODEL=gpt-4o-mini
OPENAI_BASE_URL=https://api.openai.com/v1
```

未配置 Key 时会返回本地模板示例。

### 3) 运行开发服务器

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000) 查看页面。

主要页面在 `src/app/page.tsx`，API 在 `src/app/api/generate/route.ts`。

## 部署

### Vercel

直接在 Vercel 部署即可，记得在环境变量中配置 `OPENAI_API_KEY`。

### 其他平台

```bash
npm run build
npm run start
```

## 说明

- 项目默认使用 OpenAI 接口，可扩展到其它模型。
- 输出为标准 Slidev Markdown，可直接保存为 `slides.md` 使用 Slidev 预览。

## 后续计划

1. 集成 Slidev CLI 实现实时预览
2. 一句话生成 PPT（Prompt → Slidev Markdown → 实时预览）
3. 支持粘贴 GitHub 仓库链接读取内容并生成 PPT
   - 复用 [github-agent](https://github.com/lvy010/github-agent) 的仓库读取流程
   - 生成文本摘要/结构化要点后再转 Slidev Markdown
   - 最终通过 Slidev CLI 做实时预览
4. 对 LLM 进行微调，训练 Slidev 专用模型，生成更好的 PPT、更适配

