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
export type ITaskUpdate = Required<Pick<ITask, "id">> &
  Partial<Omit<ITask, "id">>;

export interface IManyTask {
  tasks: ITaskUpdate[];
}

export interface IPage {
  _start: number;
  _end: number;
  _sort: string | null;
  _order: SortDirection | null;
  [key: string]: string | number | boolean | null | undefined;
}
export interface PageResponse<T> {
  elements: T[];
  pageable: IPage;
  totalElements: number;
}

export interface QueryParams extends IPage {
  page: number;
  pageSize: number;
}
