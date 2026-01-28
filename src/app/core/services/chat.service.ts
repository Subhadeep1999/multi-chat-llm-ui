import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LlmResponse } from '../models/llm-response.model';
import { environment } from '../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = `${environment.apiUrl}/chat`;

  constructor(private http: HttpClient) {}

  sendPrompt(prompt: string, selectedModels: Record<string, string>): Observable<LlmResponse> {
    return this.http.post<LlmResponse>(this.apiUrl, { prompt, selected_models: selectedModels });
  }
}
