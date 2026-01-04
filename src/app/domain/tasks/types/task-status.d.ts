import { TaskStatus as TaskStatusEnum } from '../domain/tasks/enums/task-status.enum';

export type TaskStatus = TaskStatusEnum.TODO | TaskStatusEnum.DOING | TaskStatusEnum.DONE;
