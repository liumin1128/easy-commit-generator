import { IAIProvider } from "./IAIProvider";
import {
  zhCNSystemPrompt,
  zhCNUserPrompt,
  enSystemPrompt,
  enUserPrompt,
} from "../prompts";

interface APIConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
}

/**
 * OpenAIProvider - 调用 OpenAI 兼容 API（支持任何兼容接口的模型）
 */
export class OpenAIProvider implements IAIProvider {
  constructor(private config: APIConfig) {}

  async generate(diff: string, language: "zh-cn" | "en"): Promise<string> {
    const { baseUrl, apiKey, model } = this.config;

    // 规范化 baseUrl：去掉末尾斜杠，确保有 /v1 路径
    let url = baseUrl.replace(/\/+$/, "");
    if (!url.endsWith("/v1")) {
      url += "/v1";
    }
    url += "/chat/completions";

    const systemPrompt =
      language === "zh-cn" ? zhCNSystemPrompt() : enSystemPrompt();
    const userPrompt =
      language === "zh-cn" ? zhCNUserPrompt(diff) : enUserPrompt(diff);

    const body = {
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    };

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API 请求失败 (${response.status}): ${errorText}`);
    }

    const data = (await response.json()) as {
      choices: Array<{ message: { content: string } }>;
    };

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("API 返回了空响应");
    }

    return content.trim();
  }
}
