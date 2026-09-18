import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  createTask,
  deleteTask as deleteTaskRequest,
  getApiErrorMessage,
  getTasks,
  updateTask,
} from '../services/api';
import type {Task, TaskInput} from '../types/task';

type TaskContextValue = {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  refreshTasks: () => Promise<void>;
  addTask: (task: TaskInput) => Promise<Task | undefined>;
  toggleTaskCompleted: (id: string) => Promise<Task | undefined>;
  deleteTask: (id: string) => Promise<boolean>;
  getTaskById: (id: string) => Task | undefined;
};

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

export const TaskProvider = ({children}: React.PropsWithChildren) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshTasks = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const loadedTasks = await getTasks();
      setTasks(loadedTasks);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshTasks();
  }, [refreshTasks]);

  const addTask = async (task: TaskInput): Promise<Task | undefined> => {
    setError(null);

    try {
      const createdTask = await createTask(task);
      setTasks(current => [createdTask, ...current]);
      return createdTask;
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
      return undefined;
    }
  };

  const toggleTaskCompleted = async (
    id: string,
  ): Promise<Task | undefined> => {
    setError(null);
    const task = tasks.find(currentTask => currentTask.id === id);

    if (!task) {
      setError('Task not found.');
      return undefined;
    }

    try {
      const updatedTask = await updateTask(id, {completed: !task.completed});
      setTasks(current =>
        current.map(currentTask =>
          currentTask.id === id ? updatedTask : currentTask,
        ),
      );
      return updatedTask;
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
      return undefined;
    }
  };

  const deleteTask = async (id: string): Promise<boolean> => {
    setError(null);

    try {
      await deleteTaskRequest(id);
      setTasks(current => current.filter(task => task.id !== id));
      return true;
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
      return false;
    }
  };

  const getTaskById = (id: string) => tasks.find(task => task.id === id);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        refreshTasks,
        addTask,
        toggleTaskCompleted,
        deleteTask,
        getTaskById,
      }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
