import express, { Application } from 'express';
import config from './config';
import mongoConnect from './mongoConnection';
import userRoutes from './routes/userRoutes';
import todoRoutes from './routes/todoRoutes';

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

/**
 * Routes
 */
app.use('/users', userRoutes);
app.use('/todos', todoRoutes);

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
