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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-sm font-semibold text-white">
              AI
            </div>
            <div>
              <h1 className="text-lg font-semibold">{uiText.title}</h1>
              <p className="text-xs text-slate-500">{uiText.subtitle}</p>
            </div>
          </div>
          <button
            className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:text-slate-900"
            type="button"
            onClick={() =>
              setLanguage(language === "zh-CN" ? "en-US" : "zh-CN")
            }
          >
            {uiText.langToggle}
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-6 py-6 lg:grid-cols-[1.05fr_1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">{uiText.configTitle}</h2>
            <button
              className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500 hover:text-slate-700"
              type="button"
              onClick={() => setTopic(exampleList[0])}
            >
              {uiText.example}
            </button>
          </div>

          <div className="mt-5 grid gap-4">
            <label className="grid gap-2 text-sm">
              {uiText.promptLabel}
              <textarea
                className="min-h-28 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                placeholder={uiText.promptPlaceholder}
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm">
                {uiText.audienceLabel}
                <input
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-slate-400"
                  value={audience}
                  onChange={(event) => setAudience(event.target.value)}
                />
              </label>
              <label className="grid gap-2 text-sm">
                {uiText.toneLabel}
                <input
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-slate-400"
                  value={tone}
                  onChange={(event) => setTone(event.target.value)}
                />
              </label>
              <label className="grid gap-2 text-sm">
                {uiText.slideCountLabel}
                <input
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-slate-400"
                  type="number"
                  min={3}
                  max={20}
                  value={slideCount}
                  onChange={(event) =>
                    setSlideCount(Number(event.target.value))
                  }
                />
              </label>
              <label className="grid gap-2 text-sm">
                {uiText.languageLabel}
                <select
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-slate-400"
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                >
                  <option value="zh-CN">中文</option>
                  <option value="en-US">English</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm">
                {uiText.themeLabel}
                <input
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-slate-400"
                  value={theme}
                  onChange={(event) => setTheme(event.target.value)}
                  placeholder={uiText.themePlaceholder}
                />
              </label>
              <div className="grid gap-2 text-sm">
                {uiText.preferenceLabel}
                <div className="flex flex-wrap gap-3 text-xs text-slate-600">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={includeCode}
                      onChange={(event) => setIncludeCode(event.target.checked)}
                    />
                    {uiText.includeCode}
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={includeMermaid}
                      onChange={(event) =>
                        setIncludeMermaid(event.target.checked)
                      }
                    />
                    {uiText.includeMermaid}
                  </label>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                type="button"
                onClick={handleGenerate}
                disabled={isLoading}
              >
                {isLoading ? uiText.generating : uiText.generate}
              </button>
              <button
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:text-slate-900"
                type="button"
                onClick={() =>
                  setTopic(
                    exampleList[
                      Math.floor(Math.random() * exampleList.length)
                    ],
                  )
                }
              >
                {uiText.randomExample}
              </button>
            </div>

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            ) : null}
            {usedFallback ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
                {uiText.fallback}
              </div>
            ) : null}
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">{uiText.previewTitle}</h2>
            <div className="flex gap-2">
              <button
                className="rounded-lg border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:text-slate-900"
                type="button"
                onClick={handleCopy}
                disabled={!markdown}
              >
                {uiText.copy}
              </button>
              <button
                className="rounded-lg border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:text-slate-900"
                type="button"
                onClick={handleDownload}
                disabled={!markdown}
              >
                {uiText.download}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-900/95 p-4 text-xs text-slate-100">
            <pre className="whitespace-pre-wrap leading-5">
              {markdown ||
                uiText.previewPlaceholder}
            </pre>
          </div>
          <div className="text-xs text-slate-500">
            {uiText.previewHint}
          </div>
        </section>
      </main>
    </div>
  );
}
