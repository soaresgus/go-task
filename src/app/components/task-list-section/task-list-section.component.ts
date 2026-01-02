import { Component, inject } from '@angular/core';
import { TaskCardComponent } from '../task-card/task-card.component';
import { TaskService } from '../../services/task.service';
import {
  CdkDropList,
  CdkDrag,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { AsyncPipe } from '@angular/common';
import { ITask } from '../../interfaces/task.interface';
import { TaskStatus } from '../../types/task-status';
import { TaskStatusEnum } from '../../enums/task-status.enum';

@Component({
  selector: 'app-task-list-section',
  imports: [TaskCardComponent, CdkDropList, CdkDrag, AsyncPipe],
  templateUrl: './task-list-section.component.html',
  styleUrl: './task-list-section.component.css',
})
export class TaskListSectionComponent {
  readonly _taskService = inject(TaskService);

  onCardDrop(event: CdkDragDrop<ITask[]>) {
    this.moveCardToColumn(event);

    const taskId = event.item.data.id;
    const taskCurrentStatus = event.item.data.currentStatus;
    const droppedColumn = event.container.id;

    this.updateTaskStatus(taskId, taskCurrentStatus, droppedColumn);
  }

  private updateTaskStatus(taskId: string, taskCurrentStatus: TaskStatus, droppedColumn: string) {
    let newStatus: TaskStatus;

    switch (droppedColumn) {
      case 'to-do-column':
        newStatus = TaskStatusEnum.TODO;
        break;
      case 'doing-column':
        newStatus = TaskStatusEnum.DOING;
        break;
      case 'done-column':
        newStatus = TaskStatusEnum.DONE;
        break;
      default:
        throw new Error('Invalid column ID');
    }

    this._taskService.updateTaskStatus(taskId, taskCurrentStatus, newStatus);
  }

  private moveCardToColumn(event: CdkDragDrop<ITask[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
