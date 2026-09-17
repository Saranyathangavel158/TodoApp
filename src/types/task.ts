export type TaskPriority = 'Low' | 'Medium' | 'High';

export type Task = {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  deadline: string;
  priority: TaskPriority;
  category: string;
  completed: boolean;
};
