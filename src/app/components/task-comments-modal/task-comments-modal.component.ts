import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { ITask } from '../../interfaces/task.interface';
import { formatElapsed } from '../../utils/format-elapsed';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-comments-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './task-comments-modal.component.html',
  styleUrl: './task-comments-modal.component.css',
})
export class TaskCommentsModalComponent {
  commentControl = new FormControl('', [Validators.required]);
  readonly _task = inject<ITask>(DIALOG_DATA);

  formatElapsed = (date: Date | string): string => {
    return formatElapsed(date);
  };

  onAddComment() {
    console.log('comment', this.commentControl.value);
  }
}
