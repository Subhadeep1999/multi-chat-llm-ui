// Message model placeholder
export interface Message {
  id?: string;
  text: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp?: string;
}
