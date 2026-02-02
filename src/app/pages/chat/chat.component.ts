// Group each user prompt with its set of LLM responses for the UI

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { Conversation, ChatMessage } from '../../core/models/conversation.model';
import { environment } from '../../../environments/environment';
import { LlmResponse, MultiLLMResponse } from '../../core/models/llm-response.model';
import { ChatService } from '../../core/services/chat.service';

// ✅ Child components
import { ChatInputComponent } from '../../shared/components/chat-input/chat-input.component';
import { ModelCardComponent } from '../../shared/components/model-card/model-card.component'; 

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    ChatInputComponent,
    ModelCardComponent
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  conversations: Conversation[] = [];
  activeConversation: Conversation | null = null;
  loading = false;
  llmResponses: { [key: string]: string } = {};
  llmLoading: boolean = false;
  llmSelections: { [key: number]: string } = {};
  selectedLlm: string | null = null;

  constructor(private http: HttpClient, private cd: ChangeDetectorRef, private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.getConversations().subscribe(convs => {
      this.conversations = convs;
      if (convs.length === 0) {
        this.activeConversation = null;
        // Do not start a new chat automatically after deletion
      } else {
        // Use selectConversation to fetch full history for first conversation
        this.selectConversation(convs[0]);
      }
    });
  }

  // 🔹 Start a new chat
  startNewChat(): void {
    this.loading = true;
    this.llmResponses = {};
    this.selectedLlm = null;
    this.chatService.startChat().subscribe({
      next: (res) => {
        const conv: Conversation = {
          sessionId: res.session_id,
          mode: res.mode,
          selectedLlm: res.selected_llm,
          createdAt: res.created_at,
          messages: []
        };
        this.chatService.addConversation(conv);
        this.activeConversation = conv;
        this.llmSelections = {};
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Failed to start chat', err);
        this.loading = false;
      }
    });
  }

    getPromptResponseGroups() {
    if (!this.activeConversation) return [];
    const groups: any[] = [];
    const msgs = this.activeConversation.messages;
    for (let i = 0; i < msgs.length; i++) {
      if (msgs[i].role === 'user') {
        const responses: any = { gemini: '', deepseek_chat: '', deepseek_coder: '' };
        let loading = false;
        let j = i + 1;
        let found = { gemini: false, deepseek_chat: false, deepseek_coder: false };
        while (j < msgs.length && msgs[j].role === 'assistant') {
          if (msgs[j].llm_type === 'gemini') {
            responses.gemini = msgs[j].content;
            found.gemini = true;
          }
          if (msgs[j].llm_type === 'deepseek_chat') {
            responses.deepseek_chat = msgs[j].content;
            found.deepseek_chat = true;
          }
          if (msgs[j].llm_type === 'deepseek_coder') {
            responses.deepseek_coder = msgs[j].content;
            found.deepseek_coder = true;
          }
          j++;
          if (found.gemini && found.deepseek_chat && found.deepseek_coder) break;
        }
        if (!responses.gemini && !responses.deepseek_chat && !responses.deepseek_coder && i === msgs.length - 1 && this.llmLoading) {
          loading = true;
        }
        const isLatest = (i === msgs.length - 1) || (msgs.slice(i+1).find(m => m.role === 'user') === undefined);
        // Use the selected_llm from the user message for this group
        const selectedLlm = typeof msgs[i].selected_llm === 'string' ? msgs[i].selected_llm : null;
        groups.push({ prompt: msgs[i], responses, loading, selectedLlm, isLatest });
      }
    }
    return groups;
    }

    // Handle LLM selection for a prompt group
    onSelectLlm(group: any, llm: string) {
    let backendLlm = llm;
    if (llm === 'DeepSeek Chat' || llm === 'deepseek-chat') backendLlm = 'deepseek_chat';
    if (llm === 'DeepSeek Coder' || llm === 'deepseek-coder') backendLlm = 'deepseek_coder';
    if (llm === 'Gemini' || llm === 'gemini') backendLlm = 'gemini';
    if (llm === 'reset') {
      // Remove selected_llm from the user message for this group
      if (group && group.prompt && group.prompt.selected_llm) {
        delete group.prompt.selected_llm;
      }
      // If this is the latest group, also clear the global selectedLlm
      if (group && group.isLatest) {
        this.selectedLlm = null;
      }
    } else {
      // Set selected_llm on the user message for this group
      if (group && group.prompt) {
        group.prompt.selected_llm = backendLlm;
      }
      // If this is the latest group, update the global selectedLlm
      if (group && group.isLatest) {
        this.selectedLlm = backendLlm;
      }
      // Call backend to persist selection for latest user message
      if (this.activeConversation) {
        this.http.post('/api/chat/select-llm', {
          session_id: this.activeConversation.sessionId,
          llm: backendLlm
        }).subscribe();
      }
    }
    this.cd.detectChanges();
    }

  // 🔹 Send message from input component
  send(message: string): void {
    if (!this.activeConversation) return;
    console.log('SEND called with:', message);

    // Add user message to conversation, with selected_llm
    this.activeConversation.messages.push({
      role: 'user',
      content: message,
      createdAt: new Date().toISOString(),
      llm_type: 'user',
      selected_llm: this.selectedLlm || null
    });
    this.llmLoading = true;
    this.loading = true;
    this.llmResponses = {};
    const multi_url = `${environment.apiBaseUrl}/chat/multi`;
    // Use the selectedLlm (restored from DB/UI)
    let llmToSend = this.selectedLlm;
    // Always restore selectedLlm from last user message in this conversation
    const lastUser = [...this.activeConversation.messages].reverse().find(m => m.role === 'user' && m.selected_llm);
    if (lastUser && typeof lastUser.selected_llm === 'string') {
      llmToSend = lastUser.selected_llm;
      this.selectedLlm = lastUser.selected_llm;
    } else {
      llmToSend = null;
      this.selectedLlm = null;
    }
    const payload: any = {
      session_id: this.activeConversation.sessionId,
      prompt: message
    };
    if (llmToSend) {
      payload.llm = llmToSend;
    }
    this.http.post<any>(multi_url, payload).subscribe({
      next: (res) => {
        // Map backend array to expected keys
        const responses = res.responses || [];
        this.llmResponses = {
          gemini: responses.find((r: any) => r.llm === 'gemini')?.response || '',
          deepseek_chat: responses.find((r: any) => r.llm === 'deepseek-chat')?.response || '',
          deepseek_coder: responses.find((r: any) => r.llm === 'deepseek-coder')?.response || ''
        };
        // Add assistant messages to conversation
        if (this.llmResponses['gemini'] && this.activeConversation) {
          this.activeConversation.messages.push({
            role: 'assistant',
            content: this.llmResponses['gemini'],
            createdAt: new Date().toISOString(),
            llm_type: 'gemini'
          });
        }
        if (this.llmResponses['deepseek_chat'] && this.activeConversation) {
          this.activeConversation.messages.push({
            role: 'assistant',
            content: this.llmResponses['deepseek_chat'],
            createdAt: new Date().toISOString(),
            llm_type: 'deepseek_chat'
          });
        }
        if (this.llmResponses['deepseek_coder'] && this.activeConversation) {
          this.activeConversation.messages.push({
            role: 'assistant',
            content: this.llmResponses['deepseek_coder'],
            createdAt: new Date().toISOString(),
            llm_type: 'deepseek_coder'
          });
        }
        this.llmLoading = false;
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Failed to get LLM responses', err);
        this.llmLoading = false;
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  // 🔹 Select conversation
  selectConversation(conv: Conversation): void {
    // Set activeConversation immediately for UI update
    this.activeConversation = conv;
    this.cd.detectChanges();
    // Fetch full chat history for this conversation
    this.http.get<any[]>(`${environment.apiBaseUrl}/chat/history/${conv.sessionId}`).subscribe({
      next: (messages) => {
        conv.messages = messages.map(m => ({
          role: m.role,
          content: m.content,
          createdAt: m.createdAt,
          llm_type: m.llm_type,
          selected_llm: m.selected_llm,
          id: m.id
        }));
        // Restore selectedLlm from the last user message with a selected_llm
        if (conv && conv.messages) {
          const lastUser = [...conv.messages].reverse().find(m => m.role === 'user' && m.selected_llm);
          this.selectedLlm = lastUser && typeof lastUser.selected_llm === 'string' ? lastUser.selected_llm : null;
        } else {
          this.selectedLlm = null;
        }
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load chat history', err);
      }
    });
  }

  loadChatHistory(sessionId: string) {
    // Assume chatService will provide updated conversation state
    this.cd.detectChanges();
  }

  // 🔹 Reset chat
  resetChat(): void {
    if (this.activeConversation) {
      // Remove LLM selection from all user messages in this conversation
      for (const msg of this.activeConversation.messages) {
        if (msg.role === 'user' && msg.selected_llm) {
          delete msg.selected_llm;
        }
      }
      this.selectedLlm = null;
      this.llmResponses = {};
      this.cd.detectChanges();
    }
  }

  // Show confirmation dialog and delete conversation from DB
  deleteConversation(conv: Conversation, event: Event) {
    event.stopPropagation();
    // Show confirmation popup
    if (!window.confirm(`Are you sure you want to delete this conversation? This action cannot be undone.`)) {
      return;
    }
    this.loading = true;
    this.cd.detectChanges();
    // Call backend to delete conversation by sessionId
    this.chatService.deleteSession(conv.sessionId).subscribe({
      next: () => {
        // After successful delete, fetch updated conversations from backend
        this.chatService.getConversations().subscribe(convs => {
          this.conversations = convs;
          // If the deleted conversation was active, switch to another
          if (this.activeConversation && this.activeConversation.sessionId === conv.sessionId) {
            if (this.conversations.length > 0) {
              this.activeConversation = this.conversations[0];
              this.loadChatHistory(this.activeConversation.sessionId);
            } else {
              this.activeConversation = null;
              // Do not start a new chat automatically after deletion
            }
          }
          this.loading = false;
          this.cd.detectChanges();
        });
      },
      error: (err) => {
        this.loading = false;
        this.cd.detectChanges();
        window.alert('Failed to delete conversation. Please try again.');
      }
    });
  }
}
