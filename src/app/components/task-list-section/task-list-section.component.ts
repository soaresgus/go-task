import { Component, inject, OnInit } from '@angular/core';
import { TaskCardComponent } from '../task-card/task-card.component';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-list-section',
  imports: [TaskCardComponent],
  templateUrl: './task-list-section.component.html',
  styleUrl: './task-list-section.component.css',
})
export class TaskListSectionComponent implements OnInit {
  private readonly _taskService = inject(TaskService);

  ngOnInit() {
    this._taskService.todoTasksObservable.subscribe((tasks) => {
      console.log('TODO Tasks:', tasks);
    });
  }
}
