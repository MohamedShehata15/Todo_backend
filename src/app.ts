import express, { Application, Request, Response, NextFunction } from 'express';

import config from './config';
import mongoConnect from './mongoConnection';
import userRoutes from './routes/userRoutes';
import todoRoutes from './routes/todoRoutes';
import { AppError } from './utils/appError';
import globalErrorHandler from './controllers/errorController';
import cors from 'cors';
import { morgan } from 'morgan';

const port = config.port || 4000;

/**
 *  Handle UnCaught Exception
 */

process.on('uncaughtException', (err) => {
   console.log(err.name, err.message);
   console.log('UNCAUGHT EXCEPTION! Shutting down...');
   process.exit(1);
});

/**
 *  Init App
 */
const app: Application = express();

/**
 * Connect to MongoDB
 */
mongoConnect();

/**
 * Middlewares
 */
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

/**
 * Routes
 */
app.use('/users', userRoutes);
app.use('/todos', todoRoutes);

/**
 * Route Not Found Handler
 */
app.all('*', (req: Request, _res: Response, next: NextFunction) => {
   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

/**
 * Global Error Handler
 */

app.use(globalErrorHandler);

/**
 * Start Server
 */

app.listen(port, () =>
   console.log(`Server is running at: http://localhost:${port}`)
);

/**
 *  Unhandled Rejection
 */

process.on('unhandledRejection', (err: Error) => {
   console.log(err.name, err.message);
   console.log('UNHANDLED REJECTION! Shutting down...');
   process.exit(1);
});

export default app;
