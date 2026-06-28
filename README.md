# Git Message - 一键生成中英文 Commit Message

在 VS Code 源代码管理（SCM）面板中，为 Git 暂存区变更一键生成中文或英文的 Commit Message。

## 功能

- 🇨🇳 **中文 Commit Message** - 根据暂存区代码变更，自动生成符合 Conventional Commits 规范的中文提交信息
- 🇬🇧 **英文 Commit Message** - 根据暂存区代码变更，自动生成符合 Conventional Commits 规范的英文提交信息

## 使用方法

1. 在 VS Code 中暂存你的代码变更（`git add`）
2. 打开源代码管理面板（Ctrl+Shift+G / Cmd+Shift+G）
3. 在 SCM 工具栏中点击 💬 按钮
   - 生成中文或英文 Commit Message
4. 生成的 Commit Message 会自动填入输入框

## 要求

- VS Code 1.90.0 及以上版本
- 已登录 GitHub Copilot（或配置了其他 AI 语言模型提供商）
- Git 仓库已初始化

## 开发

```bash
# 安装依赖
npm install

# 编译
npm run compile

# 打包
npm run package
```

## 许可证

MIT
