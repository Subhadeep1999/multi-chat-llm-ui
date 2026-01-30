import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Conversation } from '../models/conversation.model';

@Injectable({ providedIn: 'root' })
export class ChatService {

  private API = `${environment.apiBaseUrl}/chat`;

  private conversations$ = new BehaviorSubject<Conversation[]>([]);
  private activeConversation$ = new BehaviorSubject<Conversation | null>(null);

  constructor(private http: HttpClient) {}

  // ---------------------------
  // Conversation state
  // ---------------------------
  getConversations() {
    // On first subscription, fetch all sessions from backend
    this.fetchAllSessions();
    return this.conversations$.asObservable();
  }

  fetchAllSessions() {
    this.http.get<any[]>(`${this.API}/sessions`).subscribe(sessions => {
      // Map backend sessions to Conversation[]
      const conversations = sessions.map(s => ({
        sessionId: s.session_id,
        mode: s.mode,
        selectedLlm: s.selectedLlm || null,
        createdAt: s.createdAt,
        messages: s.firstMessage ? [{ content: s.firstMessage, role: 'user' as 'user', createdAt: s.createdAt }] : []
      }));
      this.conversations$.next(conversations);
    });
  }

  getActiveConversation() {
    return this.activeConversation$.value;
  }

  setActiveConversation(conv: Conversation) {
    this.activeConversation$.next(conv);
  }

  // ---------------------------
  // Start new chat
  // ---------------------------
  startChat() {
    return this.http.post<any>(`${this.API}/start`, {});
  }

  addConversation(conv: Conversation) {
    this.conversations$.next([conv, ...this.conversations$.value]);
    this.activeConversation$.next(conv);
  }

  // ---------------------------
  // Backend calls
  // ---------------------------
  sendMultiPrompt(prompt: string) {
    const sessionId = this.getActiveConversation()?.id;
    return this.http.post<any>(`${this.API}/multi`, {
      session_id: sessionId,
      prompt
    });
  }

  selectLLM(llm: string) {
    const sessionId = this.getActiveConversation()?.id;
    return this.http.post<any>(`${this.API}/select-llm`, {
      session_id: sessionId,
      llm
    });
  }

  sendSinglePrompt(prompt: string) {
    const sessionId = this.getActiveConversation()?.id;
    return this.http.post<any>(`${this.API}/single`, {
      session_id: sessionId,
      prompt
    });
  }
}
