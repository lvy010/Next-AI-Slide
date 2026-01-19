export type SlidevGenerateOptions = {
  topic: string;
  audience: string;
  tone: string;
  slideCount: number;
  language: string;
  theme: string;
  includeCode: boolean;
  includeMermaid: boolean;
};

const clampSlideCount = (value: number) => {
  if (Number.isNaN(value)) return 8;
  return Math.min(20, Math.max(3, value));
};

export const buildSlidevPrompt = (options: SlidevGenerateOptions) => {
  const count = clampSlideCount(options.slideCount);
  return [
    "你是资深幻灯片作者，请根据用户需求生成 Slidev Markdown。",
    "严格输出 Slidev Markdown，不要包含其它解释。",
    "请包含 YAML front matter，设置 title、theme、layout。",
    `总页数为 ${count} 页（含封面与结尾）。`,
    `语言: ${options.language}`,
    `主题: ${options.topic}`,
    `受众: ${options.audience}`,
    `语气风格: ${options.tone}`,
    `主题模板: ${options.theme || "default"}`,
    `是否包含代码片段: ${options.includeCode ? "是" : "否"}`,
    `是否包含 Mermaid 图表: ${options.includeMermaid ? "是" : "否"}`,
  ].join("\n");
};

export const buildFallbackSlidev = (options: SlidevGenerateOptions) => {
  const count = clampSlideCount(options.slideCount);
  const title = options.topic?.trim() || "AI 主题演示";
  const theme = options.theme?.trim() || "default";
  const language = options.language?.trim() || "zh-CN";

  const slides: string[] = [];
  slides.push(
    [
      "---",
      `title: ${title}`,
      `theme: ${theme}`,
      "layout: cover",
      "---",
      `# ${title}`,
      "",
      `> 面向 ${options.audience || "目标受众"}`,
      `> 语气：${options.tone || "专业清晰"}`,
    ].join("\n"),
  );

  slides.push(
    [
      "---",
      "layout: agenda",
      "---",
      "## 议程",
      "",
      "- 背景与目标",
      "- 核心洞察",
      "- 方案与执行",
      "- 里程碑与指标",
      "- 下一步行动",
    ].join("\n"),
  );

  slides.push(
    [
      "---",
      "---",
      "## 背景与目标",
      "",
      "- 行业趋势概览",
      "- 业务问题与机会",
      "- 本次演示的目标",
    ].join("\n"),
  );

  slides.push(
    [
      "---",
      "---",
      "## 核心洞察",
      "",
      "- 关键数据摘要",
      "- 用户痛点与需求",
      "- 竞品差异化分析",
    ].join("\n"),
  );

  if (options.includeMermaid) {
    slides.push(
      [
        "---",
        "---",
        "## 流程示意",
        "",
        "```mermaid",
        "flowchart LR",
        "A[需求输入] --> B[AI 生成]",
        "B --> C[Slidev Markdown]",
        "C --> D[发布与迭代]",
        "```",
      ].join("\n"),
    );
  }

  if (options.includeCode) {
    slides.push(
      [
        "---",
        "---",
        "## 示例代码",
        "",
        "```ts",
        "export const generateSlides = async (prompt: string) => {",
        "  const response = await fetch('/api/generate', {",
        "    method: 'POST',",
        "    body: JSON.stringify({ topic: prompt }),",
        "  });",
        "  return response.json();",
        "};",
        "```",
      ].join("\n"),
    );
  }

  slides.push(
    [
      "---",
      "---",
      "## 方案与执行",
      "",
      "- 关键里程碑",
      "- 资源与协作",
      "- 风险与对策",
    ].join("\n"),
  );

  slides.push(
    [
      "---",
      "layout: end",
      "---",
      "## 下一步",
      "",
      "- 确认需求与范围",
      "- 建立试点与反馈机制",
      "- 规划迭代节奏",
      "",
      `> Generated in ${language}`,
    ].join("\n"),
  );

  if (slides.length > count) {
    return slides.slice(0, count).join("\n\n");
  }

  while (slides.length < count) {
    slides.splice(
      slides.length - 1,
      0,
      [
        "---",
        "---",
        `## 扩展内容 ${slides.length}`,
        "",
        "- 补充案例",
        "- 数据支撑",
        "- 行动建议",
      ].join("\n"),
    );
  }

  return slides.join("\n\n");
};

