/**
 * IAIProvider - AI 供应商接口，定义统一的生成方法
 */
export interface IAIProvider {
  /** 根据 diff 和语言生成 Commit Message */
  generate(diff: string, language: "zh-cn" | "en"): Promise<string>;
}
