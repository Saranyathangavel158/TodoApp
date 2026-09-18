import axios from 'axios';
import type {Task, TaskInput, TaskPriority} from '../types/task';

const api = axios.create({
  baseURL: 'http://10.0.2.2:5000/api',
  timeout: 10000,
});

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

type ApiErrorResponse = {
  success?: boolean;
  message?: string;
};

type BackendTask = {
  _id: string;
  title: string;
  description?: string;
  dateTime: string;
  deadline: string;
  priority: TaskPriority;
  category?: string;
  completed?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type UpdateTaskInput = Partial<TaskInput>;

const normalizeTask = (task: BackendTask): Task => ({
  id: task._id,
  _id: task._id,
  title: task.title,
  description: task.description ?? '',
  dateTime: task.dateTime,
  deadline: task.deadline,
  priority: task.priority,
  category: task.category ?? '',
  completed: task.completed ?? false,
  createdAt: task.createdAt,
  updatedAt: task.updatedAt,
});

export const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.message ??
      error.message ??
      'Unable to connect to the task API.'
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
};

export const getTasks = async (): Promise<Task[]> => {
  const response = await api.get<ApiResponse<BackendTask[]>>('/tasks');
  return response.data.data.map(normalizeTask);
};

export const getTaskById = async (id: string): Promise<Task> => {
  const response = await api.get<ApiResponse<BackendTask>>(`/tasks/${id}`);
  return normalizeTask(response.data.data);
};

export const createTask = async (task: TaskInput): Promise<Task> => {
  const response = await api.post<ApiResponse<BackendTask>>('/tasks', task);
  return normalizeTask(response.data.data);
};

export const updateTask = async (
  id: string,
  task: UpdateTaskInput,
): Promise<Task> => {
  const response = await api.put<ApiResponse<BackendTask>>(`/tasks/${id}`, task);
  return normalizeTask(response.data.data);
};

export const deleteTask = async (id: string): Promise<void> => {
  await api.delete<ApiResponse<BackendTask>>(`/tasks/${id}`);
};

export default api;
