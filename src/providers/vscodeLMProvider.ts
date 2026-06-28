import * as vscode from "vscode";
import { IAIProvider } from "./IAIProvider";
import { zhCNUserPrompt, enUserPrompt } from "../prompts";

/**
 * VSCodeLMProvider - 使用 VS Code 内置语言模型（Copilot 等）
 */
export class VSCodeLMProvider implements IAIProvider {
  async generate(diff: string, language: "zh-cn" | "en"): Promise<string> {
    // 尝试选择 Copilot 模型
    let models = await vscode.lm.selectChatModels({
      vendor: "copilot",
      family: "gpt-4o",
    });

    if (models.length === 0) {
      models = await vscode.lm.selectChatModels();
    }

    if (models.length === 0) {
      throw new Error(
        "没有可用的语言模型，请登录 GitHub Copilot 或在设置中配置自定义 API",
      );
    }

    const prompt =
      language === "zh-cn" ? zhCNUserPrompt(diff) : enUserPrompt(diff);

    const messages: vscode.LanguageModelChatMessage[] = [
      vscode.LanguageModelChatMessage.User(prompt),
    ];

    const response = await models[0].sendRequest(
      messages,
      {},
      new vscode.CancellationTokenSource().token,
    );

    let result = "";
    for await (const fragment of response.text) {
      result += fragment;
    }

    return result.trim();
  }
}
