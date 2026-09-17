import type {NextFunction, Request, Response} from 'express';
import mongoose from 'mongoose';
import {Task} from '../models/Task';

const invalidId = (id: string, response: Response): boolean => {
  if (!mongoose.isValidObjectId(id)) {
    response.status(400).json({message: 'Invalid task ID'});
    return true;
  }
  return false;
};

const getTaskId = (request: Request): string => {
  const {id} = request.params;
  return Array.isArray(id) ? id[0] : id;
};

const handleError = (error: unknown, response: Response) => {
  if (error instanceof mongoose.Error.ValidationError) {
    response.status(400).json({
      message: 'Validation failed',
      errors: Object.values(error.errors).map(validationError => validationError.message),
    });
    return;
  }

  console.error(error);
  response.status(500).json({message: 'Internal server error'});
};

export const getTasks = async (
  _request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const tasks = await Task.find().sort({createdAt: -1});
    response.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = getTaskId(request);
    if (invalidId(id, response)) return;

    const task = await Task.findById(id);
    if (!task) {
      response.status(404).json({message: 'Task not found'});
      return;
    }

    response.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const task = await Task.create(request.body);
    response.status(201).json(task);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      handleError(error, response);
      return;
    }
    next(error);
  }
};

export const updateTask = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = getTaskId(request);
    if (invalidId(id, response)) return;

    const task = await Task.findByIdAndUpdate(id, request.body, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      response.status(404).json({message: 'Task not found'});
      return;
    }

    response.status(200).json(task);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      handleError(error, response);
      return;
    }
    next(error);
  }
};

export const deleteTask = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = getTaskId(request);
    if (invalidId(id, response)) return;

    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      response.status(404).json({message: 'Task not found'});
      return;
    }

    response.status(200).json({message: 'Task deleted successfully'});
  } catch (error) {
    next(error);
  }
};
