import { Component, Input, Output, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy, SimpleChanges, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-model-card',
  standalone: true,
  templateUrl: './model-card.component.html',
  styleUrls: ['./model-card.component.css'],
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModelCardComponent implements OnChanges {
  @Input() modelName = '';
  @Input() response: string | null = '';
  @Input() isLoading = false;
  @Input() modelOptions: string[] = [];
  @Input() selectedModel = '';
  @Input() showSelect = false;
  @Input() showReset = false;
  @Input() selected = false;
  @Input() disabled = false;
  @Output() modelChange = new EventEmitter<string>();
  @Output() select = new EventEmitter<string>();
  @Output() reset = new EventEmitter<string>();

  selectLlm() {
      this.select.emit(this.modelName);
    }
  resetLlm() {
    this.reset.emit('reset');
  }
  onModelChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.modelChange.emit(value);
  }

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['response'] || changes['isLoading']) {
      this.changeDetectorRef.markForCheck();
    }
  }

  /**
   * Get the appropriate icon for the model
   */
  getModelIconPath(): string {
    const modelLower = this.modelName.toLowerCase();
    switch (modelLower) {
      case 'deepseek chat':
        return 'M3 12l18-6-6 18-6-18z'; // Example icon for DeepSeek Chat
      case 'deepseek coder':
        return 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L12 15v4.93z'; // Example icon for DeepSeek Coder
      case 'gemini':
        return 'M12 2 L15 9 L22 12 L15 15 L12 22 L9 15 L2 12 L9 9 Z';
      default:
        return 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z';
    }
  }
}