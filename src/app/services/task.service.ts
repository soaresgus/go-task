import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ITask } from '../interfaces/task.interface';
import { ITaskFormControls } from '../interfaces/task-form-controls.interface';
import { generateUniqueId } from '../utils/generate-unique-id';
import { TaskStatusEnum } from '../enums/task-status.enum';

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

  addTask(taskInfos: ITaskFormControls): void {
    const newTask: ITask = {
      id: generateUniqueId(),
      name: taskInfos.name,
      description: taskInfos.description,
      currentStatus: TaskStatusEnum.TODO,
      comments: [],
    };

    const currentTodoTasks = this.todoTasks$.value;
    this.todoTasks$.next([...currentTodoTasks, newTask]);
  }
}
