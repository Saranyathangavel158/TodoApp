import React, {createContext, useContext, useState} from 'react';
import type {Task} from '../types/task';

type TaskContextValue = {
  tasks: Task[];
  addTask: (task: Task) => void;
  toggleTaskCompleted: (id: string) => void;
  deleteTask: (id: string) => void;
  getTaskById: (id: string) => Task | undefined;
};

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Prepare project brief',
    description: 'Draft the task app project scope and outline the first milestone.',
    dateTime: 'Sep 18, 2026 at 10:00 AM',
    deadline: 'Sep 19, 2026',
    priority: 'High',
    category: 'Work',
    completed: false,
  },
  {
    id: '2',
    title: 'Review weekly notes',
    description: 'Clean up planning notes and move useful items into tasks.',
    dateTime: 'Sep 17, 2026 at 4:30 PM',
    deadline: 'Sep 17, 2026',
    priority: 'Medium',
    category: 'Personal',
    completed: true,
  },
  {
    id: '3',
    title: 'Schedule design pass',
    description: 'Block focused time to refine the To-Do dashboard visuals.',
    dateTime: 'Sep 20, 2026 at 11:00 AM',
    deadline: 'Sep 22, 2026',
    priority: 'Low',
    category: 'Design',
    completed: false,
  },
];

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

export const TaskProvider = ({children}: React.PropsWithChildren) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const addTask = (task: Task) => setTasks(current => [task, ...current]);

  const toggleTaskCompleted = (id: string) => {
    setTasks(current =>
      current.map(task =>
        task.id === id ? {...task, completed: !task.completed} : task,
      ),
    );
  };

  const deleteTask = (id: string) => {
    setTasks(current => current.filter(task => task.id !== id));
  };

  const getTaskById = (id: string) => tasks.find(task => task.id === id);

  return (
    <TaskContext.Provider
      value={{tasks, addTask, toggleTaskCompleted, deleteTask, getTaskById}}>
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
