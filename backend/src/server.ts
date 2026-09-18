import express from 'express';
import {connectDatabase} from './config/database';
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
  try {
    await connectDatabase();
    app.listen(env.port, () => {
      console.log(`Todo API listening on port ${env.port}`);
    });
  } catch (error) {
    console.error('MongoDB connection failed', error);
    process.exit(1);
  }
};

void startServer();

export default app;
