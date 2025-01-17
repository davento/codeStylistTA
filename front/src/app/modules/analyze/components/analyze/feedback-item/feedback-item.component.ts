import { Component, Input } from '@angular/core';
import { Feedback } from 'src/app/shared/interfaces/Feedback';

@Component({
  selector: 'app-feedback-item',
  templateUrl: './feedback-item.component.html',
  styleUrls: ['./feedback-item.component.css']
})
export class FeedbackItemComponent {
  @Input() success: boolean = false;
  @Input() evaluated: boolean = false;
  @Input() isLoading: boolean = false;
  @Input() response: Feedback[] = [];
  @Input() errorLog: string = '';
}
