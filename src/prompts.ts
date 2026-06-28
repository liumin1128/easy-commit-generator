/**
 * prompts - 纯函数，负责生成 AI Prompt 模板，不涉及任何 I/O
 */

/** 限制 diff 长度，避免超出 token 限制 */
const MAX_DIFF_LENGTH = 4000;

function truncateDiff(diff: string): string {
  if (diff.length <= MAX_DIFF_LENGTH) {
    return diff;
  }
  return diff.substring(0, MAX_DIFF_LENGTH) + "\n... (diff 内容已截断)";
}

/** 生成中文 Commit Message 的 System Prompt */
export function zhCNSystemPrompt(): string {
  return `你是一位资深软件工程师，擅长根据 git diff 编写规范的 commit message。

要求：
1. 遵循 Conventional Commits 规范（feat:, fix:, chore:, docs:, refactor:, style:, test:, ci:, build:, perf: 等）
2. 标题不超过 50 个字符，标题后空一行再写正文
3. 用中文描述变更内容
4. 只返回 commit message 文本，不要包含任何解释或 markdown 代码块标记
5. 如果是多项变更，正文用列表形式简要说明`;
}

/** 生成中文 Commit Message 的 User Prompt */
export function zhCNUserPrompt(diff: string): string {
  return `请根据以下 git diff 生成中文 commit message：

\`\`\`
${truncateDiff(diff)}
\`\`\``;
}

/** 生成英文 Commit Message 的 System Prompt */
export function enSystemPrompt(): string {
  return `You are a senior software engineer skilled at writing standardized commit messages based on git diffs.

Requirements:
1. Follow Conventional Commits specification (feat:, fix:, chore:, docs:, refactor:, style:, test:, ci:, build:, perf:, etc.)
2. Title no more than 50 characters, followed by a blank line before the body
3. Describe changes in English
4. Return only the commit message text, no explanations or markdown code blocks
5. If multiple changes, use bullet points in the body for a brief summary`;
}

/** 生成英文 Commit Message 的 User Prompt */
export function enUserPrompt(diff: string): string {
  return `Generate an English commit message for the following git diff:

\`\`\`
${truncateDiff(diff)}
\`\`\``;
}
