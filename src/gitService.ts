import * as vscode from "vscode";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

/**
 * Git API 接口定义（vscode.git 扩展暴露的 API）
 */
interface GitExtension {
  getAPI(version: 1): GitAPI;
}

interface GitAPI {
  repositories: Repository[];
}

interface Repository {
  rootUri: vscode.Uri;
  state: RepositoryState;
  inputBox: { value: string };
  diffIndexWithHEAD(): Promise<string>;
  diffIndexWith(ref: string): Promise<string>;
  diff(cached: boolean): Promise<string>;
}

interface RepositoryState {
  HEAD: Branch | undefined;
  refs: Branch[];
  workingTreeChanges: Change[];
  indexChanges: Change[];
}

interface Branch {
  name: string;
  commit: string;
}

interface Change {
  uri: vscode.Uri;
  status: number;
}

/**
 * GitService - 负责与 Git 扩展交互，获取暂存区变更
 */
export class GitService {
  private gitApi: GitAPI | null = null;

  /**
   * 初始化 Git API
   */
  async initialize(): Promise<boolean> {
    const gitExtension =
      vscode.extensions.getExtension<GitExtension>("vscode.git");
    if (!gitExtension) {
      vscode.window.showErrorMessage(
        "未找到 Git 扩展，请确保已启用内置 Git 扩展",
      );
      return false;
    }

    if (!gitExtension.isActive) {
      await gitExtension.activate();
    }

    const api = gitExtension.exports.getAPI(1);
    this.gitApi = api;
    return true;
  }

  /**
   * 获取当前工作区的 Git 仓库
   */
  getRepository(): Repository | null {
    if (!this.gitApi) {
      return null;
    }

    const repos = this.gitApi.repositories;
    if (repos.length === 0) {
      vscode.window.showWarningMessage("当前工作区没有 Git 仓库");
      return null;
    }

    // 如果有多个仓库，使用第一个
    return repos[0];
  }

  /**
   * 获取暂存区的 diff 内容（直接调用 git CLI，避免 Git API 兼容性问题）
   */
  async getStagedDiff(): Promise<string | null> {
    const repo = this.getRepository();
    if (!repo) {
      return null;
    }

    const cwd = repo.rootUri.fsPath;

    try {
      // 直接使用 git diff --cached 获取暂存区变更
      const { stdout } = await execAsync("git diff --cached", { cwd });
      const diff = stdout.trim();
      if (!diff) {
        vscode.window.showWarningMessage("暂存区没有变更，请先 git add 文件");
        return null;
      }
      return diff;
    } catch (error) {
      vscode.window.showErrorMessage(`获取暂存区变更失败: ${error}`);
      return null;
    }
  }

  /**
   * 设置 SCM 输入框的值 (commit message)
   */
  setCommitMessage(message: string): void {
    const repo = this.getRepository();
    if (!repo) {
      return;
    }
    repo.inputBox.value = message;
  }
}
