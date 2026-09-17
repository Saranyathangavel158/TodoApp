import express from 'express';
import {connectDatabase} from './config/db';
import {env} from './config/env';
import {errorHandler} from './middleware/errorHandler';
import taskRouter from './routes/taskRoutes';

const app = express();

app.use(express.json());

app.use('/api/tasks', taskRouter);

app.get('/health', (_request, response) => {
  response.json({status: 'ok', message: 'API is running'});
});

app.use(errorHandler);

const startServer = async (): Promise<void> => {
  app.listen(env.port, () => {
    console.log(`Todo API listening on port ${env.port}`);
  });

  try {
    await connectDatabase();
  } catch (error) {
    console.error('MongoDB connection failed', error);
  }
};

void startServer();

export default app;
