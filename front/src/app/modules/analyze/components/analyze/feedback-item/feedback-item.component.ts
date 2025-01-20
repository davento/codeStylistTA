import { Component, Input } from '@angular/core';
import { Feedback } from 'src/app/shared/interfaces/Feedback';
import { LoadingState } from 'src/app/shared/enums/LoadingState';

@Component({
  selector: 'app-feedback-item',
  templateUrl: './feedback-item.component.html',
  styleUrls: ['./feedback-item.component.css']
})
export class FeedbackItemComponent {
  // Enums
  public LoadingState = LoadingState;

  // Input content from parent
  @Input() success: boolean = false;
  @Input() analyzed: boolean = false;
  @Input() isLoading: number = LoadingState.nothing;
  @Input() response: Feedback[] = [];
  @Input() errorLog: string = '';
}
