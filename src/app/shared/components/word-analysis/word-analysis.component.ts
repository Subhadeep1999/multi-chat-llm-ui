import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-word-analysis',
  standalone: true,
  templateUrl: './word-analysis.component.html',
  styleUrls: ['./word-analysis.component.css'],
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WordAnalysisComponent {
  @Input() analysis: any = null;
  @Input() isLoading = false;
}
