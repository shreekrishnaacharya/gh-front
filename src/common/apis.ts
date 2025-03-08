import axios from "axios";
import { ITask, PageResponse, QueryParams } from "./interface";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const getTasks = async (
  params?: QueryParams
): Promise<PageResponse<ITask>> => {
  const response = await axios.get(`${API_URL}/tasks`, {
    params,
  });
  return response.data;
};

export const createTask = async (task: Omit<ITask, "id">): Promise<ITask> => {
  const response = await axios.post(`${API_URL}/tasks`, task);
  return response.data;
};

export const updateTask = async (
  id: number,
  task: Partial<ITask>
): Promise<ITask> => {
  const response = await axios.patch(`${API_URL}/tasks/${id}`, task);
  return response.data;
};
