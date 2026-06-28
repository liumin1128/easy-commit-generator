import * as vscode from "vscode";
import { GitService } from "./gitService";
import { AIService } from "./aiService";

/**
 * 扩展激活入口
 */
export function activate(context: vscode.ExtensionContext) {
  const gitService = new GitService();
  const aiService = new AIService();

  // 注册：生成中文 Commit Message
  const cmdZhCN = vscode.commands.registerCommand(
    "easyCommitGenerator.generateZhCN",
    async () => {
      await generateCommitMessage(gitService, aiService, "zh-cn");
    },
  );

  // 注册：生成英文 Commit Message
  const cmdEn = vscode.commands.registerCommand(
    "easyCommitGenerator.generateEn",
    async () => {
      await generateCommitMessage(gitService, aiService, "en");
    },
  );

  context.subscriptions.push(cmdZhCN, cmdEn);
}

/**
 * 生成 Commit Message 的核心流程
 */
async function generateCommitMessage(
  gitService: GitService,
  aiService: AIService,
  language: "zh-cn" | "en",
): Promise<void> {
  try {
    // 1. 初始化 Git API
    const initialized = await gitService.initialize();
    if (!initialized) {
      return;
    }

    // 2. 获取暂存区 diff
    const diff = await gitService.getStagedDiff();
    if (!diff) {
      return;
    }

    // 3. 显示进度条
    const langLabel = language === "zh-cn" ? "中文" : "英文";
    const message = await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: `正在生成${langLabel} Commit Message...`,
        cancellable: true,
      },
      async (progress, token) => {
        // 4. 调用 AI 生成
        if (language === "zh-cn") {
          return await aiService.generateZhCN(diff);
        } else {
          return await aiService.generateEn(diff);
        }
      },
    );

    // 5. 设置到 SCM 输入框
    if (message) {
      gitService.setCommitMessage(message);
      vscode.window.showInformationMessage(
        `✅ ${langLabel} Commit Message 已生成`,
      );
    }
  } catch (error) {
    vscode.window.showErrorMessage(
      `生成 Commit Message 失败: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * 扩展停用
 */
export function deactivate() {}
