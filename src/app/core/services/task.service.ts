import { Injectable } from '@angular/core';
import { BehaviorSubject, map, tap } from 'rxjs';
import { TaskStatusEnum } from '../../domain/tasks/enums/task-status.enum';
import { IComment } from '../../domain/tasks/interfaces/comment.interface';
import { ITask } from '../../domain/tasks/interfaces/task.interface';
import { TaskStatus } from '../../domain/tasks/types/task-status';
import { generateUniqueId } from '../../shared/utils/generate-unique-id';
import { ITaskFormControls } from '../interfaces/task-form-controls.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private todoTasks$ = new BehaviorSubject<ITask[]>(
    this.loadTasksFromLocalStorage(TaskStatusEnum.TODO),
  );
  readonly todoTasksObservable = this.todoTasks$.asObservable().pipe(
    map((tasks) => structuredClone(tasks)),
    tap((tasks) => this.saveTasksOnLocalStorage(TaskStatusEnum.TODO, tasks)),
  );

  private doingTasks$ = new BehaviorSubject<ITask[]>(
    this.loadTasksFromLocalStorage(TaskStatusEnum.DOING),
  );
  readonly doingTasksObservable = this.doingTasks$.asObservable().pipe(
    map((tasks) => structuredClone(tasks)),
    tap((tasks) => this.saveTasksOnLocalStorage(TaskStatusEnum.DOING, tasks)),
  );

  private doneTasks$ = new BehaviorSubject<ITask[]>(
    this.loadTasksFromLocalStorage(TaskStatusEnum.DONE),
  );
  readonly doneTasksObservable = this.doneTasks$.asObservable().pipe(
    map((tasks) => structuredClone(tasks)),
    tap((tasks) => this.saveTasksOnLocalStorage(TaskStatusEnum.DONE, tasks)),
  );

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

  deleteTask(taskId: string, taskCurrentStatus: TaskStatus) {
    const currentTaskList = this.getTaskListByStatus(taskCurrentStatus);
    const updatedTaskList = currentTaskList.value.filter((task) => task.id !== taskId);
    currentTaskList.next([...updatedTaskList]);
  }

  private saveTasksOnLocalStorage(key: string, tasks: ITask[]) {
    try {
      localStorage.setItem(key, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
    }
  }

  private loadTasksFromLocalStorage(key: string): ITask[] {
    try {
      const tasksJson = localStorage.getItem(key);
      return tasksJson ? JSON.parse(tasksJson) : [];
    } catch (error) {
      console.error('Error loading tasks from localStorage:', error);
      return [];
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
