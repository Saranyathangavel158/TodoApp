export type TaskPriority = 'Low' | 'Medium' | 'High';

export type Task = {
  id: string;
  _id?: string;
  title: string;
  description: string;
  dateTime: string;
  deadline: string;
  priority: TaskPriority;
  category: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type TaskInput = Omit<Task, 'id' | '_id' | 'createdAt' | 'updatedAt'>;
