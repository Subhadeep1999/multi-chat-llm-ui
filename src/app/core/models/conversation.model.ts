// -----------------------------
// Message inside a conversation
// -----------------------------
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  llm_type?: string; // 'gemini', 'deepseek_chat', 'deepseek_coder' for assistant, undefined for user
  selected_llm?: string | null; // for user prompt, which LLM was selected
  id?: string;
}

// -----------------------------
// LLM response (multi-LLM mode)
// -----------------------------
export interface LLMResponse {
  llm: string;
  response: string;
}

// -----------------------------
// Conversation (FINAL & CLEAN)
// -----------------------------
export interface Conversation {
  // Backend session ID (primary identifier)
  sessionId: string;

  // Chat mode
  mode: 'MULTI' | 'SINGLE';

  // Selected LLM after user chooses
  selectedLlm: string | null;

  // Metadata
  createdAt: string;

  // Chat history
  messages: ChatMessage[];

  // 🔹 Optional UI-only fields (NOT required)
  id?: string;
  title?: string;
}
