import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatInputComponent {

  @Input() loading = false;              // ✅ REQUIRED
  @Output() send = new EventEmitter<string>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      prompt: ['', Validators.required]
    });
  }

  submit() {
    if (this.form.invalid || this.loading) {
      return;
    }

    const value = this.form.value.prompt.trim();
    if (!value) {
      return;
    }

    this.send.emit(value);
    this.form.reset();
  }
}
