import * as vscode from "vscode";
import { IAIProvider } from "./providers/IAIProvider";
import { VSCodeLMProvider } from "./providers/vscodeLMProvider";
import { OpenAIProvider } from "./providers/openaiProvider";

/**
 * AIService - 根据用户配置自动选择 AI Provider（策略模式）
 */
export class AIService {
  private provider: IAIProvider | null = null;

  /**
   * 获取当前应使用的 Provider（延迟初始化）
   */
  private getProvider(): IAIProvider {
    if (this.provider) {
      return this.provider;
    }

    const config = vscode.workspace.getConfiguration("git-message");
    const baseUrl = config.get<string>("apiBaseUrl", "");
    const apiKey = config.get<string>("apiKey", "");
    const model = config.get<string>("apiModel", "gpt-4o-mini");

    if (baseUrl && apiKey) {
      this.provider = new OpenAIProvider({ baseUrl, apiKey, model });
    } else {
      this.provider = new VSCodeLMProvider();
    }

    return this.provider;
  }

  /** 根据暂存区 diff 生成中文 Commit Message */
  async generateZhCN(diff: string): Promise<string> {
    return this.getProvider().generate(diff, "zh-cn");
  }

  /** 根据暂存区 diff 生成英文 Commit Message */
  async generateEn(diff: string): Promise<string> {
    return this.getProvider().generate(diff, "en");
  }
}
