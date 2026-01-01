import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ITask } from '../interfaces/task.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private todoTasks$ = new BehaviorSubject<ITask[]>([]);
  readonly todoTasksObservable = this.todoTasks$.asObservable();

  private doingTasks$ = new BehaviorSubject<ITask[]>([]);
  readonly doingTasksObservable = this.doingTasks$.asObservable();

  private doneTasks$ = new BehaviorSubject<ITask[]>([]);
  readonly doneTasksObservable = this.doneTasks$.asObservable();
}
