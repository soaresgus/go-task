import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ITask } from '../../interfaces/task.interface';
import { formatElapsed } from '../../utils/format-elapsed';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { IComment } from '../../interfaces/comment.interface';
import { generateUniqueId } from '../../utils/generate-unique-id';

@Component({
  selector: 'app-task-comments-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './task-comments-modal.component.html',
  styleUrl: './task-comments-modal.component.css',
})
export class TaskCommentsModalComponent {
  commentControl = new FormControl('', [Validators.required]);
  taskCommentsChanged = false;
  @ViewChild('commentInput') commentInputRef!: ElementRef<HTMLInputElement>;
  readonly _task = inject<ITask>(DIALOG_DATA);
  readonly _dialogRef: DialogRef<boolean> = inject(DialogRef<boolean>);

  formatElapsed = (date: Date | string): string => {
    return formatElapsed(date);
  };

  onAddComment() {
    const comment: IComment = {
      id: generateUniqueId(),
      description: this.commentControl.value ?? '',
      createdAt: new Date(),
    };

    this._task.comments.unshift(comment);

    this.commentControl.reset();

    this.taskCommentsChanged = true;

    this.commentInputRef.nativeElement.focus();
  }

  onCloseModal() {
    this._dialogRef.close(this.taskCommentsChanged);
  }

  onDeleteComment(commentId: string) {
    this._task.comments = this._task.comments.filter((comment) => comment.id !== commentId);

    this.taskCommentsChanged = true;
  }
}
