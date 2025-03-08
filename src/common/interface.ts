import { SortDirection } from "./common.enum";
import { TaskPriorityEnum, TaskStatusEnum } from "./task.enum";

export interface ITask {
  id: number;
  title: string;
  description: string;
  due_date: string;
  priority: TaskPriorityEnum;
  status: TaskStatusEnum;
}

export interface IPage {
  _start: number;
  _end: number;
  _sort: string;
  _order: SortDirection;
}
export interface PageResponse<T> {
  elements: T[];
  pageable: IPage;
  totalElements: number;
}
