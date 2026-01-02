import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { ITask } from '../../interfaces/task.interface';
import { formatElapsed } from '../../utils/format-elapsed';

@Component({
  selector: 'app-task-comments-modal',
  imports: [],
  templateUrl: './task-comments-modal.component.html',
  styleUrl: './task-comments-modal.component.css',
})
export class TaskCommentsModalComponent {
  readonly _task = inject<ITask>(DIALOG_DATA);

  formatElapsed = (date: Date | string): string => {
    return formatElapsed(date);
  };
}
