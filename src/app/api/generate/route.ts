import { NextResponse } from "next/server";
import {
  buildFallbackSlidev,
  buildSlidevPrompt,
  type SlidevGenerateOptions,
} from "@/lib/slidev";

const OPENAI_BASE_URL =
  process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

const normalizeOptions = (payload: Partial<SlidevGenerateOptions>) => ({
  topic: String(payload.topic || "").trim(),
  audience: String(payload.audience || ""),
  tone: String(payload.tone || ""),
  slideCount: Number(payload.slideCount || 8),
  language: String(payload.language || "zh-CN"),
  theme: String(payload.theme || "default"),
  includeCode: Boolean(payload.includeCode),
  includeMermaid: Boolean(payload.includeMermaid),
});

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<SlidevGenerateOptions>;
  const options = normalizeOptions(payload);

  if (!options.topic) {
    return NextResponse.json(
      { error: "请输入主题或需求描述。" },
      { status: 400 },
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({
      markdown: buildFallbackSlidev(options),
      usedFallback: true,
    });
  }

  const prompt = buildSlidevPrompt(options);

  try {
    const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content:
              "You are a Slidev expert. Output ONLY Slidev Markdown with front matter.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { error: text || "模型调用失败，请稍后重试。" },
        { status: 500 },
      );
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content?.trim();

    if (!content) {
      return NextResponse.json({
        markdown: buildFallbackSlidev(options),
        usedFallback: true,
      });
    }

    return NextResponse.json({
      markdown: content,
      usedFallback: false,
      model: OPENAI_MODEL,
    });
  } catch (error) {
    return NextResponse.json(
      {
        markdown: buildFallbackSlidev(options),
        usedFallback: true,
        error: error instanceof Error ? error.message : "模型调用失败。",
      },
      { status: 500 },
    );
  }
}

