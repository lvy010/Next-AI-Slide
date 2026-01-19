"use client";

import { useMemo, useState } from "react";

type GenerateRequest = {
  topic: string;
  audience: string;
  tone: string;
  slideCount: number;
  language: string;
  theme: string;
  includeCode: boolean;
  includeMermaid: boolean;
};

const copy = {
  "zh-CN": {
    title: "Next AI Slide",
    subtitle: "将自然语言转为 Slidev Markdown",
    langToggle: "中 / EN",
    configTitle: "AI 生成配置",
    example: "使用示例",
    promptLabel: "主题/需求描述",
    promptPlaceholder: "例如：AI 驱动的年度战略汇报",
    audienceLabel: "受众",
    toneLabel: "语气/风格",
    slideCountLabel: "页数",
    languageLabel: "语言",
    themeLabel: "主题模板",
    themePlaceholder: "例如：seriph / apple-basic",
    preferenceLabel: "内容偏好",
    includeCode: "代码片段",
    includeMermaid: "Mermaid 图表",
    generate: "生成 Slidev Markdown",
    generating: "生成中...",
    randomExample: "随机示例",
    previewTitle: "Slidev 预览",
    copy: "复制",
    download: "下载 .md",
    previewPlaceholder: "生成后的 Slidev Markdown 将显示在这里，支持直接复制或下载。",
    previewHint: "可以将生成内容保存为 slides.md，然后用 Slidev CLI 预览。",
    fallback:
      "未检测到 AI Key，已返回本地模板示例。设置 OPENAI_API_KEY 可启用真实模型生成。",
  },
  "en-US": {
    title: "Next AI Slide",
    subtitle: "Turn prompts into Slidev Markdown",
    langToggle: "中 / EN",
    configTitle: "AI Generation",
    example: "Use Example",
    promptLabel: "Topic / Prompt",
    promptPlaceholder: "e.g. AI-driven annual strategy briefing",
    audienceLabel: "Audience",
    toneLabel: "Tone / Style",
    slideCountLabel: "Slides",
    languageLabel: "Language",
    themeLabel: "Theme",
    themePlaceholder: "e.g. seriph / apple-basic",
    preferenceLabel: "Preferences",
    includeCode: "Code blocks",
    includeMermaid: "Mermaid diagrams",
    generate: "Generate Slidev Markdown",
    generating: "Generating...",
    randomExample: "Random Example",
    previewTitle: "Slidev Preview",
    copy: "Copy",
    download: "Download .md",
    previewPlaceholder:
      "Generated Slidev Markdown will appear here. Copy or download directly.",
    previewHint: "Save as slides.md and preview with the Slidev CLI.",
    fallback:
      "No AI key detected. Returning a local template. Set OPENAI_API_KEY to enable real generation.",
  },
};

const examplePrompts = {
  "zh-CN": [
    "用 8 页介绍 AI 助力产品经理的日常工作",
    "向高中生解释什么是量子计算，包含 1 张流程图",
    "公司季度复盘汇报，语气正式，包含关键指标与图表建议",
  ],
  "en-US": [
    "Use 8 slides to explain how AI helps product managers daily",
    "Explain quantum computing to high school students, include one diagram",
    "Quarterly business review with key metrics and chart suggestions",
  ],
};

export default function Home() {
  const [topic, setTopic] = useState("AI 驱动的产品发布会");
  const [audience, setAudience] = useState("产品团队与管理层");
  const [tone, setTone] = useState("专业、清晰、简洁");
  const [slideCount, setSlideCount] = useState(8);
  const [language, setLanguage] = useState("zh-CN");
  const [theme, setTheme] = useState("default");
  const [includeCode, setIncludeCode] = useState(true);
  const [includeMermaid, setIncludeMermaid] = useState(true);
  const [markdown, setMarkdown] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [usedFallback, setUsedFallback] = useState(false);

  const requestPayload: GenerateRequest = useMemo(
    () => ({
      topic,
      audience,
      tone,
      slideCount,
      language,
      theme,
      includeCode,
      includeMermaid,
    }),
    [
      audience,
      includeCode,
      includeMermaid,
      language,
      slideCount,
      theme,
      tone,
      topic,
    ],
  );

  const handleGenerate = async () => {
    setError("");
    setIsLoading(true);
    setUsedFallback(false);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "生成失败，请稍后重试。");
      }
      const data = (await response.json()) as {
        markdown: string;
        usedFallback?: boolean;
      };
      setMarkdown(data.markdown || "");
      setUsedFallback(Boolean(data.usedFallback));
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败，请稍后重试。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!markdown) return;
    await navigator.clipboard.writeText(markdown);
  };

  const handleDownload = () => {
    if (!markdown) return;
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "slides.md";
    link.click();
    URL.revokeObjectURL(url);
  };

  const uiText = copy[language as "zh-CN" | "en-US"] ?? copy["zh-CN"];
  const exampleList = examplePrompts[language as "zh-CN" | "en-US"];

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
