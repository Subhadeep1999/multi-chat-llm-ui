export interface LlmResponseItem {
  model: string;
  response: string;
}

export interface WordAnalysisData {
  total_words: number;
  word_count: number;
  top_5_words: Array<{
    word: string;
    count: number;
  }>;
}

export interface LlmResponse {
  word_analysis?: WordAnalysisData;
  llm_responses?: LlmResponseItem[];
}

export interface MultiLLMResponse {
  gemini: string;
  deepseek_chat: string;
  deepseek_coder: string;
}

