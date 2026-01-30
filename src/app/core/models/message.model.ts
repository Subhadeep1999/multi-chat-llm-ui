// // Message model placeholder
// export interface Message {
//   id?: string;
//   text: string;
//   sender: 'user' | 'assistant' | 'system';
//   timestamp?: string;
// }
export interface Message {
  role: 'user' | 'assistant';
  content: string;
}