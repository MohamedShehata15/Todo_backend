import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import User from '../models/User';
import catchAsync from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import config from '../config';
import { JwtPayload } from '../types/jwtPayload.types';
import { UserRequest } from '../types/userRequest.types';

class AuthMiddleware {
   protect = catchAsync(
      async (req: UserRequest, _res: Response, next: NextFunction) => {
         // Getting Token
         let token: string | null = null;

         if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
         ) {
            token = req.headers.authorization.split(' ')[1];
         }

         if (!token) {
            return next(
               new AppError(
                  'You are not logged in! Please log in to get access',
                  401
               )
            );
         }

         // Verification Token.
         const jwtSecret: string = config.jwtSecret ?? '';
         const decode = jwt.verify(token, jwtSecret) as JwtPayload;

         // Check if user exists
         const currentUser = await User.findById(decode.id);
         if (!currentUser) {
            return next(
               new AppError(
                  'The user belonging to this token does no longer exits',
                  401
               )
            );
         }

         // issued token after password changed
         if (currentUser.changedPasswordAfter(decode.iat)) {
            return next(
               new AppError(
                  'User recently changed password! Please log in again',
                  401
               )
            );
         }

         // Grant access to route
         req.user = currentUser;
         next();
      }
   );

   authorize = catchAsync(
      async (req: UserRequest, res: Response, next: NextFunction) => {
         const todoId = req.params.id;
         const loggedUser = req.user;

         let userTodo = loggedUser?.todos.some(
            (todo) => todo.toString() === todoId
         );

         if (!userTodo)
            return next(
               new AppError(
                  'You are not authorized to access this resource',
                  401
               )
            );

         next();
      }
   );
}

export default AuthMiddleware;
