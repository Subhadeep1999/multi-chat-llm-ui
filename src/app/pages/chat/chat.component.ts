import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { ChatInputComponent } from '../../shared/components/chat-input/chat-input.component';
import { ModelCardComponent } from '../../shared/components/model-card/model-card.component';
import { WordAnalysisComponent } from '../../shared/components/word-analysis/word-analysis.component';
import { ChatService } from '../../core/services/chat.service';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    ChatInputComponent,
    ModelCardComponent,
    WordAnalysisComponent
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent implements OnInit {

  // =========================
  // UI State
  // =========================
  responses: Record<string, string> = {};
  wordAnalysis: any = null;
  errorMessage = '';

  loadingStates: Record<string, boolean> = {
    deepseek_chat: false,
    deepseek_coder: false,
    gemini: false
  };

  // =========================
  // Model Options
  // =========================
  modelOptions: Record<string, string[]> = {
    deepseek_chat: [
      'deepseek-chat',
      'deepseek-chat-intl',
      'deepseek-chat-lite'
    ],
    deepseek_coder: [
      'deepseek-coder',
      'deepseek-coder-lite'
    ],
    gemini: [
      'gemini-2.0-flash',
      'gemini-1.5-pro',
      'gemini-1.0-pro'
    ]
  };

  // =========================
  // Selected Models
  // =========================
  selectedModels: Record<string, string> = {
    deepseek_chat: 'deepseek-chat',
    deepseek_coder: 'deepseek-coder',
    gemini: 'gemini-2.0-flash'
  };

  constructor(
    private chatService: ChatService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  // =========================
  // Model Selection
  // =========================
  onModelChange(llm: string, model: string): void {
    this.selectedModels[llm] = model;
  }

  // =========================
  // Send Prompt
  // =========================
  onSend(prompt: string): void {
    if (!prompt || !prompt.trim()) return;

    console.log('onSend called with:', prompt);

    // Reset state
    this.errorMessage = '';
    this.responses = {};
    this.wordAnalysis = null;

    this.loadingStates = {
      deepseek_chat: true,
      deepseek_coder: true,
      gemini: true
    };

    this.cdr.markForCheck();

    this.chatService.sendPrompt(prompt, this.selectedModels).subscribe({
      next: (res: any) => {
        console.log('API response:', res);

        // Word analysis
        if (res.word_analysis) {
          this.wordAnalysis = res.word_analysis;
        }

        // LLM responses
        if (Array.isArray(res.llm_responses)) {
          res.llm_responses.forEach((r: any) => {
            // Normalize backend model name → frontend key
            const key = (r.model || '').replace('-', '_');
            this.responses[key] = r.response;
            this.loadingStates[key] = false;
          });
        }

        this.cdr.markForCheck();
      },
      error: (err: any) => {
        console.error('API error:', err);

        this.errorMessage =
          err?.error?.detail ||
          err?.message ||
          'Failed to get responses from backend';

        this.loadingStates = {
          deepseek_chat: false,
          deepseek_coder: false,
          gemini: false
        };

        this.cdr.markForCheck();
      }
    });
  }
}
