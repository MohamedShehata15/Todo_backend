import { Request, Response, NextFunction } from 'express';

import { AppError } from '../utils/appError';
import config from '../config';

type ErrorType = Error & {
   statusCode: number;
   status: string;
   isOperational: boolean;
   code: number;
   keyValue: { email: string };
   errors: {
      email?: {
         message: string;
      };
   };
};

const sendErrorDev = (err: ErrorType, res: Response) => {
   res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
   });
};

const sendErrorProd = (err: AppError, res: Response) => {
   console.log('Sned Error Production');

   // Operational Error
   if (err.isOperational) {
      res.status(err.statusCode).json({
         status: err.status,
         message: err.message
      });
   } else {
      // Programming Error
      res.status(500).json({
         status: 'error',
         message: 'Something went very wrong!'
      });
   }
};

const handleDuplicateFieldDB = (err: ErrorType) => {
   const message = `Duplicate field value ${err.keyValue.email}. Please use another email!`;

   return new AppError(message, 400);
};

const handleValidationError = (err: ErrorType) => {
   const errors = Object.values(err.errors).map((el) => el.message);
   const message = `Invalid input data ${errors.join('. ')}`;

   return new AppError(message, 400);
};

export default (
   err: ErrorType,
   _req: Request,
   res: Response,
   _next: NextFunction
) => {
   err.statusCode = err.statusCode || 500;
   err.status = err.status || 'error';

   if (config.env === 'dev') {
      sendErrorDev(err, res);
   } else if (config.env === 'prod') {
      let error: AppError = new AppError('Something went wrong!', 500);

      if (err.code === 11000) {
         error = handleDuplicateFieldDB(err);
      }

      if (err.name === 'ValidationError') {
         error = handleValidationError(err);
      }

      sendErrorProd(error, res);
   }
};
