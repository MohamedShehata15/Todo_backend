import express, { Application, Request, Response } from 'express';
import config from './config';
import nametest from './server';

const PORT = config.port || 4000;

/**
 *  Init App
 */
const app: Application = express();

/**
 * Middlewares
 */

/**
 * Routes
 */
app.get('/test', function (req, res) {
   console.log(nametest);
   res.json({
      message: 'Hello, World'
   });
});

/**
 * Start Server
 */

app.listen(PORT, () =>
   console.log(`Server is running at: http://localhost:${PORT}`)
);

export default app;
