import {Document, model, Schema} from 'mongoose';

export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface ITask extends Document {
  title: string;
  description: string;
  dateTime: Date;
  deadline: Date;
  priority: TaskPriority;
  category: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    dateTime: {
      type: Date,
      required: [true, 'Date/time is required'],
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    category: {
      type: String,
      default: '',
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {timestamps: true},
);

export const Task = model<ITask>('Task', taskSchema);
