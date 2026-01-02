import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { ITask } from '../interfaces/task.interface';
import { ITaskFormControls } from '../interfaces/task-form-controls.interface';
import { generateUniqueId } from '../utils/generate-unique-id';
import { TaskStatusEnum } from '../enums/task-status.enum';
import { TaskStatus } from '../types/task-status';
import { IComment } from '../interfaces/comment.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private todoTasks$ = new BehaviorSubject<ITask[]>([]);
  readonly todoTasksObservable = this.todoTasks$
    .asObservable()
    .pipe(map((tasks) => structuredClone(tasks)));

  private doingTasks$ = new BehaviorSubject<ITask[]>([]);
  readonly doingTasksObservable = this.doingTasks$
    .asObservable()
    .pipe(map((tasks) => structuredClone(tasks)));

  private doneTasks$ = new BehaviorSubject<ITask[]>([]);
  readonly doneTasksObservable = this.doneTasks$
    .asObservable()
    .pipe(map((tasks) => structuredClone(tasks)));

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

  updateTaskStatus(taskId: string, taskCurrentStatus: TaskStatus, newStatus: TaskStatus) {
    const currentTaskList = this.getTaskListByStatus(taskCurrentStatus);
    const nextTaskList = this.getTaskListByStatus(newStatus);
    const currentTask = currentTaskList.value.find((task) => task.id === taskId);

    if (currentTask) {
      currentTask.currentStatus = newStatus;

      const updatedCurrentTaskList = currentTaskList.value.filter((task) => task.id !== taskId);
      currentTaskList.next([...updatedCurrentTaskList]);

      nextTaskList.next([...nextTaskList.value, { ...currentTask }]);
    }
  }

  editTaskInfo(taskId: string, taskCurrentStatus: TaskStatus, updatedInfos: ITaskFormControls) {
    const currentTaskList = this.getTaskListByStatus(taskCurrentStatus);
    const currentTask = currentTaskList.value.find((task) => task.id === taskId);

    if (currentTask) {
      const updatedTask = {
        ...currentTask,
        ...updatedInfos,
      };

      const updatedTaskList = currentTaskList.value.map((task) =>
        task.id === taskId ? updatedTask : task,
      );

      currentTaskList.next([...updatedTaskList]);
    }
  }

  updateTaskComments(taskId: string, taskCurrentStatus: TaskStatus, newTaskComments: IComment[]) {
    const currentTaskList = this.getTaskListByStatus(taskCurrentStatus);
    const currentTask = currentTaskList.value.find((task) => task.id === taskId);

    if (currentTask) {
      const updatedTask = {
        ...currentTask,
        comments: [...newTaskComments],
      };

      const updatedTaskList = currentTaskList.value.map((task) =>
        task.id === taskId ? updatedTask : task,
      );

      currentTaskList.next([...updatedTaskList]);
    }
  }

  private getTaskListByStatus(status: TaskStatus): BehaviorSubject<ITask[]> {
    switch (status) {
      case TaskStatusEnum.TODO:
        return this.todoTasks$;
      case TaskStatusEnum.DOING:
        return this.doingTasks$;
      case TaskStatusEnum.DONE:
        return this.doneTasks$;
      default:
        throw new Error('Invalid task status');
    }
  }
}
