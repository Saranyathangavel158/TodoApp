import type {Request, RequestHandler, Response} from 'express';
import mongoose from 'mongoose';
import {Task, type TaskPriority} from '../models/Task';

const priorities: TaskPriority[] = ['Low', 'Medium', 'High'];

class BadRequestError extends Error {}

type TaskRequestBody = {
  title?: unknown;
  description?: unknown;
  dateTime?: unknown;
  deadline?: unknown;
  priority?: unknown;
  completed?: unknown;
  category?: unknown;
};

type TaskPayload = {
  title?: string;
  description?: string;
  dateTime?: Date;
  deadline?: Date;
  priority?: TaskPriority;
  completed?: boolean;
  category?: string;
};

const sendError = (
  response: Response,
  statusCode: number,
  message: string,
): void => {
  response.status(statusCode).json({success: false, message});
};

const sendSuccess = (
  response: Response,
  statusCode: number,
  data: unknown,
): void => {
  response.status(statusCode).json({success: true, data});
};

const getTaskId = (request: Request<{id: string}>): string => request.params.id;

const parseDate = (value: unknown, fieldName: string): Date => {
  if (typeof value !== 'string' && !(value instanceof Date)) {
    throw new BadRequestError(`${fieldName} is required`);
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new BadRequestError(`${fieldName} must be a valid date`);
  }

  return date;
};

const parseTaskPayload = (
  body: TaskRequestBody,
  requireFields: boolean,
): TaskPayload => {
  const payload: TaskPayload = {};

  if (requireFields || body.title !== undefined) {
    if (typeof body.title !== 'string' || body.title.trim().length === 0) {
      throw new BadRequestError('Title is required');
    }
    payload.title = body.title.trim();
  }

  if (body.description !== undefined) {
    if (typeof body.description !== 'string') {
      throw new BadRequestError('Description must be a string');
    }
    payload.description = body.description.trim();
  }

  if (requireFields || body.dateTime !== undefined) {
    payload.dateTime = parseDate(body.dateTime, 'dateTime');
  }

  if (requireFields || body.deadline !== undefined) {
    payload.deadline = parseDate(body.deadline, 'deadline');
  }

  if (body.priority !== undefined) {
    if (
      typeof body.priority !== 'string' ||
      !priorities.includes(body.priority as TaskPriority)
    ) {
      throw new BadRequestError('Priority must be Low, Medium, or High');
    }
    payload.priority = body.priority as TaskPriority;
  }

  if (body.completed !== undefined) {
    if (typeof body.completed !== 'boolean') {
      throw new BadRequestError('Completed must be a boolean');
    }
    payload.completed = body.completed;
  }

  if (body.category !== undefined) {
    if (typeof body.category !== 'string') {
      throw new BadRequestError('Category must be a string');
    }
    payload.category = body.category.trim();
  }

  return payload;
};

const handleControllerError = (error: unknown, response: Response): void => {
  if (error instanceof mongoose.Error.ValidationError) {
    sendError(response, 400, 'Task validation failed');
    return;
  }

  if (error instanceof BadRequestError) {
    sendError(response, 400, error.message);
    return;
  }

  sendError(response, 500, 'Internal server error');
};

export const createTask: RequestHandler<unknown, unknown, TaskRequestBody> = async (
  request,
  response,
): Promise<void> => {
  try {
    const payload = parseTaskPayload(request.body, true);
    const task = await Task.create(payload);
    sendSuccess(response, 201, task);
  } catch (error) {
    handleControllerError(error, response);
  }
};

export const getTasks: RequestHandler = async (
  _request,
  response,
): Promise<void> => {
  try {
    const tasks = await Task.find().sort({createdAt: -1});
    sendSuccess(response, 200, tasks);
  } catch {
    sendError(response, 500, 'Unable to fetch tasks');
  }
};

export const getTaskById: RequestHandler<{id: string}> = async (
  request,
  response,
): Promise<void> => {
  try {
    const id = getTaskId(request);
    if (!mongoose.isValidObjectId(id)) {
      sendError(response, 400, 'Invalid task ID');
      return;
    }

    const task = await Task.findById(id);
    if (!task) {
      sendError(response, 404, 'Task not found');
      return;
    }

    sendSuccess(response, 200, task);
  } catch {
    sendError(response, 500, 'Unable to fetch task');
  }
};

export const updateTask: RequestHandler<
  {id: string},
  unknown,
  TaskRequestBody
> = async (request, response): Promise<void> => {
  try {
    const id = getTaskId(request);
    if (!mongoose.isValidObjectId(id)) {
      sendError(response, 400, 'Invalid task ID');
      return;
    }

    const payload = parseTaskPayload(request.body, false);
    const task = await Task.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      sendError(response, 404, 'Task not found');
      return;
    }

    sendSuccess(response, 200, task);
  } catch (error) {
    handleControllerError(error, response);
  }
};

export const deleteTask: RequestHandler<{id: string}> = async (
  request,
  response,
): Promise<void> => {
  try {
    const id = getTaskId(request);
    if (!mongoose.isValidObjectId(id)) {
      sendError(response, 400, 'Invalid task ID');
      return;
    }

    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      sendError(response, 404, 'Task not found');
      return;
    }

    sendSuccess(response, 200, task);
  } catch {
    sendError(response, 500, 'Unable to delete task');
  }
};
