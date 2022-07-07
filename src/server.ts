import mongoose from 'mongoose';

import config from './config';

import app from './main.js';

process.on('uncaughtException', (err) => {
   console.log(err.name, err.message);
   console.log('UNCAUGHT EXCEPTION! Shutting down...');
   process.exit(1);
});

const DB = config.database.replace('<PASSWORD>', config.databasePassword);

mongoose
   .connect(DB, {
      userNewUrlParser: true
   })
   .then(() => console.log('DB Connection Successful'));

process.on('unhandledRejection', (err) => {
   console.log(err.name, err.message);
   console.log('UNHANDLED REJECTION! Shutting down...');
   server.close(() => {
      process.exit(1);
   });
});
